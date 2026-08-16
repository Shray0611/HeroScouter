import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import SiteFooter from '../components/SiteFooter'
import SiteNav from '../components/SiteNav'
import ApplicationForm from '../components/ApplicationForm'
import { fallbackActiveRole, fetchRole } from '../data/api'
import { Role } from '../data/roles'
import logoFallback from '../imports/roles_data.jpg'
import heroScouterLogo from '../imports/Screenshot_2026-08-10_192639-removebg-preview.png'

function fmtSalary(role: Role) {
  const sym = role.currency || '$'
  return `${sym}${(role.salaryMin / 1000).toFixed(0)}K - ${sym}${(role.salaryMax / 1000).toFixed(0)}K`
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
  const [role, setRole] = useState<Role | null>(() => fallbackActiveRole(roleId))
  const [loading, setLoading] = useState(true)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    if (!role || isDownloading) return
    setIsDownloading(true)

    // Load html2pdf.js from CDN once; cache on window
    const loadHtml2pdf = (): Promise<any> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).html2pdf) return Promise.resolve((window as any).html2pdf)
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
        script.onload = () => resolve((window as any).html2pdf) // eslint-disable-line @typescript-eslint/no-explicit-any
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const pdfStyles = `
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap');
      .pdf-shell {
        font-family: 'Inter', Arial, Helvetica, sans-serif;
        color: #26303B;
        max-width: 700px;
        margin: 0 auto;
        padding: 0;
      }
      .pdf-header,
      .pdf-title,
      .pdf-chips,
      .pdf-footer,
      .pdf-section,
      .pdf-section h2,
      .pdf-content h1,
      .pdf-content h2,
      .pdf-content h3,
      .pdf-content p,
      .pdf-content ul,
      .pdf-content ol,
      .pdf-content li {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .pdf-section {
        margin: 0 0 34px 0;
        padding-top: 2px;
      }
      .pdf-section h2 {
        color: #07152A;
        border-bottom: 2px solid rgba(34,38,43,0.16);
        font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
        font-size: 22px;
        font-style: italic;
        font-weight: 600;
        line-height: 1.25;
        margin: 0 0 16px 0;
        padding: 0 0 10px 0;
      }
      .pdf-content {
        font-size: 13.5px;
        line-height: 1.75;
        color: #26303B;
      }
      .pdf-content h1,
      .pdf-content h2,
      .pdf-content h3,
      .pdf-content h4,
      .pdf-content strong {
        color: #07152A;
        font-weight: 700;
      }
      .pdf-content h1,
      .pdf-content h2,
      .pdf-content h3,
      .pdf-content h4 {
        font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
        font-style: italic;
        font-weight: 600;
        margin: 18px 0 8px 0;
        line-height: 1.25;
      }
      .pdf-content p {
        margin: 0 0 10px 0;
      }
      .pdf-content ul,
      .pdf-content ol {
        margin: 8px 0 14px 20px;
        padding: 0;
      }
      .pdf-content li {
        margin: 0 0 8px 0;
        padding-left: 2px;
      }
      .pdf-content li p {
        margin: 0;
      }
    `

    // Build a clean, branded HTML document for the PDF
    const html = `
      <style>${pdfStyles}</style>
      <div class="pdf-shell">
        <!-- HEADER -->
        <div class="pdf-header" style="display: flex; align-items: center; justify-content: space-between; gap: 24px; padding-bottom: 18px; border-bottom: 2px solid #D96F18; margin-bottom: 26px;">
          <img src="${heroScouterLogo}" alt="HeroScouter" style="width: 118px; height: auto; object-fit: contain; display: block;" />
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; font-family: 'Inter', Arial, sans-serif;">
            <a href="https://heroscouter.com" style="font-size: 11px; color: #D96F18; text-decoration: underline; text-underline-offset: 2px;">heroscouter.com</a>
            <span style="font-size: 10.5px; color: #8B93A3;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <!-- JOB TITLE -->
        <div class="pdf-title">
          <h1 style="font-size: 30px; font-weight: 600; font-style: italic; margin: 0 0 6px 0; line-height: 1.2; color: #07152A; font-family: 'Fraunces', Georgia, serif;">${role.title}</h1>
          <p style="font-size: 16px; color: #D96F18; margin: 0 0 4px 0; font-family: 'Fraunces', Georgia, serif; font-style: italic; font-weight: 600;">at ${role.company}</p>
          <p style="font-size: 12px; color: #8B93A3; margin: 0 0 16px 0; font-family: 'Inter', Arial, sans-serif;">Role ID: ${role.id}</p>
        </div>

        <!-- SALARY -->
        <p style="font-size: 16px; font-weight: 700; color: #26303B; margin: 0 0 16px 0; font-family: 'Inter', Arial, sans-serif;">${(role.currency || '$')}${(role.salaryMin / 1000).toFixed(0)}K &ndash; ${(role.currency || '$')}${(role.salaryMax / 1000).toFixed(0)}K</p>

        <!-- CHIPS -->
        <div class="pdf-chips" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 32px;">
          ${[role.location, role.employmentType || 'Full-time', role.h1bSponsorship ? 'Visa supported' : 'US citizen/visa only', role.yoe, role.jobCategory, role.industry, role.workLocation].filter(Boolean).map(chip => `<span style="display: inline-block; padding: 3px 10px; border: 1px solid rgba(34,38,43,0.2); border-radius: 4px; font-size: 11px; color: #26303B; font-family: 'Inter', Arial, sans-serif; background: #F7F4EF;">${chip}</span>`).join('')}
        </div>

        ${(role.responsibilitiesHtml || role.responsibilities) ? `
        <!-- ABOUT THE ROLE -->
        <div class="pdf-section">
          <h2>About the Role</h2>
          <div class="pdf-content">${role.responsibilitiesHtml || role.responsibilities}</div>
        </div>` : ''}

        ${role.requirementsHtml ? `
        <!-- REQUIREMENTS -->
        <div class="pdf-section">
          <h2>What You'll Bring</h2>
          <div class="pdf-content">${role.requirementsHtml}</div>
        </div>` : ''}

        ${role.benefitsHtml ? `
        <!-- BENEFITS -->
        <div class="pdf-section">
          <h2>Benefits</h2>
          <div class="pdf-content">${role.benefitsHtml}</div>
        </div>` : ''}

        <!-- FOOTER -->
        <div class="pdf-footer" style="margin-top: 34px; padding-top: 16px; border-top: 1px solid rgba(34,38,43,0.12); display: flex; justify-content: space-between; align-items: center; gap: 18px;">
          <span style="font-size: 10px; color: #8B93A3; font-family: 'Inter', Arial, sans-serif;">Generated by HeroScouter</span>
          <span style="font-size: 10px; color: #8B93A3; font-family: 'Inter', Arial, sans-serif;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · <a href="https://heroscouter.com" style="color: #D96F18; text-decoration: underline; text-underline-offset: 2px;">heroscouter.com</a></span>
        </div>
      </div>
    `
    try {
      const element = document.createElement('div')
      element.innerHTML = html
      const h2pdf = await loadHtml2pdf()
      await h2pdf().set({
        margin: [0.5, 0.6, 0.5, 0.6],
        filename: `HeroScouter-JD-${role.title.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        enableLinks: true,
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: ['.pdf-section', '.pdf-content p', '.pdf-content li', '.pdf-section h2'] }
      }).from(element).save()
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchRole(roleId)
      .then((item) => {
        if (!cancelled) setRole(item)
      })
      .catch(() => {
        if (!cancelled) setRole(fallbackActiveRole(roleId))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
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
