'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type ListingRow = {
  id: string
  slug: string
  title: string
  type: string
  locality: string
  size_width_ft: number | null
  size_height_ft: number | null
  availability: string
  is_published: boolean
  is_featured: boolean
  cover_photo: string | null
  created_at: string
}

const AVAILABILITY_STYLE: Record<string, string> = {
  available:    'bg-green-500/15 text-green-400',
  booked:       'bg-red-500/15 text-red-400',
  'coming-soon':'bg-amber-500/15 text-amber-400',
}

const PAGE_SIZE = 20

export default function ListingsManager({ listings }: { listings: ListingRow[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [localityFilter, setLocalityFilter] = useState('')
  const [availFilter, setAvailFilter] = useState('')
  const [page, setPage] = useState(0)

  // Unique filter options from data
  const types      = [...new Set(listings.map(l => l.type))].sort()
  const localities = [...new Set(listings.map(l => l.locality))].sort()

  const filtered = listings.filter(l => {
    if (search      && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.slug.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter     && l.type !== typeFilter) return false
    if (localityFilter && l.locality !== localityFilter) return false
    if (availFilter    && l.availability !== availFilter) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  async function toggleField(id: string, field: 'is_published' | 'is_featured', value: boolean) {
    const supabase = createClient()
    const update = field === 'is_published' ? { is_published: value } : { is_featured: value }
    await supabase.from('listings').update(update).eq('id', id)
    startTransition(() => router.refresh())
  }

  async function deleteListing(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const supabase = createClient()
    await supabase.from('listings').delete().eq('id', id)
    startTransition(() => router.refresh())
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search listings…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
          className="bg-[#111111] border border-[#1e1e1e] text-white placeholder-gray-600 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors w-48"
        />
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(0) }}
          className="bg-[#111111] border border-[#1e1e1e] text-gray-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors"
        >
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={localityFilter}
          onChange={e => { setLocalityFilter(e.target.value); setPage(0) }}
          className="bg-[#111111] border border-[#1e1e1e] text-gray-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors"
        >
          <option value="">All Localities</option>
          {localities.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={availFilter}
          onChange={e => { setAvailFilter(e.target.value); setPage(0) }}
          className="bg-[#111111] border border-[#1e1e1e] text-gray-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors"
        >
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="coming-soon">Coming Soon</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No listings found</p>
            <Link href="/admin/listings/new" className="text-[#FFE600] text-sm mt-2 inline-block hover:underline">
              + Add your first listing
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e] text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium w-12"></th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Locality</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Size</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Published</th>
                <th className="text-center px-4 py-3 font-medium">Featured</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]">
              {paginated.map(listing => (
                <tr key={listing.id} className="hover:bg-[#141414] transition-colors">
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-md bg-[#1a1a1a] overflow-hidden flex items-center justify-center shrink-0">
                      {listing.cover_photo ? (
                        <Image src={listing.cover_photo} alt="" width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-600 text-xs">IMG</span>
                      )}
                    </div>
                  </td>
                  {/* Title */}
                  <td className="px-4 py-3">
                    <p className="text-white font-medium truncate max-w-[180px]">{listing.title}</p>
                    <p className="text-gray-600 text-xs truncate max-w-[180px]">/listing/{listing.slug}</p>
                  </td>
                  {/* Type */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="bg-[#FFE600]/10 text-[#FFE600] text-xs px-2 py-0.5 rounded-full font-condensed">
                      {listing.type}
                    </span>
                  </td>
                  {/* Locality */}
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{listing.locality}</td>
                  {/* Size */}
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                    {listing.size_width_ft && listing.size_height_ft
                      ? `${listing.size_width_ft} × ${listing.size_height_ft} ft`
                      : '—'}
                  </td>
                  {/* Availability */}
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${AVAILABILITY_STYLE[listing.availability] ?? 'bg-gray-800 text-gray-400'}`}>
                      {listing.availability}
                    </span>
                  </td>
                  {/* Published toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(listing.id, 'is_published', !listing.is_published)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${listing.is_published ? 'bg-green-500' : 'bg-[#2a2a2a]'}`}
                      title={listing.is_published ? 'Published — click to unpublish' : 'Draft — click to publish'}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${listing.is_published ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  {/* Featured toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleField(listing.id, 'is_featured', !listing.is_featured)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${listing.is_featured ? 'bg-[#FFE600]' : 'bg-[#2a2a2a]'}`}
                      title={listing.is_featured ? 'Featured — click to remove' : 'Not featured — click to feature'}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${listing.is_featured ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/listings/${listing.id}/edit`}
                        className="text-gray-400 hover:text-white text-xs px-2.5 py-1.5 rounded bg-[#1a1a1a] hover:bg-[#222] transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteListing(listing.id, listing.title)}
                        className="text-gray-600 hover:text-red-400 text-xs px-2.5 py-1.5 rounded bg-[#1a1a1a] hover:bg-[#222] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded bg-[#111111] border border-[#1e1e1e] text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded bg-[#111111] border border-[#1e1e1e] text-gray-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
