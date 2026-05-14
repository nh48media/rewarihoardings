import Link from 'next/link'
import Image from 'next/image'
import type { ListingRow } from '@/types/database'

const WA = '918168740234'

const FORMAT_LABEL: Record<string, string> = {
  unipole: 'Unipole', gantry: 'Gantry', hoarding: 'Hoarding',
  'rooftop-hoarding': 'Rooftop', 'wall-painting': 'Wall Painting',
  'construction-hoarding': 'Construction', 'led-display': 'LED Display',
  'led-video-wall': 'LED Video Wall', 'digital-kiosk': 'Digital Kiosk',
  'bus-shelter': 'Bus Shelter', 'pole-kiosk': 'Pole Kiosk',
  'traffic-booth': 'Traffic Booth', 'toll-naka': 'Toll Naka',
  'road-divider': 'Road Divider', 'railway-station': 'Railway Station',
  'cinema-advertising': 'Cinema', 'look-walker': 'Look Walker',
  'water-tank': 'Water Tank', 'society-gate': 'Society Gate',
  'petrol-pump': 'Petrol Pump', 'footpath-kiosk': 'Footpath Kiosk',
}

export function fmtLabel(type: string) {
  return FORMAT_LABEL[type] ?? type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function WAIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function AvailBadge({ avail }: { avail: string }) {
  if (avail === 'available')
    return <><span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" /><span className="text-green-400">Available</span></>
  if (avail === 'booked')
    return <><span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" /><span className="text-red-400">Booked</span></>
  return <><span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" /><span className="text-amber-400">Coming Soon</span></>
}

export default function ListingCard({ l }: { l: ListingRow }) {
  const size = l.size_width_ft && l.size_height_ft ? `${l.size_width_ft} × ${l.size_height_ft} ft` : null
  const sqft = l.size_width_ft && l.size_height_ft ? l.size_width_ft * l.size_height_ft : null
  const waMsg = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi, I'm interested in the hoarding: ${l.title}. Please share availability and rates.`)}`

  return (
    <div className="bg-[#1E1E1E] overflow-hidden hover:bg-[#222] transition-colors">
      <div className="relative h-[200px] bg-gradient-to-br from-[#1c1c1c] to-[#2c2c2c] flex items-center justify-center">
        {l.cover_photo ? (
          <Image src={l.cover_photo} alt={l.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        ) : (
          <div className="opacity-20">
            <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="white" strokeWidth="2">
              <rect x="6" y="18" width="36" height="22" rx="2" /><line x1="24" y1="6" x2="24" y2="18" /><line x1="14" y1="6" x2="34" y2="6" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[11px] uppercase tracking-[0.1em] px-2 py-0.5">
          {fmtLabel(l.type)}
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 px-2 py-1 font-condensed text-[11px] font-bold uppercase tracking-[0.05em]">
          <AvailBadge avail={l.availability} />
        </span>
      </div>
      <div className="p-[18px]">
        <h3 className="font-condensed font-bold text-[18px] text-white uppercase tracking-[0.02em] leading-[1.2] mb-2.5">{l.title}</h3>
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {size && <span className="font-condensed text-[12px] font-semibold uppercase px-2 py-0.5 bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20">{size}</span>}
          {sqft && <span className="font-condensed text-[12px] font-semibold uppercase px-2 py-0.5 bg-white/5 text-[#aaa] border border-white/10">{sqft} sqft</span>}
          {l.illumination_type && <span className="font-condensed text-[12px] font-semibold uppercase px-2 py-0.5 bg-white/5 text-[#aaa] border border-white/10">{l.illumination_type}</span>}
          {l.traffic_count && <span className="font-condensed text-[12px] font-semibold uppercase px-2 py-0.5 bg-white/5 text-[#aaa] border border-white/10">{l.traffic_count}</span>}
        </div>
        <div className="flex items-center gap-1 text-[#666] font-condensed font-medium text-[13px] uppercase tracking-[0.05em] mb-4">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {l.locality}
        </div>
        <div className="flex gap-2">
          <Link href={`/listing/${l.slug}`}
            className="flex-1 bg-[#FFE600] text-[#0A0A0A] font-condensed font-bold text-[13px] uppercase tracking-[0.08em] py-2.5 text-center hover:bg-yellow-300 transition-colors no-underline">
            Get Quote
          </Link>
          <a href={waMsg} target="_blank" rel="noopener noreferrer"
            className="w-10 flex items-center justify-center bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-colors text-[#25D366] flex-shrink-0">
            <WAIcon size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}
