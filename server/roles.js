import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const seedPath = path.resolve(__dirname, '../heroscouter_roles_seed.json')

function cleanNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function statusLabel(value) {
  return String(value ?? 'active').toLowerCase() === 'active' ? 'Active' : 'Paused'
}

function normalizeRole(row) {
  return {
    id: row['HS Role ID'] ?? '',
    title: row.Title ?? '',
    company: row.Company ?? '',
    industry: row.Industry ?? null,
    fundingStage: row['Funding Stage'] ?? null,
    companySize: row['Company Size'] ?? null,
    companyWebsite: row['Company Website'] ?? '',
    companyLogoUrl: row['Company Logo URL'] ?? null,
    status: statusLabel(row.Status),
    workLocation: row['Work Location Type'] ?? 'In-person',
    location: row.Location ?? '',
    salaryMin: cleanNumber(row['Salary Min']) ?? 0,
    salaryMax: cleanNumber(row['Salary Max']) ?? 0,
    currency: row.Currency ?? '$',
    equityMin: cleanNumber(row['Equity Min']),
    equityMax: cleanNumber(row['Equity Max']),
    jobCategory: row['Job Category'] ?? null,
    employmentType: row['Employment Type'] ?? '',
    yoe: row.YOE ?? '',
    positions: cleanNumber(row.Positions) ?? 1,
    h1bSponsorship: Boolean(row['H1B Sponsorship']),
    interviewStages: row['Interview Stages'] ?? '',
    responsibilities: row.Responsibilities ?? '',
    requirements: row.Requirements ?? '',
    benefits: row.Benefits ?? '',
    responsibilitiesHtml: row['Responsibilities HTML'] ?? '',
    requirementsHtml: row['Requirements HTML'] ?? '',
    benefitsHtml: row['Benefits HTML'] ?? '',
  }
}

export async function readSeedRoles() {
  const raw = await fs.readFile(seedPath, 'utf8')
  return JSON.parse(raw.replace(/\bNaN\b/g, 'null')).map(normalizeRole)
}

export function activeCompaniesFromRoles(roles) {
  const byCompany = new Map()

  for (const role of roles) {
    if (role.status !== 'Active' || !role.company) continue

    const key = role.company.trim().toLowerCase()
    const existing = byCompany.get(key)
    byCompany.set(key, {
      name: role.company,
      industry: existing?.industry ?? role.industry,
      fundingStage: existing?.fundingStage ?? role.fundingStage,
      companySize: existing?.companySize ?? role.companySize,
      website: existing?.website ?? role.companyWebsite,
      logoUrl: existing?.logoUrl ?? role.companyLogoUrl,
      active: true,
      activeRoleCount: (existing?.activeRoleCount ?? 0) + 1,
    })
  }

  return Array.from(byCompany.values()).sort((a, b) => a.name.localeCompare(b.name))
}
