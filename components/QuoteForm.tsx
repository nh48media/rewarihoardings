'use client'

import { useState } from 'react'

const WA = '918168740234'

export default function QuoteForm({ localities }: { localities: string[] }) {
  const [form, setForm] = useState({ name: '', phone: '', company: '', location: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function set(field: keyof typeof form, val: string) {
    setForm(f => ({ ...f, [field]: val }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const fullMessage = [form.location && `Location preference: ${form.location}`, form.message].filter(Boolean).join('. ')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, company: form.company || undefined, message: fullMessage || undefined }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm({ name: '', phone: '', company: '', location: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputCls = 'w-full bg-[#141414] border border-[#2A2A2A] text-white font-sans text-sm px-3.5 py-2.5 outline-none focus:border-[#FFE600] transition-colors placeholder:text-[#444]'
  const labelCls = 'block font-condensed text-[11px] font-bold uppercase tracking-[0.12em] text-[#555] mb-1.5'

  if (status === 'success') {
    return (
      <div className="bg-[#0A0A0A] p-8 flex flex-col items-center justify-center text-center min-h-[380px]">
        <div className="w-16 h-16 bg-[#FFE600] flex items-center justify-center font-condensed font-black text-3xl text-[#0A0A0A] mb-5">✓</div>
        <p className="font-condensed font-bold text-xl text-white uppercase tracking-wide mb-2">Enquiry Sent!</p>
        <p className="font-sans text-sm text-[#666] mb-6">We'll get back to you within 24 hours.</p>
        <button onClick={() => setStatus('idle')} className="font-condensed text-sm text-[#FFE600] uppercase tracking-wider underline">
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-[#0A0A0A] p-8">
      <p className="font-condensed font-black text-2xl text-white uppercase tracking-[0.04em] mb-6">Get a Quick Quote</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelCls}>Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone *</label>
          <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
        </div>
      </div>
      <div className="mb-3">
        <label className={labelCls}>Company / Brand</label>
        <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Optional" className={inputCls} />
      </div>
      <div className="mb-3">
        <label className={labelCls}>Location Preference</label>
        <select value={form.location} onChange={e => set('location', e.target.value)} className={`${inputCls} appearance-none bg-[#141414]`}>
          <option value="">Any location in Rewari</option>
          {localities.map(l => <option key={l} value={l}>{l}</option>)}
          <option value="Other / Flexible">Other / Flexible</option>
        </select>
      </div>
      <div className="mb-4">
        <label className={labelCls}>Message</label>
        <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={3}
          placeholder="Campaign objective, duration, or specific requirements…"
          className={`${inputCls} resize-none`} />
      </div>
      {status === 'error' && (
        <p className="font-condensed text-red-400 text-sm mb-3">Something went wrong. Please try again.</p>
      )}
      <button type="submit" disabled={status === 'loading'}
        className="w-full bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-base uppercase tracking-[0.1em] py-3.5 hover:bg-yellow-300 transition-colors disabled:opacity-50">
        {status === 'loading' ? 'Sending…' : 'Send Enquiry →'}
      </button>
      <p className="text-center mt-3.5 font-condensed text-[13px] text-[#444] uppercase tracking-[0.05em]">
        Prefer to chat?{' '}
        <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold">
          WhatsApp us directly
        </a>
      </p>
    </form>
  )
}
