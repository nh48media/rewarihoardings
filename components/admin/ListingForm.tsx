'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { ListingRow } from '@/types/database'

type FormData = {
  title: string
  slug: string
  type: string
  city: string
  locality: string
  landmark: string
  address_full: string
  latitude: string
  longitude: string
  size_width_ft: string
  size_height_ft: string
  facing: string
  structure_type: string
  illuminated: boolean
  illumination_type: string
  visibility_grade: string
  traffic_count: string
  audience_profile: string
  availability: string
  is_featured: boolean
  is_published: boolean
  notes_internal: string
  meta_title: string
  meta_description: string
}

const DEFAULT_FORM: FormData = {
  title: '', slug: '', type: '', city: 'Rewari',
  locality: '', landmark: '', address_full: '',
  latitude: '', longitude: '',
  size_width_ft: '', size_height_ft: '',
  facing: '', structure_type: '',
  illuminated: false, illumination_type: '',
  visibility_grade: 'high',
  traffic_count: '', audience_profile: '',
  availability: 'available',
  is_featured: false, is_published: false,
  notes_internal: '',
  meta_title: '', meta_description: '',
}

const LISTING_TYPES = [
  'unipole','gantry','hoarding','rooftop-hoarding','wall-painting','construction-hoarding',
  'led-display','led-video-wall','digital-kiosk',
  'bus-shelter','pole-kiosk','traffic-booth','toll-naka','road-divider','footpath-kiosk',
  'auto-rickshaw','e-rickshaw','bus-branding','mobile-van','tractor-branding',
  'society-gate','school-college-gate','market-gate','hospital-branding','petrol-pump',
  'dhaba-restaurant','no-parking-board','atm-branding',
  'pamphlet-distribution','newspaper-insert','newspaper-ad','flex-banner','poster',
  'railway-station','cinema-advertising','look-walker','exhibition-stall','water-tank',
]

// Localities are fetched from DB — see props

const FACINGS = ['North','South','East','West','NH-48 Inbound','NH-48 Outbound','Both Sides']
const STRUCTURES = ['Ground-mounted','Rooftop','Bridge-mounted','Wall','Gantry span']
const ILLUM_TYPES = ['Frontlit','Backlit','LED','Neon']

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function autoMetaTitle(f: FormData) {
  if (!f.type || !f.locality) return ''
  const size = f.size_width_ft && f.size_height_ft ? ` | ${f.size_width_ft}×${f.size_height_ft} ft` : ''
  return `${f.type.charAt(0).toUpperCase() + f.type.slice(1)} at ${f.locality}, Rewari${size} | Rewari Hoardings`
}

function autoMetaDesc(f: FormData) {
  if (!f.type || !f.locality) return ''
  const size = f.size_width_ft && f.size_height_ft ? `${f.size_width_ft}×${f.size_height_ft} ft ` : ''
  const traffic = f.traffic_count ? ` ${f.traffic_count}.` : ''
  return `Book a ${size}${f.type} at ${f.landmark || f.locality}, ${f.locality}, Rewari.${traffic} Get quote: +91 8168740234.`
}

interface Props {
  existing?: ListingRow
  localities?: string[]
}

const FALLBACK_LOCALITIES = [
  'NH-48 Entry Point','Delhi Road','Sadar Bazar','Rewari Bus Stand','Rewari Railway Station',
  'Subhash Nagar','Model Town','Gurudwara Chowk','New Grain Market','Majra Chowk',
  'Jat College Road','Circular Road','Dharan Road','Rewari Industrial Area','Kosli Road',
]

export default function ListingForm({ existing, localities: localitiesProp }: Props) {
  const localities = localitiesProp && localitiesProp.length > 0 ? localitiesProp : FALLBACK_LOCALITIES
  const router = useRouter()
  const [, startTransition] = useTransition()
  const isEdit = !!existing

  const [form, setForm] = useState<FormData>(() => {
    if (!existing) return DEFAULT_FORM
    return {
      title: existing.title,
      slug: existing.slug,
      type: existing.type,
      city: existing.city,
      locality: existing.locality,
      landmark: existing.landmark ?? '',
      address_full: existing.address_full ?? '',
      latitude: existing.latitude?.toString() ?? '',
      longitude: existing.longitude?.toString() ?? '',
      size_width_ft: existing.size_width_ft?.toString() ?? '',
      size_height_ft: existing.size_height_ft?.toString() ?? '',
      facing: existing.facing ?? '',
      structure_type: existing.structure_type ?? '',
      illuminated: existing.illuminated,
      illumination_type: existing.illumination_type ?? '',
      visibility_grade: existing.visibility_grade,
      traffic_count: existing.traffic_count ?? '',
      audience_profile: existing.audience_profile ?? '',
      availability: existing.availability,
      is_featured: existing.is_featured,
      is_published: existing.is_published,
      notes_internal: existing.notes_internal ?? '',
      meta_title: existing.meta_title ?? '',
      meta_description: existing.meta_description ?? '',
    }
  })

  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? [])
  const [coverPhoto, setCoverPhoto] = useState<string>(existing?.cover_photo ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugManual, setSlugManual] = useState(isEdit)

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm(f => ({ ...f, slug: slugify(f.title) + '-rewari' }))
    }
  }, [form.title, slugManual])

  // Auto meta from form data
  useEffect(() => {
    setForm(f => ({
      ...f,
      meta_title: autoMetaTitle(f),
      meta_description: autoMetaDesc(f),
    }))
  }, [form.type, form.locality, form.landmark, form.size_width_ft, form.size_height_ft, form.traffic_count])

  function set(field: keyof FormData, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function uploadPhotos(files: FileList) {
    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      const path = `${form.slug || 'listing'}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { data, error } = await supabase.storage.from('hoarding-photos').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('hoarding-photos').getPublicUrl(data.path)
        uploaded.push(urlData.publicUrl)
      }
    }

    setPhotos(prev => {
      const next = [...prev, ...uploaded]
      if (!coverPhoto && next.length > 0) setCoverPhoto(next[0])
      return next
    })
    setUploading(false)
  }

  async function deletePhoto(url: string) {
    // Remove from state
    setPhotos(prev => prev.filter(p => p !== url))
    if (coverPhoto === url) setCoverPhoto(photos.find(p => p !== url) ?? '')
  }

  async function handleSave(publish: boolean) {
    setSaving(true)
    setError('')

    if (!form.title || !form.slug || !form.type || !form.locality) {
      setError('Title, slug, type and locality are required.')
      setSaving(false)
      return
    }

    const supabase = createClient()
    const payload = {
      title: form.title,
      slug: form.slug,
      type: form.type as import('@/types/database').ListingFormat,
      city: form.city,
      locality: form.locality,
      landmark: form.landmark || null,
      address_full: form.address_full || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      size_width_ft: form.size_width_ft ? parseFloat(form.size_width_ft) : null,
      size_height_ft: form.size_height_ft ? parseFloat(form.size_height_ft) : null,
      facing: form.facing || null,
      structure_type: form.structure_type || null,
      illuminated: form.illuminated,
      illumination_type: form.illuminated ? form.illumination_type || null : null,
      visibility_grade: form.visibility_grade as 'high' | 'medium' | 'low',
      traffic_count: form.traffic_count || null,
      audience_profile: form.audience_profile || null,
      availability: form.availability as 'available' | 'booked' | 'coming-soon',
      is_featured: form.is_featured,
      is_published: publish,
      notes_internal: form.notes_internal || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      photos,
      cover_photo: coverPhoto || null,
    }

    let result
    if (isEdit && existing) {
      result = await supabase.from('listings').update(payload).eq('id', existing.id)
    } else {
      result = await supabase.from('listings').insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    // Trigger ISR revalidation
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
        slug: form.slug,
        type: form.type,
        locality: form.locality,
      }),
    }).catch(() => {})

    startTransition(() => router.push('/admin/listings'))
    router.refresh()
  }

  const sqft = form.size_width_ft && form.size_height_ft
    ? (parseFloat(form.size_width_ft) * parseFloat(form.size_height_ft)).toFixed(0)
    : null

  return (
    <div className="max-w-3xl space-y-8 pb-32">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Section 1 — Identity */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          1. Identity
        </h2>

        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="e.g. Premium Unipole — NH-48 Entry Point, Rewari"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>

        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Slug *</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm shrink-0">rewarihoardings.com/listing/</span>
            <input value={form.slug}
              onChange={e => { setSlugManual(true); set('slug', slugify(e.target.value)) }}
              placeholder="auto-generated"
              className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Format Type *</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors">
              <option value="">Select type…</option>
              {LISTING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Locality *</label>
            <select value={form.locality} onChange={e => set('locality', e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors">
              <option value="">Select locality…</option>
              {localities.map((l: string) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Landmark</label>
          <input value={form.landmark} onChange={e => set('landmark', e.target.value)}
            placeholder="e.g. Near Rewari Toll Plaza"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>

        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Full Address</label>
          <textarea value={form.address_full} onChange={e => set('address_full', e.target.value)}
            rows={2} placeholder="Full address…"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Latitude</label>
            <input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)}
              placeholder="28.1234"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Longitude</label>
            <input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)}
              placeholder="76.6189"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
          </div>
        </div>
      </section>

      {/* Section 2 — Physical Specs */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          2. Physical Specs
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Width (ft)</label>
            <input type="number" step="0.5" value={form.size_width_ft} onChange={e => set('size_width_ft', e.target.value)}
              placeholder="40"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Height (ft)</label>
            <input type="number" step="0.5" value={form.size_height_ft} onChange={e => set('size_height_ft', e.target.value)}
              placeholder="20"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Area</label>
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] text-gray-400 px-3 py-2.5 rounded-lg text-sm">
              {sqft ? `${sqft} sq ft` : '—'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Facing</label>
            <select value={form.facing} onChange={e => set('facing', e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors">
              <option value="">Select facing…</option>
              {FACINGS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Structure Type</label>
            <select value={form.structure_type} onChange={e => set('structure_type', e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors">
              <option value="">Select structure…</option>
              {STRUCTURES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <button type="button" onClick={() => set('illuminated', !form.illuminated)}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.illuminated ? 'bg-[#FFE600]' : 'bg-[#2a2a2a]'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.illuminated ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-gray-400 text-sm font-condensed">Illuminated</span>
          </label>

          {form.illuminated && (
            <select value={form.illumination_type} onChange={e => set('illumination_type', e.target.value)}
              className="bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors">
              <option value="">Illumination type…</option>
              {ILLUM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>

        <div>
          <label className="block text-gray-400 text-xs mb-2 font-condensed uppercase tracking-wider">Visibility Grade</label>
          <div className="flex gap-3">
            {(['high','medium','low'] as const).map(v => (
              <button key={v} type="button" onClick={() => set('visibility_grade', v)}
                className={`px-4 py-2 rounded-lg text-sm font-condensed transition-colors ${
                  form.visibility_grade === v
                    ? 'bg-[#FFE600] text-[#0A0A0A] font-bold'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]'
                }`}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Audience */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          3. Audience Data
        </h2>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Traffic Count</label>
          <input value={form.traffic_count} onChange={e => set('traffic_count', e.target.value)}
            placeholder="e.g. ~25,000 vehicles/day"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">Audience Profile</label>
          <textarea value={form.audience_profile} onChange={e => set('audience_profile', e.target.value)}
            rows={3} placeholder="Describe the audience — commuters, shoppers, highway traffic…"
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors resize-none" />
        </div>
      </section>

      {/* Section 4 — Photos */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          4. Photos
        </h2>

        {/* Upload zone */}
        <label className="block">
          <input type="file" accept="image/jpeg,image/webp,image/png" multiple className="sr-only"
            onChange={e => e.target.files && uploadPhotos(e.target.files)} />
          <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            uploading ? 'border-[#FFE600]/50 bg-[#FFE600]/5' : 'border-[#2a2a2a] hover:border-[#FFE600]/50 hover:bg-[#FFE600]/5'
          }`}>
            {uploading ? (
              <p className="text-[#FFE600] text-sm font-condensed">Uploading…</p>
            ) : (
              <>
                <p className="text-gray-400 text-sm">Drag & drop photos or <span className="text-[#FFE600]">click to browse</span></p>
                <p className="text-gray-600 text-xs mt-1">JPG, WEBP, PNG · Max 5MB each</p>
              </>
            )}
          </div>
        </label>

        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {photos.map(url => (
              <div key={url} className="relative group aspect-square rounded-lg overflow-hidden bg-[#1a1a1a]">
                <Image src={url} alt="" fill className="object-cover" sizes="150px" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button type="button" onClick={() => setCoverPhoto(url)}
                    className={`text-xs px-2 py-1 rounded font-condensed ${
                      coverPhoto === url ? 'bg-[#FFE600] text-[#0A0A0A]' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}>
                    {coverPhoto === url ? '★ Cover' : 'Set Cover'}
                  </button>
                  <button type="button" onClick={() => deletePhoto(url)}
                    className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 font-condensed">
                    Delete
                  </button>
                </div>
                {coverPhoto === url && (
                  <span className="absolute top-1 left-1 bg-[#FFE600] text-[#0A0A0A] text-[10px] font-bold px-1.5 py-0.5 rounded font-condensed">
                    COVER
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 5 — SEO */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          5. SEO
        </h2>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-gray-400 text-xs font-condensed uppercase tracking-wider">Meta Title</label>
            <span className={`text-xs ${form.meta_title.length > 60 ? 'text-red-400' : 'text-gray-600'}`}>
              {form.meta_title.length}/60
            </span>
          </div>
          <input value={form.meta_title} onChange={e => set('meta_title', e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-gray-400 text-xs font-condensed uppercase tracking-wider">Meta Description</label>
            <span className={`text-xs ${form.meta_description.length > 160 ? 'text-red-400' : 'text-gray-600'}`}>
              {form.meta_description.length}/160
            </span>
          </div>
          <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
            rows={3}
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors resize-none" />
        </div>
      </section>

      {/* Section 6 — Status */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          6. Status & Admin
        </h2>

        <div>
          <label className="block text-gray-400 text-xs mb-2 font-condensed uppercase tracking-wider">Availability</label>
          <div className="flex gap-3">
            {(['available','booked','coming-soon'] as const).map(v => (
              <button key={v} type="button" onClick={() => set('availability', v)}
                className={`px-4 py-2 rounded-lg text-sm font-condensed transition-colors ${
                  form.availability === v
                    ? 'bg-[#FFE600] text-[#0A0A0A] font-bold'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]'
                }`}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <button type="button" onClick={() => set('is_featured', !form.is_featured)}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.is_featured ? 'bg-[#FFE600]' : 'bg-[#2a2a2a]'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.is_featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-gray-400 text-sm font-condensed">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <button type="button" onClick={() => set('is_published', !form.is_published)}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.is_published ? 'bg-green-500' : 'bg-[#2a2a2a]'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.is_published ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-gray-400 text-sm font-condensed">Published</span>
          </label>
        </div>

        <div>
          <label className="block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider">
            Internal Notes <span className="normal-case text-gray-600">(never shown publicly)</span>
          </label>
          <textarea value={form.notes_internal} onChange={e => set('notes_internal', e.target.value)}
            rows={3} placeholder="Owner details, rate, booked dates, etc."
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors resize-none" />
        </div>
      </section>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-56 right-0 bg-[#111111] border-t border-[#1e1e1e] px-6 py-4 flex items-center gap-3">
        {isEdit && (
          <a href={`/listing/${form.slug}`} target="_blank" rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-sm font-condensed border border-[#2a2a2a] px-4 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors">
            Preview ↗
          </a>
        )}
        <div className="flex-1" />
        <button type="button" onClick={() => handleSave(false)} disabled={saving}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 font-condensed font-medium px-5 py-2.5 rounded-lg hover:bg-[#222] transition-colors disabled:opacity-50 text-sm">
          {saving ? 'Saving…' : 'Save as Draft'}
        </button>
        <button type="button" onClick={() => handleSave(true)} disabled={saving}
          className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 text-sm">
          {saving ? 'Saving…' : 'Save & Publish'}
        </button>
      </div>
    </div>
  )
}
