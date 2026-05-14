import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { RhBlogRow } from '@/types/database'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'OOH Advertising Blog — Rewari Hoardings',
  description: 'Tips, guides and insights on outdoor advertising in Rewari, Haryana. Learn about hoarding formats, campaign planning, and OOH marketing strategies.',
  alternates: { canonical: 'https://rewarihoardings.com/blog' },
}

function fmtDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('rh_blog')
    .select('id,slug,title,excerpt,cover_image,published_at,meta_title')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const allPosts: Pick<RhBlogRow, 'id' | 'slug' | 'title' | 'excerpt' | 'cover_image' | 'published_at' | 'meta_title'>[] = posts ?? []

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[12px] uppercase tracking-[0.12em] px-3 py-1 mb-5">
            OOH Insights
          </div>
          <h1 className="font-condensed font-black text-white uppercase leading-none tracking-[-0.01em] mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            Outdoor Advertising <span className="text-[#FFE600]">Blog</span>
          </h1>
          <p className="font-sans text-[16px] text-[#777] leading-[1.65] max-w-[560px]">
            Tips, guides and insights on OOH advertising in Rewari and the NH-48 corridor.
          </p>
        </div>
      </section>

      {allPosts.length > 0 ? (
        <section className="bg-[#141414] px-10 py-14">
          <div className="max-w-7xl mx-auto">
            {/* Featured post (first one) */}
            {allPosts[0] && (
              <Link href={`/blog/${allPosts[0].slug}`}
                className="block mb-10 group no-underline border border-[#2A2A2A] hover:border-[#FFE600]/40 transition-colors bg-[#111] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] items-stretch">
                  {allPosts[0].cover_image ? (
                    <div className="relative aspect-[16/7] md:aspect-auto md:min-h-[280px]">
                      <Image src={allPosts[0].cover_image} alt={allPosts[0].title}
                        fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                    </div>
                  ) : (
                    <div className="hidden md:flex items-center justify-center bg-[#0A0A0A] min-h-[280px]">
                      <span className="font-condensed font-black text-[#1a1a1a] text-[80px] uppercase tracking-tight select-none">OOH</span>
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <div className="inline-block bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 mb-4">
                        Featured
                      </div>
                      <h2 className="font-condensed font-black text-white text-[22px] uppercase tracking-[0.02em] leading-[1.2] mb-3 group-hover:text-[#FFE600] transition-colors">
                        {allPosts[0].title}
                      </h2>
                      {allPosts[0].excerpt && (
                        <p className="font-sans text-[14px] text-[#666] leading-[1.65]">
                          {allPosts[0].excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-condensed text-[12px] text-[#444] uppercase tracking-[0.08em]">
                        {fmtDate(allPosts[0].published_at)}
                      </span>
                      <span className="font-condensed font-bold text-[13px] text-[#FFE600] uppercase tracking-[0.08em]">
                        Read article →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining posts grid */}
            {allPosts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
                {allPosts.slice(1).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`}
                    className="bg-[#111] p-7 group no-underline flex flex-col hover:bg-[#141414] transition-colors">
                    {post.cover_image && (
                      <div className="relative aspect-[16/9] mb-5 overflow-hidden">
                        <Image src={post.cover_image} alt={post.title}
                          fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                      </div>
                    )}
                    <h2 className="font-condensed font-black text-white text-[18px] uppercase tracking-[0.02em] leading-[1.2] mb-3 group-hover:text-[#FFE600] transition-colors flex-1">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="font-sans text-[13px] text-[#666] leading-[1.6] mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1e1e1e]">
                      <span className="font-condensed text-[11px] text-[#444] uppercase tracking-[0.08em]">
                        {fmtDate(post.published_at)}
                      </span>
                      <span className="font-condensed font-bold text-[12px] text-[#FFE600] uppercase tracking-[0.08em]">
                        Read →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Empty state — coming soon */
        <section className="bg-[#141414] px-10 py-14">
          <div className="max-w-7xl mx-auto">
            <p className="font-condensed font-bold text-[12px] text-[#555] uppercase tracking-[0.15em] mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600]" />
              Articles coming soon
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
              {[
                { title: "How to Choose the Right Hoarding Location in Rewari", excerpt: "A guide to evaluating visibility, traffic count, facing direction, and proximity to your target audience when booking OOH inventory in Rewari.", tag: "Planning" },
                { title: "Unipole vs Gantry vs Hoarding — What's Right for Your Brand?", excerpt: "A breakdown of the three most popular OOH formats in Rewari, their strengths, typical campaign durations, and which categories of brands use them most.", tag: "Formats" },
                { title: "Why the NH-48 Corridor is a Prime OOH Advertising Opportunity", excerpt: "Rewari sits at the gateway of the Delhi–Jaipur national highway. We look at traffic data, audience demographics, and why brands choose Rewari for intercity reach.", tag: "Insights" },
                { title: "Measuring OOH Campaign Effectiveness Without Digital Tracking", excerpt: "How to set up before/after surveys, footfall correlation, and brand recall studies to attribute results to your outdoor advertising spend.", tag: "Strategy" },
              ].map((post, i) => (
                <div key={i} className="bg-[#1a1a1a] p-8">
                  <span className="inline-block bg-[#FFE600]/10 text-[#FFE600] font-condensed font-bold text-[11px] uppercase tracking-[0.1em] px-2.5 py-0.5 border border-[#FFE600]/20 mb-4">
                    {post.tag}
                  </span>
                  <h2 className="font-condensed font-bold text-[20px] text-white uppercase tracking-[0.02em] leading-[1.2] mb-3">
                    {post.title}
                  </h2>
                  <p className="font-sans text-[14px] text-[#666] leading-[1.65]">{post.excerpt}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 font-condensed text-[12px] text-[#444] uppercase tracking-[0.1em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#444]" />
                    Coming soon
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <div className="bg-[#0A0A0A] px-10 py-10 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-condensed font-bold text-[18px] text-white uppercase tracking-[0.03em] mb-1">
              Get notified when we publish
            </p>
            <p className="font-sans text-[14px] text-[#666]">WhatsApp us and we'll notify you when new articles go live.</p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a href={`https://wa.me/918168740234?text=${encodeURIComponent("Hi, please notify me when new blog articles are published on Rewari Hoardings.")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 bg-[#25D366] text-white font-condensed font-bold text-[14px] uppercase tracking-[0.08em] px-6 py-3 hover:bg-[#1ebe5a] transition-colors no-underline">
              Notify Me on WhatsApp
            </a>
            <Link href="/city/rewari"
              className="flex-shrink-0 bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[14px] uppercase tracking-[0.08em] px-6 py-3 hover:bg-yellow-300 transition-colors no-underline">
              Browse Inventory →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
