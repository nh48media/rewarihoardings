'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  settings: Record<string, unknown>
}

export default function SettingsForm({ settings }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [revalidating, setRevalidating] = useState(false)

  const [form, setForm] = useState({
    contact_whatsapp:   String(settings.contact_whatsapp ?? '918168740234'),
    contact_email:      String(settings.contact_email ?? ''),
    enquiry_email_bcc:  String(settings.enquiry_email_bcc ?? ''),
    site_tagline:       String(settings.site_tagline ?? ''),
    homepage_hero_text: String(settings.homepage_hero_text ?? ''),
    ga4_measurement_id: String(settings.ga4_measurement_id ?? ''),
  })

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()

    const updates = Object.entries(form).map(([key, value]) =>
      supabase.from('rh_settings').upsert({ key, value: JSON.stringify(value) })
    )
    await Promise.all(updates)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    startTransition(() => router.refresh())
  }

  async function handleRevalidate(path?: string) {
    setRevalidating(true)
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
        ...(path ? {} : {}),
      }),
    })
    setRevalidating(false)
    alert(path ? `Revalidated ${path}` : 'All pages revalidated')
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Contact */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          Contact
        </h2>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">
            WhatsApp Number <span className="text-gray-600 normal-case">(digits only, include country code)</span>
          </label>
          <input value={form.contact_whatsapp} onChange={e => set('contact_whatsapp', e.target.value)}
            placeholder="918168740234"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Contact Email</label>
          <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)}
            placeholder="info@rewarihoardings.com"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">BCC Email for Leads</label>
          <input type="email" value={form.enquiry_email_bcc} onChange={e => set('enquiry_email_bcc', e.target.value)}
            placeholder="love@nh48media.com"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>
      </section>

      {/* Site Copy */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          Site Copy
        </h2>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Site Tagline</label>
          <input value={form.site_tagline} onChange={e => set('site_tagline', e.target.value)}
            placeholder="Rewari's #1 Hoarding Inventory Marketplace"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Homepage Hero Text</label>
          <input value={form.homepage_hero_text} onChange={e => set('homepage_hero_text', e.target.value)}
            placeholder="Find the Perfect Hoarding in Rewari"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>
      </section>

      {/* Analytics */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          SEO & Analytics
        </h2>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">GA4 Measurement ID</label>
          <input value={form.ga4_measurement_id} onChange={e => set('ga4_measurement_id', e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>
      </section>

      {/* ISR */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          On-Demand Revalidation
        </h2>
        <p className="text-gray-500 text-sm">Force Next.js to regenerate cached pages immediately.</p>
        <div className="flex gap-3">
          <button onClick={() => handleRevalidate()} disabled={revalidating}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 font-condensed px-4 py-2.5 rounded-lg text-sm hover:bg-[#222] transition-colors disabled:opacity-50">
            {revalidating ? 'Revalidating…' : 'Revalidate All Pages'}
          </button>
          <button onClick={() => handleRevalidate('/city/rewari')} disabled={revalidating}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 font-condensed px-4 py-2.5 rounded-lg text-sm hover:bg-[#222] transition-colors disabled:opacity-50">
            Revalidate /city/rewari
          </button>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 text-sm">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
        {saved && <p className="text-green-400 text-sm font-condensed">Saved ✓</p>}
      </div>
    </div>
  )
}
