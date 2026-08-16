'use client'

import { useEffect, useState } from 'react'
import { Role } from '../data/roles'
import { fallbackActiveRoles, fetchRoles } from '../data/api'
import logoFallback from '../imports/image-28.png'

function fmtSalary(role: Role) {
  const sym = role.currency || '$'
  return `${sym}${(role.salaryMin / 1000).toFixed(0)}k - ${sym}${(role.salaryMax / 1000).toFixed(0)}k`
}

function RoleLogo({ src, company }: { src: string | null; company: string }) {
  const [errored, setErrored] = useState(false)

  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
      style={{ background: '#F7F4EF', border: '1px solid rgba(34,38,43,0.10)' }}
    >
      <img
        src={errored || !src ? logoFallback : src}
        alt={company}
        className="w-7 h-7 object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  )
}

export default function RolesSlate() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [roles, setRoles] = useState<Role[]>(() => fallbackActiveRoles(10))

  useEffect(() => {
    let cancelled = false

    fetchRoles('?status=active&limit=10')
      .then((items) => {
        if (!cancelled && items.length) setRoles(items)
      })
      .catch(() => {
        if (!cancelled) setRoles(fallbackActiveRoles(10))
      })

    return () => { cancelled = true }
  }, [])

  return (
    <section
      id="roles"
      className="pt-14 md:pt-16 pb-14 md:pb-16"
      style={{ background: '#EDE9E1' }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: '#1E4D3A', letterSpacing: '0.15em' }}
            >
              Curated weekly
            </p>
            <h2
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                letterSpacing: '-0.025em',
                lineHeight: 1.12,
                color: '#22262B',
              }}
            >
              Open roles, right now.
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#7A8390' }}>
              Ten live opportunities from the companies in your directory.
            </p>
          </div>

          <a
            href="/roles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shrink-0 transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: '#F7F4EF',
              border: '1px solid rgba(34,38,43,0.14)',
              color: '#22262B',
            }}
          >
            All roles
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roles.map((role) => {
            const active = hovered === role.id
            const tags = [role.jobCategory, role.employmentType].filter(Boolean)

            return (
              <a
                key={role.id}
                href={`/roles/${encodeURIComponent(role.id)}`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(role.id)}
                onMouseLeave={() => setHovered(null)}
                className="flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-200"
                style={{
                  background: active ? '#F7F4EF' : '#F0EDE7',
                  border: `1px solid ${active ? 'rgba(34,38,43,0.14)' : 'rgba(34,38,43,0.08)'}`,
                  transform: active ? 'translateY(-1px)' : 'none',
                  boxShadow: active ? '0 4px 16px rgba(34,38,43,0.07)' : 'none',
                }}
              >
                <RoleLogo src={role.companyLogoUrl} company={role.company} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <span className="text-xs block truncate" style={{ color: '#7A8390' }}>
                        {role.company}
                      </span>
                      <h3
                        className="font-medium leading-snug mt-0.5"
                        style={{ fontSize: '0.9375rem', color: '#22262B' }}
                      >
                        {role.title}
                      </h3>
                    </div>
                    <span className="text-xs font-medium shrink-0 px-2.5 py-1 rounded-full" style={{ background: '#EAF2EE', color: '#1E4D3A', border: '1px solid #1E4D3A28' }}>
                      Open
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: '#7A8390' }}
                    >
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {role.location}
                      {role.workLocation === 'Remote' && (
                        <span
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{ background: '#EAF2EE', color: '#1E4D3A', fontSize: '0.6875rem' }}
                        >
                          Remote
                        </span>
                      )}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: '#D98A3D' }}
                    >
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {fmtSalary(role)}
                    </span>
                  </div>

                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: '#EDE9E1',
                          color: '#4A5059',
                          border: '1px solid rgba(34,38,43,0.10)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="shrink-0 self-center transition-all duration-200"
                  style={{
                    color: '#7A8390',
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateX(0)' : 'translateX(-4px)',
                  }}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </a>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/roles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: '#22262B',
              color: '#F7F4EF',
            }}
          >
            Browse all open roles
          </a>
        </div>

        <div
          className="w-full h-px mt-16"
          style={{ background: 'rgba(34,38,43,0.12)' }}
        />
      </div>
    </section>
  )
}
