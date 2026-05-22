import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ListingsManager from '@/components/admin/ListingsManager'

export default async function AdminListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: listings } = await supabase
    .from('listings')
    .select('id,slug,title,type,city,locality,size_width_ft,size_height_ft,availability,is_published,is_featured,cover_photo,created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Listings</h1>
          <p className="text-gray-500 text-sm mt-1">{listings?.length ?? 0} total listings</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold px-4 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors text-sm tracking-wide"
        >
          + Add Listing
        </Link>
      </div>
      <ListingsManager listings={listings ?? []} />
    </div>
  )
}
