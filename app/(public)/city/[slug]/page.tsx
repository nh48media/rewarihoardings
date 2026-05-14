import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ListingCard from '@/components/listing/ListingCard'
import type { ListingRow } from '@/types/database'

export const revalidate = 3600

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

const CITY_META: Record<string, { name: string; state: string }> = {
  rewari: { name: 'Rewari', state: 'Haryana' },
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = CITY_META[slug]
  if (!city) return { title: 'City Not Found' }
  const title = `Hoardings in ${city.name}, ${city.state} — OOH Advertising Inventory`
  const description = `Browse all outdoor advertising hoardings, unipoles, gantries and LED displays in ${city.name}, ${city.state}. Get instant quotes on available locations.`
  return {
    title,
    description,
    alternates: { canonical: `https://rewarihoardings.com/city/${slug}` },
    openGraph: { title, description, url: `https://rewarihoardings.com/city/${slug}` },
  }
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const city = CITY_META[slug]
  if (!city) notFound()

  const supabase = await createClient()
  const [{ data: listings, count }, { data: localitySetting }] = await Promise.all([
    supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase.from('rh_settings').select('value').eq('key', 'rewari_localities').single(),
  ])

  const all: ListingRow[] = listings ?? []
  const total = count ?? 0
  const localities: string[] = Array.isArray(localitySetting?.value) ? (localitySetting.value as string[]) : []

  const availableCount = all.filter(l => l.availability === 'available').length
  const types = [...new Set(all.map(l => l.type))]

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#0A0A0A] border-b border-[#1a1a1a] px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-condensed text-[12px] uppercase tracking-[0.08em] text-[#555]">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <span className="text-[#888]">{city.name}</span>
        </div>
      </div>

      {/* Header */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[rgba(255,230,0,0.1)] border border-[rgba(255,230,0,0.3)] px-3 py-1.5 mb-5 font-condensed font-semibold text-[13px] text-[#FFE600] uppercase tracking-[0.12em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600]" />
            {city.name} · {city.state} · NH-48 Corridor
          </div>
          <h1 className="font-condensed font-black text-white uppercase leading-none tracking-[-0.01em] mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            Hoardings in <span className="text-[#FFE600]">{city.name}</span>
          </h1>
          <p className="font-sans text-[16px] text-[#777] leading-[1.65] max-w-[600px] mb-8">
            Browse all outdoor advertising inventory in {city.name}, {city.state}. Unipoles, gantries, hoardings, LED displays and more — all key locations on NH-48.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { num: `${total}`, label: 'Total listings' },
              { num: `${availableCount}`, label: 'Available now' },
              { num: `${types.length}`, label: 'Format types' },
              { num: `${localities.length || '10'}+`, label: 'Localities' },
            ].map(s => (
              <div key={s.label} className="bg-[#111] border border-[#2A2A2A] px-5 py-3">
                <div className="font-condensed font-black text-[28px] text-[#FFE600] leading-none">{s.num}</div>
                <div className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locality filter chips */}
      {localities.length > 0 && (
        <div className="bg-[#0A0A0A] px-10 py-6 border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
            <span className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mr-1">Filter:</span>
            <Link href={`/city/${slug}`}
              className="font-condensed font-bold text-[13px] text-[#0A0A0A] bg-[#FFE600] uppercase tracking-[0.05em] px-3 py-1.5 no-underline">
              All
            </Link>
            {localities.map(loc => (
              <Link key={loc} href={`/locality/${slugify(loc)}`}
                className="font-condensed font-semibold text-[13px] text-[#666] uppercase tracking-[0.05em] px-3 py-1.5 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
                {loc}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Format type quick links */}
      <div className="bg-[#0A0A0A] px-10 py-4 border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
          <span className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mr-1">Type:</span>
          {[
            ['unipole', 'Unipoles'],
            ['gantry', 'Gantries'],
            ['hoarding', 'Hoardings'],
            ['led-display', 'LED Displays'],
            ['bus-shelter', 'Bus Shelters'],
            ['wall-painting', 'Wall Paintings'],
          ].map(([typeSlug, label]) => (
            <Link key={typeSlug} href={`/type/${typeSlug}`}
              className="font-condensed font-semibold text-[13px] text-[#666] uppercase tracking-[0.05em] px-3 py-1.5 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Listings grid */}
      <section className="bg-[#141414] px-10 py-14">
        <div className="max-w-7xl mx-auto">
          {all.length > 0 ? (
            <>
              <p className="font-condensed text-[13px] text-[#555] uppercase tracking-[0.1em] mb-6">
                Showing {all.length} listing{all.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
                {all.map(l => <ListingCard key={l.id} l={l} />)}
              </div>
            </>
          ) : (
            <div className="text-center py-20 border border-[#2A2A2A]">
              <div className="opacity-20 mb-4 flex justify-center">
                <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="white" strokeWidth="2">
                  <rect x="6" y="18" width="36" height="22" rx="2" /><line x1="24" y1="6" x2="24" y2="18" /><line x1="14" y1="6" x2="34" y2="6" />
                </svg>
              </div>
              <p className="font-condensed text-[#555] uppercase tracking-wider text-[14px] mb-2">No listings yet</p>
              <p className="font-sans text-[#444] text-[13px]">Inventory is being added — check back soon or WhatsApp us for availability.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FFE600] px-10 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-condensed font-black text-[32px] text-[#0A0A0A] uppercase tracking-[-0.01em] leading-none mb-2">
              Can't find what you need?
            </h2>
            <p className="font-sans text-[15px] text-black/55">
              Tell us your requirements — we'll find the right hoarding for your campaign.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/get-quote"
              className="font-condensed font-black text-[15px] text-[#0A0A0A] uppercase tracking-[0.08em] px-7 py-3.5 bg-[#0A0A0A] text-[#FFE600] hover:bg-[#111] transition-colors no-underline">
              Get a Quote →
            </Link>
            <a href={`https://wa.me/918168740234?text=${encodeURIComponent("Hi, I'm looking for a hoarding in Rewari. Please help me find the right location.")}`}
              target="_blank" rel="noopener noreferrer"
              className="font-condensed font-bold text-[15px] text-[#0A0A0A] uppercase tracking-[0.08em] px-7 py-3.5 border-2 border-[#0A0A0A]/30 hover:border-[#0A0A0A] transition-colors no-underline">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
