import 'dotenv/config'
import { getDb } from './db.js'
import { normalizeRole, activeCompaniesFromRoles } from './roles.js'

// ---------------------------------------------------------------------------
// Config (all from .env)
// ---------------------------------------------------------------------------
const SHEET_ID    = process.env.GOOGLE_SHEET_ID
const API_KEY     = process.env.GOOGLE_API_KEY
const TAB_NAME    = process.env.SHEETS_TAB_NAME || 'Website connection'
const INTERVAL_MS = Number(process.env.SHEETS_SYNC_INTERVAL_MS || 600000)

// ---------------------------------------------------------------------------
// Sync state — read by /api/sync/status
// ---------------------------------------------------------------------------
export const syncState = {
  lastSync:    null,   // ISO string of last successful sync
  lastError:   null,   // error message or null
  status:      'idle', // 'idle' | 'running' | 'ok' | 'error'
  roleCount:   0,      // total roles in sheet last sync
  activeCount: 0,      // active roles after last sync
  skippedRows: 0,      // rows skipped (incomplete/in-progress edits)
}

// Prevent concurrent syncs (e.g. interval fires while previous is still running)
let isSyncRunning = false

// ---------------------------------------------------------------------------
// Validate a normalized role row
// Simply checks for a valid HS Role ID to filter out blank/trailing sheet rows.
// All data from the sheet is rendered as-is, with 'Public Status' driving Active/Inactive.
// ---------------------------------------------------------------------------
function isValidRole(role) {
  return typeof role.id === 'string' && role.id.trim() !== ''
}

// ---------------------------------------------------------------------------
// Fetch all data rows from Google Sheet as array of { header: value } objects
// ---------------------------------------------------------------------------
async function fetchSheetRows() {
  if (!SHEET_ID || !API_KEY) {
    throw new Error('GOOGLE_SHEET_ID and GOOGLE_API_KEY must be set in .env')
  }

  const tab = encodeURIComponent(TAB_NAME)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${tab}!A1:ZZ?key=${API_KEY}`

  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Google Sheets API error ${res.status}: ${body}`)
  }

  const json = await res.json()
  const rows  = json.values || []
  if (rows.length < 2) return []  // header only or empty sheet

  const headers = rows[0]
  return rows.slice(1).map((cells) => {
    const obj = {}
    headers.forEach((header, i) => {
      const val = cells[i] ?? ''
      const trimmedKey = (header || '').trim()
      obj[trimmedKey] = typeof val === 'string' ? val.trim() : val
      obj[header] = val
    })
    return obj
  })
}

// ---------------------------------------------------------------------------
// Full reconciliation sync — runs on each cycle
// ---------------------------------------------------------------------------
export async function runSync() {
  // Prevent overlapping syncs (e.g. slow network + short interval, or rapid /trigger calls)
  if (isSyncRunning) {
    console.log('[sheets-sync] Sync already in progress — skipping this cycle')
    return
  }

  isSyncRunning       = true
  syncState.status    = 'running'
  console.log(`[sheets-sync] Starting sync from tab: "${TAB_NAME}"`)

  try {
    // 1. Fetch all rows from the sheet
    const rawRows = await fetchSheetRows()

    // 2. Normalize and filter:
    //    - Skip rows with no ID (blank/filler rows)
    //    - Skip rows that fail the validity check (incomplete mid-edit rows)
    const normalized = rawRows.map(normalizeRole)
    const roles      = normalized.filter(isValidRole)
    const skipped    = normalized.length - roles.length

    if (skipped > 0) {
      console.log(`[sheets-sync] ⚠️  Skipped ${skipped} incomplete row(s) (mid-edit or missing required fields)`)
    }

    // 3. Safety check: if the sheet returns far fewer valid rows than what's in the DB,
    //    it may be a partial fetch during an active edit — abort to protect data.
    const db         = await getDb()
    const rolesCol   = db.collection('roles')
    const dbCount    = await rolesCol.countDocuments({})
    const MIN_RATIO  = 0.5  // must have at least 50% of existing DB rows
    if (dbCount > 10 && roles.length < dbCount * MIN_RATIO) {
      throw new Error(
        `Sync aborted: sheet returned only ${roles.length} valid rows but DB has ${dbCount}. ` +
        `Possible partial fetch or active edit in progress. Will retry next cycle.`
      )
    }

    syncState.skippedRows = skipped
    console.log(`[sheets-sync] ${roles.length} valid roles to sync (${skipped} skipped)`)

    // 4. Upsert every role — covers all cases:
    //    • New role added to sheet            → inserted into DB
    //    • Inactive → Active in "Public Status" → DB document updated
    //    • Active → Inactive in "Public Status" → DB document updated
    //    • Any other field changed             → DB document updated
    if (roles.length > 0) {
      const ops = roles.map((role) => ({
        replaceOne: {
          filter:      { id: role.id },
          replacement: role,
          upsert:      true,
        },
      }))
      await rolesCol.bulkWrite(ops, { ordered: false })
    }

    // 3. Roles that disappeared from the sheet entirely → mark Inactive
    const sheetIds = roles.map((r) => r.id)
    const ghost    = await rolesCol.updateMany(
      { id: { $nin: sheetIds } },
      { $set: { status: 'Inactive' } }
    )
    if (ghost.modifiedCount > 0) {
      console.log(`[sheets-sync] ${ghost.modifiedCount} role(s) no longer in sheet → set Inactive`)
    }

    // 4. Ensure indexes
    await rolesCol.createIndex({ id: 1 },     { unique: true })
    await rolesCol.createIndex({ status: 1 }, {})

    // 5. Rebuild companies collection from current active roles
    const allActive = await rolesCol.find({ status: 'Active' }).toArray()
    const companies = activeCompaniesFromRoles(allActive)
    const compCol   = db.collection('companies')
    await compCol.deleteMany({})
    if (companies.length > 0) {
      await compCol.insertMany(companies)
      await compCol.createIndex({ name: 1 },   { unique: true })
      await compCol.createIndex({ active: 1 }, {})
    }

    // 6. Update sync state
    syncState.lastSync    = new Date().toISOString()
    syncState.lastError   = null
    syncState.status      = 'ok'
    syncState.roleCount   = roles.length
    syncState.activeCount = allActive.length

    console.log(
      `[sheets-sync] ✅ Done — ${roles.length} total | ${allActive.length} active | ${companies.length} companies`
    )
  } catch (err) {
    syncState.status    = 'error'
    syncState.lastError = err instanceof Error ? err.message : String(err)
    console.error('[sheets-sync] ❌ Sync failed:', syncState.lastError)
    throw err
  } finally {
    // Always release the lock so the next cycle can run
    isSyncRunning = false
  }
}

// ---------------------------------------------------------------------------
// Start the polling loop — call once on server startup
// ---------------------------------------------------------------------------
export function startSheetsSync() {
  console.log(`[sheets-sync] Polling tab "${TAB_NAME}" every ${INTERVAL_MS / 1000}s`)
  // Run immediately on startup
  runSync().catch((err) => console.error('[sheets-sync] Initial sync error:', err))
  // Then on schedule
  setInterval(() => {
    runSync().catch((err) => console.error('[sheets-sync] Interval sync error:', err))
  }, INTERVAL_MS)
}