import Link from 'next/link'

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A] flex items-center justify-between px-10 h-16">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-9 h-9 bg-[#FFE600] flex items-center justify-center font-condensed font-black text-lg text-[#0A0A0A] leading-none">
          RH
        </div>
        <span className="font-condensed font-bold text-[17px] text-white uppercase tracking-[0.02em]">
          Rewari<span className="text-[#FFE600]">Hoardings</span>
        </span>
      </Link>
      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        <li>
          <Link href="/city/rewari" className="font-condensed font-medium text-[15px] text-[#aaa] hover:text-white uppercase tracking-[0.06em] transition-colors no-underline">
            Rewari
          </Link>
        </li>
        <li>
          <Link href="/type/unipole" className="font-condensed font-medium text-[15px] text-[#aaa] hover:text-white uppercase tracking-[0.06em] transition-colors no-underline">
            Types
          </Link>
        </li>
        <li>
          <Link href="/blog" className="font-condensed font-medium text-[15px] text-[#aaa] hover:text-white uppercase tracking-[0.06em] transition-colors no-underline">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/get-quote" className="font-condensed font-bold text-[14px] text-[#0A0A0A] bg-[#FFE600] px-4 py-2 uppercase tracking-[0.06em] hover:bg-yellow-300 transition-colors no-underline">
            Get Quote
          </Link>
        </li>
      </ul>
    </nav>
  )
}
