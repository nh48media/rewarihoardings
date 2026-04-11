import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: rows } = await supabase.from('rh_settings').select('*')
  const settings = Object.fromEntries((rows ?? []).map(r => [r.key, r.value]))

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure site-wide settings stored in the database.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
