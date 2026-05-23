import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BlogDeleteButton from '@/components/admin/BlogDeleteButton'

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: posts } = await supabase
    .from('rh_blog')
    .select('id,slug,title,excerpt,is_published,published_at,created_at')
    .order('created_at', { ascending: false })

  const allPosts = posts ?? []

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-condensed font-bold tracking-wide">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">{allPosts.length} total posts</p>
        </div>
        <Link href="/admin/blog/new"
          className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold px-4 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors text-sm tracking-wide">
          + New Post
        </Link>
      </div>

      {allPosts.length === 0 ? (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-12 text-center">
          <p className="text-gray-500 font-condensed uppercase tracking-wider text-sm mb-2">No blog posts yet</p>
          <Link href="/admin/blog/new"
            className="text-[#FFE600] font-condensed text-sm hover:underline">
            Write your first post →
          </Link>
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="text-left px-4 py-3 text-gray-500 font-condensed uppercase tracking-wider text-xs">Title</th>
                <th className="text-left px-4 py-3 text-gray-500 font-condensed uppercase tracking-wider text-xs hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-condensed uppercase tracking-wider text-xs hidden lg:table-cell">Published</th>
                <th className="text-left px-4 py-3 text-gray-500 font-condensed uppercase tracking-wider text-xs hidden lg:table-cell">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {allPosts.map((post, i) => (
                <tr key={post.id}
                  className={`border-b border-[#1a1a1a] hover:bg-[#141414] transition-colors ${i === allPosts.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="font-condensed font-semibold text-white text-sm tracking-wide leading-tight mb-0.5 line-clamp-1">
                      {post.title}
                    </div>
                    <div className="text-gray-600 text-xs font-mono">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-condensed font-semibold ${
                      post.is_published
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-gray-700/30 text-gray-500'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-xs hidden lg:table-cell">
                    {fmtDate(post.published_at)}
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-xs hidden lg:table-cell">
                    {fmtDate(post.created_at)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {post.is_published && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-gray-500 hover:text-white text-xs font-condensed border border-[#2a2a2a] px-2.5 py-1.5 rounded hover:bg-[#1a1a1a] transition-colors">
                          View ↗
                        </a>
                      )}
                      <Link href={`/admin/blog/${post.id}/edit`}
                        className="text-[#FFE600] hover:text-white text-xs font-condensed border border-[#FFE600]/30 px-2.5 py-1.5 rounded hover:bg-[#1a1a1a] transition-colors">
                        Edit
                      </Link>
                      <BlogDeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
