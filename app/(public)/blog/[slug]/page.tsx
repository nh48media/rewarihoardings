import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'

export const revalidate = 3600

function fmtDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from('rh_blog')
    .select('slug')
    .eq('is_published', true)
  return (data ?? []).map(p => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('rh_blog')
    .select('title,excerpt,meta_title,meta_description,cover_image,published_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) return { title: 'Post Not Found — Rewari Hoardings Blog' }

  const title       = post.meta_title       ?? `${post.title} — Rewari Hoardings Blog`
  const description = post.meta_description ?? post.excerpt ?? ''

  return {
    title,
    description,
    alternates: { canonical: `https://rewarihoardings.com/blog/${slug}` },
    openGraph: {
      title,
      description,
      url:  `https://rewarihoardings.com/blog/${slug}`,
      type: 'article',
      ...(post.cover_image  ? { images: [{ url: post.cover_image }] }   : {}),
      ...(post.published_at ? { publishedTime: post.published_at }       : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('rh_blog')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  const { data: related } = await supabase
    .from('rh_blog')
    .select('slug,title,excerpt,published_at')
    .eq('is_published', true)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3)

  const breadcrumbs = [
    { name: 'Home', url: 'https://rewarihoardings.com' },
    { name: 'Blog', url: 'https://rewarihoardings.com/blog' },
    { name: post.title, url: `https://rewarihoardings.com/blog/${slug}` },
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? '',
    url: `https://rewarihoardings.com/blog/${slug}`,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'Rewari Hoardings / NH48 Media' },
    publisher: {
      '@type': 'Organization',
      name: 'Rewari Hoardings',
      logo: { '@type': 'ImageObject', url: 'https://rewarihoardings.com/logo.png' },
    },
    ...(post.cover_image ? { image: post.cover_image } : {}),
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb nav */}
      <div className="bg-[#0A0A0A] border-b border-[#1a1a1a] px-10 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 font-condensed text-[12px] uppercase tracking-[0.08em] text-[#555] flex-wrap">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition-colors no-underline">Blog</Link>
          <span>/</span>
          <span className="text-[#888] truncate max-w-[200px]">{post.title}</span>
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image && (
        <div className="relative w-full" style={{ height: 'clamp(200px, 35vw, 440px)' }}>
          <Image src={post.cover_image} alt={post.title}
            fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>
      )}

      {/* Article */}
      <article>
        <header className="bg-[#0A0A0A] px-10 pt-12 pb-8 border-b border-[#2A2A2A]">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[12px] uppercase tracking-[0.12em] px-3 py-1 mb-5">
              OOH Insights
            </div>
            <h1 className="font-condensed font-black text-white uppercase leading-[1.1] tracking-[-0.01em] mb-4"
              style={{ fontSize: 'clamp(28px, 4.5vw, 52px)' }}>
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="font-sans text-[17px] text-[#888] leading-[1.65] max-w-[640px] mb-6">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-[12px] font-condensed text-[#555] uppercase tracking-[0.08em]">
              <span>Rewari Hoardings</span>
              {post.published_at && (
                <>
                  <span className="text-[#333]">·</span>
                  <time dateTime={post.published_at}>{fmtDate(post.published_at)}</time>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="bg-[#0A0A0A] px-10 py-14">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-16 items-start">
            {/* Markdown content */}
            <div className="prose-blog">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-6">
              <div className="bg-[#FFE600] p-6">
                <h3 className="font-condensed font-black text-[#0A0A0A] text-[18px] uppercase tracking-[0.02em] leading-[1.2] mb-3">
                  Looking for OOH inventory in Rewari?
                </h3>
                <p className="font-sans text-[#333] text-[13px] leading-[1.6] mb-5">
                  Browse available hoardings, unipoles, LED displays and more. Get a quote within 24 hours.
                </p>
                <Link href="/city/rewari"
                  className="block text-center bg-[#0A0A0A] text-[#FFE600] font-condensed font-bold text-[13px] uppercase tracking-[0.1em] py-3 no-underline hover:bg-[#111] transition-colors mb-3">
                  Browse Inventory
                </Link>
                <a href={`https://wa.me/918168740234?text=${encodeURIComponent('Hi, I read your blog and want to enquire about OOH advertising in Rewari.')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="block text-center border-2 border-[#0A0A0A] text-[#0A0A0A] font-condensed font-bold text-[13px] uppercase tracking-[0.1em] py-3 no-underline hover:bg-[#0A0A0A] hover:text-[#FFE600] transition-colors">
                  WhatsApp Us
                </a>
              </div>

              {related && related.length > 0 && (
                <div>
                  <h3 className="font-condensed font-bold text-[11px] text-[#555] uppercase tracking-[0.14em] mb-3 border-b border-[#1e1e1e] pb-2">
                    More Articles
                  </h3>
                  <div className="space-y-4">
                    {related.map(r => (
                      <Link key={r.slug} href={`/blog/${r.slug}`} className="block group no-underline">
                        <p className="font-condensed font-bold text-[14px] text-white uppercase tracking-[0.02em] leading-[1.3] group-hover:text-[#FFE600] transition-colors mb-1">
                          {r.title}
                        </p>
                        <p className="font-condensed text-[11px] text-[#444] uppercase tracking-[0.06em]">
                          {fmtDate(r.published_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <Link href="/blog"
                    className="block mt-4 font-condensed text-[12px] text-[#FFE600] uppercase tracking-[0.1em] no-underline hover:underline">
                    All articles →
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>

      {/* Bottom CTA */}
      <div className="bg-[#111] px-10 py-10 border-t border-[#2A2A2A] text-center">
        <p className="font-condensed text-[#666] uppercase tracking-[0.08em] text-[14px] mb-3">
          Ready to book a hoarding in Rewari?
        </p>
        <Link href="/city/rewari"
          className="inline-block bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[15px] uppercase tracking-[0.1em] px-8 py-3 hover:bg-yellow-300 transition-colors no-underline">
          Browse Inventory →
        </Link>
      </div>
    </>
  )
}
