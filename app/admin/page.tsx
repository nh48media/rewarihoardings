import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const STATUS_BADGE: Record<string, string> = {
  new:          'bg-blue-500/15 text-blue-400',
  contacted:    'bg-amber-500/15 text-amber-400',
  negotiating:  'bg-purple-500/15 text-purple-400',
  'closed-won': 'bg-green-500/15 text-green-400',
  'closed-lost':'bg-red-500/15 text-red-400',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart  = new Date(now.getTime() - 7 * 86400000).toISOString()

  const [
    { count: totalListings },
    { count: leadsToday },
    { count: leadsWeek },
    { count: totalLeads },
    { data: recentLeads },
    { count: publishedCount },
    { count: draftCount },
    { count: featuredCount },
    { count: bookedCount },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('rh_leads').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('rh_leads').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
    supabase.from('rh_leads').select('*', { count: 'exact', head: true }),
    supabase.from('rh_leads').select('id,name,phone,listing_title,source,status,created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_published', false),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('availability', 'booked'),
  ])

  const stats = [
    { label: 'Total Listings',    value: totalListings ?? 0,  href: '/admin/listings' },
    { label: 'Leads Today',       value: leadsToday ?? 0,     href: '/admin/leads' },
    { label: 'Leads This Week',   value: leadsWeek ?? 0,      href: '/admin/leads' },
    { label: 'Total Leads',       value: totalLeads ?? 0,     href: '/admin/leads' },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold px-4 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors text-sm tracking-wide"
        >
          + Add New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#2a2a2a] transition-colors group"
          >
            <p className="text-gray-500 text-xs font-condensed uppercase tracking-widest">{stat.label}</p>
            <p className="text-white text-3xl font-condensed font-bold mt-2 group-hover:text-[#FFE600] transition-colors">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
            <h2 className="text-white font-condensed font-semibold tracking-wide">Recent Leads</h2>
            <Link href="/admin/leads" className="text-[#FFE600] text-xs font-condensed hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {recentLeads && recentLeads.length > 0 ? recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#141414] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{lead.name}</p>
                  <p className="text-gray-500 text-xs truncate">{lead.listing_title ?? 'General Enquiry'}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[lead.status] ?? 'bg-gray-800 text-gray-400'}`}>
                    {lead.status}
                  </span>
                  <p className="text-gray-600 text-xs mt-1">{timeAgo(lead.created_at)}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-600 text-sm px-5 py-8 text-center">No leads yet</p>
            )}
          </div>
        </div>

        {/* Listings Summary + Quick Actions */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
            <h2 className="text-white font-condensed font-semibold tracking-wide mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/listings/new"
                className="block w-full text-center bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold px-4 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors text-sm"
              >
                + Add New Listing
              </Link>
              <Link
                href="/admin/leads"
                className="block w-full text-center bg-[#1a1a1a] text-gray-300 font-condensed px-4 py-2.5 rounded-lg hover:bg-[#222] transition-colors text-sm border border-[#2a2a2a]"
              >
                View All Leads
              </Link>
            </div>
          </div>

          {/* Listings Status */}
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
            <h2 className="text-white font-condensed font-semibold tracking-wide mb-4">Listings Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Published',  value: publishedCount ?? 0, dot: 'bg-green-500' },
                { label: 'Drafts',     value: draftCount ?? 0,     dot: 'bg-gray-500' },
                { label: 'Featured',   value: featuredCount ?? 0,  dot: 'bg-[#FFE600]' },
                { label: 'Booked',     value: bookedCount ?? 0,    dot: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                    <span className="text-gray-400 text-sm font-condensed">{item.label}</span>
                  </div>
                  <span className="text-white text-sm font-condensed font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
