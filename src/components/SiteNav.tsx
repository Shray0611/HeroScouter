import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import logoImage from '@/imports/Screenshot_2026-08-10_192639-removebg-preview.png'
import { roles } from '@/data/roles'
import { fetchActiveRoleCount } from '@/data/api'

interface SiteNavProps {
  cta?: { label: string; href: string }
  activeLink?: string
  variant?: 'absolute' | 'fixed'
}

const LIVE_COUNT_FETCH_TIMEOUT = 10000

function fallbackLiveCount() {
  return roles.filter((r) => r.status === 'Active').length
}

export default function SiteNav({
  cta = { label: 'Get started', href: '/' },
  activeLink,
  variant = 'absolute',
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const [liveCount, setLiveCount] = useState(() => fallbackLiveCount())

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), LIVE_COUNT_FETCH_TIMEOUT)

    fetchActiveRoleCount({ signal: controller.signal })
      .then((count) => {
        if (!cancelled) setLiveCount(count)
      })
      .catch(() => {
        if (!cancelled) setLiveCount(fallbackLiveCount())
      })
      .finally(() => window.clearTimeout(timeout))

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [])

  const links: { label: string; to: string; count?: number }[] = [
    { label: 'Candidates', to: '/candidates' },
    { label: 'Companies', to: '/companies' },
    { label: 'Recruiters', to: '/recruiters' },
    { label: 'Blog', to: '/blog' },
    { label: 'Active Roles', to: '/roles', count: liveCount },
  ]

  const currentActive = activeLink ?? (location.pathname === '/roles' ? 'Active Roles' : links.find((l) => l.to === location.pathname)?.label ?? '')

  return (
    <>
      <nav
        className={`${variant === 'fixed' ? 'fixed' : 'absolute'} top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 transition-all duration-300`}
        style={{
          paddingTop: '0.35rem',
          paddingBottom: '0.35rem',
          background: scrolled || menuOpen
            ? 'linear-gradient(160deg, rgba(14,24,48,0.96) 0%, rgba(10,18,36,0.94) 100%)'
            : 'linear-gradient(160deg, rgba(14,24,48,0.52) 0%, rgba(10,18,36,0.24) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: 'none',
          boxShadow: scrolled
            ? '0 1px 0 rgba(247,244,239,0.06), 0 8px 40px rgba(0,0,0,0.28)'
            : 'none',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex flex-col group" style={{ alignItems: 'flex-start' }}>
          <img
            src={logoImage}
            alt="Heroscouter"
            className="h-[4.2rem] sm:h-[5rem] md:h-[5.5rem] w-auto transition-transform duration-200 group-hover:scale-[1.02]"
            style={{
              display: 'block',
              marginLeft: '-10px',
              marginBottom: '-10px',
              marginTop: '-8px',
              filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
            }}
          />
          <span
            className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider"
            style={{ color: '#D98A3D', letterSpacing: '0.18em', paddingLeft: '12px', marginTop: '-2px' }}
          >
            Hiring, done properly
          </span>
        </Link>

        {/* Desktop Nav links */}
        <div
          className="hidden md:flex items-center gap-0.5 px-1.5 py-1.5 rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(247,244,239,0.13) 0%, rgba(247,244,239,0.065) 100%)',
            border: '1px solid rgba(247,244,239,0.18)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 34px rgba(0,0,0,0.16)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {links.map(({ label, to, count }) => {
            const isActive = label === currentActive
            return (
              <Link
                key={label}
                to={to}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5"
                style={{
                  color: isActive ? '#0f1a2e' : 'rgba(247,244,239,0.82)',
                  background: isActive
                    ? 'linear-gradient(180deg, #F7F4EF 0%, #EDE9E1 100%)'
                    : 'transparent',
                  boxShadow: isActive ? '0 8px 18px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.65)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(247,244,239,0.13)'
                    e.currentTarget.style.color = '#F7F4EF'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(247,244,239,0.82)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {label}
                {count !== undefined && (
                  <span
                    className="text-xs min-w-5 h-5 px-1.5 rounded-full font-bold tabular-nums inline-flex items-center justify-center"
                    style={{
                      background: isActive
                        ? 'rgba(15,26,46,0.13)'
                        : 'linear-gradient(135deg, rgba(200,146,58,0.92) 0%, rgba(217,160,61,0.82) 100%)',
                      color: isActive ? '#22262B' : '#1a0e04',
                      boxShadow: isActive ? 'none' : '0 2px 8px rgba(200,146,58,0.28)',
                    }}
                  >
                    {count}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Desktop CTA */}
        <a
          href={cta.href}
          className="hidden md:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
          style={{
            background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
            color: '#1a0e04',
          }}
        >
          {cta.label}
        </a>

        {/* Mobile: CTA + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <a
            href={cta.href}
            onClick={(e) => {
              const href = cta.href
              if (href.startsWith('#')) {
                e.preventDefault()
                const el = document.getElementById(href.slice(1))
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap text-center"
            style={{
              background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
              color: '#1a0e04',
            }}
          >
            {cta.label}
          </a>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all duration-200"
            style={{ background: 'rgba(247,244,239,0.12)', border: '1px solid rgba(247,244,239,0.18)' }}
          >
            <span
              className="block w-5 h-0.5 rounded-full transition-all duration-300"
              style={{
                background: '#F7F4EF',
                transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block w-5 h-0.5 rounded-full transition-all duration-300"
              style={{
                background: '#F7F4EF',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 rounded-full transition-all duration-300"
              style={{
                background: '#F7F4EF',
                transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>

        {/* Gradient fade below nav */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '100%',
            height: '72px',
            background: 'linear-gradient(to bottom, rgba(10,18,36,0.38) 0%, rgba(10,18,36,0.12) 45%, transparent 100%)',
            zIndex: -1,
          }}
        />
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className="fixed inset-0 z-40 md:hidden flex flex-col transition-all duration-300"
        style={{
          background: 'rgba(10,18,36,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col flex-1 px-6 pt-28 pb-12 gap-2 overflow-y-auto">
          {links.map(({ label, to, count }) => {
            const isActive = label === currentActive
            return (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-5 py-4 rounded-2xl text-base font-semibold transition-all duration-150"
                style={{
                  background: isActive ? 'rgba(247,244,239,0.10)' : 'transparent',
                  color: isActive ? '#F7F4EF' : 'rgba(247,244,239,0.60)',
                  borderLeft: isActive ? '2px solid #C8923A' : '2px solid transparent',
                }}
              >
                <span>{label}</span>
                {count !== undefined && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-bold tabular-nums"
                    style={{
                      background: 'linear-gradient(135deg, rgba(200,146,58,0.92) 0%, rgba(217,160,61,0.82) 100%)',
                      color: '#1a0e04',
                    }}
                  >
                    {count} live
                  </span>
                )}
              </Link>
            )
          })}

          <div className="mt-auto pt-8 border-t border-white border-opacity-10">
            <a
              href={cta.href}
              onClick={(e) => {
                setMenuOpen(false)
                const href = cta.href
                if (href.startsWith('#')) {
                  e.preventDefault()
                  setTimeout(() => {
                    const el = document.getElementById(href.slice(1))
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }, 300)
                }
              }}
              className="flex items-center justify-center w-full py-4 rounded-2xl text-base font-semibold transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                color: '#1a0e04',
              }}
            >
              {cta.label}
            </a>
            <p className="text-center text-xs mt-5" style={{ color: 'rgba(247,244,239,0.30)' }}>
              basecamp@heroscouter.com
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
