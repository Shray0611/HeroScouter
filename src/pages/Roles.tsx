import { useState, useMemo, useRef, useEffect } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { roles as fallbackRoles, Role } from '../data/roles'
import { fetchActiveRoleCount, fetchRoles } from '../data/api'
import rolesBg from '../imports/roles_data.jpg'
import logoFallback from '../imports/image-5.png'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Filters {
  company: string[]
  workLocation: string[]
  industry: string[]
  fundingStage: string[]
  companySize: string[]
  jobCategory: string[]
  employmentType: string[]
  h1b: string[]
}

const EMPTY: Filters = {
  company: [], workLocation: [], industry: [], fundingStage: [],
  companySize: [], jobCategory: [], employmentType: [], h1b: [],
}

type FilterKey = keyof Filters

const ACTIVE_ROLES_CACHE_KEY = 'heroscouter.activeRoles.v1'
const ACTIVE_ROLES_FETCH_TIMEOUT = 10000

function activeFallbackRoles() {
  return fallbackRoles.filter((role) => role.status === 'Active')
}

function readCachedActiveRoles() {
  try {
    const cached = window.sessionStorage.getItem(ACTIVE_ROLES_CACHE_KEY)
    if (!cached) return null
    const parsed = JSON.parse(cached)
    return Array.isArray(parsed) && parsed.length ? parsed as Role[] : null
  } catch {
    return null
  }
}

function writeCachedActiveRoles(items: Role[]) {
  try {
    window.sessionStorage.setItem(ACTIVE_ROLES_CACHE_KEY, JSON.stringify(items))
  } catch {
    // Session storage can be unavailable in privacy modes; the fallback data still renders.
  }
}

// ─── Salary ───────────────────────────────────────────────────────────────────

const SALARY_BUCKETS = [
  { label: 'Under $100k', value: 'u100' },
  { label: '$100k – $175k', value: '100_175' },
  { label: '$175k – $250k', value: '175_250' },
  { label: 'Over $250k', value: 'ov250' },
]

function numericRangeValue(value: string) {
  const normalized = value.trim().replace(/[$,\s]/g, '').replace(/k$/i, '')
  if (!normalized || !/^-?\d*(?:\.\d+)?$/.test(normalized)) return null
  const n = Number(normalized)
  if (!Number.isFinite(n) || n < 0) return null
  return n
}

function salaryFromInput(value: string) {
  const n = numericRangeValue(value)
  if (n == null || n <= 0) return null
  return n < 1000 ? n * 1000 : n
}

function matchesSalaryRange(role: Role, min: number | null, max: number | null) {
  if (min != null && max != null && min > max) return matchesSalaryRange(role, max, min)
  if (min != null && max != null) return role.salaryMax >= min && role.salaryMin <= max
  if (min != null) return role.salaryMax >= min
  if (max != null) return role.salaryMin <= max
  return true
}

function parseExperienceYears(value: string): { min: number; max: number } {
  const nums = value.match(/\d+(?:\.\d+)?/g)?.map(Number).filter((n) => Number.isFinite(n)) ?? []
  if (!nums.length) return { min: 0, max: 99 }
  if (nums.length === 1) return { min: nums[0], max: nums[0] }
  return { min: Math.min(...nums), max: Math.max(...nums) }
}

function expFromInput(value: string) {
  return numericRangeValue(value)
}

function matchesExperienceRange(role: Role, minExp: number | null, maxExp: number | null) {
  if (minExp != null && maxExp != null && minExp > maxExp) return matchesExperienceRange(role, maxExp, minExp)
  const { min, max } = parseExperienceYears(role.yoe || '')
  if (minExp != null && maxExp != null) return max >= minExp && min <= maxExp
  if (minExp != null) return max >= minExp
  if (maxExp != null) return min <= maxExp
  return true
}

function midUSD(role: Role) {
  return (role.salaryMin + role.salaryMax) / 2
}

function matchesSalary(role: Role, buckets: string[]) {
  if (!buckets.length) return true
  const m = midUSD(role)
  return buckets.some((b) => {
    if (b === 'u100') return m < 100000
    if (b === '100_175') return m >= 100000 && m < 175000
    if (b === '175_250') return m >= 175000 && m < 250000
    if (b === 'ov250') return m >= 250000
    return true
  })
}

function fmtSalary(role: Role) {
  const sym = role.currency || '$'
  const lo = (role.salaryMin / 1000).toFixed(0)
  const hi = (role.salaryMax / 1000).toFixed(0)
  return `${sym}${lo}k – ${sym}${hi}k`
}

// ─── Dynamic filter options from data ────────────────────────────────────────

function getOptions(key: keyof Role, source: Role[]): string[] {
  const seen = new Set<string>()
  source.forEach((r) => {
    const v = r[key]
    if (v != null && v !== '') seen.add(String(v))
  })
  return Array.from(seen).sort()
}

function getFilterGroups(source: Role[]): { key: FilterKey; label: string; options: string[] }[] {
  return [
  { key: 'company', label: 'Company', options: getOptions('company', source) },
  { key: 'workLocation', label: 'Work Location', options: ['Remote', 'Hybrid', 'In-person'] },
  { key: 'industry', label: 'Industry', options: getOptions('industry', source) },
  { key: 'fundingStage', label: 'Funding Stage', options: getOptions('fundingStage', source) },
  { key: 'companySize', label: 'Company Size', options: getOptions('companySize', source) },
  { key: 'jobCategory', label: 'Job Category', options: getOptions('jobCategory', source) },
  { key: 'employmentType', label: 'Employment Type', options: getOptions('employmentType', source) },
  { key: 'h1b', label: 'H1B Sponsorship', options: ['Sponsored', 'Not sponsored'] },
  ]
}

// ─── Filter counts ────────────────────────────────────────────────────────────

function getCounts(key: FilterKey, opts: string[], source: Role[]): Record<string, number> {
  const c: Record<string, number> = {}
  opts.forEach((o) => {
    c[o] = source.filter((r) => {
      if (key === 'h1b') return o === 'Sponsored' ? r.h1bSponsorship : !r.h1bSponsorship
      return (r as unknown as Record<string, unknown>)[key] === o
    }).length
  })
  return c
}

// ─── FilterGroup component ────────────────────────────────────────────────────

interface FilterGroupProps {
  groupKey: FilterKey
  label: string
  options: string[]
  selected: string[]
  roles: Role[]
  onToggle: (key: FilterKey, val: string) => void
}

function FilterGroup({ groupKey, label, options, selected, roles, onToggle }: FilterGroupProps) {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const counts = useMemo(() => getCounts(groupKey, options, roles), [groupKey, options, roles])

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options
    return options.filter((opt) => opt.toLowerCase().includes(query.trim().toLowerCase()))
  }, [options, query])

  const shown = expanded || query.trim() ? filteredOptions : filteredOptions.slice(0, 6)

  return (
    <div style={{ paddingBottom: '18px', borderBottom: '1px solid rgba(34,38,43,0.08)', marginBottom: '18px' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase" style={{ letterSpacing: '0.13em', color: 'rgba(34,38,43,0.42)' }}>
          {label}
        </p>
        {selected.length > 0 && (
          <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full" style={{ background: '#22262B', color: '#F7F4EF' }}>
            {selected.length}
          </span>
        )}
      </div>

      {/* Company Search Input */}
      {groupKey === 'company' && options.length > 4 && (
        <div className="relative mb-2.5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company..."
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg outline-none transition-all"
            style={{
              background: '#fff',
              border: '1px solid rgba(34,38,43,0.12)',
              color: '#22262B',
            }}
          />
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: 'rgba(34,38,43,0.38)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
        {shown.map((opt) => {
          const active = selected.includes(opt)
          return (
            <div
              key={opt}
              className="flex items-center gap-2.5 cursor-pointer py-0.5 group"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(groupKey, opt) }}
            >
              <div
                className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all duration-150"
                style={{
                  border: active ? 'none' : '1.5px solid rgba(34,38,43,0.25)',
                  background: active ? '#22262B' : 'transparent',
                }}
              >
                {active && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="#F7F4EF" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm flex-1 leading-snug transition-colors duration-150 group-hover:text-black" style={{ color: active ? '#22262B' : '#4A5059', fontWeight: active ? 500 : 400 }}>
                {opt}
              </span>
              <span className="text-xs tabular-nums" style={{ color: 'rgba(34,38,43,0.30)' }}>
                {counts[opt] ?? 0}
              </span>
            </div>
          )
        })}
        {shown.length === 0 && (
          <p className="text-xs py-2 text-center" style={{ color: 'rgba(34,38,43,0.40)' }}>
            No companies found
          </p>
        )}
      </div>

      {!query && options.length > 6 && (
        <button
          onClick={(e) => { e.preventDefault(); setExpanded(!expanded) }}
          className="text-xs font-medium mt-2.5 transition-colors duration-150"
          style={{ color: '#C8923A' }}
        >
          {expanded ? '↑ See fewer' : `↓ See all ${options.length}`}
        </button>
      )}
    </div>
  )
}

// ─── Role card ────────────────────────────────────────────────────────────────

function SalaryRangeFilter({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: {
  minValue: string
  maxValue: string
  onMinChange: (value: string) => void
  onMaxChange: (value: string) => void
}) {
  return (
    <div style={{ paddingBottom: '18px', borderBottom: '1px solid rgba(34,38,43,0.08)', marginBottom: '18px' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase" style={{ letterSpacing: '0.13em', color: 'rgba(34,38,43,0.42)' }}>
          Salary (USD)
        </p>
        {(minValue || maxValue) && (
          <button
            onClick={() => { onMinChange(''); onMaxChange('') }}
            className="text-[11px] font-medium"
            style={{ color: '#C8923A' }}
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium" style={{ color: 'rgba(34,38,43,0.55)' }}>Min salary</span>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'rgba(34,38,43,0.4)' }}>$</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={minValue}
              onChange={(e) => onMinChange(e.target.value)}
              placeholder="e.g. 100"
              className="w-full rounded-lg pl-6 pr-2 py-2 text-xs outline-none"
              style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.12)', color: '#22262B' }}
            />
          </div>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium" style={{ color: 'rgba(34,38,43,0.55)' }}>Max salary</span>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium" style={{ color: 'rgba(34,38,43,0.4)' }}>$</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={maxValue}
              onChange={(e) => onMaxChange(e.target.value)}
              placeholder="e.g. 250"
              className="w-full rounded-lg pl-6 pr-2 py-2 text-xs outline-none"
              style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.12)', color: '#22262B' }}
            />
          </div>
        </label>
      </div>
      <p className="mt-2 text-[11px] leading-snug" style={{ color: 'rgba(34,38,43,0.42)' }}>
        Values in thousands (e.g. 150 for $150K/yr).
      </p>
    </div>
  )
}

function ExperienceRangeFilter({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: {
  minValue: string
  maxValue: string
  onMinChange: (value: string) => void
  onMaxChange: (value: string) => void
}) {
  const hasValue = Boolean(minValue || maxValue)
  const [open, setOpen] = useState(hasValue)

  useEffect(() => {
    if (hasValue) setOpen(true)
  }, [hasValue])

  return (
    <div style={{ paddingBottom: '18px', borderBottom: '1px solid rgba(34,38,43,0.08)', marginBottom: '18px' }}>
      <div className={`flex items-center justify-between ${open ? 'mb-3' : ''}`}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex flex-1 items-center justify-between gap-3 text-left"
        >
          <span className="text-xs font-semibold uppercase" style={{ letterSpacing: '0.13em', color: 'rgba(34,38,43,0.42)' }}>
            Work Experience
          </span>
          <svg
            width="13"
            height="13"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            className="transition-transform duration-150"
            style={{ color: 'rgba(34,38,43,0.42)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {hasValue && (
          <button
            onClick={() => { onMinChange(''); onMaxChange('') }}
            className="ml-3 text-[11px] font-medium"
            style={{ color: '#C8923A' }}
          >
            Reset
          </button>
        )}
      </div>

      {open && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium" style={{ color: 'rgba(34,38,43,0.55)' }}>Min years</span>
              <input
                type="number"
                min="0"
                max="40"
                inputMode="numeric"
                value={minValue}
                onChange={(e) => onMinChange(e.target.value)}
                placeholder="e.g. 2"
                className="w-full rounded-lg px-3 py-2 text-xs outline-none"
                style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.12)', color: '#22262B' }}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium" style={{ color: 'rgba(34,38,43,0.55)' }}>Max years</span>
              <input
                type="number"
                min="0"
                max="40"
                inputMode="numeric"
                value={maxValue}
                onChange={(e) => onMaxChange(e.target.value)}
                placeholder="e.g. 6"
                className="w-full rounded-lg px-3 py-2 text-xs outline-none"
                style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.12)', color: '#22262B' }}
              />
            </label>
          </div>
          <p className="mt-2 text-[11px] leading-snug" style={{ color: 'rgba(34,38,43,0.42)' }}>
            Filter roles by required years of experience.
          </p>
        </>
      )}
    </div>
  )
}

const LOC_STYLE: Record<string, { bg: string; color: string }> = {
  Remote: { bg: 'rgba(30,77,58,0.11)', color: '#1E4D3A' },
  Hybrid: { bg: 'rgba(200,146,58,0.13)', color: '#8C5E10' },
  'In-person': { bg: 'rgba(34,38,43,0.07)', color: '#4A5059' },
}

function Tag({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ background: 'rgba(34,38,43,0.07)', color: '#4A5059', ...style }}>
      {children}
    </span>
  )
}

function CompanyLogo({
  src,
  alt,
  size = 56,
  radius = '0.75rem',
  imageScale = 0.72,
  border = '1px solid rgba(34,38,43,0.08)',
}: {
  src: string | null
  alt: string
  size?: number
  radius?: string
  imageScale?: number
  border?: string
}) {
  const [errored, setErrored] = useState(false)
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size, background: '#F7F4EF', border, borderRadius: radius }}
    >
      <img
        src={errored || !src ? logoFallback : src}
        alt={alt}
        className="object-contain"
        style={{ width: size * imageScale, height: size * imageScale }}
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
      />
    </div>
  )
}

interface RoleCardProps {
  role: Role
}

function RoleCard({ role }: RoleCardProps) {
  const loc = LOC_STYLE[role.workLocation] ?? { bg: 'rgba(34,38,43,0.07)', color: '#4A5059' }
  return (
    <a
      href={`/roles/${encodeURIComponent(role.id)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-4 md:p-5 rounded-2xl cursor-pointer transition-all duration-200"
      style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.08)', boxShadow: '0 2px 12px rgba(34,38,43,0.04)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,38,43,0.11)'
        e.currentTarget.style.borderColor = 'rgba(34,38,43,0.15)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(34,38,43,0.04)'
        e.currentTarget.style.borderColor = 'rgba(34,38,43,0.08)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <CompanyLogo src={role.companyLogoUrl} alt={role.company} size={44} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm md:text-base leading-tight mb-0.5 truncate" style={{ color: '#22262B' }}>
              {role.title}
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium" style={{ color: '#4A5059' }}>{role.company}</span>
              <span style={{ color: 'rgba(34,38,43,0.22)' }}>·</span>
              <span className="text-xs flex items-center gap-1" style={{ color: '#4A5059' }}>
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {role.location}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-xs md:text-sm font-semibold" style={{ color: '#C8923A' }}>{fmtSalary(role)}</div>
            {role.equityMin != null && role.equityMax != null && role.equityMax > 0 && (
              <div className="text-xs mt-0.5 hidden md:block" style={{ color: 'rgba(34,38,43,0.40)' }}>
                {role.equityMin}–{role.equityMax}% equity
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <Tag style={{ background: loc.bg, color: loc.color }}>{role.workLocation}</Tag>
          {role.jobCategory && <Tag className="hidden sm:inline-flex">{role.jobCategory}</Tag>}
          {role.employmentType && <Tag className="hidden sm:inline-flex">{role.employmentType}</Tag>}
          {role.yoe && <Tag className="hidden md:inline-flex">{role.yoe}</Tag>}
          {role.h1bSponsorship && <Tag style={{ background: 'rgba(30,77,58,0.10)', color: '#1E4D3A' }}>H1B</Tag>}
          {role.positions > 1 && <Tag>{role.positions} positions</Tag>}
        </div>
      </div>

      {/* Arrow — hidden on smallest screens */}
      <div
        className="hidden sm:flex flex-shrink-0 self-center w-8 h-8 rounded-full items-center justify-center transition-all duration-200"
        style={{ border: '1.5px solid rgba(34,38,43,0.14)', color: 'rgba(34,38,43,0.45)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#22262B'; e.currentTarget.style.color = '#F7F4EF' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(34,38,43,0.45)' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </a>
  )
}

// ─── Role detail panel ─────────────────────────────────────────────────────────

type DetailTab = 'role' | 'requirements' | 'benefits' | 'interview'

function InterviewStages({ stages }: { stages: string }) {
  const steps = stages.split(' | ').filter(Boolean)
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          {/* Number + connector line column */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: '28px' }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: '#22262B', color: '#F7F4EF' }}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: '2px', flex: 1, minHeight: '24px', background: 'rgba(34,38,43,0.12)', margin: '4px 0' }} />
            )}
          </div>
          {/* Step text */}
          <div className="flex-1 pt-1 pb-5">
            <span className="text-sm leading-relaxed" style={{ color: '#22262B' }}>{step}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function HtmlContent({ html }: { html: string }) {
  if (!html) return <p className="text-sm" style={{ color: '#4A5059' }}>No information provided.</p>
  return (
    <div
      className="hs-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function RoleDetail({ role, onClose }: { role: Role; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<DetailTab>('role')
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const tabs: { key: DetailTab; label: string; shortLabel: string }[] = [
    { key: 'role', label: 'Role Details', shortLabel: 'Role' },
    { key: 'requirements', label: 'Requirements', shortLabel: 'Req.' },
    { key: 'benefits', label: 'Benefits', shortLabel: 'Benefits' },
    { key: 'interview', label: 'Interview', shortLabel: 'Interview' },
  ]

  const loc = LOC_STYLE[role.workLocation] ?? { bg: 'rgba(34,38,43,0.07)', color: '#4A5059' }
  const websiteHost = role.companyWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const statRows = [
    { label: 'Salary', value: fmtSalary(role) },
    role.equityMin != null && role.equityMax != null && role.equityMax > 0
      ? { label: 'Equity', value: `${role.equityMin}% – ${role.equityMax}%` }
      : null,
    { label: 'Positions', value: `${role.positions} open` },
    { label: 'Experience', value: role.yoe || '—' },
    { label: 'Company size', value: role.companySize || '—' },
    { label: 'H1B', value: role.h1bSponsorship ? 'Yes' : 'No', positive: role.h1bSponsorship },
    role.fundingStage ? { label: 'Stage', value: role.fundingStage } : null,
  ].filter((row): row is { label: string; value: string; positive?: boolean } => row !== null)

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-stretch justify-end"
      style={{ background: 'rgba(10,18,36,0.52)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Panel — full-screen on mobile, right-drawer on desktop */}
      <div
        className="relative w-full md:w-auto h-full overflow-y-auto flex flex-col"
        style={{ width: undefined, maxWidth: '820px', background: '#F7F4EF', boxShadow: '-24px 0 80px rgba(10,18,36,0.28)' }}
      >
        {/* ── DARK HEADER ── */}
        <div style={{ background: '#0f1a2e', flexShrink: 0 }}>
          {/* Close */}
          <div className="flex justify-end px-4 md:px-6 pt-4 pb-0">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
              style={{ background: 'rgba(247,244,239,0.10)', color: 'rgba(247,244,239,0.70)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(247,244,239,0.18)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(247,244,239,0.10)' }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Company + role identity */}
          <div className="px-4 md:px-7 pt-3 pb-4">
            <div className="flex items-start gap-4 mb-5">
              {/* Small logo */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: '#F7F4EF', border: '2px solid rgba(247,244,239,0.14)' }}>
                <CompanyLogo src={role.companyLogoUrl} alt={role.company} size={48} border="none" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: 'rgba(247,244,239,0.60)' }}>
                  {role.company}
                  {role.companyWebsite && (
                    <a
                      href={role.companyWebsite} target="_blank" rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-xs transition-colors"
                      style={{ color: 'rgba(217,160,61,0.75)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      {websiteHost}
                    </a>
                  )}
                </p>
                <h1 className="font-serif font-light" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', letterSpacing: '-0.02em', lineHeight: 1.15, color: '#F7F4EF' }}>
                  {role.title}
                </h1>
              </div>
            </div>

            {/* Tag chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {role.fundingStage && (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(200,146,58,0.22)', color: '#E8C97A' }}>
                  {role.fundingStage}
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: role.status === 'Active' ? 'rgba(30,77,58,0.35)' : 'rgba(180,60,60,0.20)', color: role.status === 'Active' ? '#5AC49A' : '#F08080' }}>
                {role.status === 'Active' ? '● Active' : '● Paused'}
              </span>
              {role.industry && (
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(247,244,239,0.10)', color: 'rgba(247,244,239,0.65)' }}>
                  {role.industry}
                </span>
              )}
              {role.jobCategory && (
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(247,244,239,0.10)', color: 'rgba(247,244,239,0.65)' }}>
                  {role.jobCategory}
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: loc.bg === 'rgba(30,77,58,0.11)' ? 'rgba(30,77,58,0.30)' : 'rgba(247,244,239,0.10)', color: role.workLocation === 'Remote' ? '#5AC49A' : 'rgba(247,244,239,0.65)' }}>
                {role.workLocation}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(247,244,239,0.10)', color: 'rgba(247,244,239,0.65)' }}>
                {role.location}
              </span>
            </div>

            {/* Tab bar — scrollable on mobile */}
            <div className="flex items-end gap-0 overflow-x-auto" style={{ borderBottom: '1px solid rgba(247,244,239,0.10)' }}>
              {tabs.map(({ key, label, shortLabel }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="px-3 md:px-4 py-2.5 text-xs md:text-sm font-medium transition-all duration-150 whitespace-nowrap"
                  style={{
                    color: activeTab === key ? '#F7F4EF' : 'rgba(247,244,239,0.42)',
                    borderBottom: activeTab === key ? '2px solid #D4A052' : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                  {key === 'interview' && role.interviewStages && (
                    <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full tabular-nums" style={{ background: 'rgba(247,244,239,0.12)', color: 'rgba(247,244,239,0.55)' }}>
                      {role.interviewStages.split(' | ').length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY — stacks on mobile, side-by-side on desktop ── */}
        <div className="flex flex-col md:flex-row gap-0 flex-1 min-h-0">
          {/* Main content */}
          <div className="flex-1 min-w-0 px-4 md:px-7 py-5 md:py-7 overflow-y-auto order-1">
            {activeTab === 'role' && <HtmlContent html={role.responsibilitiesHtml} />}
            {activeTab === 'requirements' && <HtmlContent html={role.requirementsHtml} />}
            {activeTab === 'benefits' && <HtmlContent html={role.benefitsHtml} />}
            {activeTab === 'interview' && (
              role.interviewStages
                ? <InterviewStages stages={role.interviewStages} />
                : <p className="text-sm" style={{ color: '#4A5059' }}>Interview details not available.</p>
            )}
          </div>

          {/* Right sidebar — below content on mobile, fixed-width column on desktop */}
          <div
            className="order-2 md:flex-shrink-0 flex flex-col"
            style={{ borderTop: '1px solid rgba(34,38,43,0.08)', background: '#fff', padding: '1.25rem 1rem' }}
          >
            <div className="w-full md:w-[260px]">
              {/* Logo — hidden on mobile to save space */}
              <div
                className="hidden md:flex items-center justify-center mb-4 rounded-3xl"
                style={{
                  background: 'linear-gradient(180deg, #FBFAF7 0%, #F0ECE5 100%)',
                  border: '1px solid rgba(34,38,43,0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.80), 0 10px 30px rgba(34,38,43,0.06)',
                  padding: '0.85rem',
                }}
              >
                <CompanyLogo
                  src={role.companyLogoUrl}
                  alt={role.company}
                  size={106}
                  radius="1.25rem"
                  imageScale={0.82}
                  border="none"
                />
              </div>

              <p className="font-semibold text-sm mb-3 hidden md:block text-center" style={{ color: '#22262B' }}>{role.company}</p>

              {/* Key stats — grid on mobile, list on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-0" style={{ borderTop: '1px solid rgba(34,38,43,0.07)' }}>
                {statRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-2 py-2"
                    style={{ borderBottom: '1px solid rgba(34,38,43,0.06)' }}
                  >
                    <span className="text-xs leading-snug shrink-0" style={{ color: 'rgba(34,38,43,0.45)' }}>
                      {row.label}
                    </span>
                    <span
                      className="text-xs font-semibold text-right leading-snug min-w-0"
                      style={{ color: row.positive ? '#1E4D3A' : '#22262B', maxWidth: '140px' }}
                    >
                      {row.positive && (
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                          style={{ background: '#1E4D3A' }}
                        />
                      )}
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="pt-4">
                <a
                  href="/candidates"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 mb-2"
                  style={{ background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)', color: '#1a0e04' }}
                >
                  Apply via HeroScouter
                </a>
                {role.companyWebsite && (
                  <a
                    href={role.companyWebsite} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                    style={{ background: 'transparent', border: '1.5px solid rgba(34,38,43,0.14)', color: '#4A5059' }}
                  >
                    <span>Visit Website</span>
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H9m8 0v8" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Roles() {
  const [directoryRoles, setDirectoryRoles] = useState<Role[]>(() => readCachedActiveRoles() ?? activeFallbackRoles())
  const [filters, setFilters] = useState<Filters>({ ...EMPTY })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [experienceMin, setExperienceMin] = useState('')
  const [experienceMax, setExperienceMax] = useState('')
  const [activeCount, setActiveCount] = useState(() => activeFallbackRoles().length)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), ACTIVE_ROLES_FETCH_TIMEOUT)

    fetchRoles('?status=active', { signal: controller.signal })
      .then((items) => {
        if (!cancelled && items.length) {
          setDirectoryRoles(items)
          setActiveCount(items.length)
          writeCachedActiveRoles(items)
        }
      })
      .catch(() => {
        if (!cancelled) setDirectoryRoles((current) => current.length ? current : activeFallbackRoles())
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), ACTIVE_ROLES_FETCH_TIMEOUT)

    fetchActiveRoleCount({ signal: controller.signal })
      .then((count) => {
        if (!cancelled) setActiveCount(count)
      })
      .catch(() => {
        if (!cancelled) setActiveCount((count) => count || activeFallbackRoles().length)
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [])

  const filterGroups = useMemo(() => getFilterGroups(directoryRoles), [directoryRoles])

  function toggleFilter(key: FilterKey, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }))
  }

  function removeChip(key: FilterKey, value: string) {
    setFilters((prev) => ({ ...prev, [key]: prev[key].filter((v) => v !== value) }))
  }

  function clearAll() {
    setFilters({ ...EMPTY })
    setSearch('')
    setSalaryMin('')
    setSalaryMax('')
    setExperienceMin('')
    setExperienceMax('')
  }

  const chips = useMemo(() => {
    const out: { key: FilterKey; value: string }[] = []
    Object.entries(filters).forEach(([k, vals]) => vals.forEach((v: string) => out.push({ key: k as FilterKey, value: v })))
    return out
  }, [filters])
  const salaryMinValue = useMemo(() => salaryFromInput(salaryMin), [salaryMin])
  const salaryMaxValue = useMemo(() => salaryFromInput(salaryMax), [salaryMax])
  const expMinValue = useMemo(() => expFromInput(experienceMin), [experienceMin])
  const expMaxValue = useMemo(() => expFromInput(experienceMax), [experienceMax])
  const activeFilterCount = chips.length
    + (salaryMinValue != null ? 1 : 0)
    + (salaryMaxValue != null ? 1 : 0)
    + (expMinValue != null ? 1 : 0)
    + (expMaxValue != null ? 1 : 0)

  const filtered = useMemo(() => {
    let r = directoryRoles
    if (filters.company.length) r = r.filter((x) => filters.company.includes(x.company))
    if (filters.workLocation.length) r = r.filter((x) => filters.workLocation.includes(x.workLocation))
    if (filters.industry.length) r = r.filter((x) => x.industry && filters.industry.includes(x.industry))
    if (filters.fundingStage.length) r = r.filter((x) => x.fundingStage && filters.fundingStage.includes(x.fundingStage))
    if (filters.companySize.length) r = r.filter((x) => x.companySize && filters.companySize.includes(x.companySize))
    if (filters.jobCategory.length) r = r.filter((x) => x.jobCategory && filters.jobCategory.includes(x.jobCategory))
    if (filters.employmentType.length) r = r.filter((x) => filters.employmentType.includes(x.employmentType))
    if (expMinValue != null || expMaxValue != null) r = r.filter((x) => matchesExperienceRange(x, expMinValue, expMaxValue))
    if (filters.h1b.length) {
      r = r.filter((x) =>
        (filters.h1b.includes('Sponsored') && x.h1bSponsorship) ||
        (filters.h1b.includes('Not sponsored') && !x.h1bSponsorship)
      )
    }
    if (salaryMinValue != null || salaryMaxValue != null) r = r.filter((x) => matchesSalaryRange(x, salaryMinValue, salaryMaxValue))
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter((x) =>
        x.title.toLowerCase().includes(q) ||
        x.company.toLowerCase().includes(q) ||
        (x.industry ?? '').toLowerCase().includes(q) ||
        x.location.toLowerCase().includes(q) ||
        (x.jobCategory ?? '').toLowerCase().includes(q) ||
        x.id.toLowerCase().includes(q)
      )
    }
    if (sort === 'newest') return [...r].sort((a, b) => b.id.localeCompare(a.id))
    if (sort === 'salary_hi') return [...r].sort((a, b) => midUSD(b) - midUSD(a))
    if (sort === 'salary_lo') return [...r].sort((a, b) => midUSD(a) - midUSD(b))
    if (sort === 'alpha') return [...r].sort((a, b) => a.title.localeCompare(b.title))
    return r
  }, [directoryRoles, filters, search, sort, expMinValue, expMaxValue, salaryMinValue, salaryMaxValue])

  // Prevent scroll-to-footer when results shrink: if section scrolled past view, scroll back
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.bottom < 80) {
      window.scrollTo({ top: el.offsetTop - 96, behavior: 'smooth' })
    }
  }, [filtered.length])

  // Reset to page 1 whenever filtered results change
  useEffect(() => {
    setPage(1)
  }, [filtered.length, search, filters, sort, salaryMin, salaryMax, experienceMin, experienceMax])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const hasFilters = chips.length > 0 || search.trim().length > 0 || salaryMinValue != null || salaryMaxValue != null || expMinValue != null || expMaxValue != null

  // Sidebar template (shared between desktop aside + mobile drawer)
  const SidebarContent = (
    <>
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold" style={{ color: '#22262B' }}>Filters</span>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs font-medium" style={{ color: '#C8923A' }}>Clear all</button>
        )}
      </div>
      <SalaryRangeFilter
        minValue={salaryMin}
        maxValue={salaryMax}
        onMinChange={setSalaryMin}
        onMaxChange={setSalaryMax}
      />
      <ExperienceRangeFilter
        minValue={experienceMin}
        maxValue={experienceMax}
        onMinChange={setExperienceMin}
        onMaxChange={setExperienceMax}
      />
      {filterGroups.map((g) => (
        <FilterGroup key={g.key} groupKey={g.key} label={g.label} options={g.options} selected={filters[g.key]} roles={directoryRoles} onToggle={toggleFilter} />
      ))}
    </>
  )

  return (
    <div style={{ background: '#F7F4EF', minHeight: '100vh' }}>
      <SiteNav cta={{ label: 'Submit Profile', href: '/candidates' }} activeLink="Open Roles" variant="fixed" />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden flex flex-col justify-center text-center md:text-left" style={{ minHeight: '40vh', background: '#F7F4EF', paddingTop: '7rem', paddingBottom: '2rem' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,26,46,0.08) 0%, rgba(247,244,239,0) 60%)' }} />
        <div className="relative z-10 px-6 md:px-16" style={{ marginLeft: 'clamp(0rem, 2vw, 3rem)' }}>
          <p className="text-xs font-semibold uppercase mb-4" style={{ color: '#C8923A', letterSpacing: '0.22em' }}>
            Role Directory · {activeCount} live roles
          </p>
          <h1 className="font-serif font-light" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 3.6rem)', letterSpacing: '-0.025em', lineHeight: 1.1, color: '#07152A' }}>
            Browse open roles at <em style={{ color: '#C8923A' }}>exceptional companies.</em>
          </h1>
        </div>
      </section>

      {/* ── DIRECTORY ── */}
      <div ref={sectionRef} className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 pb-28">
        <div className="flex gap-7 items-start">

          {/* Sidebar */}
          <aside className="hidden md:block flex-shrink-0 sticky top-24" style={{ width: '260px', maxHeight: 'calc(100vh - 6.5rem)', overflowY: 'auto', paddingRight: '8px' }}>
            {SidebarContent}
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Search + sort */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative min-w-0">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(34,38,43,0.38)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search roles, companies…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{ background: '#fff', border: '1.5px solid rgba(34,38,43,0.11)', color: '#22262B' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C8923A' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(34,38,43,0.11)' }}
                />
              </div>
              <select
                value={sort} onChange={(e) => setSort(e.target.value)}
                className="hidden sm:block px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer flex-shrink-0"
                style={{ background: '#fff', border: '1.5px solid rgba(34,38,43,0.11)', color: '#22262B', minWidth: '152px' }}
              >
                <option value="default">Best match</option>
                <option value="newest">Newest first</option>
                <option value="salary_hi">Salary: high → low</option>
                <option value="salary_lo">Salary: low → high</option>
                <option value="alpha">A–Z by title</option>
              </select>
              {/* Mobile sort — icon only */}
              <select
                value={sort} onChange={(e) => setSort(e.target.value)}
                className="sm:hidden px-2 py-2.5 rounded-xl text-xs outline-none cursor-pointer flex-shrink-0"
                style={{ background: '#fff', border: '1.5px solid rgba(34,38,43,0.11)', color: '#22262B' }}
              >
                <option value="default">Best</option>
                <option value="newest">New</option>
                <option value="salary_hi">$ High</option>
                <option value="salary_lo">$ Low</option>
                <option value="alpha">A–Z</option>
              </select>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium flex-shrink-0"
                style={{ background: '#fff', border: '1.5px solid rgba(34,38,43,0.11)', color: '#22262B' }}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                <span className="hidden xs:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ background: '#22262B', color: '#F7F4EF' }}>{activeFilterCount}</span>
                )}
              </button>
            </div>

            {/* Active chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {salaryMinValue != null && (
                  <button
                    onClick={() => setSalaryMin('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 hover:opacity-80"
                    style={{ background: '#22262B', color: '#F7F4EF' }}
                  >
                    Min salary ${(salaryMinValue / 1000).toFixed(0)}K
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {salaryMaxValue != null && (
                  <button
                    onClick={() => setSalaryMax('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 hover:opacity-80"
                    style={{ background: '#22262B', color: '#F7F4EF' }}
                  >
                    Max salary ${(salaryMaxValue / 1000).toFixed(0)}K
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {expMinValue != null && (
                  <button
                    onClick={() => setExperienceMin('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 hover:opacity-80"
                    style={{ background: '#22262B', color: '#F7F4EF' }}
                  >
                    Min exp {expMinValue} yrs
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {expMaxValue != null && (
                  <button
                    onClick={() => setExperienceMax('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 hover:opacity-80"
                    style={{ background: '#22262B', color: '#F7F4EF' }}
                  >
                    Max exp {expMaxValue} yrs
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {chips.map(({ key, value }) => (
                  <button
                    key={`${key}-${value}`} onClick={() => removeChip(key, value)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 hover:opacity-80"
                    style={{ background: '#22262B', color: '#F7F4EF' }}
                  >
                    {value}
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                <button onClick={clearAll} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ background: 'transparent', border: '1px solid rgba(34,38,43,0.18)', color: '#4A5059' }}>
                  Clear all
                </button>
              </div>
            )}

            {/* Count */}
            <p className="text-sm mb-4" style={{ color: 'rgba(34,38,43,0.48)' }}>
              Showing <strong style={{ color: '#22262B' }}>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong style={{ color: '#22262B' }}>{filtered.length}</strong> roles
            </p>

            {/* Cards */}
            {filtered.length > 0 ? (
              <>
                <div className="flex flex-col gap-3">
                  {paginated.map((r) => <RoleCard key={r.id} role={r} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center gap-3 sm:justify-between" style={{ borderTop: '1px solid rgba(34,38,43,0.08)' }}>
                    {/* Prev + Next — full width on mobile */}
                    <div className="flex w-full sm:w-auto gap-2 sm:gap-0">
                      <button
                        onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: (sectionRef.current?.offsetTop ?? 0) - 96, behavior: 'smooth' }) }}
                        disabled={page === 1}
                        className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                        style={{ background: page === 1 ? 'rgba(34,38,43,0.04)' : '#fff', border: '1.5px solid rgba(34,38,43,0.11)', color: page === 1 ? 'rgba(34,38,43,0.28)' : '#22262B', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Previous
                      </button>
                      <button
                        onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: (sectionRef.current?.offsetTop ?? 0) - 96, behavior: 'smooth' }) }}
                        disabled={page === totalPages}
                        className="sm:hidden inline-flex flex-1 items-center justify-center gap-2 ml-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                        style={{ background: page === totalPages ? 'rgba(34,38,43,0.04)' : '#fff', border: '1.5px solid rgba(34,38,43,0.11)', color: page === totalPages ? 'rgba(34,38,43,0.28)' : '#22262B', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                      >
                        Next
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                        const isActive = p === page
                        const isNear = Math.abs(p - page) <= 2 || p === 1 || p === totalPages
                        if (!isNear) {
                          if (p === page - 3 || p === page + 3) return <span key={p} className="text-xs px-1" style={{ color: 'rgba(34,38,43,0.35)' }}>…</span>
                          return null
                        }
                        return (
                          <button
                            key={p}
                            onClick={() => { setPage(p); window.scrollTo({ top: (sectionRef.current?.offsetTop ?? 0) - 96, behavior: 'smooth' }) }}
                            className="w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150"
                            style={{
                              background: isActive ? '#22262B' : 'transparent',
                              color: isActive ? '#F7F4EF' : '#4A5059',
                              border: isActive ? 'none' : '1.5px solid transparent',
                              fontWeight: isActive ? 600 : 400,
                            }}
                            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(34,38,43,0.06)' }}
                            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                          >
                            {p}
                          </button>
                        )
                      })}
                    </div>

                    {/* Next — desktop only */}
                    <button
                      onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: (sectionRef.current?.offsetTop ?? 0) - 96, behavior: 'smooth' }) }}
                      disabled={page === totalPages}
                      className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                      style={{ background: page === totalPages ? 'rgba(34,38,43,0.04)' : '#fff', border: '1.5px solid rgba(34,38,43,0.11)', color: page === totalPages ? 'rgba(34,38,43,0.28)' : '#22262B', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                      Next
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
                style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.07)' }}>
                <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} style={{ color: 'rgba(34,38,43,0.22)', marginBottom: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <h3 className="text-base font-semibold mb-2" style={{ color: '#22262B' }}>No roles match your search</h3>
                <p className="text-sm mb-6" style={{ color: '#4A5059', maxWidth: '26rem' }}>Try different keywords or broaden your filters.</p>
                {hasFilters && (
                  <button onClick={clearAll} className="px-5 py-2.5 rounded-full text-sm font-medium hover:brightness-110"
                    style={{ background: '#22262B', color: '#F7F4EF' }}>
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[150] flex md:hidden" style={{ background: 'rgba(10,18,36,0.48)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileFiltersOpen(false)}>
          <div className="ml-auto h-full overflow-y-auto p-5" style={{ width: 'min(320px, 90vw)', background: '#F7F4EF' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold" style={{ color: '#22262B' }}>Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {SidebarContent}
            <button onClick={() => setMobileFiltersOpen(false)} className="w-full py-3 rounded-xl text-sm font-semibold mt-3"
              style={{ background: '#22262B', color: '#F7F4EF' }}>
              View {filtered.length} roles
            </button>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
