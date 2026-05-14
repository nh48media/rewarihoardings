import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { ListingRow } from '@/types/database'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import FAQSchema from '@/components/seo/FAQSchema'
import RewariInventory from '@/components/city/RewariInventory'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Hoardings in Rewari, Haryana — Book OOH Advertising on NH-48',
  description:
    'Browse all outdoor advertising inventory in Rewari, Haryana — unipoles, gantries, LED displays, rooftop hoardings and more on the NH-48 corridor. Get instant quotes.',
  alternates: { canonical: 'https://rewarihoardings.com/city/rewari' },
  openGraph: {
    title: 'Hoardings in Rewari, Haryana — OOH Advertising Inventory',
    description:
      'Browse all outdoor advertising in Rewari on the NH-48 corridor. Unipoles, gantries, LED displays and more. Get quotes within 24 hours.',
    url: 'https://rewarihoardings.com/city/rewari',
    type: 'website',
  },
}

const FAQS = [
  {
    question: 'What types of outdoor advertising are available in Rewari, Haryana?',
    answer:
      'Rewari offers a full range of OOH formats: unipoles and gantries on NH-48, rooftop hoardings on commercial buildings, LED digital displays near Rewari Bus Stand and key junctions, bus shelter panels, wall paintings in market areas, and pole kiosks. Browse our live inventory above to see what is currently available and bookable.',
  },
  {
    question: 'How quickly can I get a quote for hoarding advertising in Rewari?',
    answer:
      'We respond to all enquiries within 24 hours — usually much faster. Submit the Get Quote form or WhatsApp us directly at +91 81687 40234. Share your preferred locality, format type, and campaign duration and we will send matching options with rates by return.',
  },
  {
    question: 'Which areas in Rewari get the highest traffic for OOH advertising?',
    answer:
      'The highest-traffic locations in Rewari are the NH-48 Entry Point (20,000–35,000 vehicles/day including intercity traffic between Delhi and Rajasthan), Delhi Road crossing, Gurudwara Chowk, and Rewari Bus Stand junction. For dense local market reach, Sadar Bazar and New Grain Market are strong performers with a captive pedestrian and shopper audience.',
  },
  {
    question: 'What is the minimum booking period for a hoarding in Rewari?',
    answer:
      'Most hoarding and unipole locations in Rewari are available on a minimum 1-month booking. Longer campaigns of 3, 6 or 12 months typically attract significantly better rates. LED digital displays may have shorter minimum periods. Contact us for location-specific availability and pricing terms.',
  },
  {
    question: 'Is Rewari effective for brands targeting Delhi NCR and Rajasthan audiences?',
    answer:
      'Yes — Rewari sits directly on NH-48, the Delhi–Jaipur–Mumbai national highway. Every vehicle traveling between Delhi and Rajasthan passes through Rewari, making it one of the most cost-effective intercity OOH opportunities in North India. Advertising costs are significantly lower than NCR while the audience exposure — especially at highway entry/exit points — is comparable.',
  },
]

const FORMAT_TYPES = [
  { slug: 'unipole',          label: 'Unipoles' },
  { slug: 'gantry',           label: 'Gantries' },
  { slug: 'hoarding',         label: 'Hoardings' },
  { slug: 'led-display',      label: 'LED Displays' },
  { slug: 'bus-shelter',      label: 'Bus Shelters' },
  { slug: 'wall-painting',    label: 'Wall Paintings' },
  { slug: 'rooftop-hoarding', label: 'Rooftop' },
  { slug: 'digital-kiosk',    label: 'Digital Kiosks' },
]

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

export default async function RewariCityPage() {
  const supabase = await createClient()

  const [{ data: listings }, { data: localitySetting }] = await Promise.all([
    supabase
      .from('listings')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase.from('rh_settings').select('value').eq('key', 'rewari_localities').single(),
  ])

  const all: ListingRow[]    = listings ?? []
  const localities: string[] = Array.isArray(localitySetting?.value)
    ? (localitySetting.value as string[])
    : []

  const total          = all.length
  const availableCount = all.filter(l => l.availability === 'available').length
  const types          = [...new Set(all.map(l => l.type))]

  // count per locality for the quick-links grid
  const localityCount = (loc: string) => all.filter(l => l.locality === loc).length

  const breadcrumbs = [
    { name: 'Home',   url: 'https://rewarihoardings.com' },
    { name: 'Rewari', url: 'https://rewarihoardings.com/city/rewari' },
  ]

  return (
    <>
      <LocalBusinessSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={FAQS} />

      {/* ── BREADCRUMB NAV ── */}
      <div className="bg-[#0A0A0A] border-b border-[#1a1a1a] px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-condensed text-[12px] uppercase tracking-[0.08em] text-[#555]">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <span className="text-[#888]">Rewari</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="bg-[#0A0A0A] px-10 pt-14 pb-0 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)' }} />
        <div className="absolute inset-y-0 left-1/3 w-px bg-[rgba(255,230,0,0.06)] pointer-events-none" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-[rgba(255,230,0,0.06)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[rgba(255,230,0,0.1)] border border-[rgba(255,230,0,0.3)] px-3 py-1.5 mb-6 font-condensed font-semibold text-[13px] text-[#FFE600] uppercase tracking-[0.12em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600]" />
            Rewari · Haryana · NH-48 Corridor
          </div>

          <h1
            className="font-condensed font-black text-white uppercase leading-[0.92] tracking-[-0.02em] mb-6"
            style={{ fontSize: 'clamp(44px, 6.5vw, 88px)' }}
          >
            <span className="block" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.18)', color: 'transparent' }}>All Hoardings</span>
            <span className="block text-[#FFE600]">in Rewari</span>
            <span className="block">Haryana</span>
          </h1>

          <p className="font-sans text-[16px] text-[#888] leading-[1.65] max-w-[540px] mb-10">
            Browse every available outdoor advertising location in Rewari — unipoles, gantries, LED displays, bus shelters and more across the NH-48 corridor and key market junctions.
          </p>

          <div className="flex flex-wrap gap-3 mb-14">
            <a href="#inventory"
              className="inline-flex items-center gap-2 bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[15px] uppercase tracking-[0.08em] px-7 py-3.5 hover:bg-yellow-300 transition-colors no-underline">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              Browse Inventory
            </a>
            <Link href="/get-quote"
              className="inline-flex items-center gap-2 bg-transparent text-white font-condensed font-semibold text-[15px] uppercase tracking-[0.08em] px-7 py-3.5 border border-white/25 hover:border-white/60 hover:bg-white/5 transition-colors no-underline">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-[#FFE600] px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center divide-x divide-black/15">
          {[
            { num: String(total),          label: 'Total\nListings' },
            { num: String(availableCount), label: 'Available\nNow' },
            { num: String(types.length),   label: 'Format\nTypes' },
            { num: String(localities.length || '10') + '+', label: 'Key\nLocalities' },
            { num: '24h',                  label: 'Quote\nResponse' },
          ].map((s, i) => (
            <div key={i} className="py-5 px-7 first:pl-0">
              <div className="font-condensed font-black text-[38px] text-[#0A0A0A] leading-none tracking-[-0.02em]">{s.num}</div>
              <div className="font-condensed font-bold text-[12px] text-black/50 uppercase tracking-[0.08em] leading-[1.35] mt-0.5 whitespace-pre-line">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── INVENTORY (client: filter + grid) ── */}
      <div className="bg-[#0A0A0A] pt-14">
        <div className="max-w-7xl mx-auto px-10 mb-0">
          <h2 className="font-condensed font-black text-[40px] text-white uppercase tracking-[-0.01em] leading-none">
            Full <span className="text-[#FFE600]">Inventory</span>
          </h2>
          <p className="font-sans text-[15px] text-[#666] mt-2">
            All published locations — updated live from our database
          </p>
        </div>
      </div>
      <RewariInventory listings={all} types={types} />

      {/* ── LOCALITY QUICK-LINKS ── */}
      {localities.length > 0 && (
        <section className="bg-[#141414] px-10 py-16 border-t border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="font-condensed font-black text-[40px] text-white uppercase tracking-[-0.01em] leading-none">
                Browse by <span className="text-[#FFE600]">Locality</span>
              </h2>
              <p className="font-sans text-[15px] text-[#666] mt-2">
                Find hoardings in a specific area of Rewari
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
              {localities.map(loc => {
                const count = localityCount(loc)
                return (
                  <Link
                    key={loc}
                    href={`/locality/${slugify(loc)}`}
                    className="group bg-[#1a1a1a] p-5 hover:bg-[#222] transition-colors no-underline block"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-condensed font-bold text-[15px] text-white uppercase tracking-[0.03em] leading-[1.2] group-hover:text-[#FFE600] transition-colors">
                        {loc}
                      </p>
                      <svg className="w-3.5 h-3.5 text-[#444] group-hover:text-[#FFE600] transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="font-condensed text-[12px] text-[#555] uppercase tracking-[0.08em]">
                      {count > 0 ? `${count} listing${count !== 1 ? 's' : ''}` : 'Coming soon'}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FORMAT TYPE LINKS ── */}
      <section className="bg-[#F4F4F0] px-10 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="font-condensed font-black text-[40px] text-[#0A0A0A] uppercase tracking-[-0.01em] leading-none">
              Browse by{' '}
              <span style={{ WebkitTextStroke: '2px #0A0A0A', color: 'transparent' }}>Format</span>
            </h2>
            <p className="font-sans text-[15px] text-[#6B6B6B] mt-2">
              Find the right OOH format for your campaign
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-px bg-[#E0E0D8] border border-[#E0E0D8]">
            {FORMAT_TYPES.map(f => (
              <Link
                key={f.slug}
                href={`/type/${f.slug}`}
                className="group bg-white p-5 text-center hover:bg-[#FFE600] transition-colors no-underline block"
              >
                <div className="font-condensed font-bold text-[14px] text-[#0A0A0A] uppercase tracking-[0.04em] leading-[1.2]">{f.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY REWARI ── */}
      <section className="bg-[#141414] px-10 py-16 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="font-condensed font-black text-[40px] text-white uppercase tracking-[-0.01em] leading-none">
              Why Advertise <span className="text-[#FFE600]">in Rewari?</span>
            </h2>
            <p className="font-sans text-[15px] text-[#666] mt-2">
              Rewari's strategic location on NH-48 gives OOH advertisers unmatched intercity reach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A]">
            {[
              {
                stat: 'NH-48',
                head: 'Prime Highway Corridor',
                body: 'Every vehicle traveling between Delhi and Rajasthan passes through Rewari — giving hoardings here unmatched intercity audience exposure. The NH-48 entry and exit points are among the most valuable OOH placements in Haryana.',
              },
              {
                stat: '25K+',
                head: 'Daily Vehicle Count',
                body: 'Key junctions see 20,000–35,000 vehicles per day including commercial vehicles, passenger cars and two-wheelers. A diverse consumer audience spanning local Rewari residents and intercity travelers makes every format effective.',
              },
              {
                stat: '₹₹',
                head: 'Cost-Effective vs NCR',
                body: 'Rewari offers significantly lower OOH costs than Delhi NCR while delivering comparable reach within the Haryana–Rajasthan belt. Brands that would be priced out of NCR find Rewari a high-impact, efficient alternative.',
              },
            ].map((f, i) => (
              <div key={i} className={`py-10 ${i === 0 ? 'md:pr-10' : i === 1 ? 'md:px-10' : 'md:pl-10'}`}>
                <div className="font-condensed font-black text-[64px] text-[#FFE600] leading-none tracking-[-0.03em] mb-3">{f.stat}</div>
                <div className="font-condensed font-bold text-[20px] text-white uppercase tracking-[0.03em] mb-3">{f.head}</div>
                <p className="font-sans text-[15px] text-[#666] leading-[1.65]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="font-condensed font-black text-[40px] text-white uppercase tracking-[-0.01em] leading-none">
              Frequently Asked <span className="text-[#FFE600]">Questions</span>
            </h2>
            <p className="font-sans text-[15px] text-[#666] mt-2">
              About hoarding advertising in Rewari
            </p>
          </div>

          <div className="divide-y divide-[#1E1E1E] border border-[#1E1E1E]">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-7 bg-[#111111]">
                <div className="flex items-start gap-5">
                  <span className="font-condensed font-black text-[22px] text-[#FFE600] leading-none flex-shrink-0 w-7 text-right">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-condensed font-bold text-[18px] text-white uppercase tracking-[0.02em] leading-[1.25] mb-3">
                      {faq.question}
                    </h3>
                    <p className="font-sans text-[15px] text-[#777] leading-[1.7]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#FFE600] px-10 py-14">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-condensed font-black text-[#0A0A0A] uppercase leading-none tracking-[-0.01em] mb-3"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
              Can't find the right location?
            </h2>
            <p className="font-sans text-[15px] text-black/55 max-w-[440px] leading-[1.6]">
              Tell us your requirements — locality, format, size, campaign duration — and we'll match you with the best available hoarding in Rewari within 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link href="/get-quote"
              className="font-condensed font-black text-[15px] uppercase tracking-[0.08em] px-7 py-3.5 bg-[#0A0A0A] text-[#FFE600] hover:bg-[#111] transition-colors no-underline">
              Get a Free Quote →
            </Link>
            <a
              href={`https://wa.me/918168740234?text=${encodeURIComponent("Hi, I'm looking for a hoarding in Rewari. Please help me find the right location.")}`}
              target="_blank" rel="noopener noreferrer"
              className="font-condensed font-bold text-[15px] uppercase tracking-[0.08em] px-7 py-3.5 border-2 border-[#0A0A0A]/30 hover:border-[#0A0A0A] text-[#0A0A0A] transition-colors no-underline">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
