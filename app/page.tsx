import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { ListingRow } from '@/types/database'
import Link from 'next/link'
import Image from 'next/image'
import QuoteForm from '@/components/QuoteForm'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import WebSiteSchema from '@/components/seo/WebSiteSchema'

export const revalidate = 3600

export const metadata: Metadata = {
  title: {
    absolute: "Rewari Hoardings — Rewari's #1 OOH Advertising Marketplace",
  },
  description:
    'Find and book hoardings, unipoles, gantries, LED displays and outdoor advertising in Rewari, Haryana. Browse 15+ prime NH-48 corridor locations.',
  alternates: { canonical: 'https://rewarihoardings.com' },
}

const WA = '918168740234'

function waUrl(msg: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

const FORMAT_LABEL: Record<string, string> = {
  'unipole': 'Unipole', 'gantry': 'Gantry', 'hoarding': 'Hoarding',
  'rooftop-hoarding': 'Rooftop', 'wall-painting': 'Wall Painting',
  'construction-hoarding': 'Construction', 'led-display': 'LED Display',
  'led-video-wall': 'LED Video Wall', 'digital-kiosk': 'Digital Kiosk',
  'bus-shelter': 'Bus Shelter', 'pole-kiosk': 'Pole Kiosk',
  'traffic-booth': 'Traffic Booth', 'toll-naka': 'Toll Naka',
  'road-divider': 'Road Divider', 'railway-station': 'Railway Station',
  'cinema-advertising': 'Cinema',
}

function fmtLabel(type: string) {
  return FORMAT_LABEL[type] ?? type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ── Reusable pieces ───────────────────────────────────────────────────────────

function WAIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function AvailBadge({ avail }: { avail: string }) {
  if (avail === 'available')
    return <><span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" /><span className="text-green-400">Available</span></>
  if (avail === 'booked')
    return <><span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" /><span className="text-red-400">Booked</span></>
  return <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" /><span className="text-amber-400">Coming Soon</span></>
}

function ListingCard({ l }: { l: ListingRow }) {
  const size = l.size_width_ft && l.size_height_ft ? `${l.size_width_ft} × ${l.size_height_ft} ft` : null
  const sqft = l.size_width_ft && l.size_height_ft ? l.size_width_ft * l.size_height_ft : null
  const waMsg = waUrl(`Hi, I'm interested in the hoarding: ${l.title}. Please share availability and rates.`)

  return (
    <div className="bg-[#1E1E1E] overflow-hidden hover:bg-[#222] transition-colors">
      <div className="relative h-[200px] bg-gradient-to-br from-[#1c1c1c] to-[#2c2c2c] flex items-center justify-center">
        {l.cover_photo ? (
          <Image src={l.cover_photo} alt={l.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <div className="opacity-20">
            <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="white" strokeWidth="2">
              <rect x="6" y="18" width="36" height="22" rx="2" /><line x1="24" y1="6" x2="24" y2="18" /><line x1="14" y1="6" x2="34" y2="6" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[11px] uppercase tracking-[0.1em] px-2 py-0.5">
          {fmtLabel(l.type)}
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 px-2 py-1 font-condensed text-[11px] font-bold uppercase tracking-[0.05em]">
          <AvailBadge avail={l.availability} />
        </span>
      </div>
      <div className="p-[18px]">
        <h3 className="font-condensed font-bold text-[18px] text-white uppercase tracking-[0.02em] leading-[1.2] mb-2.5">{l.title}</h3>
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {size && <span className="font-condensed text-[12px] font-semibold uppercase px-2 py-0.5 bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20">{size}</span>}
          {sqft && <span className="font-condensed text-[12px] font-semibold uppercase px-2 py-0.5 bg-white/5 text-[#aaa] border border-white/10">{sqft} sqft</span>}
          {l.illumination_type && <span className="font-condensed text-[12px] font-semibold uppercase px-2 py-0.5 bg-white/5 text-[#aaa] border border-white/10">{l.illumination_type}</span>}
          {l.traffic_count && <span className="font-condensed text-[12px] font-semibold uppercase px-2 py-0.5 bg-white/5 text-[#aaa] border border-white/10">{l.traffic_count}</span>}
        </div>
        <div className="flex items-center gap-1 text-[#666] font-condensed font-medium text-[13px] uppercase tracking-[0.05em] mb-4">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {l.locality}
        </div>
        <div className="flex gap-2">
          <Link href={`/listing/${l.slug}`}
            className="flex-1 bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold text-[13px] uppercase tracking-[0.08em] py-2.5 text-center hover:bg-yellow-300 transition-colors no-underline">
            Get Quote
          </Link>
          <a href={waMsg} target="_blank" rel="noopener noreferrer"
            className="w-10 flex items-center justify-center bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-colors text-[#25D366] flex-shrink-0">
            <WAIcon size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: featured }, { count: totalCount }, { data: localitySetting }] = await Promise.all([
    supabase.from('listings').select('*').eq('is_featured', true).eq('is_published', true).order('created_at', { ascending: false }).limit(3),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('rh_settings').select('value').eq('key', 'rewari_localities').single(),
  ])

  const listings: ListingRow[] = featured ?? []
  const count = totalCount ?? 0
  const localities: string[] = Array.isArray(localitySetting?.value) ? (localitySetting.value as string[]) : []
  const countLabel = count > 0 ? `${count}+` : '15+'
  const heroCard = listings[0] ?? null

  return (
    <>
      <LocalBusinessSchema />
      <WebSiteSchema />
      <SiteNav />

      {/* ── HERO ── */}
      <section className="relative bg-[#0A0A0A] overflow-hidden px-10 py-20 border-b-[3px] border-[#FFE600]">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)' }} />
        <div className="absolute inset-y-0 left-1/4 w-px bg-[rgba(255,230,0,0.07)] pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-[rgba(255,230,0,0.07)] pointer-events-none" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-[rgba(255,230,0,0.07)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-14 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[rgba(255,230,0,0.1)] border border-[rgba(255,230,0,0.3)] px-3 py-1.5 mb-6 font-condensed font-semibold text-[13px] text-[#FFE600] uppercase tracking-[0.12em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600]" style={{ animation: 'heroPulse 2s ease-in-out infinite' }} />
              Rewari · Haryana · NH-48 Corridor
            </div>
            <h1 className="font-condensed font-black uppercase leading-[0.95] tracking-[-0.01em] text-white mb-7" style={{ fontSize: 'clamp(52px, 7vw, 96px)' }}>
              <span className="block" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)', color: 'transparent' }}>Book the</span>
              <span className="block text-[#FFE600]">Best Hoardings</span>
              <span className="block">in Rewari</span>
            </h1>
            <p className="font-sans text-[17px] text-[#888] leading-[1.65] max-w-[520px] mb-10">
              Rewari's dedicated outdoor advertising marketplace. Browse unipoles, gantries, rooftop hoardings, LED displays and more across every key junction in Rewari.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/city/rewari"
                className="inline-flex items-center gap-2 bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold text-[16px] uppercase tracking-[0.08em] px-7 py-3.5 hover:bg-yellow-300 transition-all hover:-translate-y-px no-underline">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                Browse Inventory
              </Link>
              <a href={waUrl('Hi, I want to enquire about hoarding advertising in Rewari.')} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-white font-condensed font-semibold text-[16px] uppercase tracking-[0.08em] px-7 py-3.5 border border-white/25 hover:border-white/60 hover:bg-white/5 transition-colors no-underline">
                <WAIcon size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right: Hero preview card */}
          <div className="bg-[#141414] border border-[#2A2A2A] overflow-hidden" style={{ animation: 'fadeUp 0.6s ease both 0.2s' }}>
            <div className="relative h-[220px] bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
              {heroCard?.cover_photo ? (
                <Image src={heroCard.cover_photo} alt={heroCard.title} fill className="object-cover" sizes="420px" />
              ) : (
                <div className="flex flex-col items-center gap-2.5 opacity-25">
                  <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="white" strokeWidth="2">
                    <rect x="6" y="18" width="36" height="22" rx="2" /><line x1="24" y1="6" x2="24" y2="18" /><line x1="14" y1="6" x2="34" y2="6" />
                  </svg>
                  <span className="font-condensed text-[11px] text-white uppercase tracking-[0.1em]">Photo Coming Soon</span>
                </div>
              )}
              <span className="absolute top-3.5 left-3.5 bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[12px] uppercase tracking-[0.1em] px-2.5 py-1">
                {heroCard ? fmtLabel(heroCard.type) : 'Unipole'}
              </span>
              <span className="absolute top-3.5 right-3.5 bg-[#0A0A0A] text-[#FFE600] font-condensed font-bold text-[11px] uppercase tracking-[0.1em] px-2.5 py-1 border border-[#FFE600]">
                Featured
              </span>
              <span className="absolute bottom-3.5 right-3.5 flex items-center gap-1 bg-black/80 px-2.5 py-1 font-condensed text-[12px] font-semibold uppercase tracking-[0.06em]">
                {heroCard ? <AvailBadge avail={heroCard.availability} /> : <><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span className="text-green-400">Available</span></>}
              </span>
            </div>
            <div className="p-5">
              <h2 className="font-condensed font-bold text-[20px] text-white uppercase tracking-[0.02em] leading-[1.15] mb-2.5">
                {heroCard?.title ?? 'NH-48 Entry Point — Rewari'}
              </h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {heroCard ? (
                  <>
                    {heroCard.size_width_ft && heroCard.size_height_ft && (
                      <span className="flex items-center gap-1 font-condensed text-[13px] text-[#888] font-medium uppercase tracking-[0.04em]">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1" /></svg>
                        {heroCard.size_width_ft} × {heroCard.size_height_ft} ft
                      </span>
                    )}
                    {heroCard.facing && (
                      <span className="flex items-center gap-1 font-condensed text-[13px] text-[#888] font-medium uppercase tracking-[0.04em]">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></svg>
                        {heroCard.facing}
                      </span>
                    )}
                    {heroCard.traffic_count && (
                      <span className="flex items-center gap-1 font-condensed text-[13px] text-[#888] font-medium uppercase tracking-[0.04em]">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
                        {heroCard.traffic_count}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1 font-condensed text-[13px] text-[#888] font-medium uppercase tracking-[0.04em]">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1" /></svg>
                      40 × 20 ft · 800 sqft
                    </span>
                    <span className="flex items-center gap-1 font-condensed text-[13px] text-[#888] font-medium uppercase tracking-[0.04em]">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
                      Frontlit · 25k+ Vehicles/Day
                    </span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-[1fr_48px] gap-2">
                <Link href={heroCard ? `/listing/${heroCard.slug}` : '/get-quote'}
                  className="flex items-center justify-center bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold text-[13px] uppercase tracking-[0.08em] px-4 py-2.5 hover:bg-yellow-300 transition-colors no-underline">
                  Get Quote
                </Link>
                <a href={waUrl(heroCard ? `Hi, I'm interested in the hoarding: ${heroCard.title}. Please share availability and rates.` : "Hi, I'd like to enquire about hoarding advertising in Rewari.")}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center bg-[#25D366] hover:bg-[#1ebe5a] transition-colors text-white h-[44px]">
                  <WAIcon size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-[#FFE600] px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
          {([
            { num: countLabel, label: 'Hoarding\nLocations' },
            { num: '6', label: 'Format\nTypes' },
            { num: '50+', label: 'Location\nPages' },
            { num: 'NH-48', label: 'Corridor\nCoverage' },
            { num: '24h', label: 'Quote\nResponse' },
          ] as const).map((s, i) => (
            <div key={i} className="flex items-center gap-3.5">
              {i > 0 && <div className="w-px h-10 bg-black/15" />}
              <div className="py-5">
                <div className="font-condensed font-black text-[40px] text-[#0A0A0A] leading-none tracking-[-0.02em]">{s.num}</div>
                <div className="font-condensed font-bold text-[13px] text-black/55 uppercase tracking-[0.08em] leading-[1.3] mt-0.5 whitespace-pre-line">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED LISTINGS ── */}
      <section className="bg-[#141414] px-10 py-20">
        <div className="max-w-7xl mx-auto mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-condensed font-black text-[48px] text-white uppercase tracking-[-0.01em] leading-none">
              Featured <span className="text-[#FFE600]">Inventory</span>
            </h2>
            <p className="font-sans text-[15px] text-[#666] mt-2">High-visibility locations across Rewari's key junctions</p>
          </div>
          <Link href="/city/rewari" className="font-condensed font-bold text-[14px] text-[#FFE600] uppercase tracking-[0.1em] flex items-center gap-1.5 pb-1 border-b border-[#FFE600]/30 hover:border-[#FFE600] transition-colors no-underline whitespace-nowrap">
            View all listings →
          </Link>
        </div>
        {listings.length > 0 ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
            {listings.map(l => <ListingCard key={l.id} l={l} />)}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto text-center py-16 border border-[#2A2A2A]">
            <p className="font-condensed text-[#555] uppercase tracking-wider">Listings coming soon — check back shortly.</p>
          </div>
        )}
      </section>

      {/* ── BROWSE BY FORMAT TYPE ── */}
      <section className="bg-[#F4F4F0] px-10 py-20">
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="font-condensed font-black text-[48px] text-[#0A0A0A] uppercase tracking-[-0.01em] leading-none">
            Browse by{' '}
            <span style={{ WebkitTextStroke: '2px #0A0A0A', color: 'transparent' }}>Format</span>
          </h2>
          <p className="font-sans text-[15px] text-[#6B6B6B] mt-2">Choose your OOH format — we have inventory across all types</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#E0E0D8] border border-[#E0E0D8]">
          {[
            {
              slug: 'unipole', name: 'Unipole', desc: 'High-rise single pole',
              icon: <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 40 40" fill="none" stroke="#0A0A0A" strokeWidth="1.5"><rect x="8" y="10" width="24" height="16" rx="1.5" /><line x1="20" y1="4" x2="20" y2="10" /><line x1="12" y1="4" x2="28" y2="4" /><line x1="20" y1="26" x2="20" y2="38" /></svg>,
            },
            {
              slug: 'gantry', name: 'Gantry', desc: 'Overhead road span',
              icon: <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 40 40" fill="none" stroke="#0A0A0A" strokeWidth="1.5"><rect x="4" y="14" width="32" height="14" rx="1.5" /><line x1="4" y1="28" x2="4" y2="38" /><line x1="36" y1="28" x2="36" y2="38" /><line x1="4" y1="8" x2="36" y2="8" /><line x1="4" y1="8" x2="4" y2="14" /><line x1="36" y1="8" x2="36" y2="14" /></svg>,
            },
            {
              slug: 'hoarding', name: 'Hoarding', desc: 'Classic billboard',
              icon: <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 40 40" fill="none" stroke="#0A0A0A" strokeWidth="1.5"><rect x="4" y="8" width="32" height="22" rx="1.5" /><line x1="10" y1="30" x2="10" y2="38" /><line x1="30" y1="30" x2="30" y2="38" /></svg>,
            },
            {
              slug: 'led-display', name: 'LED Display', desc: 'Digital, dynamic',
              icon: <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 40 40" fill="none" stroke="#0A0A0A" strokeWidth="1.5"><rect x="4" y="6" width="32" height="22" rx="2" /><circle cx="10" cy="12" r="1.5" fill="#0A0A0A" /><circle cx="17" cy="12" r="1.5" fill="#0A0A0A" /><circle cx="24" cy="12" r="1.5" fill="#0A0A0A" /><circle cx="10" cy="20" r="1.5" fill="#0A0A0A" /><circle cx="17" cy="20" r="1.5" fill="#0A0A0A" /><circle cx="24" cy="20" r="1.5" fill="#0A0A0A" /><line x1="20" y1="28" x2="20" y2="36" /></svg>,
            },
            {
              slug: 'bus-shelter', name: 'Bus Shelter', desc: 'Transit point panels',
              icon: <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 40 40" fill="none" stroke="#0A0A0A" strokeWidth="1.5"><rect x="8" y="10" width="24" height="18" rx="1.5" /><line x1="6" y1="10" x2="34" y2="10" /><line x1="8" y1="28" x2="8" y2="36" /><line x1="32" y1="28" x2="32" y2="36" /><line x1="8" y1="36" x2="32" y2="36" /></svg>,
            },
            {
              slug: 'wall-painting', name: 'Wall Painting', desc: 'Painted wall display',
              icon: <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 40 40" fill="none" stroke="#0A0A0A" strokeWidth="1.5"><rect x="4" y="6" width="32" height="28" rx="1.5" /><path d="M12 28 Q20 14 28 28" /><circle cx="20" cy="18" r="3" /></svg>,
            },
          ].map(t => (
            <Link key={t.slug} href={`/type/${t.slug}`}
              className="group bg-white p-7 text-center hover:bg-[#FFE600] transition-colors no-underline block">
              <div className="opacity-70 group-hover:opacity-100 transition-opacity">{t.icon}</div>
              <div className="font-condensed font-bold text-[16px] text-[#0A0A0A] uppercase tracking-[0.05em] mb-1">{t.name}</div>
              <div className="font-condensed text-[12px] font-medium text-[#6B6B6B] uppercase tracking-[0.06em]">{t.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── LOCALITY CHIPS ── */}
      {localities.length > 0 && (
        <div className="bg-[#0A0A0A] px-10 py-14 border-t border-b border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto">
            <p className="font-condensed font-bold text-[12px] text-[#FFE600] uppercase tracking-[0.15em] mb-5">Browse by Locality</p>
            <div className="flex flex-wrap gap-2">
              {localities.map(loc => (
                <Link key={loc} href={`/locality/${slugify(loc)}`}
                  className="font-condensed font-semibold text-[14px] text-[#666] uppercase tracking-[0.05em] px-4 py-2 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
                  {loc}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WHY ADVERTISE IN REWARI ── */}
      <section className="bg-[#141414] px-10 py-[72px] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="font-condensed font-black text-[48px] text-white uppercase tracking-[-0.01em] leading-none">
            Why Advertise <span className="text-[#FFE600]">in Rewari?</span>
          </h2>
          <p className="font-sans text-[15px] text-[#666] mt-2.5">Rewari sits at a strategic point on the Delhi–Jaipur NH-48 corridor</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A]">
          {[
            {
              num: 'NH-48',
              title: 'Prime Corridor Location',
              desc: 'Rewari is a key gateway city on the Delhi–Ahmedabad National Highway 48. Every vehicle traveling between Delhi and Rajasthan passes through Rewari — giving hoardings here unmatched intercity traffic exposure.',
            },
            {
              num: '25K+',
              title: 'Daily Vehicle Count',
              desc: 'Key junctions like NH-48 entry point and Delhi Road crossing see 20,000–35,000 vehicles per day including commercial, passenger, and two-wheelers — a diverse consumer audience for any campaign.',
            },
            {
              num: '24h',
              title: 'Fast Quote Turnaround',
              desc: 'Rewari offers significantly lower OOH advertising costs compared to NCR while delivering comparable reach within the Haryana belt. We respond to every enquiry within 24 hours.',
            },
          ].map((f, i) => (
            <div key={i} className={`py-10 ${i === 0 ? 'md:pr-10' : i === 1 ? 'md:px-10' : 'md:pl-10'}`}>
              <div className="font-condensed font-black text-[72px] text-[#FFE600] leading-none tracking-[-0.03em] mb-2">{f.num}</div>
              <div className="font-condensed font-bold text-[22px] text-white uppercase tracking-[0.03em] mb-3">{f.title}</div>
              <p className="font-sans text-[15px] text-[#666] leading-[1.65]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#F4F4F0] px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-[560px] mb-14">
            <h2 className="font-condensed font-black text-[48px] text-[#0A0A0A] uppercase tracking-[-0.01em] leading-none">
              How It <span style={{ WebkitTextStroke: '2px #0A0A0A', color: 'transparent' }}>Works</span>
            </h2>
            <p className="font-sans text-[15px] text-[#6B6B6B] mt-2.5">Book a hoarding in Rewari in 4 simple steps</p>
          </div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px pointer-events-none"
              style={{ background: 'repeating-linear-gradient(90deg,#0A0A0A 0,#0A0A0A 8px,transparent 8px,transparent 16px)', opacity: 0.25 }} />
            {[
              { num: '01', title: 'Browse Inventory', desc: 'Filter by location, format type, size and facing to shortlist suitable hoardings.' },
              { num: '02', title: 'Request a Quote', desc: 'Submit the Get Quote form or drop a WhatsApp message — no commitment needed.' },
              { num: '03', title: 'We Confirm', desc: 'Our team confirms availability, shares rates and any combo deals within 24 hours.' },
              { num: '04', title: 'Go Live', desc: 'Creative printed, mounted, and your brand live on the hoarding. Campaign begins.' },
            ].map(s => (
              <div key={s.num} className="text-center px-4 relative">
                <div className="w-14 h-14 bg-[#0A0A0A] text-[#FFE600] font-condensed font-black text-[24px] flex items-center justify-center mx-auto mb-5 relative z-10">
                  {s.num}
                </div>
                <div className="font-condensed font-bold text-[18px] text-[#0A0A0A] uppercase tracking-[0.04em] mb-2">{s.title}</div>
                <p className="font-sans text-[14px] text-[#6B6B6B] leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA + QUOTE FORM ── */}
      <section id="quote" className="bg-[#FFE600] px-10 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-20 items-center">
          <div>
            <h2 className="font-condensed font-black text-[#0A0A0A] uppercase leading-[0.95] tracking-[-0.01em] mb-4" style={{ fontSize: 'clamp(40px, 5vw, 68px)' }}>
              Ready to<br />
              <span style={{ WebkitTextStroke: '2px #0A0A0A', color: 'transparent' }}>Own Rewari's</span><br />
              Attention?
            </h2>
            <p className="font-sans text-[16px] text-black/55 leading-[1.6] mb-8">
              Tell us where you want to advertise and we'll match you with the best available hoarding in Rewari. No pricing confusion — just a straight quote, fast.
            </p>
            <div>
              <p className="font-condensed font-semibold text-[12px] text-black/45 uppercase tracking-[0.1em] mb-1.5">Direct WhatsApp</p>
              <a href={waUrl("Hi, I'd like to enquire about hoarding advertising in Rewari.")} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-condensed font-black text-[22px] text-[#0A0A0A] uppercase tracking-[0.05em] no-underline hover:opacity-75 transition-opacity">
                <WAIcon size={22} />
                +91 81687 40234
              </a>
            </div>
          </div>
          <QuoteForm localities={localities} />
        </div>
      </section>

      <SiteFooter localities={localities} />

      <WhatsAppFAB />
    </>
  )
}
