import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function cleanNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function statusLabel(value) {
  const s = String(value ?? 'active').toLowerCase()
  if (s === 'active') return 'Active'
  if (s === 'inactive') return 'Inactive'
  // handle legacy 'paused' values already in DB
  return 'Inactive'
}

// Handles both the original spaced-key format AND the new camelCase format
function normalizeRole(row) {
  return {
    id:               row['HS Role ID']         ?? row.hsRoleId          ?? '',
    title:            row.Title                 ?? row.title             ?? '',
    company:          row.Company               ?? row.company           ?? '',
    industry:         row.Industry              ?? row.industry          ?? null,
    fundingStage:     row['Funding Stage']      ?? row.fundingStage      ?? null,
    companySize:      row['Company Size']       ?? row.companySize       ?? null,
    companyWebsite:   row['Company Website']    ?? row.companyWebsite    ?? '',
    companyLogoUrl:   row['Company Logo URL']   ?? row.companyLogoUrl    ?? null,
    status:           statusLabel(row.Status    ?? row.status),
    workLocation:     row['Work Location Type'] ?? row.workLocationType  ?? 'In-person',
    location:         row.Location              ?? row.location          ?? '',
    salaryMin:        cleanNumber(row['Salary Min']  ?? row.salaryMin)   ?? 0,
    salaryMax:        cleanNumber(row['Salary Max']  ?? row.salaryMax)   ?? 0,
    currency:         row.Currency              ?? row.currency          ?? '$',
    equityMin:        cleanNumber(row['Equity Min']  ?? row.equityMin),
    equityMax:        cleanNumber(row['Equity Max']  ?? row.equityMax),
    jobCategory:      row['Job Category']       ?? row.jobCategory       ?? null,
    employmentType:   row['Employment Type']    ?? row.employmentType    ?? '',
    yoe:              row.YOE                   ?? row.yoe               ?? '',
    positions:        cleanNumber(row.Positions ?? row.positions)        ?? 1,
    h1bSponsorship:   Boolean(row['H1B Sponsorship'] ?? row.h1bSponsorship),
    interviewStages:  row['Interview Stages']   ?? row.interviewStages   ?? '',
    responsibilities: row.Responsibilities      ?? row.responsibilities  ?? '',
    requirements:     row.Requirements          ?? row.requirements      ?? '',
    benefits:         row.Benefits              ?? row.benefits          ?? '',
    responsibilitiesHtml: row['Responsibilities HTML'] ?? row.responsibilitiesHtml ?? '',
    requirementsHtml:     row['Requirements HTML']     ?? row.requirementsHtml     ?? '',
    benefitsHtml:         row['Benefits HTML']         ?? row.benefitsHtml         ?? '',
  }
}

// Finds every hero_scouter_seed_*.json file inside the server/ directory
async function findSeedFiles() {
  const entries = await fs.readdir(__dirname)
  return entries
    .filter((f) => f.startsWith('hero_scouter_seed_') && f.endsWith('.json'))
    .map((f) => path.join(__dirname, f))
}

// Reads and normalises roles from all seed files found in server/
export async function readSeedRoles() {
  const files = await findSeedFiles()

  if (!files.length) {
    console.warn('No seed files found in server/. Expected files named hero_scouter_seed_*.json')
    return []
  }

  const allRoles = []
  for (const file of files) {
    console.log(`  Loading: ${path.basename(file)}`)
    const raw = await fs.readFile(file, 'utf8')
    const rows = JSON.parse(raw.replace(/\bNaN\b/g, 'null'))
    allRoles.push(...rows.map(normalizeRole))
  }

  // Deduplicate by id — last file wins on conflict
  const byId = new Map()
  for (const role of allRoles) {
    if (role.id) byId.set(role.id, role)
  }

  return Array.from(byId.values())
}

export function activeCompaniesFromRoles(roles) {
  const byCompany = new Map()

  for (const role of roles) {
    if (role.status !== 'Active' || !role.company) continue

    const key = role.company.trim().toLowerCase()
    const existing = byCompany.get(key)
    byCompany.set(key, {
      name: role.company,
      industry:     existing?.industry     ?? role.industry,
      fundingStage: existing?.fundingStage ?? role.fundingStage,
      companySize:  existing?.companySize  ?? role.companySize,
      website:      existing?.website      ?? role.companyWebsite,
      logoUrl:      existing?.logoUrl      ?? role.companyLogoUrl,
      active: true,
      activeRoleCount: (existing?.activeRoleCount ?? 0) + 1,
    })
  }

  return Array.from(byCompany.values()).sort((a, b) => a.name.localeCompare(b.name))
}
