import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LeadsInbox from '@/components/admin/LeadsInbox'

export default async function AdminLeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: leads } = await supabase
    .from('rh_leads')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: listings } = await supabase
    .from('listings')
    .select('id,title,slug')
    .order('title')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Leads Inbox</h1>
        <p className="text-gray-500 text-sm mt-1">{leads?.length ?? 0} total leads</p>
      </div>
      <LeadsInbox leads={leads ?? []} listings={listings ?? []} />
    </div>
  )
}
