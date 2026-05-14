'use client'

import { useState } from 'react'

const WA = '918168740234'

type Listing = { id: string; slug: string; title: string }

export default function ListingEnquiryForm({ listing }: { listing: Listing }) {
  const defaultMsg = `Hi, I'm interested in the hoarding: ${listing.title}. Please share availability and rates.`

  const [form, setForm] = useState({ name: '', phone: '', company: '', message: defaultMsg })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function set(field: keyof typeof form, val: string) {
    setForm(f => ({ ...f, [field]: val }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          company: form.company || undefined,
          message: form.message || undefined,
          listing_id: listing.id,
          listing_slug: listing.slug,
          listing_title: listing.title,
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const waMsg = encodeURIComponent(`Hi, I'm interested in the hoarding: ${listing.title}. Please share availability and rates.`)

  const inputCls = 'w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white font-sans text-sm px-3.5 py-2.5 outline-none focus:border-[#FFE600] transition-colors placeholder:text-[#444]'
  const labelCls = 'block font-condensed text-[11px] font-bold uppercase tracking-[0.12em] text-[#555] mb-1.5'

  if (status === 'success') {
    return (
      <div className="bg-[#111111] border border-[#1E1E1E] p-6 flex flex-col items-center justify-center text-center min-h-[280px]">
        <div className="w-14 h-14 bg-[#FFE600] flex items-center justify-center font-condensed font-black text-2xl text-[#0A0A0A] mb-4">✓</div>
        <p className="font-condensed font-bold text-lg text-white uppercase tracking-wide mb-1">Enquiry Sent!</p>
        <p className="font-sans text-sm text-[#666] mb-5">We'll respond within 24 hours.</p>
        <button onClick={() => setStatus('idle')} className="font-condensed text-sm text-[#FFE600] uppercase tracking-wider underline">
          Send another
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-[#1E1E1E]">
      <div className="px-6 pt-6 pb-0">
        <h2 className="font-condensed font-black text-[20px] text-white uppercase tracking-[0.04em] mb-1">Quick Enquiry</h2>
        <p className="font-sans text-[13px] text-[#555] mb-5">No commitment — we'll share details within 24h</p>
      </div>
      <form onSubmit={submit} className="px-6 pb-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Name *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone *</label>
            <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Company / Brand</label>
          <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Optional" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Message</label>
          <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={3}
            className={`${inputCls} resize-none`} />
        </div>
        {status === 'error' && (
          <p className="font-condensed text-red-400 text-[13px]">Something went wrong. Please try again.</p>
        )}
        <button type="submit" disabled={status === 'loading'}
          className="w-full bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[15px] uppercase tracking-[0.1em] py-3 hover:bg-yellow-300 transition-colors disabled:opacity-50">
          {status === 'loading' ? 'Sending…' : 'Send Enquiry →'}
        </button>
      </form>

      <div className="border-t border-[#1E1E1E] px-6 py-4">
        <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] font-condensed font-bold text-[14px] uppercase tracking-[0.08em] py-3 hover:bg-[#25D366]/20 transition-colors no-underline">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>

      <div className="px-6 pb-4 flex items-center justify-center gap-1.5 text-[#444] font-condensed text-[11px] uppercase tracking-wider">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
        </svg>
        Response within 24 hours
      </div>
    </div>
  )
}
