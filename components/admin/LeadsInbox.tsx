'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { RhLeadRow, LeadStatus } from '@/types/database'

type Lead = RhLeadRow
type ListingRef = { id: string; title: string; slug: string }

const STATUS_BADGE: Record<LeadStatus, string> = {
  new:           'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  contacted:     'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  negotiating:   'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  'closed-won':  'bg-green-500/15 text-green-400 border border-green-500/20',
  'closed-lost': 'bg-red-500/15 text-red-400 border border-red-500/20',
}

const STATUSES: LeadStatus[] = ['new','contacted','negotiating','closed-won','closed-lost']

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function whatsAppUrl(lead: Lead) {
  const msg = encodeURIComponent(
    `Hi ${lead.name}, thanks for your enquiry${lead.listing_title ? ` about "${lead.listing_title}"` : ''} on rewarihoardings.com. How can I help?`
  )
  return `https://wa.me/918168740234?text=${msg}`
}

interface Props {
  leads: Lead[]
  listings: ListingRef[]
}

export default function LeadsInbox({ leads, listings }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [showLogModal, setShowLogModal] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', phone: '', company: '', listing_id: '', message: '' })

  const filtered = leads.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!l.name.toLowerCase().includes(q) && !l.phone.includes(q)) return false
    }
    return true
  })

  const counts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  async function updateStatus(id: string, status: LeadStatus) {
    const supabase = createClient()
    await supabase.from('rh_leads').update({ status }).eq('id', id)
    startTransition(() => router.refresh())
  }

  async function saveNotes(id: string) {
    const supabase = createClient()
    await supabase.from('rh_leads').update({ admin_notes: notes[id] ?? '' }).eq('id', id)
    startTransition(() => router.refresh())
  }

  async function deleteLead(id: string) {
    if (!confirm('Delete this lead permanently?')) return
    const supabase = createClient()
    await supabase.from('rh_leads').delete().eq('id', id)
    startTransition(() => router.refresh())
  }

  async function logWhatsAppLead() {
    if (!newLead.name || !newLead.phone) return
    const supabase = createClient()
    await supabase.from('rh_leads').insert({
      name: newLead.name,
      phone: newLead.phone,
      email: null,
      company: newLead.company || null,
      listing_id: newLead.listing_id || null,
      listing_slug: listings.find(l => l.id === newLead.listing_id)?.slug ?? null,
      listing_title: listings.find(l => l.id === newLead.listing_id)?.title ?? null,
      message: newLead.message || null,
      source: 'whatsapp' as const,
      status: 'new' as const,
      admin_notes: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      ip_address: null,
      user_agent: null,
    })
    setShowLogModal(false)
    setNewLead({ name: '', phone: '', company: '', listing_id: '', message: '' })
    startTransition(() => router.refresh())
  }

  function exportCSV() {
    const headers = ['Name','Phone','Email','Company','Listing','Source','Status','Message','Date']
    const rows = filtered.map(l => [
      l.name, l.phone, l.email ?? '', l.company ?? '',
      l.listing_title ?? '', l.source, l.status,
      (l.message ?? '').replace(/,/g, ' '),
      new Date(l.created_at).toLocaleDateString('en-IN'),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'rh-leads.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Status tabs + actions */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-1 flex-wrap">
          {(['all', ...STATUSES] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-condensed font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-[#FFE600] text-[#0A0A0A]'
                  : 'bg-[#111111] border border-[#1e1e1e] text-gray-400 hover:text-white'
              }`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== 'all' && counts[s] ? ` (${counts[s]})` : ''}
              {s === 'all' ? ` (${leads.length})` : ''}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name / phone…"
            className="bg-[#111111] border border-[#1e1e1e] text-white placeholder-gray-600 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors w-44"
          />
          <button onClick={() => setShowLogModal(true)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 font-condensed px-3 py-1.5 rounded-lg text-sm hover:bg-[#222] transition-colors">
            + Log WhatsApp Lead
          </button>
          <button onClick={exportCSV}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 font-condensed px-3 py-1.5 rounded-lg text-sm hover:bg-[#222] transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Leads list */}
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden divide-y divide-[#171717]">
        {filtered.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-12">No leads found</p>
        ) : filtered.map(lead => (
          <div key={lead.id}>
            {/* Row */}
            <div
              className="flex items-center gap-4 px-5 py-4 hover:bg-[#141414] transition-colors cursor-pointer"
              onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-medium">{lead.name}</p>
                  {lead.company && <p className="text-gray-500 text-xs">· {lead.company}</p>}
                </div>
                <p className="text-gray-500 text-xs mt-0.5 truncate">
                  {lead.listing_title ?? 'General Enquiry'} · {lead.phone}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[lead.source === 'whatsapp' ? 'new' : 'new'].replace('blue', 'gray')}`}>
                  {lead.source}
                </span>
                <span className="text-gray-500 text-xs">{timeAgo(lead.created_at)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[lead.status as LeadStatus]}`}>
                  {lead.status}
                </span>
                <span className="text-gray-600 text-xs">{expandedId === lead.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Expanded detail */}
            {expandedId === lead.id && (
              <div className="px-5 py-4 bg-[#0d0d0d] border-t border-[#1e1e1e] space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs font-condensed uppercase tracking-wider mb-1">Contact</p>
                    <a href={`tel:${lead.phone}`} className="text-[#FFE600] hover:underline block">{lead.phone}</a>
                    {lead.email && <a href={`mailto:${lead.email}`} className="text-gray-400 hover:underline block text-xs">{lead.email}</a>}
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-condensed uppercase tracking-wider mb-1">Enquired About</p>
                    {lead.listing_slug ? (
                      <a href={`/listing/${lead.listing_slug}`} target="_blank" className="text-[#FFE600] hover:underline text-sm">
                        {lead.listing_title} ↗
                      </a>
                    ) : <p className="text-gray-400 text-sm">General Enquiry</p>}
                  </div>
                </div>

                {lead.message && (
                  <div>
                    <p className="text-gray-600 text-xs font-condensed uppercase tracking-wider mb-1">Message</p>
                    <p className="text-gray-300 text-sm bg-[#111111] rounded-lg px-3 py-2">{lead.message}</p>
                  </div>
                )}

                {(lead.utm_source || lead.utm_medium || lead.utm_campaign) && (
                  <p className="text-gray-600 text-xs">
                    UTM: {[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ')}
                  </p>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-gray-600 text-xs font-condensed uppercase tracking-wider mb-1">Status</p>
                    <select
                      defaultValue={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-[#111111] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 text-xs font-condensed uppercase tracking-wider mb-1">Notes</p>
                    <textarea
                      defaultValue={lead.admin_notes ?? ''}
                      onChange={e => setNotes(n => ({ ...n, [lead.id]: e.target.value }))}
                      rows={2}
                      placeholder="Add notes…"
                      className="w-full bg-[#111111] border border-[#2a2a2a] text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <a href={whatsAppUrl(lead)} target="_blank" rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-500 text-white font-condensed px-4 py-2 rounded-lg text-sm transition-colors">
                    WhatsApp ↗
                  </a>
                  <button onClick={() => saveNotes(lead.id)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 font-condensed px-4 py-2 rounded-lg text-sm hover:bg-[#222] transition-colors">
                    Save Notes
                  </button>
                  <button onClick={() => deleteLead(lead.id)}
                    className="bg-[#1a1a1a] border border-red-500/20 text-red-500 font-condensed px-4 py-2 rounded-lg text-sm hover:bg-red-500/10 transition-colors ml-auto">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Log WhatsApp Lead modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-condensed font-bold text-lg">Log WhatsApp Lead</h3>
            <input value={newLead.name} onChange={e => setNewLead(n => ({ ...n, name: e.target.value }))}
              placeholder="Name *" className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
            <input value={newLead.phone} onChange={e => setNewLead(n => ({ ...n, phone: e.target.value }))}
              placeholder="Phone *" className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
            <input value={newLead.company} onChange={e => setNewLead(n => ({ ...n, company: e.target.value }))}
              placeholder="Company" className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors" />
            <select value={newLead.listing_id} onChange={e => setNewLead(n => ({ ...n, listing_id: e.target.value }))}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors">
              <option value="">General Enquiry</option>
              {listings.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
            <textarea value={newLead.message} onChange={e => setNewLead(n => ({ ...n, message: e.target.value }))}
              placeholder="Message / notes" rows={3}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#FFE600] transition-colors resize-none" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowLogModal(false)}
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 font-condensed py-2.5 rounded-lg text-sm hover:bg-[#222] transition-colors">
                Cancel
              </button>
              <button onClick={logWhatsAppLead} disabled={!newLead.name || !newLead.phone}
                className="flex-1 bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold py-2.5 rounded-lg text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50">
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
