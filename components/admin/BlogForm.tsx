'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createClient } from '@/lib/supabase/client'
import type { RhBlogRow } from '@/types/database'

type FormData = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  published_at: string
  is_published: boolean
  meta_title: string
  meta_description: string
}

const today = new Date().toISOString().slice(0, 10)

const DEFAULT_FORM: FormData = {
  title: '', slug: '', excerpt: '', content: '',
  cover_image: '', published_at: today,
  is_published: false, meta_title: '', meta_description: '',
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

interface Props {
  existing?: RhBlogRow
}

export default function BlogForm({ existing }: Props) {
  const router = useRouter()
  const isEdit = !!existing

  const [form, setForm] = useState<FormData>(() => {
    if (!existing) return DEFAULT_FORM
    return {
      title:           existing.title,
      slug:            existing.slug,
      excerpt:         existing.excerpt ?? '',
      content:         existing.content,
      cover_image:     existing.cover_image ?? '',
      published_at:    existing.published_at ? existing.published_at.slice(0, 10) : today,
      is_published:    existing.is_published,
      meta_title:      existing.meta_title ?? '',
      meta_description: existing.meta_description ?? '',
    }
  })

  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugManual, setSlugManual] = useState(isEdit)

  useEffect(() => {
    if (!slugManual && form.title) {
      setForm(f => ({ ...f, slug: slugify(f.title) }))
    }
  }, [form.title, slugManual])

  // Auto-fill meta from title/excerpt when empty
  useEffect(() => {
    if (!isEdit) {
      setForm(f => ({
        ...f,
        meta_title: f.title ? `${f.title} — Rewari Hoardings Blog` : '',
        meta_description: f.excerpt || '',
      }))
    }
  }, [form.title, form.excerpt, isEdit])

  function set(field: keyof FormData, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave(publish: boolean) {
    setSaving(true)
    setError('')

    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError('Title, slug and content are required.')
      setSaving(false)
      return
    }

    const supabase = createClient()
    const payload = {
      title:            form.title.trim(),
      slug:             form.slug.trim(),
      excerpt:          form.excerpt.trim() || null,
      content:          form.content,
      cover_image:      form.cover_image.trim() || null,
      published_at:     form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString(),
      is_published:     publish,
      meta_title:       form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
    }

    let result
    if (isEdit && existing) {
      result = await supabase.from('rh_blog').update(payload).eq('id', existing.id)
    } else {
      result = await supabase.from('rh_blog').insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
        blogSlug: form.slug,
      }),
    }).catch(() => {})

    router.push('/admin/blog')
    router.refresh()
  }

  const inputCls = 'w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors'
  const labelCls = 'block text-gray-400 text-xs mb-1.5 font-condensed uppercase tracking-wider'

  return (
    <div className="max-w-3xl space-y-8 pb-32">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 1 — Identity */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          1. Post Identity
        </h2>

        <div>
          <label className={labelCls}>Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="e.g. How to Choose the Right Hoarding Location in Rewari"
            className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Slug *</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm shrink-0">rewarihoardings.com/blog/</span>
            <input value={form.slug}
              onChange={e => { setSlugManual(true); set('slug', slugify(e.target.value)) }}
              placeholder="auto-generated"
              className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Excerpt</label>
          <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
            rows={3} placeholder="Short summary shown in post cards and meta description…"
            className={`${inputCls} resize-none`} />
        </div>
      </section>

      {/* 2 — Content */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-3">
          <h2 className="text-white font-condensed font-bold text-lg tracking-wide">2. Content (Markdown)</h2>
          <div className="flex gap-1">
            {(['write', 'preview'] as const).map(t => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded text-xs font-condensed font-semibold uppercase tracking-wider transition-colors ${
                  tab === t ? 'bg-[#FFE600] text-[#0A0A0A]' : 'text-gray-400 hover:text-white bg-[#1a1a1a]'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === 'write' ? (
          <textarea
            value={form.content}
            onChange={e => set('content', e.target.value)}
            rows={24}
            placeholder={`# Your blog post title\n\nWrite your content here using Markdown...\n\n## Section heading\n\nParagraph text here.\n\n- Bullet point\n- Another point\n\n> A blockquote looks like this`}
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors resize-y font-mono leading-[1.65]"
          />
        ) : (
          <div className="min-h-[400px] bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-6 py-5">
            {form.content ? (
              <div className="prose-blog">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-600 text-sm italic">Nothing to preview yet.</p>
            )}
          </div>
        )}

        <p className="text-gray-600 text-xs">
          Supports: **bold**, *italic*, # headings, - lists, {'>'} blockquotes, `code`, [links](url), tables, ---
        </p>
      </section>

      {/* 3 — Cover Image */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          3. Cover Image
        </h2>
        <div>
          <label className={labelCls}>Image URL</label>
          <input value={form.cover_image} onChange={e => set('cover_image', e.target.value)}
            placeholder="https://… (Supabase storage URL or external)"
            className={inputCls} />
        </div>
        {form.cover_image && (
          <img src={form.cover_image} alt="Cover preview"
            className="w-full max-h-48 object-cover rounded-lg border border-[#2a2a2a]" />
        )}
      </section>

      {/* 4 — Publish Settings */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          4. Publish Settings
        </h2>

        <div>
          <label className={labelCls}>Published Date</label>
          <input type="date" value={form.published_at} onChange={e => set('published_at', e.target.value)}
            className="bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <button type="button" onClick={() => set('is_published', !form.is_published)}
            className={`w-10 h-5 rounded-full transition-colors relative ${form.is_published ? 'bg-green-500' : 'bg-[#2a2a2a]'}`}>
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.is_published ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-gray-400 text-sm font-condensed">Published (visible on site)</span>
        </label>
      </section>

      {/* 5 — SEO */}
      <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-condensed font-bold text-lg tracking-wide border-b border-[#1e1e1e] pb-3">
          5. SEO
        </h2>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls}>Meta Title</label>
            <span className={`text-xs ${form.meta_title.length > 60 ? 'text-red-400' : 'text-gray-600'}`}>
              {form.meta_title.length}/60
            </span>
          </div>
          <input value={form.meta_title} onChange={e => set('meta_title', e.target.value)}
            className={inputCls} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls}>Meta Description</label>
            <span className={`text-xs ${form.meta_description.length > 160 ? 'text-red-400' : 'text-gray-600'}`}>
              {form.meta_description.length}/160
            </span>
          </div>
          <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
            rows={3} className={`${inputCls} resize-none`} />
        </div>
      </section>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-56 right-0 bg-[#111111] border-t border-[#1e1e1e] px-6 py-4 flex items-center gap-3">
        {isEdit && (
          <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer"
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
