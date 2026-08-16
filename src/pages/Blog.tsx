import blogBg from '../imports/blog-final.jpg'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { blogPosts } from '../data/blog'
import { Link } from 'react-router'

const featured = blogPosts.find((p) => p.featured)!
const rest = blogPosts.filter((p) => !p.featured)

export default function Blog() {
  return (
    <div style={{ background: '#F7F4EF', minHeight: '100vh' }}>
      <SiteNav
        cta={{ label: 'Get started', href: '/' }}
        activeLink="Blog"
        variant="fixed"
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '52vh' }}>
        <div className="absolute inset-0">
          <img
            src={blogBg}
            alt="Abstract blue watercolour background"
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 30%' }}
          />
          {/* Dark top overlay for nav readability */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(8,16,40,0.72) 0%, rgba(8,16,40,0.30) 30%, transparent 55%)' }}
          />
          {/* Bottom fade to #F7F4EF */}
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{
              height: '55%',
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(247,244,239,0.10) 38%, rgba(247,244,239,0.50) 60%, rgba(247,244,239,0.86) 80%, #F7F4EF 100%)',
            }}
          />
        </div>
        <div
          className="relative z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ paddingTop: '10rem', paddingBottom: '5rem' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#1E4D3A' }}
          >
            Insights · Hiring · Recruitment
          </p>
          <h1
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.8rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.08,
              color: '#07152A',
              textShadow: 'none',
            }}
          >
            The HeroScouter <em style={{ color: '#1E4D3A' }}>Journal</em>
          </h1>
          <p
            className="mt-5 text-base font-light"
            style={{ color: '#1E4D3A', maxWidth: '28rem' }}
          >
            Practical thinking on hiring, recruiting, and building teams that last.
          </p>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      <section className="px-8 md:px-16 pb-6" style={{ background: '#F7F4EF' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'rgba(34,38,43,0.38)', letterSpacing: '0.18em' }}>
            Featured
          </p>
          <Link
            to={`/blog/${featured.slug}`}
            className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.09)', boxShadow: '0 4px 32px rgba(34,38,43,0.08)' }}
          >
            {/* Cover image */}
            <div
              className="relative flex items-center justify-center min-h-64"
              style={{ background: featured.coverBg }}
            >
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-full object-cover"
                style={{ minHeight: '280px', maxHeight: '340px' }}
              />
            </div>
            {/* Content */}
            <div className="flex flex-col justify-center p-10 md:p-12">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(34,38,43,0.08)', color: 'rgba(34,38,43,0.50)', letterSpacing: '0.14em' }}
                >
                  Featured
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: featured.accentBg, color: featured.accentColor, letterSpacing: '0.14em' }}
                >
                  {featured.category}
                </span>
              </div>
              <h2
                className="font-serif font-light mb-4"
                style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.18, color: '#22262B' }}
              >
                {featured.title}
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#4A5059' }}>
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: '#22262B', color: '#07152A' }}
                >
                  {featured.author[0]}
                </div>
                <span className="text-xs font-medium" style={{ color: '#22262B' }}>{featured.author}</span>
                <span style={{ color: 'rgba(34,38,43,0.30)' }}>·</span>
                <span className="text-xs" style={{ color: 'rgba(34,38,43,0.50)' }}>{featured.date}</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── MORE ARTICLES ── */}
      <section className="py-14 px-8 md:px-16" style={{ background: '#F7F4EF' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: 'rgba(34,38,43,0.38)', letterSpacing: '0.18em' }}>
            More articles
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#fff', border: '1px solid rgba(34,38,43,0.09)', boxShadow: '0 2px 18px rgba(34,38,43,0.06)' }}
              >
                {/* Cover with left accent bar */}
                <div className="relative" style={{ background: post.coverBg }}>
                  {/* Left accent bar */}
                  <div
                    className="absolute top-0 left-0 bottom-0 w-1.5 z-10"
                    style={{ background: post.accentColor }}
                  />
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full object-cover"
                    style={{ height: '180px' }}
                  />
                  {/* Arrow badge */}
                  <div
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: post.accentColor }}
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <span
                    className="text-xs font-bold uppercase tracking-widest mb-3 inline-block"
                    style={{ color: post.accentColor, letterSpacing: '0.14em' }}
                  >
                    {post.category}
                  </span>
                  <h3
                    className="font-semibold mb-3 flex-1"
                    style={{ fontSize: '0.98rem', lineHeight: 1.45, color: '#22262B' }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-5" style={{ color: '#4A5059', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 pt-4" style={{ borderTop: '1px solid rgba(34,38,43,0.07)' }}>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: '#e8e4de', color: '#22262B' }}
                    >
                      {post.author[0]}
                    </div>
                    <span className="text-xs font-medium" style={{ color: '#22262B' }}>{post.author}</span>
                    <span style={{ color: 'rgba(34,38,43,0.28)' }}>·</span>
                    <span className="text-xs" style={{ color: 'rgba(34,38,43,0.45)' }}>{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          <div className="flex justify-center mt-12">
            <button
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
              style={{ background: 'rgba(34,38,43,0.08)', color: '#22262B', border: '1px solid rgba(34,38,43,0.12)' }}
            >
              Load more articles
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section className="py-20 px-8 md:px-16" style={{ background: '#EDE9E1' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(217,138,61,0.85)', letterSpacing: '0.2em' }}>
            Stay sharp
          </p>
          <h2
            className="font-serif font-light mb-4"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '-0.025em', lineHeight: 1.12, color: '#22262B' }}
          >
            <em>Hiring insight, once a fortnight.</em>
          </h2>
          <p className="text-sm font-light mb-8" style={{ color: 'rgba(34,38,43,0.55)' }}>
            No noise. No job board spam. Just well-considered takes on recruiting, hiring, and building great teams.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-full text-sm outline-none"
              style={{
                background: 'rgba(34,38,43,0.07)',
                border: '1px solid rgba(34,38,43,0.15)',
                color: '#22262B',
              }}
            />
            <button
              className="px-6 py-3 rounded-full text-sm font-semibold shrink-0 transition-all duration-200 hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #C8923A 0%, #D4A052 50%, #C07828 100%)', color: '#1a0e04' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
