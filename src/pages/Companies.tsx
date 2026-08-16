import companiesBg from '../imports/optmizedcompanies.jpg'
import SiteNav from '../components/SiteNav'
import LogoTrack from '../components/LogoTrack'
import SiteFooter from '../components/SiteFooter'
import { useState } from 'react'

export default function Companies() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      
      const payload: Record<string, any> = {}
      formData.forEach((value, key) => {
        payload[key] = value
      })
      
      const sheetUrl = import.meta.env.VITE_GOOGLE_SHEETS_COMPANIES_URL || import.meta.env.VITE_GOOGLE_SHEETS_URL
      if (sheetUrl) {
        try {
          await fetch(sheetUrl, { 
            method: 'POST', 
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            mode: 'no-cors',
          })
        } catch (fetchErr) {
          console.warn('Companies submission notice:', fetchErr)
        }
      }
      
      setIsSuccess(true)
      
      const calendlyUrl = import.meta.env.VITE_CALENDLY_URL
      if (calendlyUrl) {
        setTimeout(() => {
          window.open(calendlyUrl, '_blank')
        }, 1500)
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred while submitting.')
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ background: '#F7F4EF', minHeight: '100vh' }}>
      <SiteNav
        cta={{ label: 'Work With Us', href: '#work' }}
        activeLink="Companies"
        variant="fixed"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0" style={{ background: '#2a1e0e' }}>
          <img
            src={companiesBg}
            alt="Golden landscape at sunset"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 40%' }}
          />
          {/* Top shadow */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(20,14,6,0.72) 0%, rgba(20,14,6,0.28) 22%, transparent 42%)' }}
          />
          {/* Left vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(20,14,6,0.96) 0%, rgba(20,14,6,0.88) 14%, rgba(20,14,6,0.68) 30%, rgba(20,14,6,0.36) 50%, rgba(20,14,6,0.10) 66%, transparent 80%)',
            }}
          />
          {/* Warm amber glow matching painting's golden light */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 18% 55%, rgba(190,120,30,0.22) 0%, transparent 65%)' }}
          />
          {/* Bottom fade */}
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{
              height: '52%',
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(247,244,239,0.03) 45%, rgba(247,244,239,0.14) 62%, rgba(247,244,239,0.42) 76%, rgba(247,244,239,0.78) 88%, #F7F4EF 100%)',
            }}
          />
        </div>

        {/* Hero content */}
        <div
          className="relative z-10 px-8 md:px-10 pb-20 md:pb-28 max-w-3xl"
          style={{ marginLeft: 'clamp(1rem, 6vw, 7rem)' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: 'rgba(217,160,61,0.9)', letterSpacing: '0.22em' }}
          >
            Contingency Recruitment · Zero Upfront Cost
          </p>
          <h1
            className="font-serif font-light mb-6"
            style={{
              fontSize: 'clamp(2.8rem, 4.2vw, 5rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.07,
              color: '#F7F4EF',
              textShadow: '0 2px 24px rgba(0,0,0,0.35)',
            }}
          >
            <em style={{ fontStyle: 'italic', color: '#E8C97A' }}>One point of contact.</em>
            <br />
            An entire recruiter
            <br />
            network working for you.
          </h1>
          <p
            className="text-base md:text-lg font-light leading-relaxed mb-10"
            style={{ color: 'rgba(247,244,239,0.80)', maxWidth: '34rem' }}
          >
            You don't manage recruiters. You don't run a sourcing operation.
            You tell us what you need, and we deploy our network to find the
            candidates who actually fit.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                color: '#1a0e04',
              }}
            >
              Work With Us
            </a>
            <a
              href="mailto:basecamp@heroscouter.com"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: 'rgba(247,244,239,0.10)',
                border: '1px solid rgba(247,244,239,0.28)',
                color: '#F7F4EF',
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* ── LOGO TICKER ── */}
      <LogoTrack
        bg="#F7F4EF"
        logoColor="rgba(34,38,43,0.28)"
        labelColor="rgba(34,38,43,0.34)"
        borderTop="1px solid rgba(34,38,43,0.07)"
        borderBottom="1px solid rgba(34,38,43,0.07)"
        label="Placed at companies including"
      />

      {/* ── HOW WE WORK ── */}
      <section id="how-we-work" className="py-24 md:py-32 px-8 md:px-16" style={{ background: '#F7F4EF' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#1E4D3A', letterSpacing: '0.2em' }}>
            How we work
          </p>
          <h2
            className="font-serif font-light mb-16"
            style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', letterSpacing: '-0.025em', lineHeight: 1.12, color: '#22262B', maxWidth: '54rem' }}
          >
            <em>We don't send candidates. We send the right ones.</em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                ),
                title: 'A recruiter network, not a single recruiter',
                body: 'Behind HeroScouter is a distributed network of specialist sourcers. You get the output of a full team without the overhead of managing one.',
              },
              {
                icon: (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                ),
                title: 'Quality over volume, always',
                body: 'We do not flood your inbox. Every candidate we send has been assessed, spoken to, and confirmed genuinely interested in your specific role.',
              },
              {
                icon: (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7a18.991 18.991 0 01-9.993-6.15m0 0L3 17.25M9.563 9.563L3 12m6.563-2.438L3 6.75" />
                  </svg>
                ),
                title: 'Contingency only. Pay on hire.',
                body: 'No retainer. No upfront commitment. You pay a placement fee only when a candidate joins your team and completes their first 90 days.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex flex-col p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.09)', boxShadow: '0 4px 24px rgba(34,38,43,0.07)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: '#22262B', color: '#F7F4EF' }}
                >
                  {card.icon}
                </div>
                <h3 className="font-medium mb-3" style={{ fontSize: '1.05rem', color: '#22262B', lineHeight: 1.35 }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4A5059' }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROCESS ── */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-8 md:px-16" style={{ background: '#0a101d' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'rgba(217,138,61,0.85)', letterSpacing: '0.2em' }}>
            The process
          </p>
          <h2
            className="font-serif font-light mb-16"
            style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', letterSpacing: '-0.025em', lineHeight: 1.12, color: '#EDE9E1', maxWidth: '38rem' }}
          >
            <em>Brief us once. We handle the rest.</em>
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-3 rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(247,244,239,0.12)' }}
          >
            {[
              {
                num: '01',
                title: 'Share your brief',
                body: 'Tell us the role, the team culture, the compensation, and what a great hire looks like to you. The more specific, the faster we move.',
              },
              {
                num: '02',
                title: 'We source and screen',
                body: 'Our recruiter network activates immediately. You receive a shortlist of pre-vetted, interested candidates — not a pile of CVs.',
              },
              {
                num: '03',
                title: 'You hire, we invoice',
                body: 'Interview at your pace, select your hire, and pay only on successful placement. No risk, no waste.',
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
                <h3 className="font-serif font-light mb-3" style={{ fontSize: '1.25rem', color: '#EDE9E1' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(247,244,239,0.55)' }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANIES FORM ── */}
      <section id="work" className="pt-12 md:pt-16 pb-24 md:pb-32 px-8 md:px-16" style={{ background: '#EDE9E1' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h2
              className="font-serif font-light mb-4"
              style={{
                fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)',
                color: '#22262B',
                letterSpacing: '-0.02em',
              }}
            >
              Work With Us
            </h2>
            <p className="text-sm" style={{ color: 'rgba(34,38,43,0.55)' }}>
              Tell us what you need. We find who you are looking for.
            </p>
          </div>

          {/* Form Container */}
          <div
            className="p-8 md:p-10"
            style={{
              background: '#F7F4EF',
              border: '1px solid rgba(34,38,43,0.10)',
              borderRadius: '20px',
              boxShadow: '0 12px 40px rgba(34,38,43,0.08)',
            }}
          >
            {isSuccess ? (
              <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(30,77,58,0.2)', border: '1px solid rgba(30,77,58,0.5)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecfa8" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif font-light mb-3" style={{ fontSize: '2rem', color: '#22262B' }}>
                  Form Submitted Successfully!
                </h3>
                <p className="text-sm leading-relaxed max-w-md mx-auto mb-6" style={{ color: 'rgba(34,38,43,0.65)' }}>
                  Thank you for reaching out. We are opening our calendar in a new tab so you can book an intro call with our team.
                </p>
                {import.meta.env.VITE_CALENDLY_URL && (
                  <a
                    href={import.meta.env.VITE_CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110"
                    style={{
                      background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                      color: '#1a0e04',
                    }}
                  >
                    Open Calendar Booking
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* 1 YOUR DETAILS */}
                <div className="mb-12">
                  <div
                    className="flex items-center gap-3 mb-8 pb-4"
                    style={{ borderBottom: '1px solid rgba(34,38,43,0.10)' }}
                  >
                    <h3
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: 'rgba(34,38,43,0.6)', letterSpacing: '0.1em' }}
                    >
                      Your Details
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Full Name <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Jane Smith"
                        required
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Work Email <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <p className="text-xs mb-3" style={{ color: 'rgba(34,38,43,0.45)' }}>
                        Use your company email address.
                      </p>
                      <input
                        type="email"
                        name="workEmail"
                        placeholder="jane@company.com"
                        required
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Phone Number <span style={{ color: 'rgba(34,38,43,0.45)', fontWeight: 'normal' }}>(optional)</span>
                      </label>
                      <div className="flex gap-4">
                        <select
                          name="phoneCode"
                          className="w-[120px] border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors"
                          style={{ background: '#F7F4EF', appearance: 'none' }}
                        >
                          <option>IN +91</option>
                          <option>US +1</option>
                          <option>UK +44</option>
                        </select>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="98765 43210"
                          className="flex-1 border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                          style={{ background: '#F7F4EF' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Company Name <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Acme Inc."
                        required
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2 HIRING NEEDS */}
                <div className="mb-10">
                  <div
                    className="flex items-center gap-3 mb-8 pb-4"
                    style={{ borderBottom: '1px solid rgba(34,38,43,0.10)' }}
                  >
                    <h3
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: 'rgba(34,38,43,0.6)', letterSpacing: '0.1em' }}
                    >
                      Hiring Needs
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        What roles are you looking to hire? <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <p className="text-xs mb-3" style={{ color: 'rgba(34,38,43,0.45)' }}>
                        Be as specific as you'd like — include quantities if you know them.
                      </p>
                      <textarea
                        name="roles"
                        rows={5}
                        required
                        placeholder="e.g. 2 Product Managers, 1 Full Stack Engineer, 1 Head of Sales"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF] resize-none"
                        style={{ background: '#F7F4EF' }}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 rounded-xl text-sm font-bold transition-all duration-200 hover:brightness-110 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#1E4D3A', color: '#F7F4EF' }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
