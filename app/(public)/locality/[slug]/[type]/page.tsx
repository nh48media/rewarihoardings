import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ListingCard, { fmtLabel } from '@/components/listing/ListingCard'
import type { ListingRow } from '@/types/database'

export const revalidate = 3600

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

function unslugify(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

type Props = { params: Promise<{ slug: string; type: string }> }

async function resolveLocality(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('rh_settings').select('value').eq('key', 'rewari_localities').single()
  const localities: string[] = Array.isArray(data?.value) ? (data.value as string[]) : []
  return localities.find(loc => slugify(loc) === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, type } = await params
  const locality = await resolveLocality(slug)
  const localityName = locality ?? unslugify(slug)
  const typeName = fmtLabel(type)
  const title = `${typeName} in ${localityName}, Rewari — OOH Advertising`
  const description = `Find ${typeName.toLowerCase()} outdoor advertising in ${localityName}, Rewari, Haryana. Browse available inventory and get quick quotes.`
  return {
    title,
    description,
    alternates: { canonical: `https://rewarihoardings.com/locality/${slug}/${type}` },
    openGraph: { title, description, url: `https://rewarihoardings.com/locality/${slug}/${type}` },
  }
}

export default async function LocalityTypePage({ params }: Props) {
  const { slug, type } = await params
  const localityName = await resolveLocality(slug)
  if (!localityName) notFound()

  const typeName = fmtLabel(type)

  const supabase = await createClient()
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('locality', localityName)
    .eq('type', type as ListingRow['type'])
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  const all: ListingRow[] = listings ?? []
  const availableCount = all.filter(l => l.availability === 'available').length

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#0A0A0A] border-b border-[#1a1a1a] px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-condensed text-[12px] uppercase tracking-[0.08em] text-[#555] flex-wrap">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <Link href="/city/rewari" className="hover:text-white transition-colors no-underline">Rewari</Link>
          <span>/</span>
          <Link href={`/locality/${slug}`} className="hover:text-white transition-colors no-underline">{localityName}</Link>
          <span>/</span>
          <span className="text-[#888]">{typeName}</span>
        </div>
      </div>

      {/* Header */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[12px] uppercase tracking-[0.12em] px-3 py-1">
              {typeName}
            </span>
            <span className="flex items-center gap-1.5 font-condensed font-semibold text-[12px] text-[#666] uppercase tracking-[0.1em]">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {localityName}, Rewari
            </span>
          </div>
          <h1 className="font-condensed font-black text-white uppercase leading-none tracking-[-0.01em] mb-4" style={{ fontSize: 'clamp(30px, 4.5vw, 56px)' }}>
            <span className="text-[#FFE600]">{typeName}</span>{' '}in{' '}
            <span>{localityName}</span>
          </h1>
          <p className="font-sans text-[15px] text-[#777] leading-[1.65] max-w-[560px] mb-6">
            {typeName} outdoor advertising locations in {localityName}, Rewari, Haryana.
            High-visibility spots targeting local and NH-48 corridor traffic.
          </p>

          <div className="flex flex-wrap gap-5">
            <div className="bg-[#111] border border-[#2A2A2A] px-5 py-3">
              <div className="font-condensed font-black text-[28px] text-[#FFE600] leading-none">{all.length}</div>
              <div className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mt-0.5">Total locations</div>
            </div>
            <div className="bg-[#111] border border-[#2A2A2A] px-5 py-3">
              <div className="font-condensed font-black text-[28px] text-white leading-none">{availableCount}</div>
              <div className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mt-0.5">Available now</div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings grid */}
      <section className="bg-[#141414] px-10 py-14">
        <div className="max-w-7xl mx-auto">
          {all.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
              {all.map(l => <ListingCard key={l.id} l={l} />)}
            </div>
          ) : (
            <div className="text-center py-20 border border-[#2A2A2A]">
              <p className="font-condensed text-[#555] uppercase tracking-wider text-[14px] mb-3">
                No {typeName.toLowerCase()} listings in {localityName} yet
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <Link href={`/locality/${slug}`}
                  className="font-condensed font-bold text-[14px] text-[#FFE600] uppercase tracking-[0.08em] px-5 py-2.5 border border-[#FFE600]/40 hover:border-[#FFE600] transition-colors no-underline">
                  All in {localityName}
                </Link>
                <Link href={`/type/${type}`}
                  className="font-condensed font-bold text-[14px] text-[#666] uppercase tracking-[0.08em] px-5 py-2.5 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
                  All {typeName}s in Rewari
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related nav */}
      <div className="bg-[#0A0A0A] px-10 py-8 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <span className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em]">See also:</span>
          <Link href={`/locality/${slug}`}
            className="font-condensed font-bold text-[14px] text-[#666] uppercase tracking-[0.06em] px-4 py-2 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
            All hoardings in {localityName}
          </Link>
          <Link href={`/type/${type}`}
            className="font-condensed font-bold text-[14px] text-[#666] uppercase tracking-[0.06em] px-4 py-2 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
            All {typeName}s in Rewari
          </Link>
          <Link href="/city/rewari"
            className="font-condensed font-bold text-[14px] text-[#FFE600] uppercase tracking-[0.06em] px-4 py-2 border border-[#FFE600]/40 hover:border-[#FFE600] transition-colors no-underline">
            Full Rewari Inventory →
          </Link>
        </div>
      </div>
    </>
  )
}
