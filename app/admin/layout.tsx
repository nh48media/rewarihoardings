import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not authenticated — render children only (login page)
  if (!user) {
    return <>{children}</>
  }

  // Fetch sidebar badge counts
  const [{ count: listingCount }, { count: newLeadCount }, { count: blogCount }] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase.from('rh_leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('rh_blog').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar listingCount={listingCount ?? 0} newLeadCount={newLeadCount ?? 0} blogCount={blogCount ?? 0} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
