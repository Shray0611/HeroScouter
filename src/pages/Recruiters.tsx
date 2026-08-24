import recruitersBg from '../imports/RecruitersHome.optimized.jpg'
import LogoTrack from "../components/LogoTrack";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { useState } from "react";
import { calendlyUrl, openCalendly } from "../data/calendly";
import { submitLead } from "../data/api";

const benefits = [
  {
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.7}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 7.75h10.5M6.75 12h6.5m-9-8.25h15.5a1.5 1.5 0 011.5 1.5v12.5a1.5 1.5 0 01-1.5 1.5H4.25a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5z"
        />
      </svg>
    ),
    title: "Roles allocated to you",
    body: "We maintain the client relationships and bring in the mandates. You receive roles matched to your expertise - no cold outreach required.",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.7}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.75 15.25l4.25-4.5 3.25 3.25 7-7.25"
        />
      </svg>
    ),
    title: "Commission per placement",
    body: "Earn a meaningful percentage of every hire that completes 90 days. Your income is tied directly to your output, with no ceiling.",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.7}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.75v3m0 8.5v3m7.25-7.25h-3m-8.5 0h-3M15.25 12A3.25 3.25 0 1112 8.75 3.25 3.25 0 0115.25 12z"
        />
      </svg>
    ),
    title: "Focus only on sourcing",
    body: "No account management. No client calls. No business development. HeroScouter takes care of all of that. You source and submit.",
  },
];

const steps = [
  {
    num: "01",
    title: "Apply and get onboarded",
    body: "Submit your application. We onboard in cohorts. You receive your recruiter ID, portal access, and your first role allocations within days.",
  },
  {
    num: "02",
    title: "Receive and work roles",
    body: "Roles are pushed to you based on your skills and bandwidth. Use LinkedIn, your network, or any sourcing tool you prefer to find candidates.",
  },
  {
    num: "03",
    title: "Submit, track, earn",
    body: "Submit candidates through our portal. Track their progress in real time. Earn your commission when they join and complete 90 days.",
  },
];

export default function Recruiters() {
  const [isSubmittingApply, setIsSubmittingApply] = useState(false)
  const [isSuccessApply, setIsSuccessApply] = useState(false)

  const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingApply(true)
    
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const payload: Record<string, any> = {}
      formData.forEach((value, key) => { payload[key] = value })
      
      await submitLead('recruiters', payload)
      setIsSuccessApply(true)
      setTimeout(openCalendly, 500)
    } catch (error) {
      console.error(error)
      alert('An error occurred while submitting.')
    } finally {
      setIsSubmittingApply(false)
    }
  }

  return (
    <div style={{ background: "#F7F4EF", minHeight: "100vh" }}>
      <SiteNav
        cta={{ label: "Work With Us!", href: "#apply" }}
        activeLink="Recruiters"
        variant="fixed"
      />

      <section className="hero-section relative min-h-screen flex flex-col justify-center md:justify-end overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#071327" }}>
          <img
            src={recruitersBg}
            alt="Open green field under a bright blue painted sky"
            className="w-full h-full object-cover"
            style={{ objectPosition: "52% 46%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(7,13,27,0.76) 0%, rgba(7,13,27,0.30) 24%, transparent 44%)",
            }}
          />
          <div
            className="absolute inset-0 recruiters-hero-vignette"
            style={{
              background:
                "linear-gradient(to right, rgba(7,13,27,0.96) 0%, rgba(7,13,27,0.88) 16%, rgba(7,13,27,0.68) 34%, rgba(7,13,27,0.36) 54%, rgba(7,13,27,0.10) 72%, transparent 88%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 58% 46% at 62% 42%, rgba(212,120,90,0.20) 0%, transparent 66%)",
            }}
          />
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{
              height: "52%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(247,244,239,0.05) 38%, rgba(247,244,239,0.24) 58%, rgba(247,244,239,0.58) 74%, rgba(247,244,239,0.88) 90%, #F7F4EF 100%)",
            }}
          />
        </div>

        {/* Hero content — centered on mobile, left-aligned on md+ */}
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-10 pt-20 pb-10 md:pt-0 md:pb-40 text-center md:text-left md:max-w-4xl md:ml-[clamp(1rem,6vw,7rem)]">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: '#D4A052', letterSpacing: '0.22em' }}
          >
            Join the network - commission per placement
          </p>
          <h1
            className="font-serif font-light mb-6"
            style={{
              fontSize: 'clamp(1.85rem, 4.2vw, 5rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.08,
              color: '#F7F4EF',
              textShadow: '0 2px 24px rgba(0,0,0,0.34)',
            }}
          >
            <em style={{ fontStyle: 'italic', color: '#F7F4EF' }}>
              Just place great candidates.
            </em>
            <br />
            We handle everything else.
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8 mx-auto md:mx-0"
            style={{ color: 'rgba(247,244,239,0.78)', maxWidth: '37rem' }}
          >
            No client hunting. No cold outreach to companies. No chasing
            mandates. HeroScouter allocates roles to you - your only job is to
            find the right person for them.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center md:items-start justify-center md:justify-start">
            <a
              href="#apply"
              className="flex items-center justify-center w-full sm:w-auto gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                color: '#1a0e04',
              }}
            >
              Work with Us!
            </a>
          </div>
        </div>
      </section>

      <LogoTrack
        bg="#F7F4EF"
        logoColor="rgba(34,38,43,0.28)"
        labelColor="rgba(34,38,43,0.34)"
        borderTop="1px solid rgba(34,38,43,0.07)"
        borderBottom="1px solid rgba(34,38,43,0.07)"
        label="Roles allocated across teams including"
      />

      <section
        className="py-24 md:py-32 px-8 md:px-16"
        style={{ background: "#F7F4EF" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#C0603F", letterSpacing: "0.2em" }}
            >
              What you get
            </p>
            <h2
              className="font-serif font-light"
              style={{
                fontSize: "clamp(1.9rem, 3.8vw, 3.4rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.12,
                color: "#22262B",
              }}
            >
              <em>Roles come to you. Earnings follow results.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((card) => (
              <div
                key={card.title}
                className="flex flex-col p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(34,38,43,0.09)",
                  boxShadow: "0 4px 24px rgba(34,38,43,0.07)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: "#22262B", color: "#F7F4EF" }}
                >
                  {card.icon}
                </div>
                <h3
                  className="font-serif font-light mb-4"
                  style={{
                    fontSize: "1.35rem",
                    color: "#22262B",
                    lineHeight: 1.25,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#6D746F" }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="pt-24 md:pt-32 pb-12 md:pb-16 px-8 md:px-16"
        style={{ background: "#0d1017" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#D4A052", letterSpacing: "0.2em" }}
            >
              How it works
            </p>
            <h2
              className="font-serif font-light"
              style={{
                fontSize: "clamp(1.9rem, 3.8vw, 3.4rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.12,
                color: "#D4A052",
              }}
            >
              <em>Source. Submit. Earn.</em>
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(247,244,239,0.10)" }}
          >
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="flex flex-col p-10 md:p-12"
                style={{
                  background: "rgba(247,244,239,0.06)",
                  borderRight:
                    i < 2 ? "1px solid rgba(247,244,239,0.08)" : "none",
                }}
              >
                <span
                  className="font-serif font-light mb-8 select-none"
                  style={{
                    fontSize: "3.5rem",
                    color: "rgba(247,244,239,0.12)",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
                <h3
                  className="font-serif font-light mb-3"
                  style={{ fontSize: "1.25rem", color: "#F7F4EF" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(247,244,239,0.58)" }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* ── APPLY TO JOIN FORM ── */}
      <section id="apply" className="pt-12 md:pt-16 pb-24 md:pb-32 px-4 sm:px-8 md:px-16" style={{ background: '#EDE9E1' }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h2
              className="font-serif font-light mb-4"
              style={{
                fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)',
                color: "#D4A052",
                letterSpacing: '-0.02em',
              }}
            >
              Apply to Join
            </h2>
            <p className="text-sm" style={{ color: 'rgba(34,38,43,0.55)' }}>
              Join the network and start earning commissions for placing great candidates.
            </p>
          </div>

          <div
            className="p-5 sm:p-8 md:p-10"
            style={{
              background: '#F7F4EF',
              border: '1px solid rgba(34,38,43,0.10)',
              borderRadius: '20px',
              boxShadow: '0 12px 40px rgba(34,38,43,0.08)',
            }}
          >
            {isSuccessApply ? (
              <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(30,77,58,0.2)', border: '1px solid rgba(30,77,58,0.5)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecfa8" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif font-light mb-3" style={{ fontSize: '2rem', color: '#22262B' }}>
                  Application Submitted!
                </h3>
                <p className="text-sm leading-relaxed max-w-md mx-auto mb-6" style={{ color: 'rgba(34,38,43,0.65)' }}>
                  Thank you for applying. We are opening our calendar in a new tab so you can choose an onboarding slot.
                </p>
                <a
                  href={calendlyUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110"
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
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
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
                      Email Address <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="jane@example.com"
                      required
                      className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                      style={{ background: '#F7F4EF' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Phone Number <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        name="phoneCode"
                        className="w-full sm:w-[120px] border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors"
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
                        required
                        className="flex-1 border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      LinkedIn Profile <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      placeholder="linkedin.com/in/janesmith"
                      required
                      className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                      style={{ background: '#F7F4EF' }}
                    />
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    disabled={isSubmittingApply}
                    className="w-full px-8 py-3.5 rounded-full text-sm font-semibold text-center transition-all duration-200 hover:brightness-110 hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                      color: '#1a0e04',
                    }}
                  >
                    {isSubmittingApply ? 'Submitting...' : 'Apply Now'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
