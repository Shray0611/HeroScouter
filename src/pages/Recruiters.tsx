import recruitersBg from '../imports/RecruitersHome.optimized.jpg'
import LogoTrack from "../components/LogoTrack";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { useState } from "react";

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
  const [isSubmittingCandidate, setIsSubmittingCandidate] = useState(false)
  const [isSuccessCandidate, setIsSuccessCandidate] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0])
    }
  }

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = error => reject(error)
  })

  const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingApply(true)
    
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const payload: Record<string, any> = {}
      formData.forEach((value, key) => { payload[key] = value })
      
      const sheetUrl = import.meta.env.VITE_GOOGLE_SHEETS_RECRUITERS_URL
      if (sheetUrl) {
        await fetch(sheetUrl, { 
          method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        })
      }
      setIsSuccessApply(true)
      const calendlyUrl = import.meta.env.VITE_CALENDLY_URL
      if (calendlyUrl) setTimeout(() => { window.location.href = calendlyUrl }, 10000)
    } catch (error) {
      console.error(error)
      alert('An error occurred while submitting.')
    } finally {
      setIsSubmittingApply(false)
    }
  }

  const handleCandidateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingCandidate(true)
    
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const payload: Record<string, any> = {}
      formData.forEach((value, key) => { if (key !== 'resume') payload[key] = value })
      
      if (resumeFile) {
        payload.resumeName = resumeFile.name
        payload.resumeMimeType = resumeFile.type
        payload.resumeData = await toBase64(resumeFile)
      }
      
      const sheetUrl = import.meta.env.VITE_GOOGLE_SHEETS_SUBMISSIONS_URL
      if (sheetUrl) {
        await fetch(sheetUrl, { 
          method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        })
      }
      setIsSuccessCandidate(true)
      const calendlyUrl = import.meta.env.VITE_CALENDLY_URL
      if (calendlyUrl) setTimeout(() => { window.location.href = calendlyUrl }, 10000)
    } catch (error) {
      console.error(error)
      alert('An error occurred while submitting.')
    } finally {
      setIsSubmittingCandidate(false)
    }
  }

  return (
    <div style={{ background: "#F7F4EF", minHeight: "100vh" }}>
      <SiteNav
        cta={{ label: "Apply to Join", href: "#apply" }}
        activeLink="Recruiters"
        variant="fixed"
      />

      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
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
            className="absolute inset-0"
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

        <div
          className="relative z-10 px-8 md:px-10 pb-28 md:pb-40 max-w-4xl"
          style={{ marginLeft: "clamp(1rem, 6vw, 7rem)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#D4A052", letterSpacing: "0.22em" }}
          >
            Join the network - commission per placement
          </p>
          <h1
            className="font-serif font-light mb-6"
            style={{
              fontSize: "clamp(2.8rem, 5.1vw, 5.8rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.04,
              color: "#F7F4EF",
              textShadow: "0 2px 24px rgba(0,0,0,0.34)",
            }}
          >
            <em style={{ fontStyle: "italic", color: "#F7F4EF" }}>
              Just place great candidates.
            </em>
            <br />
            We handle everything else.
          </h1>
          <p
            className="text-base md:text-lg font-light leading-relaxed mb-10"
            style={{ color: "rgba(247,244,239,0.78)", maxWidth: "37rem" }}
          >
            No client hunting. No cold outreach to companies. No chasing
            mandates. HeroScouter allocates roles to you - your only job is to
            find the right person for them.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
              style={{
                background:
                  "linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)",
                color: "#1a0e04",
              }}
            >
              Apply to Join
            </a>
            <a
              href="#submit-candidate"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: "rgba(247,244,239,0.10)",
                border: "1px solid rgba(247,244,239,0.28)",
                color: "#F7F4EF",
              }}
            >
              Submit a Candidate
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
      <section id="apply" className="pt-12 md:pt-16 pb-24 md:pb-32 px-8 md:px-16" style={{ background: '#EDE9E1' }}>
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
            className="p-8 md:p-10"
            style={{
              background: '#F7F4EF',
              border: '1px solid rgba(34,38,43,0.10)',
              borderRadius: '20px',
              boxShadow: '0 12px 40px rgba(34,38,43,0.08)',
            }}
          >
            {isSuccessApply ? (
              <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(30,77,58,0.2)', border: '1px solid rgba(30,77,58,0.5)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecfa8" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif font-light mb-4" style={{ fontSize: '2rem', color: '#22262B' }}>
                  Application Submitted!
                </h3>
                <p className="text-sm leading-relaxed max-w-md mx-auto mb-8" style={{ color: 'rgba(34,38,43,0.55)' }}>
                  Thank you for applying. You will be redirected to our calendar to book an onboarding call in 10 seconds...
                </p>
                <div className="w-6 h-6 border-2 border-[rgba(34,38,43,0.2)] border-t-[#22262B] rounded-full animate-spin"></div>
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

                <div className="mt-12 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingApply}
                    className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
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

<section id="submit-candidate" className="pt-12 md:pt-16 pb-24 md:pb-32 px-8 md:px-16" style={{ background: '#EDE9E1' }}>
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
              Submit a Candidate
            </h2>
            <p className="text-sm" style={{ color: 'rgba(34,38,43,0.55)' }}>
              Submit a candidate to our network. You earn when they get placed.
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
            {isSuccessCandidate ? (
              <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(30,77,58,0.2)', border: '1px solid rgba(30,77,58,0.5)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7ecfa8" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif font-light mb-4" style={{ fontSize: '2rem', color: '#22262B' }}>
                  Form Submitted Successfully!
                </h3>
                <p className="text-sm leading-relaxed max-w-md mx-auto mb-8" style={{ color: 'rgba(34,38,43,0.55)' }}>
                  Thank you for submitting your profile. You will be redirected to our calendar to book a quick call in 10 seconds...
                </p>
                <div className="w-6 h-6 border-2 border-[rgba(34,38,43,0.2)] border-t-[#22262B] rounded-full animate-spin"></div>
              </div>
            ) : (
              <form onSubmit={handleCandidateSubmit}>
              {/* 1 YOUR IDENTITY */}
              <div className="mb-12">
                <div
                  className="flex items-center gap-3 mb-8 pb-4"
                  style={{ borderBottom: '1px solid rgba(34,38,43,0.10)' }}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: 'rgba(34,38,43,0.07)',
                      border: '1px solid rgba(34,38,43,0.12)',
                      color: 'rgba(34,38,43,0.6)',
                    }}
                  >
                    1
                  </div>
                  <h3
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: 'rgba(34,38,43,0.6)', letterSpacing: '0.1em' }}
                  >
                    Your Identity
                  </h3>
                </div>

                <div className="space-y-6">

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Recruiter ID <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="recruiterId"
                      placeholder="e.g. REC-1234"
                      required
                      className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                      style={{ background: '#F7F4EF' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Full Name <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="First Last"
                      className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                      style={{ background: '#F7F4EF' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Email Address <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@email.com"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        LinkedIn Profile <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="linkedin"
                        placeholder="linkedin.com/in/yourname"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Phone Number <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <div className="flex gap-4">
                      <select
                        name="phoneCode"
                        className="w-1/3 border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors"
                        style={{ background: '#F7F4EF', appearance: 'none' }}
                      >
                        <option>IN +91 India</option>
                        <option>US +1 United States</option>
                        <option>UK +44 United Kingdom</option>
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="98765 43210"
                        className="w-2/3 border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 WHAT YOU ARE LOOKING FOR */}
              <div className="mb-12">
                <div
                  className="flex items-center gap-3 mb-8 pb-4"
                  style={{ borderBottom: '1px solid rgba(34,38,43,0.10)' }}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: 'rgba(34,38,43,0.07)',
                      border: '1px solid rgba(34,38,43,0.12)',
                      color: 'rgba(34,38,43,0.6)',
                    }}
                  >
                    2
                  </div>
                  <h3
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: 'rgba(34,38,43,0.6)', letterSpacing: '0.1em' }}
                  >
                    What you are looking for
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Role interest <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <p className="text-xs mb-3" style={{ color: 'rgba(34,38,43,0.45)' }}>
                      Be specific — title, stage, industry. Example: Senior Backend Engineer at a Series
                      A SaaS company, or GTM Lead at an early-stage AI startup in the US.
                    </p>
                    <textarea
                      name="roleInterest"
                      rows={4}
                      placeholder="Describe the kinds of roles and companies you are open to..."
                      className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF] resize-none"
                      style={{ background: '#F7F4EF' }}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Resume <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <p className="text-xs mb-3" style={{ color: 'rgba(34,38,43,0.45)' }}>
                      PDF or Word · Max 10MB
                    </p>
                    <label
                      className="w-full border-2 border-dotted border-[rgba(34,38,43,0.2)] rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors group hover:bg-[rgba(34,38,43,0.02)]"
                      style={{ background: '#F7F4EF' }}
                    >
                      <input type="file" name="resume" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                      {resumeFile ? (
                        <>
                          <div
                            className="w-10 h-10 rounded-lg border border-[rgba(34,38,43,0.1)] flex items-center justify-center mb-4 transition-colors"
                            style={{ background: 'rgba(30,77,58,0.2)' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7ecfa8" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm text-[#22262B] mb-1 font-medium">
                            Uploaded: <span style={{ color: '#7ecfa8' }}>{resumeFile.name}</span>
                          </p>
                          <p className="text-xs" style={{ color: 'rgba(34,38,43,0.45)' }}>
                            Click to replace file
                          </p>
                        </>
                      ) : (
                        <>
                          <div
                            className="w-10 h-10 rounded-lg border border-[rgba(34,38,43,0.1)] flex items-center justify-center mb-4 transition-colors group-hover:bg-[rgba(34,38,43,0.05)]"
                            style={{ background: '#fff' }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22262B" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0-12l-4 4m4-4l4 4M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium mb-1" style={{ color: '#22262B' }}>
                            Upload Resume
                          </p>
                          <p className="text-xs" style={{ color: 'rgba(34,38,43,0.45)' }}>
                            Browse files
                          </p>
                        </>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Portfolio or GitHub <span style={{ color: 'rgba(34,38,43,0.45)', fontWeight: 'normal' }}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="portfolio"
                      placeholder="https://github.com/username"
                      className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                      style={{ background: '#F7F4EF' }}
                    />
                  </div>
                </div>
              </div>

              {/* 3 YOUR BACKGROUND */}
              <div className="mb-12">
                <div
                  className="flex items-center gap-3 mb-8 pb-4"
                  style={{ borderBottom: '1px solid rgba(34,38,43,0.10)' }}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: 'rgba(34,38,43,0.07)',
                      border: '1px solid rgba(34,38,43,0.12)',
                      color: 'rgba(34,38,43,0.6)',
                    }}
                  >
                    3
                  </div>
                  <h3
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: 'rgba(34,38,43,0.6)', letterSpacing: '0.1em' }}
                  >
                    Your Background
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        City <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Mumbai"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Country <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <select
                        name="country"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors"
                        style={{ background: '#F7F4EF', appearance: 'none' }}
                      >
                        <option>— Select —</option>
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Total Experience <span style={{ color: '#e85c5c' }}>*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="number"
                          name="expYears"
                          placeholder="3"
                          className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                          style={{ background: '#F7F4EF' }}
                        />
                        <span className="text-sm" style={{ color: 'rgba(34,38,43,0.45)' }}>years</span>
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="number"
                          name="expMonths"
                          placeholder="6"
                          className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                          style={{ background: '#F7F4EF' }}
                        />
                        <span className="text-sm" style={{ color: 'rgba(34,38,43,0.45)' }}>months</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Current Company <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Company name"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Current Title <span style={{ color: '#e85c5c' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Senior Engineer"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 COMPENSATION */}
              <div className="mb-10">
                <div
                  className="flex items-center gap-3 mb-8 pb-4"
                  style={{ borderBottom: '1px solid rgba(34,38,43,0.10)' }}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: 'rgba(34,38,43,0.07)',
                      border: '1px solid rgba(34,38,43,0.12)',
                      color: 'rgba(34,38,43,0.6)',
                    }}
                  >
                    4
                  </div>
                  <h3
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: 'rgba(34,38,43,0.6)', letterSpacing: '0.1em' }}
                  >
                    Compensation
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Current CTC <span style={{ color: 'rgba(34,38,43,0.45)', fontWeight: 'normal' }}>(optional)</span>
                      </label>
                      <select
                        name="currentCtcCurrency"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors"
                        style={{ background: '#F7F4EF', appearance: 'none' }}
                      >
                        <option>USD — United States Dollar</option>
                        <option>INR — Indian Rupee</option>
                        <option>GBP — British Pound</option>
                      </select>
                    </div>
                    <div className="md:w-2/3">
                      <label className="block text-sm font-medium mb-2 text-transparent select-none hidden md:block">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="currentCtcAmount"
                        placeholder="90000"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                        Expected CTC <span style={{ color: 'rgba(34,38,43,0.45)', fontWeight: 'normal' }}>(optional)</span>
                      </label>
                      <select
                        name="expectedCtcCurrency"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors"
                        style={{ background: '#F7F4EF', appearance: 'none' }}
                      >
                        <option>USD — United States Dollar</option>
                        <option>INR — Indian Rupee</option>
                        <option>GBP — British Pound</option>
                      </select>
                    </div>
                    <div className="md:w-2/3">
                      <label className="block text-sm font-medium mb-2 text-transparent select-none hidden md:block">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="expectedCtcAmount"
                        placeholder="110000"
                        className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors placeholder:text-[#9CA3AF]"
                        style={{ background: '#F7F4EF' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#4A5059' }}>
                      Notice Period <span style={{ color: 'rgba(34,38,43,0.45)', fontWeight: 'normal' }}>(optional)</span>
                    </label>
                    <select
                      name="noticePeriod"
                      className="w-full border border-[rgba(34,38,43,0.15)] rounded-xl px-4 py-3 text-[#22262B] focus:outline-none focus:border-[rgba(34,38,43,0.4)] transition-colors"
                      style={{ background: '#F7F4EF', appearance: 'none' }}
                    >
                      <option>— Select —</option>
                      <option>Immediate</option>
                      <option>15 Days</option>
                      <option>1 Month</option>
                      <option>2 Months</option>
                      <option>3 Months</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-12 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingCandidate}
                  className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                    color: '#1a0e04',
                  }}
                >
                  {isSubmittingCandidate ? 'Submitting...' : 'Submit Candidate'}
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
