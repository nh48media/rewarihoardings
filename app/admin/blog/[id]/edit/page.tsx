import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BlogForm from '@/components/admin/BlogForm'

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: post } = await supabase
    .from('rh_blog')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Edit Post</h1>
          <p className="text-gray-500 text-sm mt-1 truncate max-w-md">{post.title}</p>
        </div>
        {post.is_published && (
          <Link href={`/blog/${post.slug}`} target="_blank"
            className="text-gray-400 hover:text-white text-sm font-condensed border border-[#2a2a2a] px-4 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors">
            View Live Post ↗
          </Link>
        )}
      </div>
      <BlogForm existing={post} />
    </div>
  )
}
