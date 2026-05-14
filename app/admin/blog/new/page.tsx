import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BlogForm from '@/components/admin/BlogForm'

export default async function NewBlogPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">New Blog Post</h1>
        <p className="text-gray-500 text-sm mt-1">Write and publish a new article.</p>
      </div>
      <BlogForm />
    </div>
  )
}
