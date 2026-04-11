import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ListingForm from '@/components/admin/ListingForm'

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ data: listing }, { data: setting }] = await Promise.all([
    supabase.from('listings').select('*').eq('id', params.id).single(),
    supabase.from('rh_settings').select('value').eq('key', 'rewari_localities').single(),
  ])

  if (!listing) notFound()

  const localities: string[] = Array.isArray(setting?.value) ? setting.value as string[] : []

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Edit Listing</h1>
          <p className="text-gray-500 text-sm mt-1 truncate max-w-md">{listing.title}</p>
        </div>
        <Link
          href={`/listing/${listing.slug}`}
          target="_blank"
          className="text-gray-400 hover:text-white text-sm font-condensed border border-[#2a2a2a] px-4 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          View Live Page ↗
        </Link>
      </div>
      <ListingForm existing={listing} localities={localities} />
    </div>
  )
}
