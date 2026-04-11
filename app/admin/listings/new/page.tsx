import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ListingForm from '@/components/admin/ListingForm'

export default async function NewListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Add New Listing</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below to create a new hoarding listing.</p>
      </div>
      <ListingForm />
    </div>
  )
}
