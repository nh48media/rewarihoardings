'use client'

import { useState, useMemo } from 'react'
import type { ListingRow } from '@/types/database'
import ListingCard, { fmtLabel } from '@/components/listing/ListingCard'

type Props = {
  listings: ListingRow[]
  types: string[]
}

export default function RewariInventory({ listings, types }: Props) {
  const [activeType, setActiveType] = useState<string | null>(null)

  const filtered = useMemo(
    () => (activeType ? listings.filter(l => l.type === activeType) : listings),
    [listings, activeType]
  )

  const countFor = (type: string) => listings.filter(l => l.type === type).length

  return (
    <section className="bg-[#0A0A0A] px-10 pb-20" id="inventory">
      {/* Filter bar */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-2 py-7 border-b border-[#1E1E1E] mb-10">
          <span className="font-condensed text-[11px] text-[#444] uppercase tracking-[0.12em] mr-2 flex-shrink-0">
            Filter by type
          </span>
          <button
            onClick={() => setActiveType(null)}
            className={`font-condensed font-bold text-[13px] uppercase tracking-[0.06em] px-4 py-2 transition-colors ${
              activeType === null
                ? 'bg-[#FFE600] text-[#0A0A0A]'
                : 'text-[#666] border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600]'
            }`}
          >
            All ({listings.length})
          </button>
          {types.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(activeType === type ? null : type)}
              className={`font-condensed font-bold text-[13px] uppercase tracking-[0.06em] px-4 py-2 transition-colors ${
                activeType === type
                  ? 'bg-[#FFE600] text-[#0A0A0A]'
                  : 'text-[#666] border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600]'
              }`}
            >
              {fmtLabel(type)} ({countFor(type)})
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="font-condensed text-[12px] text-[#444] uppercase tracking-[0.1em] mb-6">
          {activeType
            ? `${filtered.length} ${fmtLabel(activeType).toLowerCase()} location${filtered.length !== 1 ? 's' : ''} in Rewari`
            : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} across all formats`}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
            {filtered.map(l => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        ) : (
          <div className="border border-[#2A2A2A] py-20 text-center">
            <p className="font-condensed text-[#555] uppercase tracking-wider text-[14px] mb-1">
              No {fmtLabel(activeType ?? '')} listings yet
            </p>
            <button
              onClick={() => setActiveType(null)}
              className="mt-4 font-condensed text-[13px] text-[#FFE600] uppercase tracking-wider underline"
            >
              View all formats
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
