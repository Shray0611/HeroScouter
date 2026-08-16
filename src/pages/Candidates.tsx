import horseBg from '../imports/CandidatesHome.optimized.jpg'
import SiteFooter from '../components/SiteFooter'
import SiteNav from '../components/SiteNav'
import LogoTrack from '../components/LogoTrack'
import ApplicationForm from '../components/ApplicationForm'

export default function Candidates() {
  return (
    <div style={{ background: '#F7F4EF', minHeight: '100vh' }}>
      <SiteNav
        cta={{ label: 'Submit Profile', href: '#submit' }}
        activeLink="Candidates"
        variant="fixed"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Background image + all overlays inside the clip boundary */}
        <div className="absolute inset-0" style={{ background: '#0d1628' }}>
          <img
            src={horseBg}
            alt="Man riding horse through cosmic starfield"
            className="w-full h-full object-cover"
            style={{ objectPosition: '100% 45%', transform: 'translateX(8%)' }}
          />
          {/* Top shadow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(10,18,36,0.72) 0%, rgba(10,18,36,0.24) 20%, transparent 38%)',
            }}
          />
          {/* Left vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(10,18,36,0.97) 0%, rgba(10,18,36,0.92) 14%, rgba(10,18,36,0.78) 28%, rgba(10,18,36,0.48) 44%, rgba(10,18,36,0.18) 60%, rgba(10,18,36,0.04) 74%, transparent 86%)',
            }}
          />
          {/* Warm gold centre glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 55% 45% at 58% 58%, rgba(201,130,50,0.18) 0%, transparent 65%)',
            }}
          />
          {/* Bottom fade — full 50vh tall, ends solidly at section bottom */}
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{
              height: '52%',
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(247,244,239,0.06) 35%, rgba(247,244,239,0.32) 55%, rgba(247,244,239,0.68) 72%, rgba(247,244,239,0.92) 86%, #F7F4EF 100%)',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-8 md:px-10 pb-20 md:pb-28 max-w-3xl" style={{ marginLeft: 'clamp(1rem, 6vw, 7rem)' }}>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: 'rgba(217,138,61,0.9)', letterSpacing: '0.22em' }}
          >
            Specialist Recruitment · Seed to Series C
          </p>
          <h1
            className="font-serif font-light mb-6"
            style={{
              fontSize: 'clamp(3rem, 4.2vw, 5rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.07,
              color: '#F7F4EF',
              textShadow: '0 2px 20px rgba(0,0,0,0.25)',
            }}
          >
            <em style={{ fontStyle: 'italic', color: '#E8C97A' }}>Candidates placed by</em>
            <br />
            <em style={{ fontStyle: 'italic', color: '#E8C97A' }}>recruiters</em> are hired
            <br />
            three times more often.
          </h1>
          <p
            className="text-base md:text-lg font-light leading-relaxed mb-10"
            style={{ color: 'rgba(247,244,239,0.80)', maxWidth: '32rem' }}
          >
            HeroScouter puts a specialist in your corner — someone who knows the
            hiring manager, understands the role, and gets your profile seen by the
            right people at the right time.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#submit"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                color: '#1a0e04',
              }}
            >
              Submit Your Profile
            </a>
            <a
              href="#roles"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: 'rgba(247,244,239,0.10)',
                border: '1px solid rgba(247,244,239,0.28)',
                color: '#F7F4EF',
              }}
            >
              View Open Roles
            </a>
          </div>
        </div>
      </section>

      {/* ── LOGO TICKER — bridges hero → Why it matters ── */}
      <LogoTrack
        bg="#F7F4EF"
        logoColor="rgba(34,38,43,0.28)"
        labelColor="rgba(34,38,43,0.34)"
        borderTop="1px solid rgba(34,38,43,0.07)"
        borderBottom="1px solid rgba(34,38,43,0.07)"
        label="Roles at teams including"
      />

      {/* ── WHY IT MATTERS ── */}
      <section className="py-24 md:py-32 px-8 md:px-16" style={{ background: '#F7F4EF' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#1E4D3A', letterSpacing: '0.2em' }}>
            Why it matters
          </p>
          <h2
            className="font-serif font-light mb-14"
            style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', letterSpacing: '-0.025em', lineHeight: 1.12, color: '#22262B', maxWidth: '52rem' }}
          >
            <em>A recruiter doesn't just send your CV.</em>
            <br />They advocate for you.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

            {/* Card 1 — Funded companies only (crossroads illustration) */}
            <div
              className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.09)', boxShadow: '0 4px 28px rgba(34,38,43,0.08)' }}
            >
              <div className="relative pt-8 pb-6 px-6" style={{ background: '#eef7f5' }}>
                <span
                  className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block"
                  style={{ background: 'rgba(30,77,58,0.10)', color: '#1E4D3A', letterSpacing: '0.12em' }}
                >
                  Verified roles
                </span>
                <p className="text-lg font-serif italic leading-snug" style={{ color: '#1E4D3A' }}>
                  "We only partner with highly-vetted, well-funded startups that are actively hiring."
                </p>
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold mb-2" style={{ fontSize: '1rem', color: '#22262B' }}>Funded companies only</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#4A5059' }}>
                  Every role is at a startup with verified capital behind it. We don't work with companies that can't pay or can't commit.
                </p>
                {/* Mock role rows */}
                {[
                  { company: 'Avoca', role: 'Forward Deployed Eng', salary: '$160–200K', badge: 'Series B', badgeColor: '#1E4D3A' },
                  { company: 'Ergo', role: 'Applied AI Engineer', salary: '$180–220K', badge: 'Series A', badgeColor: '#2A6B50' },
                ].map((r) => (
                  <div key={r.company} className="flex items-center justify-between py-2.5" style={{ borderTop: '1px solid rgba(34,38,43,0.07)' }}>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#22262B' }}>{r.company} · {r.role}</p>
                      <p className="text-xs" style={{ color: 'rgba(34,38,43,0.48)' }}>{r.salary}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(30,77,58,0.10)', color: r.badgeColor }}
                    >{r.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 — A real person in your corner (thumbs up illustration) */}
            <div
              className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.09)', boxShadow: '0 4px 28px rgba(34,38,43,0.08)' }}
            >
              <div className="relative pt-8 pb-6 px-6" style={{ background: '#fdf3ec' }}>
                <span
                  className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block"
                  style={{ background: 'rgba(201,130,50,0.12)', color: '#C07828', letterSpacing: '0.12em' }}
                >
                  Your advocate
                </span>
                <p className="text-lg font-serif italic leading-snug" style={{ color: '#C07828' }}>
                  "Your profile lands directly in the hiring manager's inbox, bypassing the crowded general queue."
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2" style={{ fontSize: '1rem', color: '#22262B' }}>A real person in your corner</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#4A5059' }}>
                  We speak to hiring managers directly. Your profile arrives with context, not as one of a hundred cold applications.
                </p>
                {[
                  { name: 'Priya Shah', detail: 'Sr Eng @ Notion', status: 'Pitched', color: '#C07828', bg: 'rgba(201,130,50,0.10)' },
                  { name: 'Daniel Okafor', detail: 'Staff @ Stripe', status: 'Replied', color: '#1E4D3A', bg: 'rgba(30,77,58,0.10)' },
                ].map((r) => (
                  <div key={r.name} className="flex items-center justify-between py-2.5" style={{ borderTop: '1px solid rgba(34,38,43,0.07)' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#e8e4de', color: '#22262B' }}>
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#22262B' }}>{r.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(34,38,43,0.48)' }}>{r.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: r.bg, color: r.color }}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 — Honest. No ghosting. (status/timeline style) */}
            <div
              className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#22262B', border: '1px solid rgba(247,244,239,0.08)', boxShadow: '0 4px 28px rgba(0,0,0,0.22)' }}
            >
              <div className="relative pt-8 pb-6 px-6" style={{ background: 'rgba(247,244,239,0.04)' }}>
                <span
                  className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block"
                  style={{ background: 'rgba(247,244,239,0.10)', color: 'rgba(247,244,239,0.65)', letterSpacing: '0.12em' }}
                >
                  Always clear
                </span>
                <p className="text-lg font-serif italic leading-snug" style={{ color: 'rgba(247,244,239,0.85)' }}>
                  "Clear communication within 48 hours. No ghosting, no endless waiting."
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2" style={{ fontSize: '1rem', color: '#F7F4EF' }}>Honest. No ghosting.</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(34,38,43,0.55)' }}>
                  If there is no fit, we tell you. If there is, we move quickly. Your time is respected at every stage of the process.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="pt-24 md:pt-32 pb-12 md:pb-16 px-8 md:px-16" style={{ background: '#0a101d' }}>
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: 'rgba(217,138,61,0.85)', letterSpacing: '0.2em' }}
          >
            How it works
          </p>
          <h2
            className="font-serif font-light mb-16"
            style={{
              fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
              color: '#EDE9E1',
              maxWidth: '36rem',
            }}
          >
            <em>Three steps to your next role.</em>
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-3 rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(247,244,239,0.12)' }}
          >
            {[
              {
                num: '01',
                title: 'Submit your profile',
                body: 'Share your background, what you are looking for, and your compensation expectations. Takes three minutes.',
              },
              {
                num: '02',
                title: 'We match and advocate',
                body: 'Our team reviews your profile against active openings and presents you directly to the hiring team — with full context.',
              },
              {
                num: '03',
                title: 'Interview and close',
                body: 'We prepare you for every stage, provide feedback in real time, and support through to your first day.',
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col p-10 md:p-12"
                style={{
                  background: 'rgba(247,244,239,0.05)',
                  borderRight: i < 2 ? '1px solid rgba(247,244,239,0.08)' : 'none',
                }}
              >
                <span
                  className="font-serif font-light mb-8 select-none"
                  style={{ fontSize: '3.5rem', color: 'rgba(247,244,239,0.14)', lineHeight: 1 }}
                >
                  {step.num}
                </span>
                <h3 className="font-serif font-light mb-3" style={{ fontSize: '1.25rem', color: '#EDE9E1' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(247,244,239,0.55)' }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <a
              href="#submit"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                color: '#1a0e04',
              }}
            >
              Submit Your Profile
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── CANDIDATE FORM ── */}
      <section id="submit" className="pt-12 md:pt-16 pb-24 md:pb-32 px-8 md:px-16" style={{ background: '#EDE9E1' }}>
        <div className="max-w-3xl mx-auto flex justify-center">
          <ApplicationForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
