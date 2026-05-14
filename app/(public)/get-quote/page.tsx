import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import QuoteForm from '@/components/QuoteForm'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Get a Quote — Hoarding Advertising in Rewari, Haryana',
  description: 'Request a quote for outdoor advertising in Rewari. Hoardings, unipoles, gantries and LED displays across the NH-48 corridor. Quick response within 24 hours.',
  alternates: { canonical: 'https://rewarihoardings.com/get-quote' },
  openGraph: {
    title: 'Get a Quote — Rewari Hoardings',
    description: 'Request a free quote for OOH advertising in Rewari, Haryana.',
    url: 'https://rewarihoardings.com/get-quote',
  },
}

const WA = '918168740234'

export default async function GetQuotePage() {
  const supabase = await createClient()
  const { data: localitySetting } = await supabase
    .from('rh_settings')
    .select('value')
    .eq('key', 'rewari_localities')
    .single()
  const localities: string[] = Array.isArray(localitySetting?.value)
    ? (localitySetting.value as string[])
    : []

  return (
    <>
      {/* Header */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-b-[3px] border-[#FFE600]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-start">
          {/* Left copy */}
          <div>
            <span className="inline-block bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[12px] uppercase tracking-[0.12em] px-3 py-1 mb-6">
              Free · No Commitment
            </span>
            <h1 className="font-condensed font-black text-white uppercase leading-none tracking-[-0.01em] mb-5" style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>
              Get a Quote for<br />
              <span className="text-[#FFE600]">Hoarding Advertising</span><br />
              in Rewari
            </h1>
            <p className="font-sans text-[16px] text-[#777] leading-[1.65] max-w-[500px] mb-10">
              Tell us your campaign requirements — location, format and duration — and we'll send you the best available options with rates within 24 hours.
            </p>

            {/* Trust points */}
            <div className="space-y-4 mb-10">
              {[
                { icon: '⚡', text: 'Response within 24 hours, usually faster' },
                { icon: '📍', text: '15+ high-visibility locations across Rewari' },
                { icon: '🏷️', text: 'Competitive rates — no hidden charges' },
                { icon: '📞', text: 'Direct WhatsApp communication, no middlemen' },
              ].map(p => (
                <div key={p.text} className="flex items-start gap-3">
                  <span className="text-[18px] leading-none mt-0.5">{p.icon}</span>
                  <p className="font-sans text-[15px] text-[#888] leading-[1.5]">{p.text}</p>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp */}
            <div className="bg-[#111] border border-[#2A2A2A] p-5">
              <p className="font-condensed font-bold text-[11px] text-[#555] uppercase tracking-[0.1em] mb-1">
                Prefer to chat directly?
              </p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi, I'd like to enquire about hoarding advertising in Rewari. Please share available options.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-condensed font-black text-[20px] text-[#25D366] uppercase tracking-[0.03em] no-underline hover:opacity-80 transition-opacity"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                +91 81687 40234
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <QuoteForm localities={localities} />
          </div>
        </div>
      </section>

      {/* Format grid */}
      <section className="bg-[#141414] px-10 py-14 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-condensed font-bold text-[22px] text-white uppercase tracking-[0.03em] mb-8">
            We Have Inventory Across These <span className="text-[#FFE600]">Formats</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
            {[
              { slug: 'unipole', name: 'Unipole', desc: 'Single-pole billboard' },
              { slug: 'gantry', name: 'Gantry', desc: 'Overhead road span' },
              { slug: 'hoarding', name: 'Hoarding', desc: 'Classic billboard' },
              { slug: 'led-display', name: 'LED Display', desc: 'Digital, dynamic' },
              { slug: 'bus-shelter', name: 'Bus Shelter', desc: 'Transit panels' },
              { slug: 'wall-painting', name: 'Wall Painting', desc: 'Painted display' },
            ].map(f => (
              <a key={f.slug} href={`/type/${f.slug}`}
                className="bg-[#1a1a1a] p-6 text-center hover:bg-[#222] transition-colors no-underline block group">
                <div className="font-condensed font-bold text-[16px] text-white uppercase tracking-[0.04em] mb-1 group-hover:text-[#FFE600] transition-colors">{f.name}</div>
                <div className="font-condensed text-[12px] text-[#555] uppercase tracking-[0.06em]">{f.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
