import heroImage from '@/imports/HeroHome.optimized.jpg'
import SiteNav from './SiteNav'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: '#4a7fa5' }}>
        <img
          src={heroImage}
          alt="Sunny landscape with clouds and green meadows"
          className="w-full h-full object-cover hero-image"
          style={{ objectPosition: '50% 40%' }}
        />
        {/* Top shadow */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,25,50,0.55) 0%, rgba(10,25,50,0.15) 20%, transparent 36%)' }}
        />
        {/* Left vignette — softened on mobile so image reads clearly */}
        <div
          className="absolute inset-0 hero-vignette"
          style={{
            background:
              'linear-gradient(105deg, rgba(10,25,50,0.82) 0%, rgba(10,25,50,0.60) 20%, rgba(10,25,50,0.28) 40%, rgba(10,25,50,0.06) 56%, transparent 70%)',
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 62%, rgba(247,244,239,0.10) 76%, rgba(247,244,239,0.42) 89%, #F7F4EF 100%)',
          }}
        />
      </div>

      <SiteNav
        cta={{ label: 'Get started', href: '/' }}
        activeLink="Home"
        variant="fixed"
      />

      {/* Content — centered on mobile, left-aligned on md+ */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-10 pb-32 sm:pb-36 md:pb-32 text-center md:text-left md:max-w-3xl md:ml-[clamp(1rem,6vw,7rem)]">
        <h1
          className="font-serif font-light mb-5"
          style={{
            fontSize: 'clamp(1.85rem, 4.2vw, 5rem)',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: '#F7F4EF',
            textShadow: '0 2px 20px rgba(0,0,0,0.35)',
          }}
        >
          The difference between
          <br />
          <em style={{ fontStyle: 'italic', color: '#E8C97A' }}>a good year</em>{' '}
          and a lost one
          <br />
          is often a single hire.
        </h1>

        <p
          className="text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8 mx-auto md:mx-0"
          style={{ color: 'rgba(247,244,239,0.80)', maxWidth: '32rem' }}
        >
          We help companies hire the few people who matter most, and
          help those people find work that fits.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center md:items-start justify-center md:justify-start">
          <a
            href="#companies"
            className="flex items-center justify-center w-full sm:w-auto gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)',
              color: '#1a0e04',
            }}
          >
            Start hiring
          </a>
          <a
            href="#roles"
            className="flex items-center justify-center w-full sm:w-auto gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: 'rgba(247,244,239,0.10)',
              border: '1px solid rgba(247,244,239,0.28)',
              color: '#F7F4EF',
            }}
          >
            Browse roles
          </a>
        </div>
      </div>
    </section>
  )
}
