import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import SiteFooter from '../components/SiteFooter'
import SiteNav from '../components/SiteNav'
import ApplicationForm from '../components/ApplicationForm'
import { fallbackActiveRole, fetchRole, getCachedActiveRoles } from '../data/api'
import { Role, formatSalary } from '../data/roles'
import logoFallback from '../imports/roles_data.jpg'
import heroScouterLogo from '../imports/Screenshot_2026-08-10_192639-removebg-preview.png'

function fmtSalary(role: Role) {
  return formatSalary(role)
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function firstParagraph(html: string) {
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i)
  return stripHtml(match?.[1] ?? html).slice(0, 180)
}

function normalizeHeadingText(value: string) {
  return stripHtml(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function isRoleHeading(value: string) {
  return [
    'about the role',
    'about role',
    'the role',
    'role overview',
    'what you ll do',
    'what you will do',
  ].includes(normalizeHeadingText(value))
}

function splitRoleContent(html: string) {
  const headings = Array.from(html.matchAll(/<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/gi))
  const match = headings.find((heading) => isRoleHeading(heading[0]))

  if (!match || match.index == null || match.index === 0) {
    return { companyHtml: '', roleHtml: html }
  }

  return {
    companyHtml: html.slice(0, match.index),
    roleHtml: html.slice(match.index),
  }
}

function stripLeadingHeading(html: string, title: string) {
  const match = html.match(/^\s*<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/i)
  if (!match) return html

  return normalizeHeadingText(match[0]) === normalizeHeadingText(title)
    ? html.slice(match[0].length).trim()
    : html
}

function companyOverview(role: Role) {
  const details = [role.fundingStage, role.industry, role.companySize ? `${role.companySize} employees` : null]
    .filter(Boolean)
    .join(' · ')

  if (details) return `${role.company} is an active HeroScouter hiring partner. ${details}.`
  return `${role.company} is an active HeroScouter hiring partner.`
}

function Chip({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs"
      style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.16)', color: '#26303B' }}
    >
      {icon}
      {children}
    </span>
  )
}

function PinIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h12l-2 4 2 4H5" />
    </svg>
  )
}

function TrendIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l6-6 4 4 6-8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 6h6v6" />
    </svg>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-8" style={{ borderTop: '1px solid rgba(34,38,43,0.16)' }}>
      <h2 className="mb-6 text-4xl font-serif italic font-semibold leading-tight" style={{ color: '#07152A', letterSpacing: '0' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function HtmlContent({ html }: { html: string }) {
  if (!html) return <p className="text-base leading-8" style={{ color: '#26303B' }}>No details provided yet.</p>
  return <div className="hs-prose role-detail-prose" dangerouslySetInnerHTML={{ __html: html }} />
}

function CompanyLogo({ role }: { role: Role }) {
  const [errored, setErrored] = useState(false)

  return (
    <div
      className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-sm"
      style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.08)' }}
    >
      <img
        src={errored || !role.companyLogoUrl ? logoFallback : role.companyLogoUrl}
        alt={role.company}
        className="h-16 w-16 object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  )
}

export default function RoleDetailPage() {
  const { roleId = '' } = useParams()
  const [role, setRole] = useState<Role | null>(() => {
    return getCachedActiveRoles()?.find((r) => r.id === roleId) ?? fallbackActiveRole(roleId)
  })
  const [loading, setLoading] = useState(() => !role)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    if (!role || isDownloading) return
    setIsDownloading(true)

    try {
      // Load jsPDF
      const loadJsPDF = (): Promise<any> => {
        if ((window as any).jspdf?.jsPDF) return Promise.resolve((window as any).jspdf.jsPDF)
        return new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          script.onload = () => resolve((window as any).jspdf.jsPDF)
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      // Convert any image src → base64 data URL for addImage
      const toBase64 = (src: string): Promise<string> =>
        fetch(src)
          .then(r => r.blob())
          .then(blob => new Promise((res, rej) => {
            const fr = new FileReader()
            fr.onload = () => res(fr.result as string)
            fr.onerror = rej
            fr.readAsDataURL(blob)
          }))

      const [JsPDF, logoData] = await Promise.all([
        loadJsPDF(),
        toBase64(heroScouterLogo).catch(() => null),
      ])

      const doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const ml = 18
      const mr = 18
      const textW = pageW - ml - mr
      let y = 18

      // ── helpers ──────────────────────────────────────────────────────────
      const checkPage = (needed = 8) => {
        if (y + needed > pageH - 20) { doc.addPage(); y = 18 }
      }

      const gap = (mm = 3) => { y += mm }

      const rule = (r = 210, g = 200, b = 185, w = 0.3) => {
        checkPage(5)
        doc.setDrawColor(r, g, b)
        doc.setLineWidth(w)
        doc.line(ml, y, pageW - mr, y)
        gap(4)
      }

      // text block with word-wrap
      const txt = (
        text: string,
        size: number,
        color: [number, number, number],
        style: 'normal' | 'bold' = 'normal',
        indent = 0,
        lineGap = 0.45,
      ) => {
        if (!text.trim()) return
        doc.setFontSize(size)
        doc.setFont('helvetica', style)
        doc.setTextColor(...color)
        const lines: string[] = doc.splitTextToSize(text.trim(), textW - indent)
        lines.forEach((line: string) => {
          checkPage(size * 0.45)
          doc.text(line, ml + indent, y)
          y += size * lineGap
        })
      }

      const sectionHeading = (title: string) => {
        checkPage(18)
        gap(5)
        // Amber left accent bar
        doc.setFillColor(217, 111, 24)
        doc.rect(ml, y - 4, 2.5, 7, 'F')
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(7, 21, 42)
        doc.text(title, ml + 5, y)
        y += 4
        doc.setDrawColor(220, 210, 195)
        doc.setLineWidth(0.3)
        doc.line(ml, y, pageW - mr, y)
        gap(4)
      }

      // HTML → structured lines
      const parseHtml = (html: string) => {
        if (!html) return []
        type Line = { text: string; style: 'normal' | 'bold'; indent: number; spaceAfter: number }
        const out: Line[] = []

        const clean = html
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<\/li>/gi, '\n')
          .replace(/<li[^>]*>/gi, '@@BULLET@@')
          .replace(/<h[1-6][^>]*>/gi, '@@H@@')
          .replace(/<\/h[1-6]>/gi, '\n')
          .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '@@B@@$1@@EB@@')
          .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '@@B@@$1@@EB@@')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
          .replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&lsquo;/g, "'").replace(/&rsquo;/g, "'")

        clean.split('\n').forEach(raw => {
          const line = raw.trim()
          if (!line) return

          if (line.startsWith('@@H@@')) {
            // sub-heading inside content
            const text = line.replace('@@H@@', '').replace(/@@B@@|@@EB@@/g, '').trim()
            if (text) out.push({ text, style: 'bold', indent: 0, spaceAfter: 1.5 })
          } else if (line.startsWith('@@BULLET@@')) {
            const text = '• ' + line.replace('@@BULLET@@', '').replace(/@@B@@|@@EB@@/g, '').trim()
            out.push({ text, style: 'normal', indent: 4, spaceAfter: 1.5 })
          } else {
            // strip inline bold markers, render as normal paragraph
            const text = line.replace(/@@B@@|@@EB@@/g, '').trim()
            if (text) out.push({ text, style: 'normal', indent: 0, spaceAfter: 3 })
          }
        })
        return out
      }

      const addSection = (html: string, fallback = '') => {
        const lines = parseHtml(html || fallback)
        lines.forEach(({ text, style, indent, spaceAfter }) => {
          txt(text, 10, [55, 65, 75], style, indent)
          gap(spaceAfter)
        })
      }

      // ── HEADER ───────────────────────────────────────────────────────────
      // Orange top bar
      doc.setFillColor(217, 111, 24)
      doc.rect(0, 0, pageW, 2, 'F')

      y = 14
      // Logo image (left) — falls back to text if unavailable
      if (logoData) {
        // Draw at 32mm wide, proportional height (~9mm for this logo)
        doc.addImage(logoData, 'PNG', ml, y - 7, 40, 20)
        y = 25
      } else {
        doc.setFontSize(15)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(217, 111, 24)
        doc.text('HeroScouter', ml, y)
        y = 25
      }

      // Site URL — right aligned on same row as logo
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(139, 147, 163)
      doc.text('heroscouter.com', pageW - mr, 18, { align: 'right' })
      doc.text(
        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        pageW - mr, 23, { align: 'right' }
      )

      // Divider under header
      doc.setDrawColor(217, 111, 24)
      doc.setLineWidth(0.5)
      doc.line(ml, y, pageW - mr, y)
      y += 12

      // ── TITLE BLOCK ───────────────────────────────────────────────────────
      txt(role.title, 22, [7, 21, 42], 'bold')
      gap(1)
      txt(`at ${role.company}`, 11, [217, 111, 24])
      gap(1)

      // Role ID + status chips row
      const metaLine = [
        `ID: ${role.id}`,
        role.fundingStage,
        role.companySize ? `${role.companySize} employees` : null,
      ].filter(Boolean).join('   ·   ')
      txt(metaLine, 8, [139, 147, 163])
      gap(4)

      // Salary — large + bold
      txt(fmtSalary(role), 14, [38, 48, 59], 'bold')
      gap(1)
      if (role.equityMin != null && role.equityMax != null && role.equityMax > 0) {
        txt(`Equity: ${role.equityMin}% – ${role.equityMax}%`, 9, [139, 147, 163])
        gap(1)
      }
      gap(2)

      // Tags — each on its own labelled item, wraps cleanly
      const tagPairs: [string, string][] = [
        ['Location', role.location],
        ['Work Type', role.workLocation],
        ['Employment', role.employmentType || 'Full-time'],
        role.yoe ? ['Experience', role.yoe] : null,
        role.jobCategory ? ['Category', role.jobCategory] : null,
        role.industry ? ['Industry', role.industry] : null,
        ['Visa', role.h1bSponsorship ? 'Sponsored' : 'Not sponsored'],
      ].filter(Boolean) as [string, string][]

      // Two-column tag grid
      const colW = textW / 2
      tagPairs.forEach(([label, value], i) => {
        const x = ml + (i % 2) * colW
        if (i % 2 === 0) checkPage(6)
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(139, 147, 163)
        doc.text(label.toUpperCase(), x, y)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(38, 48, 59)
        doc.text(value, x, y + 3.5)
        if (i % 2 === 1 || i === tagPairs.length - 1) y += 10
      })
      gap(3)

      rule(217, 111, 24, 0.4)

      // ── CONTENT SECTIONS ─────────────────────────────────────────────────
      if (role.responsibilitiesHtml || role.responsibilities) {
        sectionHeading('About the Role')
        addSection(role.responsibilitiesHtml, role.responsibilities)
      }

      if (role.requirementsHtml || role.requirements) {
        sectionHeading("What You'll Bring")
        addSection(role.requirementsHtml, role.requirements)
      }

      if (role.benefitsHtml || role.benefits) {
        sectionHeading('Benefits')
        addSection(role.benefitsHtml, role.benefits)
      }

      if (role.interviewStages) {
        sectionHeading('Interview Process')
        role.interviewStages.split(' | ').filter(Boolean).forEach((stage, i) => {
          checkPage(8)
          // Number circle (drawn as filled circle + white text)
          doc.setFillColor(7, 21, 42)
          doc.circle(ml + 3, y - 1.5, 3, 'F')
          doc.setFontSize(7)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(255, 255, 255)
          doc.text(String(i + 1), ml + 3, y - 0.2, { align: 'center' })
          // Stage text
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(55, 65, 75)
          const wrapped: string[] = doc.splitTextToSize(stage.trim(), textW - 10)
          wrapped.forEach((line: string, li: number) => {
            doc.text(line, ml + 8, li === 0 ? y : y + li * 4.5)
          })
          y += Math.max(wrapped.length * 4.5, 8)
          gap(1)
        })
      }

      // ── FOOTER (every page) ───────────────────────────────────────────────
      const totalPages = (doc.internal as any).pages.length - 1
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p)
        const fy = pageH - 10
        doc.setDrawColor(220, 210, 195)
        doc.setLineWidth(0.25)
        doc.line(ml, fy - 3, pageW - mr, fy - 3)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(139, 147, 163)
        doc.text('HeroScouter — heroscouter.com', ml, fy)
        doc.text(`Page ${p} of ${totalPages}`, pageW / 2, fy, { align: 'center' })
        doc.text(`/roles/${encodeURIComponent(role.id)}`, pageW - mr, fy, { align: 'right' })
      }

      // ── SAVE ─────────────────────────────────────────────────────────────
      const filename = `${role.company.replace(/[^a-zA-Z0-9]/g, '_')}_${role.title.replace(/[^a-zA-Z0-9]/g, '_')}_HeroScouter.pdf`
      doc.save(filename)

    } catch (err) {
      console.error('PDF generation failed:', err)
      window.print()
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    fetchRole(roleId)
      .then((item) => {
        if (!cancelled && item) {
          setRole(item)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRole((prev) => prev ?? fallbackActiveRole(roleId))
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [roleId])

  const content = useMemo(() => role ? splitRoleContent(role.responsibilitiesHtml || role.responsibilities) : { companyHtml: '', roleHtml: '' }, [role])
  const summary = useMemo(() => role ? firstParagraph(content.roleHtml || role.responsibilitiesHtml || role.responsibilities) : '', [content.roleHtml, role])

  if (!role && !loading) {
    return (
      <div style={{ background: '#F7F4EF', minHeight: '100vh' }}>
        <SiteNav cta={{ label: 'Submit Profile', href: '/candidates' }} activeLink="Open Roles" variant="fixed" />
        <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-center">
          <h1 className="text-4xl font-semibold" style={{ color: '#07152A', letterSpacing: '0' }}>Role not found</h1>
          <p className="mt-4 text-sm" style={{ color: '#4A5059' }}>This role is no longer active.</p>
          <a href="/roles" className="mt-8 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold" style={{ background: '#22262B', color: '#F7F4EF' }}>
            Browse active roles
          </a>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!role) return null

  return (
    <div style={{ background: '#F7F4EF', minHeight: '100vh' }}>
      <SiteNav cta={{ label: 'Submit Profile', href: '/candidates' }} activeLink="Open Roles" variant="fixed" />

      <main className="role-detail-page mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8">
        <article className="mx-auto max-w-[1320px]">
          <header className="flex flex-col gap-5 pb-7 md:flex-row md:items-start md:justify-between" style={{ borderBottom: '1px solid rgba(34,38,43,0.16)' }}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <CompanyLogo role={role} />

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h1 className="text-3xl font-semibold leading-tight md:text-[2rem]" style={{ color: '#07152A', letterSpacing: '0' }}>
                    {role.title} at {role.company}
                  </h1>
                </div>
                <p className="mt-2 text-base font-medium" style={{ color: '#4A5059' }}>{fmtSalary(role)}</p>
                {summary && <p className="mt-3 max-w-5xl text-base leading-7" style={{ color: '#26303B' }}>{summary}</p>}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip icon={<PinIcon />}>{role.location}</Chip>
                  <Chip icon={<ClockIcon />}>{role.employmentType || 'Full-time'}</Chip>
                  <Chip icon={<FlagIcon />}>{role.h1bSponsorship ? 'Visa supported' : 'US citizen/visa only'}</Chip>
                  {role.yoe && <Chip icon={<TrendIcon />}>{role.yoe}</Chip>}
                  {role.jobCategory && <Chip>{role.jobCategory}</Chip>}
                  {role.industry && <Chip>{role.industry}</Chip>}
                  {role.workLocation && <Chip>{role.workLocation}</Chip>}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3 md:pl-4 print:hidden">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-base font-medium overflow-hidden transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
                style={{
                  background: isDownloading ? '#e8e4de' : '#fff',
                  border: '1px solid rgba(34,38,43,0.16)',
                  color: isDownloading ? '#8B93A3' : '#07152A',
                  boxShadow: isDownloading ? 'none' : '0 1px 3px rgba(34,38,43,0.08)',
                }}
              >
                {/* Ripple glow on hover */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(217,111,24,0.08) 0%, transparent 70%)' }}
                />
                {isDownloading ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="#D4A052" strokeWidth="2.5" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round" />
                    </svg>
                    <span>Generating…</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="transition-transform duration-200 group-hover:translate-y-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>Download JD</span>
                  </>
                )}
              </button>
              {role.companyWebsite && (
                <a
                  href={role.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-base font-medium transition-colors"
                  style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.16)', color: '#07152A' }}
                >
                  Visit
                </a>
              )}
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="inline-flex h-12 items-center justify-center rounded-md px-5 text-base font-semibold transition-colors hover:brightness-110"
                style={{ background: '#D96F18', color: '#fff' }}
              >
                Apply
              </button>
            </div>
          </header>

          <Section title={`About ${role.company}`}>
            {content.companyHtml ? (
              <HtmlContent html={stripLeadingHeading(content.companyHtml, `About ${role.company}`)} />
            ) : (
              <p className="max-w-none text-base leading-8" style={{ color: '#26303B' }}>
                {companyOverview(role)}
              </p>
            )}
          </Section>

          <Section title="About the role">
            <HtmlContent html={stripLeadingHeading(content.roleHtml, 'About the role')} />
          </Section>

          <Section title="What you'll bring">
            <HtmlContent html={role.requirementsHtml} />
          </Section>

          <Section title="Benefits">
            <HtmlContent html={role.benefitsHtml} />
          </Section>

          {role.interviewStages && (
            <Section title="Interview process">
              <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-3">
                {role.interviewStages.split(' | ').filter(Boolean).map((stage, index, arr) => (
                  <div key={`${stage}-${index}`} className="flex items-center gap-3">
                    <div
                      className="flex items-center gap-3 rounded-lg px-4 py-3"
                      style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.12)', boxShadow: '0 2px 8px rgba(34,38,43,0.04)' }}
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{ background: '#F7F4EF', color: '#07152A' }}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium" style={{ color: '#26303B' }}>
                        {stage}
                      </span>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="hidden md:flex text-[#A0A5AC]">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    )}
                    {index < arr.length - 1 && (
                      <div className="md:hidden flex justify-center w-full py-1 text-[#A0A5AC]">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </article>
      </main>

      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(7,21,42,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-2 sm:p-4 animate-fade-in" style={{ background: '#F7F4EF', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button 
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-50 transition-colors"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mt-8 sm:mt-4">
              <ApplicationForm 
                jobId={role.id} 
                roleTitle={role.title} 
                title="Apply for this role" 
                subtitle="Submit your details and we will get back to you shortly."
              />
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
