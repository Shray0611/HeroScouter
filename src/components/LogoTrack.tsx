import { useEffect, useMemo, useState } from 'react'
import { Company, fallbackActiveCompanies, fetchActiveCompanies } from '../data/api'
import logoFallback from '../imports/image-28.png'

function CompanyLogo({ company }: { company: Company }) {
  const [errored, setErrored] = useState(false)

  return (
    <span
      className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden"
      style={{
        background: 'rgba(34,38,43,0.06)',
        border: '1px solid rgba(34,38,43,0.08)',
      }}
    >
      <img
        src={errored || !company.logoUrl ? logoFallback : company.logoUrl}
        alt={company.name}
        className="w-6 h-6 object-contain"
        onError={() => setErrored(true)}
      />
    </span>
  )
}

interface LogoTrackProps {
  bg?: string
  logoColor?: string
  labelColor?: string
  borderTop?: string
  borderBottom?: string
  label?: string
}

export default function LogoTrack({
  bg = '#F7F4EF',
  logoColor = 'rgba(34,38,43,0.30)',
  labelColor = 'rgba(34,38,43,0.36)',
  borderTop = '1px solid rgba(34,38,43,0.08)',
  borderBottom = '1px solid rgba(34,38,43,0.08)',
}: LogoTrackProps) {
  const [companies, setCompanies] = useState<Company[]>(() => fallbackActiveCompanies().slice(0, 10))
  const track = useMemo(() => [...companies, ...companies, ...companies], [companies])

  useEffect(() => {
    let cancelled = false

    fetchActiveCompanies()
      .then((items) => {
        if (!cancelled && items.length) setCompanies(items.slice(0, 10))
      })
      .catch(() => {
        if (!cancelled) setCompanies(fallbackActiveCompanies().slice(0, 10))
      })

    return () => { cancelled = true }
  }, [])

  return (
    <div
      className="relative py-5 overflow-hidden"
      style={{ background: bg, borderTop, borderBottom }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${bg}, transparent)` }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${bg}, transparent)` }}
      />

      <div
        className="flex items-center"
        style={{ animation: 'ticker 34s linear infinite', width: 'max-content' }}
      >
        {track.map((company, i) => (
          <div
            key={`${company.name}-${i}`}
            className="flex items-center gap-3 px-8 shrink-0 select-none"
            style={{ color: logoColor }}
          >
            <CompanyLogo company={company} />
            <span className="text-sm font-medium" style={{ color: labelColor, letterSpacing: '-0.01em' }}>
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
