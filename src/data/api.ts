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

// In-memory cache & request deduplication
interface CacheEntry<T> {
  data: T
  timestamp: number
}

const memoryCache = new Map<string, CacheEntry<any>>()
const inFlightRequests = new Map<string, Promise<any>>()
const CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes fresh

export function getCachedActiveRoles(): Role[] | null {
  const entry = memoryCache.get('?status=active')
  return entry ? entry.data : null
}

export async function fetchRoles(params = '', init?: RequestInit): Promise<Role[]> {
  const cacheKey = params || 'all'

  // Deduplicate in-flight network requests
  if (inFlightRequests.has(cacheKey) && !init) {
    return inFlightRequests.get(cacheKey)!
  }

  const promise = (async () => {
    try {
      const response = await fetch(`${API_BASE}/api/roles${params}`, init)
      if (!response.ok) throw new Error(`Roles request failed: ${response.status}`)
      const data: Role[] = await response.json()
      memoryCache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } finally {
      inFlightRequests.delete(cacheKey)
    }
  })()

  if (!init) {
    inFlightRequests.set(cacheKey, promise)
  }

  return promise
}

export async function fetchActiveRoleCount(init?: RequestInit): Promise<number> {
  // If active roles are already cached, use their count
  const cached = memoryCache.get('?status=active')
  if (cached && cached.data) {
    return cached.data.length
  }

  const cacheKey = 'count_active'
  if (inFlightRequests.has(cacheKey) && !init) {
    return inFlightRequests.get(cacheKey)!
  }

  const promise = (async () => {
    try {
      const response = await fetch(`${API_BASE}/api/roles/count?status=active`, init)
      if (!response.ok) throw new Error(`Role count request failed: ${response.status}`)
      const data = await response.json() as { count?: number }
      return typeof data.count === 'number' ? data.count : 0
    } finally {
      inFlightRequests.delete(cacheKey)
    }
  })()

  if (!init) {
    inFlightRequests.set(cacheKey, promise)
  }

  return promise
}

export async function fetchRole(id: string): Promise<Role> {
  const cacheKey = `role_${id}`
  const cached = memoryCache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data
  }

  const response = await fetch(`${API_BASE}/api/roles/${encodeURIComponent(id)}`)
  if (!response.ok) throw new Error(`Role request failed: ${response.status}`)
  const data: Role = await response.json()
  memoryCache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

export async function fetchActiveCompanies(): Promise<Company[]> {
  const cacheKey = 'companies'
  const cached = memoryCache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data
  }

  const response = await fetch(`${API_BASE}/api/companies`)
  if (!response.ok) throw new Error(`Companies request failed: ${response.status}`)
  const data: Company[] = await response.json()
  memoryCache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

export async function submitLead(kind: 'candidates' | 'companies' | 'recruiters', payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}/api/submissions`, {
    method: 'POST',
    body: JSON.stringify({ kind, payload }),
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null) as { error?: string } | null
    throw new Error(data?.error || `Submission failed: ${response.status}`)
  }

  return response.json() as Promise<{ ok: boolean }>
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
