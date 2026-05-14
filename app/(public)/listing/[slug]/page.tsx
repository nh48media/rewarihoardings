import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PhotoGallery from '@/components/listing/PhotoGallery'
import ListingCard from '@/components/listing/ListingCard'
import { fmtLabel } from '@/components/listing/ListingCard'
import ListingEnquiryForm from '@/components/listing/ListingEnquiryForm'
import ListingSchema from '@/components/seo/ListingSchema'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import FAQSchema from '@/components/seo/FAQSchema'
import type { ListingRow } from '@/types/database'

export const revalidate = 3600

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

type Props = { params: Promise<{ slug: string }> }

async function getListing(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const l = await getListing(slug)
  if (!l) return { title: 'Listing Not Found' }

  const sqft = l.size_width_ft && l.size_height_ft ? ` (${l.size_width_ft * l.size_height_ft} sqft)` : ''
  const title = l.meta_title || `${l.title} | Rewari Hoardings`
  const description = l.meta_description ||
    `Book the ${fmtLabel(l.type)}${sqft} at ${l.title} in ${l.locality}, Rewari, Haryana. High-visibility outdoor advertising location. Get a quote from Rewari Hoardings.`

  return {
    title,
    description,
    alternates: { canonical: `https://rewarihoardings.com/listing/${l.slug}` },
    openGraph: {
      title,
      description,
      url: `https://rewarihoardings.com/listing/${l.slug}`,
      images: l.cover_photo ? [{ url: l.cover_photo, alt: l.title }] : [],
      type: 'website',
    },
  }
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: l } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!l) notFound()

  // Fetch related: same locality first, supplement with same type
  const [{ data: relLocality }, { data: relType }] = await Promise.all([
    supabase.from('listings').select('*')
      .eq('locality', l.locality).eq('is_published', true).neq('id', l.id)
      .order('is_featured', { ascending: false }).limit(3),
    supabase.from('listings').select('*')
      .eq('type', l.type).eq('is_published', true).neq('id', l.id)
      .order('is_featured', { ascending: false }).limit(3),
  ])

  const seen = new Set([l.id])
  const related: ListingRow[] = []
  for (const r of [...(relLocality ?? []), ...(relType ?? [])]) {
    if (!seen.has(r.id) && related.length < 3) {
      seen.add(r.id)
      related.push(r)
    }
  }

  const sqft = l.size_width_ft && l.size_height_ft ? l.size_width_ft * l.size_height_ft : null
  const allPhotos = [...new Set([l.cover_photo, ...(l.photos ?? [])].filter(Boolean))] as string[]
  const localitySlug = slugify(l.locality)

  const AVAIL = {
    available:    { dot: 'bg-green-500',  text: 'text-green-400',  ring: 'border-green-500/25 bg-green-500/10',  label: 'Available for Booking' },
    booked:       { dot: 'bg-red-500',    text: 'text-red-400',    ring: 'border-red-500/25 bg-red-500/10',    label: 'Currently Booked' },
    'coming-soon': { dot: 'bg-amber-500', text: 'text-amber-400', ring: 'border-amber-500/25 bg-amber-500/10', label: 'Coming Soon' },
  }
  const avail = AVAIL[l.availability as keyof typeof AVAIL] ?? AVAIL.available

  const visColor = l.visibility_grade === 'high' ? 'text-green-400' : l.visibility_grade === 'medium' ? 'text-amber-400' : 'text-red-400'

  type Spec = { label: string; value: string; icon: React.ReactNode; highlight?: boolean }
  const specs: Spec[] = []

  if (l.size_width_ft && l.size_height_ft) {
    specs.push({
      label: 'Size', value: `${l.size_width_ft} × ${l.size_height_ft} ft`, highlight: true,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1" /></svg>,
    })
  }
  if (sqft) {
    specs.push({
      label: 'Total Area', value: `${sqft} sq ft`,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" /><rect x="3" y="13" width="8" height="8" /><rect x="13" y="13" width="8" height="8" /></svg>,
    })
  }
  specs.push({
    label: 'Format Type', value: fmtLabel(l.type),
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="1" /><line x1="12" y1="3" x2="12" y2="7" /><line x1="8" y1="3" x2="16" y2="3" /></svg>,
  })
  if (l.facing) {
    specs.push({
      label: 'Facing', value: l.facing,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 8l4 4-4 4M8 12h8" /></svg>,
    })
  }
  if (l.illuminated) {
    specs.push({
      label: 'Illumination', value: l.illumination_type ?? 'Yes',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>,
    })
  }
  if (l.structure_type) {
    specs.push({
      label: 'Structure', value: l.structure_type,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22" /><path d="M5 6h14M5 12h14" /></svg>,
    })
  }
  if (l.traffic_count) {
    specs.push({
      label: 'Traffic Count', value: l.traffic_count, highlight: true,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v5" /><circle cx="16" cy="17" r="3" /><circle cx="7" cy="17" r="3" /></svg>,
    })
  }
  if (l.audience_profile) {
    specs.push({
      label: 'Audience', value: l.audience_profile,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
    })
  }
  specs.push({
    label: 'Visibility Grade', value: l.visibility_grade.charAt(0).toUpperCase() + l.visibility_grade.slice(1),
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  })

  // Breadcrumbs: Home > Rewari > [Locality] > [Listing]
  const breadcrumbs = [
    { name: 'Home',        url: 'https://rewarihoardings.com' },
    { name: 'Rewari',      url: 'https://rewarihoardings.com/city/rewari' },
    { name: l.locality,    url: `https://rewarihoardings.com/locality/${localitySlug}` },
    { name: l.title,       url: `https://rewarihoardings.com/listing/${l.slug}` },
  ]

  // FAQ content (4 standard questions, adapted to this listing)
  const availAnswer = l.availability === 'available'
    ? `Yes — this ${fmtLabel(l.type)} at ${l.locality} is currently available for booking. Submit the enquiry form on this page or WhatsApp us at +91 81687 40234 to confirm and receive a rate card.`
    : l.availability === 'booked'
    ? `This location is currently booked. We maintain a waitlist and can notify you when it becomes free. WhatsApp us at +91 81687 40234 to join the queue.`
    : `This ${fmtLabel(l.type)} is coming soon. Contact us via WhatsApp at +91 81687 40234 to be notified on launch and secure early-booking priority.`

  const faqs = [
    {
      question: `What is the size of this ${fmtLabel(l.type)} in ${l.locality}?`,
      answer: sqft
        ? `This ${fmtLabel(l.type)} measures ${l.size_width_ft} × ${l.size_height_ft} feet — ${sqft} sq ft of display area.${l.facing ? ` It faces ${l.facing}.` : ''}${l.illuminated ? ` The panel is ${l.illumination_type ?? 'illuminated'} for 24-hour visibility.` : ''}${l.traffic_count ? ` Estimated traffic: ${l.traffic_count}.` : ''}`
        : `This ${fmtLabel(l.type)} is located at ${l.locality}, Rewari.${l.landmark ? ` Near ${l.landmark}.` : ''} Contact us for exact dimensions and panel specifications.`,
    },
    {
      question: `Is this advertising location currently available for booking?`,
      answer: availAnswer,
    },
    {
      question: `What is the minimum booking duration for this ${fmtLabel(l.type).toLowerCase()}?`,
      answer: `The minimum booking period is one calendar month. Three-month and six-month campaigns typically attract better rates and are recommended for brand-awareness goals, as repeated exposure builds recall significantly over time. Short-term bookings (two to four weeks) are available for event or product-launch campaigns.`,
    },
    {
      question: `How do I get a rate quote for this ${fmtLabel(l.type)} in ${l.locality}?`,
      answer: `Use the enquiry form on this page or WhatsApp us directly at +91 81687 40234. We respond within 24 hours with pricing, availability confirmation, and booking terms. No commitment is required for an initial enquiry. You can also call NH48 Media to speak directly with our team.`,
    },
  ]

  return (
    <>
      <ListingSchema
        title={l.title}
        slug={l.slug}
        typeLabel={fmtLabel(l.type)}
        locality={l.locality}
        description={l.meta_description ?? `${fmtLabel(l.type)} outdoor advertising in ${l.locality}, Rewari, Haryana.`}
        photos={allPhotos}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      {/* Breadcrumb nav: Home / Rewari / [Locality] / [Title] */}
      <div className="bg-[#0A0A0A] border-b border-[#1a1a1a] px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-condensed text-[12px] uppercase tracking-[0.08em] text-[#555] flex-wrap">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <Link href="/city/rewari" className="hover:text-white transition-colors no-underline">Rewari</Link>
          <span>/</span>
          <Link href={`/locality/${localitySlug}`} className="hover:text-white transition-colors no-underline">{l.locality}</Link>
          <span>/</span>
          <span className="text-[#888] truncate max-w-[240px]">{l.title}</span>
        </div>
      </div>

      <main className="bg-[#0A0A0A] px-10 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Title block */}
            <div className="mb-7">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[12px] uppercase tracking-[0.1em] px-3 py-1">
                  {fmtLabel(l.type)}
                </span>
                <span className={`flex items-center gap-1.5 font-condensed font-bold text-[12px] uppercase tracking-[0.08em] px-3 py-1 border ${avail.ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${avail.dot}`} />
                  <span className={avail.text}>{avail.label}</span>
                </span>
                {l.is_featured && (
                  <span className="border border-[#FFE600]/50 text-[#FFE600] font-condensed font-bold text-[11px] uppercase tracking-[0.08em] px-3 py-1">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="font-condensed font-black text-white uppercase tracking-[-0.01em] leading-none mb-3"
                style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
                {l.title}
              </h1>
              <div className="flex items-center gap-1.5 text-[#666] font-condensed font-medium text-[14px] uppercase tracking-[0.05em]">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {l.locality} · {l.city}, Haryana
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="mb-8">
              <PhotoGallery photos={allPhotos} title={l.title} />
            </div>

            {/* Key Specifications */}
            <section className="mb-8">
              <h2 className="font-condensed font-bold text-[12px] text-[#FFE600] uppercase tracking-[0.15em] mb-4">
                Key Specifications
              </h2>
              <dl className="grid grid-cols-2 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
                {specs.map(spec => (
                  <div key={spec.label} className="flex items-start gap-3 bg-[#111111] p-4">
                    <div className="text-[#FFE600] mt-0.5 flex-shrink-0">{spec.icon}</div>
                    <div className="min-w-0">
                      <dt className="font-condensed text-[11px] font-bold text-[#555] uppercase tracking-[0.1em] mb-0.5">
                        {spec.label}
                      </dt>
                      <dd className={`font-condensed font-bold text-[16px] uppercase tracking-[0.02em] leading-tight ${
                        spec.highlight ? 'text-white' : spec.label === 'Visibility Grade' ? visColor : 'text-[#ccc]'
                      }`}>
                        {spec.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            {/* Location Details */}
            <section className="bg-[#111111] border border-[#1a1a1a] p-6 mb-6">
              <h2 className="font-condensed font-bold text-[12px] text-[#FFE600] uppercase tracking-[0.15em] mb-5">
                Location Details
              </h2>
              <dl className="space-y-3.5">
                {([
                  ['Locality', l.locality],
                  ['City', l.city],
                  l.landmark    ? ['Landmark', l.landmark]       : null,
                  l.address_full ? ['Address', l.address_full]   : null,
                ] as ([string, string] | null)[])
                  .filter((x): x is [string, string] => x !== null)
                  .map(([label, value]) => (
                    <div key={label} className="flex gap-3">
                      <dt className="font-condensed text-[11px] font-bold text-[#555] uppercase tracking-[0.1em] w-24 flex-shrink-0 mt-0.5">
                        {label}
                      </dt>
                      <dd className="font-condensed font-semibold text-[14px] text-[#ccc] uppercase tracking-[0.02em]">
                        {value}
                      </dd>
                    </div>
                  ))}
              </dl>
            </section>

            {/* Cross-links */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Link href={`/locality/${localitySlug}`}
                className="inline-flex items-center gap-2 border border-[#2A2A2A] hover:border-[#FFE600]/60 hover:bg-[#111] px-4 py-2.5 no-underline transition-colors group">
                <svg className="w-3.5 h-3.5 text-[#FFE600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span className="font-condensed font-semibold text-[13px] text-[#666] group-hover:text-white uppercase tracking-[0.06em] transition-colors">
                  All hoardings in {l.locality}
                </span>
                <span className="font-condensed text-[12px] text-[#444] group-hover:text-[#FFE600] transition-colors">→</span>
              </Link>
              <Link href={`/type/${l.type}`}
                className="inline-flex items-center gap-2 border border-[#2A2A2A] hover:border-[#FFE600]/60 hover:bg-[#111] px-4 py-2.5 no-underline transition-colors group">
                <svg className="w-3.5 h-3.5 text-[#FFE600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="7" width="18" height="13" rx="1" /><line x1="12" y1="3" x2="12" y2="7" /><line x1="8" y1="3" x2="16" y2="3" />
                </svg>
                <span className="font-condensed font-semibold text-[13px] text-[#666] group-hover:text-white uppercase tracking-[0.06em] transition-colors">
                  All {fmtLabel(l.type)} in Rewari
                </span>
                <span className="font-condensed text-[12px] text-[#444] group-hover:text-[#FFE600] transition-colors">→</span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ── */}
          <div className="lg:sticky lg:top-[84px] lg:self-start space-y-3">
            {(sqft || l.illumination_type) && (
              <div className="bg-[#141414] border border-[#2A2A2A] px-4 py-3 flex flex-wrap gap-x-5 gap-y-2">
                {sqft && (
                  <div>
                    <p className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.1em] mb-0.5">Size</p>
                    <p className="font-condensed font-black text-[18px] text-[#FFE600] leading-none">
                      {l.size_width_ft} × {l.size_height_ft} ft
                    </p>
                  </div>
                )}
                {sqft && (
                  <div>
                    <p className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.1em] mb-0.5">Area</p>
                    <p className="font-condensed font-black text-[18px] text-white leading-none">{sqft} sqft</p>
                  </div>
                )}
                {l.illumination_type && (
                  <div>
                    <p className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.1em] mb-0.5">Light</p>
                    <p className="font-condensed font-black text-[18px] text-white leading-none">{l.illumination_type}</p>
                  </div>
                )}
              </div>
            )}
            <ListingEnquiryForm listing={{ id: l.id, slug: l.slug, title: l.title }} />
          </div>
        </div>
      </main>

      {/* ── Related Listings ── */}
      {related.length > 0 && (
        <section className="bg-[#0F0F0F] px-10 py-14 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="font-condensed font-black text-white uppercase text-[24px] tracking-[0.02em] leading-none mb-1">
                  Related Locations
                </h2>
                <p className="font-sans text-[13px] text-[#555]">
                  Other advertising spaces near {l.locality} or similar {fmtLabel(l.type)} formats.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/locality/${localitySlug}`}
                  className="font-condensed font-semibold text-[12px] text-[#666] uppercase tracking-[0.08em] border border-[#2A2A2A] px-3 py-2 hover:border-[#FFE600]/50 hover:text-[#FFE600] transition-colors no-underline">
                  More in {l.locality}
                </Link>
                <Link href="/city/rewari"
                  className="font-condensed font-semibold text-[12px] text-[#666] uppercase tracking-[0.08em] border border-[#2A2A2A] px-3 py-2 hover:border-[#FFE600]/50 hover:text-[#FFE600] transition-colors no-underline">
                  All Rewari
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
              {related.map(r => <ListingCard key={r.id} l={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-t border-[#2A2A2A]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-condensed font-black text-white uppercase text-[26px] tracking-[0.02em] mb-2">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-[14px] text-[#555] mb-12">
            About booking this {fmtLabel(l.type)} in {l.locality}, Rewari.
          </p>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-t border-[#1E1E1E] py-8">
                <div className="flex gap-5">
                  <span className="font-condensed font-black text-[#FFE600] text-[26px] leading-none flex-shrink-0 mt-0.5 w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-condensed font-bold text-white text-[16px] uppercase tracking-[0.03em] leading-[1.3] mb-3">
                      {faq.question}
                    </h3>
                    <p className="font-sans text-[14px] text-[#666] leading-[1.7]">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-[#1E1E1E]" />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#FFE600] px-10 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="font-condensed font-black text-[#0A0A0A] uppercase text-[26px] leading-none tracking-[-0.01em] mb-2">
              Ready to book this space?
            </h2>
            <p className="font-sans text-[#333] text-[14px]">
              Get a rate card and availability confirmation within 24 hours. No commitment required.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a href={`https://wa.me/918168740234?text=${encodeURIComponent(`Hi, I'm interested in booking: ${l.title}. Please share availability and rates.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-block bg-[#0A0A0A] text-[#FFE600] font-condensed font-black text-[14px] uppercase tracking-[0.08em] px-7 py-3.5 no-underline hover:bg-[#111] transition-colors">
              WhatsApp Now
            </a>
            <Link href="/city/rewari"
              className="inline-block border-2 border-[#0A0A0A] text-[#0A0A0A] font-condensed font-bold text-[14px] uppercase tracking-[0.08em] px-7 py-3.5 no-underline hover:bg-[#0A0A0A] hover:text-[#FFE600] transition-colors">
              Browse All Inventory
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
