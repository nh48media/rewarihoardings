import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Rewari Hoardings — OOH Advertising Marketplace',
  description: 'Rewari Hoardings is Rewari\'s dedicated outdoor advertising marketplace managed by NH48 Media. Browse hoardings, unipoles, gantries and LED displays on the NH-48 corridor.',
  alternates: { canonical: 'https://rewarihoardings.com/about' },
}

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[12px] uppercase tracking-[0.12em] px-3 py-1 mb-5">
            About Us
          </div>
          <h1 className="font-condensed font-black text-white uppercase leading-none tracking-[-0.01em] mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            About <span className="text-[#FFE600]">Rewari Hoardings</span>
          </h1>
          <p className="font-sans text-[17px] text-[#777] leading-[1.65] max-w-[600px]">
            Rewari's dedicated outdoor advertising marketplace — making it easy to find and book the right hoarding for your campaign.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#141414] px-10 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 items-start">
          <div className="space-y-10">

            {/* Who we are */}
            <div>
              <h2 className="font-condensed font-black text-[28px] text-white uppercase tracking-[0.02em] mb-4">
                Who We Are
              </h2>
              <div className="space-y-4 font-sans text-[16px] text-[#888] leading-[1.7]">
                <p>
                  Rewari Hoardings is a dedicated OOH (outdoor advertising) inventory marketplace for Rewari, Haryana. We catalogue and manage hoarding locations across every key junction, arterial road and commercial zone in Rewari — from the NH-48 entry point to Sadar Bazar, Delhi Road, and beyond.
                </p>
                <p>
                  We're managed by <a href="https://nh48media.com" className="text-[#FFE600] no-underline hover:underline">NH48 Media</a>, an outdoor media company operating along the Delhi–Jaipur NH-48 corridor. Our knowledge of Rewari's traffic patterns, audience profiles and hoarding infrastructure means advertisers get accurate, up-to-date inventory — not guesswork.
                </p>
              </div>
            </div>

            {/* What we do */}
            <div>
              <h2 className="font-condensed font-black text-[28px] text-white uppercase tracking-[0.02em] mb-4">
                What We Do
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
                {[
                  { title: 'Inventory Listing', desc: 'We maintain a live catalogue of hoarding locations in Rewari — unipoles, gantries, rooftop hoardings, LED displays and more.' },
                  { title: 'Availability Tracking', desc: 'Each listing shows real-time availability status so you know which locations are bookable right now.' },
                  { title: 'Quote Service', desc: 'No pricing confusion. Submit an enquiry and we respond with a direct quote within 24 hours.' },
                  { title: 'Campaign Support', desc: 'We assist with creative printing, mounting, and monitoring throughout your campaign duration.' },
                ].map(item => (
                  <div key={item.title} className="bg-[#1a1a1a] p-6">
                    <h3 className="font-condensed font-bold text-[16px] text-white uppercase tracking-[0.04em] mb-2">{item.title}</h3>
                    <p className="font-sans text-[14px] text-[#666] leading-[1.65]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Rewari */}
            <div>
              <h2 className="font-condensed font-black text-[28px] text-white uppercase tracking-[0.02em] mb-4">
                Why Rewari?
              </h2>
              <div className="space-y-4 font-sans text-[16px] text-[#888] leading-[1.7]">
                <p>
                  Rewari is a gateway city on NH-48 — the Delhi–Jaipur–Mumbai national highway. Every vehicle traveling between Delhi and Rajasthan passes through Rewari, giving outdoor advertising here unmatched intercity traffic exposure with a captive, mid-journey audience.
                </p>
                <p>
                  With a growing industrial base (Maruti Suzuki plant, Honda Motorcycles), a large daily commuter population, and significantly lower OOH costs compared to NCR, Rewari represents an exceptional value opportunity for brands targeting Haryana, Rajasthan and the NCR periphery.
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact card */}
            <div className="bg-[#111] border border-[#2A2A2A] p-6">
              <p className="font-condensed font-bold text-[12px] text-[#FFE600] uppercase tracking-[0.15em] mb-4">
                Get in Touch
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mb-1">WhatsApp</p>
                  <a href="https://wa.me/918168740234" target="_blank" rel="noopener noreferrer"
                    className="font-condensed font-bold text-[18px] text-[#25D366] no-underline hover:opacity-80 transition-opacity">
                    +91 81687 40234
                  </a>
                </div>
                <div className="h-px bg-[#2A2A2A]" />
                <div>
                  <p className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mb-1">Location</p>
                  <p className="font-condensed font-semibold text-[14px] text-[#ccc]">Rewari, Haryana — 123401</p>
                </div>
                <div className="h-px bg-[#2A2A2A]" />
                <div>
                  <p className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mb-1">Managed by</p>
                  <a href="https://nh48media.com" target="_blank" rel="noopener noreferrer"
                    className="font-condensed font-semibold text-[14px] text-[#FFE600] no-underline hover:underline">
                    NH48 Media →
                  </a>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[#111] border border-[#2A2A2A] p-6 space-y-5">
              {[
                { num: 'NH-48', label: 'Corridor Coverage' },
                { num: '15+', label: 'Key Localities' },
                { num: '6+', label: 'Format Types' },
                { num: '24h', label: 'Quote Response' },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-condensed font-black text-[32px] text-[#FFE600] leading-none">{s.num}</div>
                  <div className="font-condensed text-[12px] text-[#555] uppercase tracking-[0.1em] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href="/get-quote"
              className="flex items-center justify-center w-full bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[15px] uppercase tracking-[0.1em] py-4 hover:bg-yellow-300 transition-colors no-underline">
              Get a Quote →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
