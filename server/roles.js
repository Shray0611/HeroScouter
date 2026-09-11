import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function normalizeKey(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getField(row, ...candidates) {
  if (!row || typeof row !== 'object') return undefined

  // 1. Direct key check
  for (const c of candidates) {
    if (c in row && row[c] !== undefined && row[c] !== null && row[c] !== '') {
      return row[c]
    }
  }

  // 2. Normalized key check
  const normalizedMap = new Map()
  for (const [k, v] of Object.entries(row)) {
    if (v !== undefined && v !== null && v !== '') {
      normalizedMap.set(normalizeKey(k), v)
    }
  }

  for (const c of candidates) {
    const norm = normalizeKey(c)
    if (normalizedMap.has(norm)) {
      return normalizedMap.get(norm)
    }
  }

  return undefined
}

function cleanNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const str = value.trim().replace(/[\$,\s]/g, '')
    if (/k$/i.test(str)) {
      const num = parseFloat(str.replace(/k$/i, ''))
      return !isNaN(num) ? num * 1000 : null
    }
    const num = parseFloat(str)
    return !isNaN(num) && Number.isFinite(num) ? num : null
  }
  return null
}

function parseSingleSalaryNum(val) {
  if (typeof val === 'number' && Number.isFinite(val)) {
    return val > 0 && val < 1000 ? val * 1000 : val
  }
  if (typeof val === 'string' && val.trim() !== '') {
    const str = val.trim().replace(/[\$,\s]/g, '')
    if (/k$/i.test(str)) {
      const num = parseFloat(str.replace(/k$/i, ''))
      return !isNaN(num) ? num * 1000 : null
    }
    const num = parseFloat(str)
    if (!isNaN(num) && Number.isFinite(num)) {
      return num > 0 && num < 1000 ? num * 1000 : num
    }
  }
  return null
}

export function parseSalaryAndCurrency(row) {
  let currency = getField(row, 'Currency', 'currency', 'Cur', 'cur') || '$'
  let minRaw = getField(row, 'Salary Min', 'salaryMin', 'salary_min', 'Min Salary', 'minSalary', 'Salary (Min)', 'Salary Minimum', 'Min Pay', 'Minimum Salary')
  let maxRaw = getField(row, 'Salary Max', 'salaryMax', 'salary_max', 'Max Salary', 'maxSalary', 'Salary (Max)', 'Salary Maximum', 'Max Pay', 'Maximum Salary')
  let combinedRaw = getField(row, 'Salary', 'salary', 'Salary Range', 'salaryRange', 'salary_range', 'Compensation', 'compensation', 'Base Salary', 'baseSalary', 'Annual Salary', 'annualSalary', 'Pay', 'pay')

  let salaryMin = parseSingleSalaryNum(minRaw)
  let salaryMax = parseSingleSalaryNum(maxRaw)

  // Detect currency symbol if inside string
  const checkCurrency = (str) => {
    if (typeof str === 'string') {
      if (str.includes('$')) currency = '$'
      else if (str.includes('€')) currency = '€'
      else if (str.includes('£')) currency = '£'
      else if (str.includes('₹')) currency = '₹'
      else if (str.includes('CAD')) currency = 'CAD $'
      else if (str.includes('EUR')) currency = '€'
      else if (str.includes('GBP')) currency = '£'
    }
  }
  checkCurrency(minRaw)
  checkCurrency(maxRaw)
  checkCurrency(combinedRaw)

  // If min and max not found, try combined salary field or minRaw containing a range
  const candidateStr = (typeof combinedRaw === 'string' && combinedRaw.trim()) 
    || (typeof minRaw === 'string' && minRaw.includes('-') && minRaw)
    || ''

  if (candidateStr && (salaryMin == null || salaryMin <= 0) && (salaryMax == null || salaryMax <= 0)) {
    const parts = candidateStr.match(/\$?\d+(?:,\d+)*(?:\.\d+)?\s*k?/gi)
    if (parts && parts.length > 0) {
      salaryMin = parseSingleSalaryNum(parts[0])
      if (parts.length > 1) {
        salaryMax = parseSingleSalaryNum(parts[1])
      }
    }
  }

  // If only one is found, set both or sensible default
  salaryMin = salaryMin ?? 0
  salaryMax = salaryMax ?? 0

  return {
    salaryMin,
    salaryMax,
    currency,
  }
}

export function statusLabel(value) {
  const s = String(value ?? 'active').toLowerCase()
  if (s === 'active') return 'Active'
  if (s === 'inactive') return 'Inactive'
  // handle legacy 'paused' values already in DB
  return 'Inactive'
}

// Handles both the original spaced-key format AND the new camelCase format with fuzzy column matching
export function normalizeRole(row) {
  const { salaryMin, salaryMax, currency } = parseSalaryAndCurrency(row)

  return {
    id:               String(getField(row, 'HS Role ID', 'hsRoleId', 'hs_role_id', 'Role ID', 'roleId', 'role_id', 'ID', 'id') ?? ''),
    title:            String(getField(row, 'Title', 'title', 'Job Title', 'jobTitle', 'job_title', 'Role Title', 'roleTitle') ?? ''),
    company:          String(getField(row, 'Company', 'company', 'Company Name', 'companyName', 'company_name') ?? ''),
    industry:         getField(row, 'Industry', 'industry', 'Company Industry', 'companyIndustry') ?? null,
    fundingStage:     getField(row, 'Funding Stage', 'fundingStage', 'funding_stage', 'Stage', 'stage') ?? null,
    companySize:      getField(row, 'Company Size', 'companySize', 'company_size', 'Size', 'size') ?? null,
    companyWebsite:   String(getField(row, 'Company Website', 'companyWebsite', 'company_website', 'Website', 'website') ?? ''),
    companyLogoUrl:   getField(row, 'Company Logo URL', 'companyLogoUrl', 'company_logo_url', 'Logo URL', 'logoUrl', 'logo_url', 'Logo', 'logo') ?? null,
    status:           statusLabel(getField(row, 'Public Status', 'publicStatus', 'public_status', 'Status', 'status')),
    workLocation:     getField(row, 'Work Location Type', 'workLocationType', 'work_location_type', 'Work Location', 'workLocation', 'Location Type', 'locationType') ?? 'In-person',
    location:         String(getField(row, 'Location', 'location', 'City', 'city', 'Address', 'address') ?? ''),
    salaryMin,
    salaryMax,
    currency,
    equityMin:        cleanNumber(getField(row, 'Equity Min', 'equityMin', 'equity_min', 'Min Equity', 'minEquity')),
    equityMax:        cleanNumber(getField(row, 'Equity Max', 'equityMax', 'equity_max', 'Max Equity', 'maxEquity')),
    jobCategory:      getField(row, 'Job Category', 'jobCategory', 'job_category', 'Category', 'category', 'Department', 'department') ?? null,
    employmentType:   String(getField(row, 'Employment Type', 'employmentType', 'employment_type', 'Type', 'type') ?? ''),
    yoe:              String(getField(row, 'YOE', 'yoe', 'Years of Experience', 'yearsOfExperience', 'Experience', 'experience') ?? ''),
    positions:        cleanNumber(getField(row, 'Positions', 'positions', 'Openings', 'openings', 'Number of Positions', 'numberOfPositions')) ?? 1,
    h1bSponsorship:   Boolean(getField(row, 'H1B Sponsorship', 'h1bSponsorship', 'h1b_sponsorship', 'Visa Sponsorship', 'visa_sponsorship', 'Visa', 'visa')),
    interviewStages:  String(getField(row, 'Interview Stages', 'interviewStages', 'interview_stages', 'Stages', 'stages') ?? ''),
    responsibilities: String(getField(row, 'Responsibilities', 'responsibilities', 'Description', 'description') ?? ''),
    requirements:     String(getField(row, 'Requirements', 'requirements', 'Qualifications', 'qualifications') ?? ''),
    benefits:         String(getField(row, 'Benefits', 'benefits', 'Perks', 'perks') ?? ''),
    responsibilitiesHtml: String(getField(row, 'Responsibilities HTML', 'responsibilitiesHtml', 'responsibilities_html') ?? ''),
    requirementsHtml:     String(getField(row, 'Requirements HTML', 'requirementsHtml', 'requirements_html') ?? ''),
    benefitsHtml:         String(getField(row, 'Benefits HTML', 'benefitsHtml', 'benefits_html') ?? ''),
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
