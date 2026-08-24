import { useParams } from 'react-router'
import { blogPosts } from '../data/blog'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return (
      <div style={{ background: '#F7F4EF', minHeight: '100vh' }}>
        <SiteNav cta={{ label: 'Get started', href: '/' }} activeLink="Blog" variant="fixed" />
        <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-center">
          <h1 className="text-3xl font-semibold" style={{ color: '#07152A' }}>Post not found</h1>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const headings = Array.from(post.content.matchAll(/<h3>(.*?)<\/h3>/g)).map(m => m[1])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <SiteNav cta={{ label: 'Get started', href: '/' }} activeLink="Blog" variant="fixed" />

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-28 sm:pt-32 pb-20 sm:pb-24">

        {/* Header */}
        <header className="mb-8 sm:mb-10 max-w-[800px] mx-auto lg:mx-0 lg:max-w-none">
          <h1
            className="font-bold tracking-tight mb-4 leading-tight"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', color: '#07152A', lineHeight: 1.15 }}
          >
            {post.title}
          </h1>
          <p
            className="mb-5 leading-relaxed"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', color: '#4A5059' }}
          >
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px] font-medium mb-5" style={{ color: '#4A5059' }}>
            <span className="font-bold" style={{ color: '#07152A' }}>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          {/* Share buttons */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-widest text-gray-500 uppercase">
            <span>Share</span>
            {['X', 'LinkedIn', 'Email'].map((label) => (
              <button
                key={label}
                className="flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-200 text-black hover:bg-gray-50 transition-colors text-xs"
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 border-t border-gray-100 pt-8 sm:pt-12">

          {/* Sidebar TOC — hidden on mobile */}
          <aside className="hidden lg:block lg:w-[240px] shrink-0 order-2 lg:order-1">
            <div className="sticky top-28">
              <h4 className="text-[11px] font-bold tracking-widest text-black uppercase mb-4">
                Table of Contents
              </h4>
              <nav className="flex flex-col gap-3 text-[13px] text-gray-600 font-medium">
                {headings.map((heading, i) => (
                  <a
                    key={i}
                    href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="hover:text-black transition-colors"
                  >
                    {heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <article className="w-full lg:w-[800px] order-1 lg:order-2 min-w-0">

            {/* Cover image — properly centered, constrained height */}
            <div
              className="rounded-xl overflow-hidden mb-8 sm:mb-10 flex items-center justify-center"
              style={{ background: post.coverBg, padding: '16px' }}
            >
              <img
                src={post.cover}
                alt={post.title}
                className="w-full object-contain rounded-lg"
                style={{ maxHeight: '260px' }}
              />
            </div>

            {/* Prose content */}
            <div
              className="hs-blog-prose"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/<h3>(.*?)<\/h3>/g, (_, content) => {
                    const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    return `<h3 id="${id}" style="font-family:'Fraunces',Georgia,serif; font-size:clamp(1.15rem,2.5vw,1.5rem); font-weight:700; margin-top:2.25rem; margin-bottom:0.85rem; color:#07152A;">${content}</h3>`
                  })
                  .replace(/<p>/g, '<p style="font-size:clamp(0.95rem,1.8vw,1.125rem); line-height:1.8; color:#374151; margin-bottom:1.4rem;">')
              }}
            />
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
