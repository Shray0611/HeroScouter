const doors = [
  {
    id: 'candidates',
    label: 'Candidates',
    headline: 'Find your next role.',
    body: 'Handpicked openings at companies worth joining. No noise, no recruiter spam. Just roles that fit.',
    cta: 'Browse roles',
    href: '/candidates',
    accent: '#D98A3D',
    accentLight: '#E8A05C',
    accentBg: '#FBF2E8',
    accentText: '#C07020',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    id: 'companies',
    label: 'Companies',
    headline: 'Hire with us.',
    body: 'Curated specialists for the roles you cannot afford to get wrong. We find people who are not on the market yet.',
    cta: 'Start hiring',
    href: '/companies',
    accent: '#1E4D3A',
    accentLight: '#2A6B50',
    accentBg: '#EAF2EE',
    accentText: '#1E4D3A',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    id: 'recruiters',
    label: 'Recruiters',
    headline: 'Recruit with us.',
    body: 'Live, high-value roles and the tools to fill them, without chasing clients. Work on roles that matter.',
    cta: 'Join as a recruiter',
    href: '/recruiters',
    accent: '#C0603F',
    accentLight: '#D4785A',
    accentBg: '#FAF0EB',
    accentText: '#A04830',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
]

import { Link } from 'react-router'

export default function ThreeDoors() {
  return (
    <section
      id="how-it-works"
      className="pt-24 md:pt-32 pb-14 md:pb-16"
      style={{ background: '#F7F4EF' }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        {/* Section header */}
        <div className="mb-14">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-4"
            style={{ color: '#1E4D3A', letterSpacing: '0.15em' }}
          >
            Where do you fit?
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
            Three ways to work with us.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {doors.map((door) => (
            <div
              key={door.id}
              className="group flex flex-col p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: door.accentBg,
                border: `1px solid ${door.accent}22`,
              }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-7"
                style={{ background: `${door.accent}18`, color: door.accent }}
              >
                {door.icon}
              </div>

              {/* Label */}
              <span
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: door.accentText, letterSpacing: '0.13em' }}
              >
                {door.label}
              </span>

              {/* Headline */}
              <h3
                className="font-serif font-light mb-4"
                style={{
                  fontSize: '1.65rem',
                  lineHeight: 1.18,
                  letterSpacing: '-0.02em',
                  color: '#22262B',
                }}
              >
                {door.headline}
              </h3>

              {/* Body */}
              <p
                className="text-sm leading-relaxed flex-1 mb-8"
                style={{ color: '#4A5059' }}
              >
                {door.body}
              </p>

              {/* CTA */}
              <Link
                to={door.href}
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:brightness-95"
                style={{
                  background: door.accent,
                  color: '#F7F4EF',
                }}
              >
                {door.cta}
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
