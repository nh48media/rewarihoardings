'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  listingCount: number
  newLeadCount: number
  blogCount: number
}

const navLinks = [
  { href: '/admin',          label: 'Dashboard', exact: true },
  { href: '/admin/listings', label: 'Listings',  exact: false },
  { href: '/admin/blog',     label: 'Blog',      exact: false },
  { href: '/admin/leads',    label: 'Leads',     exact: false, accent: true },
  { href: '/admin/photos',   label: 'Photos',    exact: false },
  { href: '/admin/settings', label: 'Settings',  exact: false },
]

export default function Sidebar({ listingCount, newLeadCount, blogCount }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-[#111111] border-r border-[#1e1e1e] flex flex-col">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-[#1e1e1e]">
        <Link href="/" target="_blank" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#FFE600] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-[#0A0A0A] font-bold text-sm font-condensed">RH</span>
          </div>
          <div>
            <p className="text-white font-condensed font-semibold text-sm leading-tight group-hover:text-[#FFE600] transition-colors">
              Rewari Hoardings
            </p>
            <p className="text-gray-600 text-[11px] mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navLinks.map(link => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href)

          const badge = link.href === '/admin/listings'
            ? listingCount
            : link.href === '/admin/leads'
            ? newLeadCount
            : link.href === '/admin/blog'
            ? blogCount
            : 0

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-[#1a1a1a] text-white border-l-2 border-[#FFE600] pl-[10px]'
                  : 'text-gray-400 hover:text-white hover:bg-[#161616]'
              }`}
            >
              <span className="font-condensed font-medium tracking-wide">{link.label}</span>
              {badge > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  link.accent
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-[#252525] text-gray-400'
                }`}>
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-[#1e1e1e] space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2.5 text-gray-500 hover:text-white text-sm rounded-lg hover:bg-[#161616] transition-all font-condensed"
        >
          <span>View Live Site</span>
          <span className="text-xs">↗</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2.5 text-gray-500 hover:text-red-400 text-sm rounded-lg hover:bg-[#161616] transition-all font-condensed"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
