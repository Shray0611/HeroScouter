const posts = [
  {
    id: 1,
    slug: 'why-best-candidates-arent-applying',
    category: 'Hiring',
    title: 'Why the best candidates are not applying to your job post',
    excerpt:
      'The people you most want to hire are usually not on the market. They are not refreshing job boards. Here is what actually gets their attention.',
    date: 'July 28, 2025',
    readTime: '5 min read',
    categoryColor: '#1E4D3A',
    categoryBg: '#EAF2EE',
  },
  {
    id: 2,
    slug: 'first-90-days',
    category: 'Onboarding',
    title: 'What actually happens in the first 90 days',
    excerpt:
      'Most hires are judged before they have had a fair chance. We looked at where early departures really start, and it is almost never about the candidate.',
    date: 'July 14, 2025',
    readTime: '7 min read',
    categoryColor: '#C07020',
    categoryBg: '#FBF2E8',
  },
  {
    id: 3,
    slug: 'job-description-that-attracts',
    category: 'Writing',
    title: 'How to write a job description that attracts the right person',
    excerpt:
      'Most job descriptions describe a wish list. The best ones describe a problem worth solving. That one change is enough to shift who applies.',
    date: 'June 30, 2025',
    readTime: '4 min read',
    categoryColor: '#A04830',
    categoryBg: '#FAF0EB',
  },
]

export default function BlogTeaser() {
  return (
    <section
      id="blog"
      className="pt-14 md:pt-16 pb-24 md:pb-32"
      style={{ background: '#F7F4EF' }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: '#1E4D3A', letterSpacing: '0.15em' }}
            >
              From the desk
            </p>
            <h2
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                letterSpacing: '-0.025em',
                lineHeight: 1.12,
                color: '#22262B',
              }}
            >
              Notes on hiring.
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#7A8390' }}>
              What we are learning about hiring in AI and tech.
            </p>
          </div>
          <a
            href="#blog-all"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shrink-0 transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: '#EDE9E1',
              border: '1px solid rgba(34,38,43,0.12)',
              color: '#4A5059',
            }}
          >
            All posts
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* Asymmetric: large featured + two smaller */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          {/* Featured */}
          <a
            href={`#blog/${posts[0].slug}`}
            className="group md:col-span-3 flex flex-col p-8 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: '#EDE9E1',
              border: '1px solid rgba(34,38,43,0.09)',
            }}
          >
            <span
              className="text-xs font-semibold tracking-wide px-2.5 py-1 rounded-full self-start mb-7"
              style={{ background: posts[0].categoryBg, color: posts[0].categoryColor }}
            >
              {posts[0].category}
            </span>

            <h3
              className="font-serif font-light mb-4 transition-colors duration-200 group-hover:text-[#1E4D3A]"
              style={{
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                lineHeight: 1.22,
                letterSpacing: '-0.02em',
                color: '#22262B',
              }}
            >
              {posts[0].title}
            </h3>

            <p
              className="text-sm leading-relaxed flex-1 mb-8"
              style={{ color: '#4A5059' }}
            >
              {posts[0].excerpt}
            </p>

            <div
              className="flex items-center gap-4 text-xs pt-6"
              style={{ color: '#7A8390', borderTop: '1px solid rgba(34,38,43,0.10)' }}
            >
              <span>{posts[0].date}</span>
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(34,38,43,0.2)' }} />
              <span>{posts[0].readTime}</span>
              <span
                className="ml-auto flex items-center gap-1.5 font-medium group-hover:gap-2.5 transition-all duration-200"
                style={{ color: '#1E4D3A' }}
              >
                Read
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </a>

          {/* Two smaller */}
          <div className="md:col-span-2 flex flex-col gap-5">
            {posts.slice(1).map((post) => (
              <a
                key={post.id}
                href={`#blog/${post.slug}`}
                className="group flex flex-col p-6 rounded-2xl flex-1 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: '#EDE9E1',
                  border: '1px solid rgba(34,38,43,0.09)',
                }}
              >
                <span
                  className="text-xs font-semibold tracking-wide px-2.5 py-1 rounded-full self-start mb-5"
                  style={{ background: post.categoryBg, color: post.categoryColor }}
                >
                  {post.category}
                </span>

                <h3
                  className="font-serif font-light mb-3 transition-colors duration-200 group-hover:text-[#1E4D3A]"
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                    letterSpacing: '-0.015em',
                    color: '#22262B',
                  }}
                >
                  {post.title}
                </h3>

                <p
                  className="text-xs leading-relaxed flex-1 mb-5"
                  style={{ color: '#4A5059' }}
                >
                  {post.excerpt}
                </p>

                <div
                  className="flex items-center gap-3 text-xs pt-4"
                  style={{ color: '#7A8390', borderTop: '1px solid rgba(34,38,43,0.08)' }}
                >
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(34,38,43,0.18)' }} />
                  <span>{post.readTime}</span>
                  <span
                    className="ml-auto flex items-center gap-1 font-medium group-hover:gap-2 transition-all duration-200"
                    style={{ color: post.categoryColor, fontSize: '0.75rem' }}
                  >
                    Read
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
