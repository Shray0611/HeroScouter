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
          <h1 className="text-4xl font-semibold" style={{ color: '#07152A' }}>Post not found</h1>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // Extract headings for Table of Contents
  const headings = Array.from(post.content.matchAll(/<h3>(.*?)<\/h3>/g)).map(m => m[1])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <SiteNav cta={{ label: 'Get started', href: '/' }} activeLink="Blog" variant="fixed" />

      <main className="mx-auto max-w-[1200px] px-6 pt-32 pb-24">
        {/* Header Section */}
        <header className="mb-10 max-w-[800px] mx-auto lg:mx-0 lg:max-w-none">
          <h1 className="text-[1.85rem] md:text-[2.75rem] leading-[1.15] md:leading-[1.1] font-bold tracking-tight mb-4" style={{ color: '#07152A' }}>
            {post.title}
          </h1>
          <p className="text-xl mb-6" style={{ color: '#4A5059' }}>
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 text-[13px] font-medium mb-6" style={{ color: '#4A5059' }}>
            <span className="font-bold text-black">{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-widest text-gray-500 uppercase">
            SHARE
            <button className="flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-200 text-black hover:bg-gray-50 transition-colors">
              X
            </button>
            <button className="flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-200 text-black hover:bg-gray-50 transition-colors">
              LinkedIn
            </button>
            <button className="flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-200 text-black hover:bg-gray-50 transition-colors">
              Email
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16 relative border-t border-gray-100 pt-12">
          {/* Sidebar - Table of Contents — hidden on mobile */}
          <aside className="hidden lg:block lg:w-[240px] shrink-0 order-2 lg:order-1">
            <div className="sticky top-28">
              <h4 className="text-[11px] font-bold tracking-widest text-black uppercase mb-4">
                Table of Contents
              </h4>
              <nav className="flex flex-col gap-3 text-[13px] text-gray-600 font-medium">
                {headings.map((heading, i) => (
                  <a key={i} href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-black transition-colors">
                    {heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:w-[800px] order-1 lg:order-2">
            <div className="rounded-xl overflow-hidden mb-10" style={{ background: post.coverBg, padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <img src={post.cover} alt={post.title} className="max-h-[220px] md:max-h-[300px] object-contain" />
            </div>

            <div 
              className="prose prose-lg max-w-none hs-blog-prose"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/<h3>(.*?)<\/h3>/g, (match, content) => {
                const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                return `<h3 id="${id}" style="font-size: 1.5rem; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; color: #07152A;">${content}</h3>`
              }).replace(/<p>/g, '<p style="font-size: 1.125rem; line-height: 1.75; color: #374151; margin-bottom: 1.5rem;">') }}
            />
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
