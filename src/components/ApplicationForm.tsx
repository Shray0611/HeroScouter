import { useState } from 'react'

export interface ApplicationFormProps {
  jobId?: string;
  roleTitle?: string;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export default function ApplicationForm({ jobId, roleTitle, onSuccess, title = "Submit Your Profile", subtitle = "Join our network to be matched with top opportunities." }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      
      const payload: Record<string, any> = {}
      formData.forEach((value, key) => {
        if (key !== 'resume') {
          payload[key] = value
        }
      })
      
      if (jobId) payload.jobId = jobId
      if (roleTitle) payload.roleTitle = roleTitle

      if (resumeFile) {
        payload.resumeName = resumeFile.name
        payload.resumeMimeType = resumeFile.type
        payload.resumeData = await toBase64(resumeFile)
      }
      // If this is an application for a specific job, use the JD sheets URL (if provided)
      const sheetUrl = jobId 
        ? (import.meta.env.VITE_GOOGLE_SHEETS_JD_URL || import.meta.env.VITE_GOOGLE_SHEETS_URL)
        : import.meta.env.VITE_GOOGLE_SHEETS_URL

      if (sheetUrl) {
        try {
          await fetch(sheetUrl, { 
            method: 'POST', 
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            mode: 'no-cors',
          })
        } catch (fetchErr) {
          console.warn('Submission notice:', fetchErr)
        }
      }
      
      setIsSuccess(true)
      if (onSuccess) {
        onSuccess()
      }
      
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
    <div className="w-full">
      <div className="mb-12 text-center">
        <h2
          className="font-serif font-light mb-4"
          style={{
            fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)',
            color: '#22262B',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>
        <p className="text-sm" style={{ color: 'rgba(34,38,43,0.55)' }}>
          {subtitle}
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
              Thank you for submitting your profile. We are opening our calendar in a new tab so you can choose a suitable discussion slot.
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
            {jobId && roleTitle && (
              <div className="mb-8 p-4 rounded-xl flex items-center gap-4" style={{ background: 'rgba(217,111,24,0.1)', border: '1px solid rgba(217,111,24,0.2)' }}>
                 <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#D96F18', color: '#fff' }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                 </div>
                 <div>
                   <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#D96F18' }}>Applying for</p>
                   <p className="text-base font-semibold" style={{ color: '#07152A' }}>{roleTitle} <span className="text-sm font-normal" style={{ color: '#4A5059' }}>({jobId})</span></p>
                 </div>
              </div>
            )}

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
                    defaultValue={roleTitle ? `Interested in the ${roleTitle} role (${jobId})` : ""}
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
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
                  color: '#1a0e04',
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
