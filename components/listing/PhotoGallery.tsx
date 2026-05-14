'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [active, setActive] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="aspect-video bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 opacity-20">
          <svg viewBox="0 0 48 48" className="w-14 h-14" fill="none" stroke="white" strokeWidth="1.5">
            <rect x="6" y="18" width="36" height="22" rx="2" /><line x1="24" y1="6" x2="24" y2="18" /><line x1="14" y1="6" x2="34" y2="6" />
          </svg>
          <span className="font-condensed text-[12px] text-white uppercase tracking-[0.1em]">Photos coming soon</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Main photo */}
      <div className="relative aspect-video bg-[#141414] border border-[#2A2A2A] overflow-hidden mb-2">
        <Image
          key={active}
          src={photos[active]}
          alt={`${title} — photo ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
          priority={active === 0}
        />
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 font-condensed text-[12px] text-white/70 uppercase tracking-wider px-2.5 py-1">
            {active + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-[88px] h-[60px] flex-shrink-0 border-2 overflow-hidden transition-all ${
                i === active ? 'border-[#FFE600] opacity-100' : 'border-transparent opacity-50 hover:opacity-80 hover:border-[#555]'
              }`}
            >
              <Image src={photo} alt={`${title} — thumbnail ${i + 1}`} fill className="object-cover" sizes="88px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
