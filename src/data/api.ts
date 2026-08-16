import { Role, roles as fallbackRoles } from './roles'

export interface Company {
  name: string
  industry: string | null
  fundingStage: string | null
  companySize: string | null
  website: string
  logoUrl: string | null
  active: boolean
  activeRoleCount: number
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export async function fetchRoles(params = '', init?: RequestInit): Promise<Role[]> {
  const response = await fetch(`${API_BASE}/api/roles${params}`, init)
  if (!response.ok) throw new Error(`Roles request failed: ${response.status}`)
  return response.json()
}

export async function fetchRole(id: string): Promise<Role> {
  const response = await fetch(`${API_BASE}/api/roles/${encodeURIComponent(id)}`)
  if (!response.ok) throw new Error(`Role request failed: ${response.status}`)
  return response.json()
}

export async function fetchActiveCompanies(): Promise<Company[]> {
  const response = await fetch(`${API_BASE}/api/companies`)
  if (!response.ok) throw new Error(`Companies request failed: ${response.status}`)
  return response.json()
}

export function fallbackActiveRoles(limit?: number) {
  const roles = fallbackRoles.filter((role) => role.status === 'Active')
  return typeof limit === 'number' ? roles.slice(0, limit) : roles
}

export function fallbackActiveRole(id: string) {
  return fallbackRoles.find((role) => role.id === id && role.status === 'Active') ?? null
}

export function fallbackActiveCompanies(): Company[] {
  const companies = new Map<string, Company>()

  fallbackActiveRoles().forEach((role) => {
    const key = role.company.toLowerCase()
    const existing = companies.get(key)
    companies.set(key, {
      name: role.company,
      industry: existing?.industry ?? role.industry,
      fundingStage: existing?.fundingStage ?? role.fundingStage,
      companySize: existing?.companySize ?? role.companySize,
      website: existing?.website ?? role.companyWebsite,
      logoUrl: existing?.logoUrl ?? role.companyLogoUrl,
      active: true,
      activeRoleCount: (existing?.activeRoleCount ?? 0) + 1,
    })
  })

  return Array.from(companies.values())
}
