import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import ListingCard, { fmtLabel } from '@/components/listing/ListingCard'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import FAQSchema from '@/components/seo/FAQSchema'
import type { ListingRow } from '@/types/database'
import { EDITORIALS, buildFallbackEditorial } from '../_editorials'

export const revalidate = 3600

// ── All known slugs — fallback when rh_settings.listing_types is absent ────────

const ALL_SLUGS = [
  'unipole', 'gantry', 'hoarding', 'rooftop-hoarding', 'wall-painting',
  'construction-hoarding', 'led-display', 'led-video-wall', 'digital-kiosk',
  'bus-shelter', 'pole-kiosk', 'traffic-booth', 'toll-naka', 'road-divider',
  'footpath-kiosk', 'auto-rickshaw', 'e-rickshaw', 'bus-branding', 'mobile-van',
  'tractor-branding', 'society-gate', 'school-college-gate', 'market-gate',
  'hospital-branding', 'petrol-pump', 'dhaba-restaurant', 'no-parking-board',
  'atm-branding', 'pamphlet-distribution', 'newspaper-insert', 'newspaper-ad',
  'flex-banner', 'poster', 'railway-station', 'cinema-advertising', 'look-walker',
  'exhibition-stall', 'water-tank',
] as const

// ── Format data ────────────────────────────────────────────────────────────────

type FormatData = {
  name: string
  category: string
  tagline: string
  desc: string
  specs: string[]
  idealFor: string[]
  related: string[]
  faqs: { q: string; a: string }[]
}

const FORMAT_DATA: Record<string, FormatData> = {
  unipole: {
    name: 'Unipole', category: 'Large Format Outdoor',
    tagline: 'High-rise single-pole billboard',
    desc: 'Unipoles are mounted on a single tall steel pole — typically 25 to 60 feet high — giving them unobstructed sightlines over trees, walls and rooftops. On NH-48 they are the dominant format for brand awareness campaigns, visible at highway speeds from 400 to 800 metres away.',
    specs: ['Height: 25–60 ft pole', 'Panel size: 40×20 ft to 60×20 ft', 'Illumination: frontlit / backlit', 'Visibility: 400–800 m', 'Structure: galvanised steel'],
    idealFor: ['Brand awareness on NH-48', 'FMCG & FMCD brands', 'Telecom & banking', 'Automotive launches', 'Real-estate projects'],
    related: ['gantry', 'hoarding', 'led-display'],
    faqs: [
      { q: 'How is a unipole different from a regular hoarding?', a: 'A unipole sits on a single tall pole (25–60 ft), elevating the display well above roadside obstructions. A standard hoarding uses two short legs and sits much lower. The height advantage gives unipoles superior visibility at highway speeds and over longer distances — often 400–800 m.' },
      { q: 'Which unipole locations in Rewari get the most traffic?', a: 'The highest-traffic unipole spots in Rewari are along NH-48 near the city entry point and Delhi Road — locations that see 20,000–35,000 vehicles per day including intercity traffic between Delhi and Rajasthan.' },
      { q: 'What is the minimum booking period for a unipole in Rewari?', a: 'Minimum booking is typically one month. Three-month and six-month campaigns attract better rates. Contact us to check availability and current pricing for specific locations.' },
    ],
  },

  gantry: {
    name: 'Gantry', category: 'Large Format Outdoor',
    tagline: 'Overhead road-spanning billboard',
    desc: 'Gantries span the full width of the road, creating an unavoidable brand impression for every vehicle that passes beneath. They are the most dominant OOH format at major junctions — every driver must slow down, read the display, and react. Rewari\'s key intersections on NH-48 and Delhi Road make gantries exceptionally impactful.',
    specs: ['Span: 30–60 ft across road', 'Panel depth: 8–15 ft', 'Mounted: 15–25 ft above road', 'Illumination: frontlit standard', 'Visibility: from 200–400 m approach'],
    idealFor: ['Junction dominance', 'Direction-signage campaigns', 'Auto & real-estate', 'High-frequency local brands', 'Election advertising'],
    related: ['unipole', 'hoarding', 'toll-naka'],
    faqs: [
      { q: 'Why are gantries considered the most impactful OOH format?', a: 'Unlike a roadside hoarding that you can look past, a gantry spans the entire road. Every driver and passenger must pass beneath it and engage with the display. There is no line-of-sight avoidance — making gantries the highest-impact format at junctions.' },
      { q: 'Where are gantry hoardings available in Rewari?', a: 'Gantries in Rewari are positioned at major road crossings — including NH-48 junction points, the Delhi Road–Rewari bypass intersection, and key roundabouts near Rewari Bus Stand and Sadar Bazar.' },
      { q: 'Are gantries available for short-term bookings?', a: 'Most gantries require a minimum 1-month booking. Due to high demand at prime junctions, availability is limited — enquire early and we will confirm the earliest open slot.' },
    ],
  },

  hoarding: {
    name: 'Hoarding', category: 'Large Format Outdoor',
    tagline: 'Classic large-format roadside billboard',
    desc: 'The traditional hoarding — two-legged structure, large print panel — remains the backbone of OOH advertising in India. In Rewari, hoardings are positioned at market entry points, arterial road junctions, and commercial-area frontages where local brand awareness and repeat impressions drive effectiveness.',
    specs: ['Typical size: 20×10 ft to 40×15 ft', 'Structure: two-leg steel/concrete', 'Illumination: frontlit or unlit', 'Height: 10–20 ft', 'Panel: flex or metal'],
    idealFor: ['Local brand awareness', 'Retail & trade campaigns', 'Political advertising', 'Event promotion', 'Property launches'],
    related: ['unipole', 'rooftop-hoarding', 'gantry'],
    faqs: [
      { q: 'What size are most hoardings in Rewari?', a: 'Standard hoardings in Rewari range from 20×10 ft (200 sqft) to 40×15 ft (600 sqft). Market-facing hoardings tend to be smaller; arterial-road hoardings are larger. Check individual listing specs for exact dimensions.' },
      { q: 'How long does it take to install a hoarding after booking?', a: 'Creative artwork is typically printed and mounted within 3–5 working days of receiving the final design file. For urgent campaigns, we offer 48-hour installation at select locations.' },
      { q: 'Can I change the creative during a long-term hoarding booking?', a: 'Yes — creative changes are possible on monthly cycles. A re-print and re-mount fee applies. Notify us at least 10 days before the desired change date to ensure seamless transition.' },
    ],
  },

  'rooftop-hoarding': {
    name: 'Rooftop Hoarding', category: 'Large Format Outdoor',
    tagline: 'Elevated building-top display',
    desc: 'Rooftop hoardings sit on top of commercial buildings, rising above roadside clutter for 360-degree visibility in dense urban zones. In Rewari\'s commercial core — Sadar Bazar, Model Town, and market areas — rooftop positions dominate the skyline and create strong brand recall for pedestrian and vehicle traffic alike.',
    specs: ['Height: building height + 10–25 ft structure', 'Typical panel: 30×15 ft', 'Illumination: frontlit / LED', 'Visibility: multi-directional', 'Structure: concrete-anchored steel frame'],
    idealFor: ['Commercial zone dominance', 'Brand skyline presence', 'Real-estate & infra brands', 'Local market campaigns', 'Long-duration awareness'],
    related: ['hoarding', 'unipole', 'wall-painting'],
    faqs: [
      { q: 'What makes rooftop hoardings different from standard hoardings in Rewari?', a: 'Rooftop hoardings are anchored to the roof of a commercial building, raising the display 20–30 ft above street level. This gives them multi-directional visibility that standard two-legged roadside hoardings cannot match — particularly valuable in dense market areas where ground-level sightlines are obstructed.' },
      { q: 'Are rooftop hoardings visible at night in Rewari?', a: 'Yes — most rooftop positions in Rewari are fitted with frontlit or LED backlighting, making them highly visible after dark. This extends effective advertising hours to evening and late-night traffic.' },
      { q: 'What permissions are needed for a rooftop hoarding?', a: 'Municipal permissions for rooftop structures are handled by Rewari Hoardings in coordination with the building owner. All listed rooftop locations are legally permitted and compliant.' },
    ],
  },

  'construction-hoarding': {
    name: 'Construction Hoarding', category: 'Large Format Outdoor',
    tagline: 'Perimeter advertising on construction sites',
    desc: 'Construction hoardings wrap the perimeter fencing of active construction sites with large-format vinyl or metal panels. They convert unavoidable visual clutter into premium advertising space. In Rewari\'s rapidly developing zones, construction sites on arterial roads offer months of guaranteed, unobstructed exposure.',
    specs: ['Format: continuous perimeter panels', 'Height: 8–12 ft panels', 'Length: 50–500 ft of perimeter', 'Material: flex vinyl on metal frame', 'Duration: tied to construction timeline'],
    idealFor: ['Long-duration brand campaigns', 'Infrastructure & real-estate brands', 'FMCG saturation', 'Political campaigns', 'Event / launch countdowns'],
    related: ['hoarding', 'wall-painting', 'flex-banner'],
    faqs: [
      { q: 'How long do construction hoarding campaigns typically run in Rewari?', a: 'Construction hoarding campaigns are tied to the site\'s active development phase, which can be 6 months to 3 years. This makes them ideal for brands that want long-duration, set-and-forget exposure without monthly renewals.' },
      { q: 'Can multiple brands advertise on a single construction hoarding?', a: 'Yes — a long construction perimeter can be divided into multiple brand panels. This allows several advertisers to share the space and cost, or one brand to dominate by taking all panels.' },
      { q: 'Are construction hoardings included in your Rewari inventory?', a: 'Availability depends on active construction in the city. WhatsApp us to enquire about current construction-site perimeter availability in your preferred Rewari locality.' },
    ],
  },

  'led-display': {
    name: 'LED Display', category: 'Digital & LED',
    tagline: 'Dynamic digital advertising screen',
    desc: 'LED displays offer full-motion video, multiple creatives in rotation, and crisp visibility day and night. In Rewari, LED displays at high-footfall locations near bus stands and market junctions create an immediate, premium brand impression that static formats cannot replicate. Multiple brands can share a single screen on time-slot rotation.',
    specs: ['Pixel pitch: P6–P16 (outdoor)', 'Brightness: 5,000–10,000 nits', 'Content: static image / video / animation', 'Time-slot: 10–30 sec per loop', 'Availability: day + night'],
    idealFor: ['Brand events & launches', 'Promotions & seasonal offers', 'Entertainment & F&B', 'Short-burst awareness campaigns', 'Multi-creative campaigns'],
    related: ['led-video-wall', 'digital-kiosk', 'unipole'],
    faqs: [
      { q: 'Can I run video content on an LED display in Rewari?', a: 'Yes — outdoor LED screens support full-motion video, animated GIFs, and static JPEG/PNG images. Most screens run a loop of multiple advertisers in 10–30 second slots. You can supply different creatives for day and night versions.' },
      { q: 'How many brands share a single LED display in Rewari?', a: 'Typically 4–8 brands share a screen on a time-slot rotation. You can purchase one or multiple slots. For exclusive ownership of a screen for a campaign period, contact us for dedicated bookings.' },
      { q: 'What file format should I provide for an LED display campaign?', a: 'Supply artwork as MP4 (video) or JPEG/PNG (static) at the exact pixel dimensions of the screen. We will share the specifications for your booked screen upon confirmation.' },
    ],
  },

  'led-video-wall': {
    name: 'LED Video Wall', category: 'Digital & LED',
    tagline: 'Large-scale modular LED display wall',
    desc: 'LED video walls are large, seamless modular display surfaces — typically 10×6 ft to 30×15 ft — delivering cinema-grade visual impact at high-traffic locations. They are most effective at commercial hubs, event venues, and major road junctions where pedestrian and slow-moving vehicle traffic maximise dwell time.',
    specs: ['Minimum size: 10×6 ft (modular)', 'Pixel pitch: P4–P8', 'Brightness: 6,000+ nits outdoor', 'Content: video, animation, static', 'Power: 3-phase electrical supply required'],
    idealFor: ['Events & launches', 'Premium brand positioning', 'Entertainment & multiplex zones', 'Commercial hub dominance', 'Experiential campaigns'],
    related: ['led-display', 'digital-kiosk', 'cinema-advertising'],
    faqs: [
      { q: 'What is the difference between an LED display and an LED video wall?', a: 'An LED display is a fixed-size single-unit screen. An LED video wall is a modular system of tiles assembled to any custom size — commonly used at events, permanent commercial installations, and venue forecourts. Video walls are larger and deliver higher visual impact at close range.' },
      { q: 'Are LED video walls available in Rewari for permanent installation?', a: 'Permanent LED video wall installations are available at select high-footfall commercial locations in Rewari. Temporary event-based video walls can also be arranged. Enquire via WhatsApp for current availability.' },
      { q: 'What is the booking duration for an LED video wall?', a: 'For permanent installations, minimum booking is typically 3 months. For events, walls can be booked for 1 day to 4 weeks. Rates depend on duration, size, and location.' },
    ],
  },

  'digital-kiosk': {
    name: 'Digital Kiosk', category: 'Digital & LED',
    tagline: 'Slim interactive digital street display',
    desc: 'Digital kiosks are slim, freestanding digital display units at pedestrian-level height. Typically positioned at bus stops, market entry points, and commercial corridors, they deliver close-range digital advertising to foot traffic with dynamic content capabilities.',
    specs: ['Display size: 32–75 inch screen', 'Height: 5–8 ft total unit', 'Orientation: portrait or landscape', 'Brightness: 2,500–5,000 nits', 'Content: digital advertising loop'],
    idealFor: ['Retail & QSR promotions', 'Pedestrian zones', 'Bus stop advertising', 'Hyperlocal offers & discounts', 'Consumer product launches'],
    related: ['led-display', 'bus-shelter', 'pole-kiosk'],
    faqs: [
      { q: 'What locations in Rewari have digital kiosks?', a: 'Digital kiosks in Rewari are positioned near Rewari Bus Stand, market entry points in Sadar Bazar, and commercial corridors in Model Town. These locations see high pedestrian footfall throughout the day.' },
      { q: 'Can I run time-targeted content on a digital kiosk?', a: 'Yes — digital kiosks support time-of-day scheduling. You can run breakfast promotions in the morning, lunch deals at noon, and evening offers — all on a single booking.' },
      { q: 'What is the minimum booking period for a digital kiosk?', a: 'Most digital kiosks in Rewari are bookable weekly or monthly. Short-term promotions of 1–4 weeks are common. Contact us to check availability for your desired location and period.' },
    ],
  },

  'bus-shelter': {
    name: 'Bus Shelter', category: 'Transit & Street',
    tagline: 'Transit-point panel advertising',
    desc: 'Bus shelter panels capture three audiences simultaneously: commuters waiting at the stop, pedestrians walking past, and vehicles slowing near the stop. High dwell time makes them uniquely effective for detailed messaging. Rewari\'s bus stands and key transit stops are among the highest-footfall points in the city.',
    specs: ['Panel size: 4×6 ft standard', 'Height: 5–7 ft from ground', 'Illumination: backlit', 'Audience: seated commuters + pedestrians', 'Dwell time: 5–25 minutes'],
    idealFor: ['FMCG product launches', 'Mobile & app brands', 'Healthcare & pharmacy', 'Education & coaching', 'Government & public services'],
    related: ['pole-kiosk', 'digital-kiosk', 'footpath-kiosk'],
    faqs: [
      { q: 'How effective are bus shelter ads for reaching local Rewari audiences?', a: 'Very effective. Commuters at Rewari Bus Stand and major bus stops spend 5–25 minutes waiting — far longer than any other OOH touchpoint. This dwell time enables detailed messaging that highway formats cannot support.' },
      { q: 'Can I book a single bus shelter panel or do I need to book all panels at a location?', a: 'Individual panels can be booked. Rewari bus shelter units typically have 2–4 advertising panels per structure. You can book one, some, or all panels depending on your budget and saturation goal.' },
      { q: 'Are bus shelter panels illuminated at night?', a: 'Yes — all bus shelter advertising panels in our Rewari inventory are backlit, providing full visibility during evening and early-morning commuter hours.' },
    ],
  },

  'pole-kiosk': {
    name: 'Pole Kiosk', category: 'Transit & Street',
    tagline: 'Streetside double-sided pole panel',
    desc: 'Pole kiosks are double-sided display panels mounted on existing utility poles or dedicated kiosk poles along roads and footpaths. They saturate a locality with brand messaging by repeating at 100–200 metre intervals, creating a corridor of brand presence along a street or market.',
    specs: ['Panel size: 2×4 ft typical', 'Double-sided: both directions', 'Height: 6–10 ft', 'Material: aluminium / flex', 'Sold as: single or corridor clusters'],
    idealFor: ['Locality brand saturation', 'Event direction signage', 'Franchise & retail promotion', 'Healthcare / pharmacy chains', 'Political campaigns'],
    related: ['bus-shelter', 'traffic-booth', 'road-divider'],
    faqs: [
      { q: 'How many pole kiosks do I need to effectively brand a locality in Rewari?', a: 'For meaningful saturation of a 1 km market stretch, typically 8–12 pole kiosks spaced 80–100 m apart creates a strong brand corridor. We can map out optimal placement across your target locality.' },
      { q: 'Are pole kiosks effective for direction-signage campaigns?', a: 'Pole kiosks are ideal for directional campaigns. Positioned at every turn and key junction, they guide foot and vehicle traffic to your location — effective for new store launches, event venues, and clinic/hospital promotions.' },
      { q: 'What is the minimum number of pole kiosks I can book in Rewari?', a: 'You can book as few as 1 individual pole kiosk. However, for meaningful campaign impact, most advertisers book a minimum corridor of 5–10 kiosks in a target locality.' },
    ],
  },

  'traffic-booth': {
    name: 'Traffic Booth', category: 'Transit & Street',
    tagline: 'Police traffic booth wrap advertising',
    desc: 'Traffic booths are wrapped with brand messaging on all visible faces. Positioned at major junctions managed by traffic police, they are at eye level for every driver and pedestrian who stops at the junction — a zero-attention-cost, unavoidable brand touchpoint.',
    specs: ['Wrap area: 4–6 sides of booth', 'Height: 6–8 ft', 'Junction position: centre of road', 'Audience: stopped vehicles at red light', 'Dwell: 30–120 seconds per stop'],
    idealFor: ['High-frequency recall campaigns', 'FMCG brand reinforcement', 'Traffic safety messaging', 'Local government messaging', 'Finance & insurance brands'],
    related: ['pole-kiosk', 'toll-naka', 'road-divider'],
    faqs: [
      { q: 'Where are traffic booth advertising opportunities in Rewari?', a: 'Traffic booths in Rewari are positioned at major controlled junctions — including Delhi Road crossing, NH-48 junction, Gurudwara Chowk, and Sadar Bazar intersection. These are the city\'s highest-dwell OOH touchpoints for vehicle audiences.' },
      { q: 'How long do vehicles actually spend in view of a traffic booth?', a: 'At busy junctions in Rewari, vehicles wait 30–90 seconds per red light cycle. Drivers facing a traffic booth during this dwell time cannot avoid the display — making traffic booths exceptionally high-frequency touchpoints for commuters who cross that junction daily.' },
      { q: 'Is traffic booth advertising approved by the municipality in Rewari?', a: 'Yes — all traffic booth locations in our inventory are operated in coordination with Rewari Municipal Council and the Rewari traffic police. Permissions are handled by Rewari Hoardings.' },
    ],
  },

  'toll-naka': {
    name: 'Toll Naka', category: 'Transit & Street',
    tagline: 'Highway toll-point captive advertising',
    desc: 'Toll plazas are among the most captive advertising environments on Indian highways — every vehicle slows to a near-stop and the occupants look around while the transaction completes. NH-48 toll points near Rewari offer guaranteed exposure to intercity motorists, a high-income traveller demographic.',
    specs: ['Placement: toll booth facade, overhead gantry, side hoarding', 'Dwell time: 45–180 seconds', 'Audience: every vehicle on the highway', 'Traffic: 20,000+ vehicles/day on NH-48', 'Format: print panels or digital screens'],
    idealFor: ['Premium brand targeting', 'Automobile & tyre brands', 'Finance & credit cards', 'Fuel & EV brands', 'Tourism & hospitality'],
    related: ['gantry', 'road-divider', 'unipole'],
    faqs: [
      { q: 'Which toll plazas near Rewari are available for advertising?', a: 'The NH-48 toll plazas nearest to Rewari see significant intercity vehicle volume. Contact us for current availability at specific toll points as inventory varies by toll operator agreement.' },
      { q: 'What formats are available at toll nakas near Rewari?', a: 'Toll advertising formats include: side hoardings adjacent to toll booths, overhead gantries across the approach road, and booth-wrap panels visible to queuing traffic. Digital screens are available at select modern toll plazas.' },
      { q: 'Who is the target audience at a toll naka on NH-48 near Rewari?', a: 'NH-48 toll traffic is predominantly intercity — private cars, commercial vehicles, and buses traveling between Delhi, Haryana, Rajasthan, and Gujarat. This makes toll advertising ideal for brands targeting highway travellers, commercial decision-makers, and urban migrant workers.' },
    ],
  },

  'road-divider': {
    name: 'Road Divider', category: 'Transit & Street',
    tagline: 'Central median strip advertising panels',
    desc: 'Road divider panels are mounted on the central median of dual-carriageway roads. They are visible to traffic travelling in both directions and reach every vehicle on the road without line-of-sight barriers. In Rewari, dual-carriageway roads near the bus stand and NH-48 service roads offer this format.',
    specs: ['Panel size: 3×6 ft to 4×8 ft', 'Mounted: on median railing or post', 'Double-sided: both carriageways', 'Spacing: 50–100 m intervals', 'Height: 4–8 ft from ground'],
    idealFor: ['High-frequency corridor branding', 'Local brand saturation', 'FMCG & consumer goods', 'Healthcare & education', 'Directional campaigns'],
    related: ['pole-kiosk', 'traffic-booth', 'toll-naka'],
    faqs: [
      { q: 'Are road divider panels double-sided?', a: 'Yes — road divider panels face both carriageways, meaning they reach traffic moving in both directions simultaneously. This makes them very cost-efficient on busy two-way roads.' },
      { q: 'Which roads in Rewari have road divider advertising panels?', a: 'Road divider advertising is available on dual-carriageway sections of the Delhi Road and NH-48 service road near Rewari. Contact us to check current availability at specific stretches.' },
      { q: 'How is road divider advertising different from a hoarding?', a: 'Road dividers are smaller panels close to traffic on the median — designed for high-frequency repeat impressions as drivers pass daily. They complement hoardings, which are larger and viewed from further away.' },
    ],
  },

  'footpath-kiosk': {
    name: 'Footpath Kiosk', category: 'Transit & Street',
    tagline: 'Pedestrian-path display panel',
    desc: 'Footpath kiosks are display panels positioned along pedestrian walkways and market corridors in Rewari. At eye level for walkers, they engage the key shopping audience — the pedestrian browser — with close-range, high-dwell brand messaging near retail zones.',
    specs: ['Panel size: 2×3 ft to 3×5 ft', 'Height: 5–7 ft from ground', 'Orientation: portrait', 'Audience: pedestrians & footpath traffic', 'Location: market corridors, commercial streets'],
    idealFor: ['Retail promotions', 'Local service brands', 'Healthcare & pharmacy', 'Food & restaurant', 'Coaching & education'],
    related: ['bus-shelter', 'pole-kiosk', 'digital-kiosk'],
    faqs: [
      { q: 'Where are footpath kiosks located in Rewari?', a: 'Footpath kiosks are positioned in the key pedestrian commercial corridors — Sadar Bazar, New Grain Market, Model Town market, and near Rewari Bus Stand. These locations see heavy foot traffic during market hours.' },
      { q: 'Are footpath kiosks effective for local retail advertising in Rewari?', a: 'Very effective. A shopper walking past a footpath kiosk in a market corridor is in active buying mode — far more receptive to retail and service messaging than a driver on the highway. Footpath kiosks deliver hyperlocal audience precision.' },
      { q: 'Can I book a footpath kiosk for a one-week promotion?', a: 'Yes — footpath kiosks can be booked for as little as one week for short-term promotions, sale events, or new store launches. Standard minimum is 2 weeks.' },
    ],
  },

  'railway-station': {
    name: 'Railway Station', category: 'Transit & Street',
    tagline: 'Platform and station concourse advertising',
    desc: 'Rewari Railway Station is one of the busiest junction stations in Haryana, with trains on the Delhi–Rewari–Jaipur and Delhi–Rewari–Bhiwani routes. Station advertising captures a captive, dwell-time audience — commuters waiting on platforms, travellers in the concourse, and daily passengers who pass through multiple times a week.',
    specs: ['Formats: platform hoardings, concourse panels, backlit displays', 'Platform dwell: 5–45 minutes', 'Footfall: 20,000+ passengers/day', 'License: Indian Railways / zonal authority', 'Placement: platform, concourse, exit'],
    idealFor: ['Mass commuter reach', 'FMCG saturation', 'Telecom & banking', 'Education & coaching', 'Government campaigns'],
    related: ['bus-shelter', 'digital-kiosk', 'pole-kiosk'],
    faqs: [
      { q: 'What advertising formats are available at Rewari Railway Station?', a: 'Railway station advertising at Rewari includes platform hoardings (visible from the train and platform), concourse backlit panels, exit-gate panels, and station name hoardings. Digital display options are available at select positions.' },
      { q: 'How many passengers pass through Rewari Railway Station daily?', a: 'Rewari Railway Station handles 20,000+ passengers per day as a junction station on multiple rail routes including Delhi–Jaipur, Delhi–Bhiwani, and metre-gauge routes. It is one of Haryana\'s busiest junction stations.' },
      { q: 'Who approves railway station advertising in Rewari?', a: 'Railway station advertising is licensed through the Indian Railways / North Western Railway zonal authority. Rewari Hoardings manages the necessary approvals and coordination for station advertising placements.' },
    ],
  },

  'auto-rickshaw': {
    name: 'Auto Rickshaw', category: 'Vehicle Branding',
    tagline: 'Mobile rear-panel and hood advertising',
    desc: 'Auto rickshaw branding turns Rewari\'s large auto fleet into a network of mobile billboards. Advertising on the rear panel, hood, and side panels reaches pedestrians, footpath dwellers, and slow-moving traffic in localities that larger hoardings miss — particularly effective in dense market lanes and residential areas.',
    specs: ['Formats: rear panel, hood, side panels', 'Fleet size: 10–500+ autos', 'Reach: city-wide mobile coverage', 'Creative: vinyl wrap or printed panel', 'Frequency: daily routes across Rewari'],
    idealFor: ['Hyperlocal brand saturation', 'Market area reach', 'FMCG & consumer goods', 'Healthcare & pharmacy', 'Education & coaching institutes'],
    related: ['e-rickshaw', 'bus-branding', 'mobile-van'],
    faqs: [
      { q: 'How many auto rickshaws are in Rewari that can be branded?', a: 'Rewari has several hundred active auto rickshaws operating city routes. Campaign sizes range from 10 autos for hyperlocal reach to 200+ for city-wide saturation. We coordinate with auto unions to facilitate fleet bookings.' },
      { q: 'What parts of an auto rickshaw can be branded?', a: 'Auto rickshaws can be branded on the rear panel (most visible to following traffic), the hood/front fascia, both side panels, and the interior roof (visible to passengers). Most campaigns use at least the rear panel.' },
      { q: 'How long do auto rickshaw branding campaigns typically run?', a: 'Auto branding campaigns typically run for 1–3 months. Shorter campaigns of 2–4 weeks are possible for event-based promotions. Longer commitments get better per-day rates.' },
    ],
  },

  'e-rickshaw': {
    name: 'E-Rickshaw', category: 'Vehicle Branding',
    tagline: 'Electric last-mile fleet branding',
    desc: 'E-rickshaws are the dominant last-mile transport in Rewari — running fixed routes through localities that autos and buses do not always serve. Branding the e-rickshaw fleet delivers repeat daily impressions to the same residential and market-area audiences, making them ideal for local brand building.',
    specs: ['Coverage: residential & market lanes', 'Routes: fixed daily corridors', 'Branding: rear, sides, canopy', 'Fleet: 10–300+ units available', 'Audience: last-mile commuters'],
    idealFor: ['Residential area targeting', 'FMCG & grocery brands', 'Coaching & tuition', 'Healthcare & pharmacy', 'Local retail chains'],
    related: ['auto-rickshaw', 'bus-branding', 'mobile-van'],
    faqs: [
      { q: 'Which localities in Rewari do e-rickshaws cover for advertising?', a: 'E-rickshaws in Rewari primarily operate fixed routes through residential zones — Subhash Nagar, Model Town, Jat College Road, and lanes connecting to the bus stand and railway station. These are localities that larger vehicles cannot reach.' },
      { q: 'What is the difference between auto-rickshaw and e-rickshaw branding?', a: 'Auto rickshaws operate across the city on passenger demand and cover a wider, less predictable territory. E-rickshaws run more fixed last-mile routes through specific residential corridors — useful for precisely targeting a locality. Both are complementary.' },
      { q: 'Can I book e-rickshaw branding for a single locality in Rewari?', a: 'Yes — we can identify e-rickshaw fleets operating specific routes through your target locality and arrange a focused booking. This is ideal for neighbourhood-level campaigns like coaching institute or pharmacy promotions.' },
    ],
  },

  'bus-branding': {
    name: 'Bus Branding', category: 'Vehicle Branding',
    tagline: 'Full-bus or panel wrap advertising',
    desc: 'Bus branding converts Rewari\'s Haryana Roadways and private bus fleet into large moving billboards. A full-bus wrap creates an unmissable rolling advertisement visible to all roadside audiences, while partial-panel bookings on the rear and sides offer more affordable entry points for smaller budgets.',
    specs: ['Full wrap: all exterior surfaces', 'Partial: rear panel, side panels, interior', 'Routes: Rewari–Delhi, Rewari–Jaipur, local', 'Creative: vinyl wrap print', 'Passengers per bus: 60–90'],
    idealFor: ['City-wide reach campaigns', 'FMCG & consumer electronics', 'Real-estate projects', 'Telecom & app brands', 'Government & public schemes'],
    related: ['auto-rickshaw', 'mobile-van', 'bus-shelter'],
    faqs: [
      { q: 'Which bus routes are available for branding near Rewari?', a: 'Haryana Roadways buses operating from Rewari Bus Stand cover routes to Delhi, Gurugram, Jaipur, Bhiwani, and Jhajjar. Branding on these routes reaches audiences across the full NH-48 corridor — well beyond Rewari city limits.' },
      { q: 'What is the difference between a full bus wrap and panel advertising?', a: 'A full bus wrap covers the entire exterior including front, rear, roof, and both sides — maximum visual impact but higher cost. Panel advertising books the rear or side panels only — more affordable and still highly effective for a single brand message.' },
      { q: 'How are bus branding campaigns priced in Rewari?', a: 'Bus branding is priced per bus per month. Rates depend on whether you book full wrap, partial panels, and whether the route is local or long-distance. Contact us with your budget and target reach to get a fleet recommendation.' },
    ],
  },

  'mobile-van': {
    name: 'Mobile Van', category: 'Vehicle Branding',
    tagline: 'Branded van for targeted locality activation',
    desc: 'Branded mobile vans drive a customised route through Rewari\'s localities, parting brand messaging to specific areas on specific days. They can be deployed to cover market days, festivals, or concentrated campaigns around new store launches — delivering geographic precision unavailable from fixed OOH media.',
    specs: ['Vehicle: mini-van / tempo traveller', 'Branding: all-sides vinyl wrap', 'Audio: optional PA system', 'Coverage: route-planned locality by locality', 'Duration: daily / weekly deployment'],
    idealFor: ['Hyperlocal activation', 'Market-day campaigns', 'Launch announcements', 'Festival & event promotion', 'FMCG rural/peri-urban push'],
    related: ['auto-rickshaw', 'e-rickshaw', 'bus-branding'],
    faqs: [
      { q: 'Can I choose which localities the mobile van covers in Rewari?', a: 'Yes — mobile van campaigns are fully route-planned. You specify the localities and time windows, and we design the daily route to maximise your target-area coverage. Routes can change day-to-day.' },
      { q: 'Can the van include a public announcement system?', a: 'Yes — mobile vans can be fitted with a PA system for audio branding alongside the visual display. This is particularly effective for local retail promotions, political campaigns, and event announcements.' },
      { q: 'How much advance notice do I need to book a mobile van campaign?', a: 'A 3–5 day lead time is typically sufficient for mobile van campaigns in Rewari. For large-scale activations requiring multiple vans, 7–10 days notice is preferred.' },
    ],
  },

  'tractor-branding': {
    name: 'Tractor Branding', category: 'Vehicle Branding',
    tagline: 'Agricultural vehicle advertising for rural reach',
    desc: 'Tractor branding is a uniquely effective format for reaching agricultural communities and rural audiences around Rewari. Tractors travel to fields, mandis, and rural markets — taking brand messages into areas that conventional OOH never reaches. Particularly effective during sowing and harvest seasons when farm activity peaks.',
    specs: ['Branding: bonnet, sides, rear panel', 'Coverage: rural lanes, mandi routes', 'Seasonality: high during Kharif/Rabi', 'Fleet: locally operated tractors', 'Audience: farmers, rural households'],
    idealFor: ['Agri-input brands (seeds, fertiliser)', 'Tractor & equipment brands', 'Rural FMCG distribution', 'Government schemes', 'Kisan credit & financial products'],
    related: ['mobile-van', 'auto-rickshaw', 'wall-painting'],
    faqs: [
      { q: 'Why is tractor branding effective around Rewari?', a: 'Rewari district has significant agricultural land. Tractors travel to mandis in Rewari, Kosli, and surrounding towns, carrying brand messages to a farm-owning audience that has significant purchasing power for agri-inputs, durables, and financial products — but is largely unreached by urban OOH.' },
      { q: 'When is the best season for tractor branding campaigns in Rewari?', a: 'The two key agricultural seasons — Kharif (June–October) and Rabi (November–March) — see peak tractor activity. Campaigns aligned with input purchase seasons (June–July and October–November) reach farmers when agri-spending decisions are being made.' },
      { q: 'How many tractors can be branded in Rewari?', a: 'We work with local tractor operators to facilitate fleet branding. Campaigns of 20–200 tractors can be arranged depending on the season. Contact us with your target area and audience to get a feasibility estimate.' },
    ],
  },

  'society-gate': {
    name: 'Society Gate', category: 'Ambient & Contextual',
    tagline: 'Residential colony entry-gate branding',
    desc: 'Society gate branding positions your brand at the entry and exit of residential colonies — capturing every resident and visitor at a natural dwell and attention point. In Rewari\'s planned residential areas, gate branding delivers daily impressions to a defined neighbourhood audience.',
    specs: ['Format: fabric / metal banner on gate arch', 'Size: variable to gate width', 'Placement: colony main entry gate', 'Audience: all residents + visitors', 'Frequency: every entry/exit'],
    idealFor: ['Hyperlocal retail', 'Neighbourhood services', 'Healthcare & pharmacy', 'Education & coaching', 'Property & real-estate'],
    related: ['market-gate', 'school-college-gate', 'pole-kiosk'],
    faqs: [
      { q: 'Which residential colonies in Rewari have society gate branding?', a: 'Society gate advertising is available across multiple planned residential colonies in Rewari. Contact us with your target localities and we will identify specific gates available within your budget.' },
      { q: 'How often does the same audience see a society gate ad?', a: 'Residents pass the same gate 2–6 times daily — morning, evening, and for errands. This high repetition frequency builds strong brand recall with a defined neighbourhood audience within a few weeks.' },
      { q: 'Is society gate advertising cost-effective for local businesses in Rewari?', a: 'Very cost-effective. Society gate branding reaches a defined neighbourhood audience at low cost, with extremely high frequency. It is ideal for coaching institutes, clinics, pharmacies, and delivery services targeting specific colony residents.' },
    ],
  },

  'school-college-gate': {
    name: 'School / College Gate', category: 'Ambient & Contextual',
    tagline: 'Educational institution entrance branding',
    desc: 'School and college gate branding reaches students, parents, and faculty at the most attentive point of their day — the institution entrance. With parents waiting during drop-off and pick-up, dwell times are extended compared to most OOH formats. Rewari has several prominent schools and colleges that generate significant daily foot traffic.',
    specs: ['Placement: main gate, gate arch banner', 'Audience: students, parents, staff', 'Peak time: morning 7–9 AM, afternoon 1–4 PM', 'Creative: fabric or metal panel', 'Dwell: 5–30 min for waiting parents'],
    idealFor: ['EdTech & coaching brands', 'Stationery & school supplies', 'FMCG targeting youth', 'Healthcare & nutrition', 'Banking & youth savings'],
    related: ['society-gate', 'market-gate', 'footpath-kiosk'],
    faqs: [
      { q: 'Which schools and colleges in Rewari have gate advertising?', a: 'Gate advertising is available at several prominent educational institutions in Rewari. Contact us for current availability — we will match you with schools or colleges aligned to your target demographic (primary, secondary, or higher education).' },
      { q: 'Why is school gate advertising effective for edtech and coaching brands?', a: 'Parents waiting at school gates are actively thinking about their children\'s education. A coaching institute or edtech product advertised at the school gate reaches the decision-maker (parent) in a highly receptive mental state — a context no other format can replicate.' },
      { q: 'Can I advertise at multiple school gates simultaneously in Rewari?', a: 'Yes — bundled school gate campaigns across 3, 5, or 10 institutions are available, providing blanket youth-demographic coverage across Rewari. Discounts apply for multi-gate bookings.' },
    ],
  },

  'market-gate': {
    name: 'Market Gate', category: 'Ambient & Contextual',
    tagline: 'Wholesale and retail market entrance branding',
    desc: 'Market gate advertising positions brands at the entry of Rewari\'s commercial markets — grain market, cloth market, Sadar Bazar, and others — capturing every visitor in active buying mode. The shopping-intent audience makes market gates one of the highest-conversion OOH touchpoints for consumer and trade brands.',
    specs: ['Format: gate banner / arch panel', 'Size: variable to gate span', 'Audience: shoppers + trade buyers', 'Frequency: every market visit', 'Peak: weekdays & haat days'],
    idealFor: ['FMCG & consumer goods', 'Trade branding (dealer/distributor)', 'Agri-inputs near grain market', 'Finance & B2B services', 'Retail promotional events'],
    related: ['society-gate', 'hoarding', 'wall-painting'],
    faqs: [
      { q: 'Which markets in Rewari have gate advertising available?', a: 'Market gate advertising is available at Sadar Bazar, New Grain Market, Cloth Market, and other commercial clusters in Rewari. Contact us to check availability at your preferred market.' },
      { q: 'Why is market gate advertising good for trade brands?', a: 'New Grain Market and wholesale markets in Rewari attract hundreds of traders, retailers, and distributors daily. A brand visible at the market gate reaches these trade buyers repeatedly — ideal for agri-inputs, wholesale FMCG, and B2B services that want trade-level awareness.' },
      { q: 'Is market gate advertising available for short-term campaigns?', a: 'Yes — minimum booking for market gate advertising is typically 2–4 weeks. Festival sale periods and harvest season campaigns are the most popular short-term bookings.' },
    ],
  },

  'hospital-branding': {
    name: 'Hospital Branding', category: 'Ambient & Contextual',
    tagline: 'Healthcare facility entrance and waiting-area advertising',
    desc: 'Hospital and clinic branding reaches patients, caregivers, and medical staff in a context where health and wellbeing is top of mind. Formats include entrance gate panels, waiting-area displays, and building-face hoardings. The health-conscious audience mindset makes hospital advertising ideal for pharmaceutical, nutrition, and insurance brands.',
    specs: ['Formats: gate panel, entrance hoarding, waiting-area display', 'Audience: patients, attendants, staff', 'Dwell: 30 min – 4 hours (waiting)', 'Context: health-focussed mindset', 'Locations: government hospital, private clinics'],
    idealFor: ['Pharmaceutical brands', 'Nutrition & supplements', 'Health insurance', 'Medical devices & equipment', 'Healthcare services'],
    related: ['atm-branding', 'petrol-pump', 'society-gate'],
    faqs: [
      { q: 'What advertising opportunities exist at hospitals in Rewari?', a: 'Hospital advertising in Rewari includes entrance gate panels (visible to all arriving patients), display boards in waiting areas (extended dwell time of 30 min to 4 hours), and building-face hoardings on the hospital facade. Contact us for specific location availability.' },
      { q: 'Is hospital advertising effective for pharmaceutical brands in Rewari?', a: 'Highly effective. Patients visiting a hospital or clinic are directly in the purchase mindset for health products and medicines. A pharmaceutical or nutraceutical brand visible at the hospital gate or waiting area reaches the most receptive possible audience.' },
      { q: 'Are there any restrictions on what can be advertised at hospitals?', a: 'Certain categories (tobacco, alcohol, prescription drugs without disclaimers) are restricted near healthcare facilities. OTC pharma, supplements, insurance, and general health products are appropriate. Contact us and we will confirm category suitability for a specific location.' },
    ],
  },

  'petrol-pump': {
    name: 'Petrol Pump', category: 'Ambient & Contextual',
    tagline: 'Fuel station dwell-point advertising',
    desc: 'Petrol pump advertising captures motorists during the 3–8 minute fuelling stop — one of the longest vehicle-side dwell times in the OOH landscape. Formats include pump topper panels, canopy banners, pillar wraps, and digital displays. The captive, stationary audience guarantees message absorption that highway hoardings rarely achieve.',
    specs: ['Formats: pump topper, canopy banner, pillar wrap, entrance hoarding', 'Dwell time: 3–8 minutes per vehicle', 'Audience: vehicle owners, drivers', 'Peak: morning rush, evenings', 'Location: NH-48, main Rewari roads'],
    idealFor: ['Automobile & tyre brands', 'Motor oil & lubricants', 'Banking & credit cards', 'FMCG & impulse products', 'Mobile & telecom'],
    related: ['atm-branding', 'hospital-branding', 'digital-kiosk'],
    faqs: [
      { q: 'What advertising formats are available at petrol pumps in Rewari?', a: 'Petrol pump advertising in Rewari includes pump topper displays (eye-level panels beside each pump), canopy banners (visible from the road), pillar wraps, entrance hoardings, and interior display boards near the payment counter.' },
      { q: 'Why is petrol pump advertising particularly effective for automobile brands?', a: 'A driver fuelling their vehicle is literally thinking about their car — maintenance, performance, and upgrades are front of mind. Tyre, lubricant, and accessory brands reaching this audience at the pump achieve far higher message relevance than any other OOH context.' },
      { q: 'How many petrol pumps in Rewari are available for advertising?', a: 'Rewari has multiple petrol pumps on NH-48 and the main city roads. Contact us for current availability and to review specific pump locations by traffic volume and area.' },
    ],
  },

  'dhaba-restaurant': {
    name: 'Dhaba & Restaurant', category: 'Ambient & Contextual',
    tagline: 'Highway eatery and restaurant branding',
    desc: 'Highway dhabas on NH-48 near Rewari are mandatory stops for long-distance truck drivers, intercity travellers, and local diners. Advertising in and around these establishments — entrance boards, menu panel inserts, table-top displays — reaches a relaxed, food-satisfied audience with high receptivity.',
    specs: ['Formats: entrance board, banner, table-top, indoor poster', 'Audience: highway travellers, local diners', 'Dwell: 20–60 minutes per visit', 'Peak: lunch (12–2 PM), dinner (7–10 PM)', 'Route: NH-48 highway dhabas + local restaurants'],
    idealFor: ['FMCG & beverage brands', 'Tobacco-alternative brands', 'Mobile & telecom', 'Rural finance & insurance', 'Agri & tractor brands (truck driver audience)'],
    related: ['petrol-pump', 'wall-painting', 'flex-banner'],
    faqs: [
      { q: 'Why are highway dhabas on NH-48 near Rewari valuable for advertising?', a: 'NH-48 dhabas attract long-distance truck drivers, bus passengers, and road-trippers. This captive audience — mid-journey, relaxed, and often making purchase decisions for the rest of the trip — is highly receptive to branding in a dhaba setting.' },
      { q: 'What formats work best for dhaba advertising near Rewari?', a: 'Entrance boards create outdoor visibility for passing traffic. Indoor table-top displays reach the seated, relaxed diner with extended engagement. Menu-card inserts are unavoidable brand touchpoints. A combination of outdoor + indoor formats maximises reach.' },
      { q: 'Is dhaba branding available at multiple locations on NH-48?', a: 'Yes — we work with a network of dhabas along NH-48 near Rewari. Multi-location bookings create a corridor of brand presence for any traveller using the highway.' },
    ],
  },

  'no-parking-board': {
    name: 'No-Parking Board', category: 'Ambient & Contextual',
    tagline: 'Brand-sponsored no-parking signage',
    desc: 'No-parking boards sponsored by brands are a low-cost, high-frequency ambient format. Positioned at building entrances, market lanes, and commercial properties, they are read carefully by every driver looking for parking — a moment of close attention that few OOH formats achieve.',
    specs: ['Size: 12×18 in to 18×24 in standard', 'Format: brand logo + no-parking message', 'Placement: walls, poles, shop fronts', 'Audience: drivers seeking parking', 'Number: typically sold in clusters of 20+'],
    idealFor: ['Local brand saturation', 'Restaurant & retail promotion', 'Healthcare & pharmacy', 'Hyperlocal awareness', 'Quick-service brand recall'],
    related: ['pole-kiosk', 'traffic-booth', 'flex-banner'],
    faqs: [
      { q: 'How does no-parking board advertising work for brands?', a: 'A brand sponsors the production of official-looking no-parking boards that include the brand name or logo alongside the no-parking message. These are placed at building entrances and commercial properties across the target locality — creating hundreds of small brand impressions wherever parking is restricted.' },
      { q: 'How many no-parking boards do I need for effective coverage in Rewari?', a: 'Minimum campaigns typically start at 50 boards to ensure meaningful locality coverage. City-wide saturation campaigns use 200–500 boards. Individual boards are inexpensive — the volume creates the impact.' },
      { q: 'Is no-parking board advertising permitted in Rewari?', a: 'No-parking boards must comply with Rewari municipal guidelines. Rewari Hoardings coordinates placement in compliance with local civic norms. Boards are placed on private property or with permission from building owners.' },
    ],
  },

  'atm-branding': {
    name: 'ATM Branding', category: 'Ambient & Contextual',
    tagline: 'Bank ATM booth and surround advertising',
    desc: 'ATM branding wraps the exterior of ATM booths or places panels on ATM surrounds. The user standing at an ATM has focused attention and extended dwell time — 2–4 minutes — making them highly receptive to financial product, insurance, and premium brand messaging. ATM locations in Rewari\'s commercial zones see hundreds of daily users.',
    specs: ['Formats: booth wrap, door panel, interior screen insert', 'Dwell: 2–4 minutes per user', 'Audience: bank account holders', 'Peak: 9 AM–12 PM, 4 PM–8 PM', 'Locations: commercial ATMs across Rewari'],
    idealFor: ['Financial products & insurance', 'Credit card & loan brands', 'Premium FMCG', 'Mobile & UPI payment brands', 'Mutual funds & investment products'],
    related: ['petrol-pump', 'hospital-branding', 'digital-kiosk'],
    faqs: [
      { q: 'What advertising formats are available on ATMs in Rewari?', a: 'ATM advertising in Rewari includes exterior booth wraps (all-sides vinyl), door panel inserts (highly visible entry point), and kiosk-style panels adjacent to the ATM enclosure. Some modern ATM cabins also accept interior screen advertising.' },
      { q: 'Who is the ATM advertising audience in Rewari?', a: 'ATM users in Rewari are predominantly adults with bank accounts and active transaction behaviour — a financially engaged audience with above-average income. This makes ATM advertising ideal for financial products, insurance, and premium consumer brands.' },
      { q: 'Are bank ATMs in Rewari available for third-party advertising?', a: 'Advertising around ATMs is subject to bank partner permissions. We work with property owners and ATM site managers for placement of panels near or around ATM enclosures. Contact us to check availability at specific locations in Rewari.' },
    ],
  },

  'water-tank': {
    name: 'Water Tank Hoarding', category: 'Ambient & Contextual',
    tagline: 'Elevated water tank surface advertising',
    desc: 'Municipal and building water tanks are elevated structures visible over large residential areas. Branding on their surfaces creates a high-altitude, long-range display with 360-degree visibility across the surrounding neighbourhood. In Rewari\'s planned residential zones, water tank hoardings are a distinctive ambient format.',
    specs: ['Height: 20–60 ft elevated structure', 'Surface area: 100–600 sqft', 'Visibility: 360-degree, 300–500 m radius', 'Material: painted or vinyl wrap', 'Durability: 12–36 month paint campaigns'],
    idealFor: ['Hyperlocal residential awareness', 'Long-duration brand presence', 'Real-estate & infrastructure brands', 'Government & civic messaging', 'Neighbourhood services'],
    related: ['rooftop-hoarding', 'hoarding', 'wall-painting'],
    faqs: [
      { q: 'How visible is a water tank hoarding in Rewari?', a: 'Water tanks are typically the highest point in a residential block, visible from 300–500 metres in all directions. In flat areas like Rewari, a painted or wrapped water tank can be seen from a wide surrounding radius — more than any ground-level hoarding.' },
      { q: 'Is water tank branding painted or vinyl?', a: 'Smaller tanks are typically painted with brand messaging — a highly durable method that lasts 12–36 months without maintenance. Larger tanks may use vinyl wrap for crisper graphics. Both methods are available depending on the tank surface.' },
      { q: 'Who owns the water tanks available for advertising in Rewari?', a: 'Water tanks are owned by Rewari Municipal Corporation, housing societies, or private building owners. Advertising rights are negotiated with the respective owner. All tanks in our inventory have confirmed advertising permissions.' },
    ],
  },

  'pamphlet-distribution': {
    name: 'Pamphlet Distribution', category: 'Print & Hyperlocal',
    tagline: 'Door-to-door and market leaflet distribution',
    desc: 'Pamphlet distribution delivers printed leaflets directly to homes, shops, and market visitors in Rewari. As a hyperlocal format, it enables street-level geographic targeting that no billboard or digital format can match. Effective for new store launches, event announcements, and short-term offers in specific localities.',
    specs: ['Format: A5 / A4 / half-page leaflet', 'Distribution: door-to-door, market hand-out', 'Quantity: 1,000–100,000+ units', 'Targeting: locality-by-locality', 'Lead time: 2–3 days print + distribution'],
    idealFor: ['New store / clinic launches', 'Restaurant & delivery promotions', 'Event announcements', 'Coaching institute enrolment', 'Festival sale events'],
    related: ['newspaper-insert', 'flex-banner', 'poster'],
    faqs: [
      { q: 'How many pamphlets do I need to cover a locality in Rewari?', a: 'A typical Rewari locality has 500–3,000 households. For door-to-door coverage, plan 1.5× the household count to account for shops and non-response. A full locality campaign with 2,000 pamphlets is a common starting point.' },
      { q: 'Can pamphlets be distributed in specific market zones in Rewari?', a: 'Yes — pamphlet distribution can be targeted to specific markets (Sadar Bazar, New Grain Market), residential streets, or institution-entry points (school gates, hospital exits). We plan the distribution route and supervise execution.' },
      { q: 'How quickly can a pamphlet campaign be executed in Rewari?', a: 'With a ready design file, printing takes 1 day and distribution can begin the next morning. Total lead time from brief to in-hand is typically 2–3 working days — making pamphlet campaigns the fastest OOH option.' },
    ],
  },

  'newspaper-insert': {
    name: 'Newspaper Insert', category: 'Print & Hyperlocal',
    tagline: 'Loose leaflet insert in local newspaper',
    desc: 'Newspaper inserts are loose printed leaflets delivered inside the morning newspaper. Unlike pamphlet distribution, newspaper inserts reach the home in a trusted, attention-positive moment — when the reader is settled and engaged. Local Hindi dailies in Rewari have strong residential penetration in the target market segments.',
    specs: ['Format: A5–A3 printed leaflet', 'Delivery: inside morning newspaper', 'Publication: local Hindi dailies in Rewari', 'Circulation: 5,000–30,000 copies', 'Targeting: city-wide or by route'],
    idealFor: ['Real-estate launches', 'Banking & financial products', 'Retail sale events', 'Healthcare services', 'Education & coaching'],
    related: ['newspaper-ad', 'pamphlet-distribution', 'poster'],
    faqs: [
      { q: 'Which newspapers in Rewari accept insert advertising?', a: 'Popular Hindi dailies with strong Rewari circulation — including Dainik Bhaskar, Amar Ujala, and Punjab Kesari — accept loose insert advertising. Circulation figures vary by publication. Contact us for current rate cards.' },
      { q: 'What is the minimum quantity for a newspaper insert campaign in Rewari?', a: 'Most publications accept inserts starting at 5,000 copies. City-wide campaigns typically run 20,000–50,000 inserts. Route-targeted inserts (specific localities) may require a minimum run of 10,000 copies.' },
      { q: 'How far in advance should I book a newspaper insert in Rewari?', a: 'Book 7–10 days in advance to secure a slot and allow printing time. For high-demand periods (festivals, election season), book 3–4 weeks ahead to guarantee placement.' },
    ],
  },

  'newspaper-ad': {
    name: 'Newspaper Ad', category: 'Print & Hyperlocal',
    tagline: 'Display advertising in local daily press',
    desc: 'Print display ads in Rewari\'s local and regional Hindi newspapers reach a literate, decision-making audience in a trusted editorial context. From small quarter-page classifieds to full-page colour ads, newspaper advertising in Rewari combines the credibility of print with strong local market penetration.',
    specs: ['Sizes: classified, quarter-page, half-page, full page', 'Colour: black & white or colour', 'Publications: local / regional Hindi dailies', 'Lead time: 2–3 days', 'Frequency: daily or specific edition'],
    idealFor: ['Real-estate project launches', 'Retail & trade promotions', 'Government tenders & notices', 'Legal & financial announcements', 'Education institutions'],
    related: ['newspaper-insert', 'pamphlet-distribution', 'cinema-advertising'],
    faqs: [
      { q: 'Which newspapers have the best Rewari district reach for advertising?', a: 'Hindi dailies with strong district-level circulation include Dainik Bhaskar, Amar Ujala, and Rajasthan Patrika (for NH-48 corridor reach into Rajasthan). Contact us for the latest circulation data and rate cards by publication.' },
      { q: 'What is the difference between a newspaper ad and a newspaper insert?', a: 'A newspaper ad is printed as part of the newspaper itself — on the page alongside editorial content. An insert is a separately printed leaflet placed inside the folded paper. Ads have more editorial credibility; inserts allow full-colour, full-bleed design freedom.' },
      { q: 'Can I target a newspaper ad to only the Rewari district edition?', a: 'Yes — most major Hindi dailies offer district or city editions. You can run an ad in the Rewari district edition only, which reduces cost compared to a full state or national run while maintaining local relevance.' },
    ],
  },

  'flex-banner': {
    name: 'Flex Banner', category: 'Print & Hyperlocal',
    tagline: 'Temporary PVC flex banner for events and retail',
    desc: 'Flex banners are lightweight PVC printed panels used for temporary and semi-permanent advertising across shop fronts, event venues, and market lanes. Quick to print and install, they are the workhorse of local event advertising, festival promotions, and new store launches across Rewari.',
    specs: ['Material: PVC flex vinyl', 'Any size: custom to requirement', 'Installation: wall-hung, frame-mounted, or tied', 'Turnaround: 1–2 days print', 'Durability: 3–12 months outdoor'],
    idealFor: ['Festival & sale promotions', 'New store launches', 'Event banners', 'Political campaigns', 'Coaching institute enrolment'],
    related: ['poster', 'wall-painting', 'pamphlet-distribution'],
    faqs: [
      { q: 'How quickly can a flex banner be printed and installed in Rewari?', a: 'Flex banners can be designed, printed, and installed within 24–48 hours in Rewari. For urgent campaigns, same-day printing is often possible. This makes flex banners the fastest large-format print option available.' },
      { q: 'What locations in Rewari are suitable for flex banners?', a: 'Flex banners can be placed on shop fronts, boundary walls, construction hoardings, event venue facades, and any location where a property owner gives permission. They are especially common in market lanes and commercial areas.' },
      { q: 'How durable are flex banners for outdoor use in Rewari?', a: 'Good-quality 440 GSM or 550 GSM flex banner material survives 6–12 months outdoors in normal weather. For monsoon exposure, reinforced grommets and proper tensioning prevent tearing. They are not suitable for permanent installations.' },
    ],
  },

  'poster': {
    name: 'Poster', category: 'Print & Hyperlocal',
    tagline: 'Small-format wall and pole poster advertising',
    desc: 'Posters are small-format printed sheets pasted on walls, utility poles, notice boards, and commercial surfaces. In Rewari\'s market areas, posters create high-density brand presence at very low cost — effective for local events, political campaigns, and businesses with tight budgets and hyperlocal targeting needs.',
    specs: ['Sizes: A2 / A1 / double crown', 'Material: paper / weatherproof paper', 'Application: paste / tape on surfaces', 'Quantity: typically 200–5,000 units', 'Placement: walls, poles, notice boards'],
    idealFor: ['Events & concerts', 'Political campaigns', 'Local retail promotions', 'Coaching institute announcements', 'New product market entry'],
    related: ['flex-banner', 'pamphlet-distribution', 'pole-kiosk'],
    faqs: [
      { q: 'Are posters an effective advertising format in Rewari markets?', a: 'In dense market lanes where larger hoardings cannot fit, posters on shop walls and utility poles create strong visual presence at very low cost. They are most effective for events, short-term promotions, and campaigns where volume of impressions matters more than premium placement.' },
      { q: 'How many posters do I need for good coverage in a Rewari market?', a: 'For meaningful market coverage (say, Sadar Bazar or New Grain Market), 200–500 posters pasted across all key surfaces creates a saturation effect. Locality-wide coverage across multiple markets may require 1,000–5,000 units.' },
      { q: 'What is the lifespan of a poster in Rewari?', a: 'Paper posters last 2–4 weeks before weathering, overlapping, or removal reduces effectiveness. Weatherproof coated-paper posters last 4–8 weeks. For longer campaigns, flex banners are a better alternative.' },
    ],
  },

  'cinema-advertising': {
    name: 'Cinema Advertising', category: 'Experiential',
    tagline: 'Pre-show slide and on-screen cinema ads',
    desc: 'Cinema advertising in Rewari\'s local theatres places your brand in front of a captive, entertainment-mode audience in the dark — when attention is at its highest and distractions are at their lowest. Pre-show slides, on-screen video ads, and lobby displays create a complete cinema brand experience.',
    specs: ['Formats: on-screen slides, video spots, lobby displays', 'Dwell: 10–30 min pre-show wait', 'Audience: urban youth, families, couples', 'Frequency: every show (4–6 shows/day)', 'Creative: slide or MP4 video'],
    idealFor: ['Youth-oriented brands', 'FMCG & snack brands', 'Entertainment & OTT', 'Fashion & lifestyle', 'Real-estate targeting middle class'],
    related: ['led-display', 'look-walker', 'exhibition-stall'],
    faqs: [
      { q: 'What advertising formats are available at cinemas in Rewari?', a: 'Rewari\'s local cinema halls offer on-screen slide advertising (10–15 second static images shown before the film), on-screen video spots (30–60 sec), lobby standee displays, and poster panels in the foyer and corridors.' },
      { q: 'How many shows per day reach cinema advertisers in Rewari?', a: 'A typical Rewari cinema runs 4–5 shows per day, 7 days a week. A monthly on-screen booking means 120–150 ad exposures per month in front of captive, concentrated audiences.' },
      { q: 'What is the demographic of cinema audiences in Rewari?', a: 'Cinema audiences in Rewari skew urban, aged 15–40 — students, young working adults, and couples. This is an aspirational, purchase-ready demographic that responds well to FMCG, fashion, entertainment, and real-estate messaging.' },
    ],
  },

  'look-walker': {
    name: 'Look Walker', category: 'Experiential',
    tagline: 'Human billboard for events and market activation',
    desc: 'A look walker is a person wearing a large illuminated display board on their front and back, walking through high-density crowds. At markets, events, and crowded junctions in Rewari, look walkers generate high curiosity and recall — their novel, human-scale presence stopping pedestrians in their tracks.',
    specs: ['Display: illuminated LED board on human carrier', 'Size: approx 2×3 ft front + back', 'Mobility: walking in crowd / market', 'Hours: 4–8 hour deployments', 'Best context: evening markets, events'],
    idealFor: ['Product launches & sampling', 'Events & exhibitions', 'Festival promotions', 'App & QR code campaigns', 'Experiential brand activations'],
    related: ['cinema-advertising', 'exhibition-stall', 'pamphlet-distribution'],
    faqs: [
      { q: 'When is look walker advertising most effective in Rewari?', a: 'Look walkers are most effective during high-footfall events — market days, melas, festivals like Diwali and Holi season shopping, and at the evening peak (6–10 PM) in Sadar Bazar and Rewari Bus Stand areas when foot traffic is at its highest.' },
      { q: 'Can look walkers distribute pamphlets or sample products alongside the display?', a: 'Yes — look walker campaigns are often paired with flyer distribution, product sampling, or QR code promotions. The visual impact of the display draws attention while the activation delivers the conversion trigger.' },
      { q: 'How many look walkers do I need for a market activation in Rewari?', a: 'For a single market zone (e.g., Sadar Bazar), 2–4 look walkers working different sections creates strong presence. For a full-city event, 8–12 look walkers deployed at key locations ensures broad coverage.' },
    ],
  },

  'exhibition-stall': {
    name: 'Exhibition Stall', category: 'Experiential',
    tagline: 'Branded stall at trade shows and melas',
    desc: 'Exhibition stalls at Rewari\'s trade shows, government melas, and annual fairs bring brands directly face-to-face with their target audience. From a 10×10 ft display stand to a large branded pavilion, exhibition advertising delivers two-way interaction — sampling, demonstration, and lead collection — that no passive format can match.',
    specs: ['Stall sizes: 10×10 ft to 20×30 ft', 'Format: shell scheme or custom-built', 'Branding: fascia, walls, floor graphics', 'Activation: demo, sampling, lead collection', 'Events: trade fairs, melas, agri shows'],
    idealFor: ['B2B & trade brand exposure', 'Agri-input brands at agri shows', 'FMCG & durables at melas', 'Real-estate project showcase', 'Financial product campaigns'],
    related: ['cinema-advertising', 'look-walker', 'flex-banner'],
    faqs: [
      { q: 'What exhibitions and melas happen in Rewari that are suitable for stall advertising?', a: 'Rewari hosts district agricultural shows, Haryana government melas, annual trade fairs, and seasonal exhibitions. Major events include the Rewari District Fair and agri-input exhibitions near harvest seasons. Contact us for the current events calendar.' },
      { q: 'Can I book just a small stall at a Rewari exhibition?', a: 'Yes — standard shell scheme stalls of 10×10 ft (100 sqft) are the entry point for most exhibitions. Larger custom-built stalls for premium brand experiences are also available at major events.' },
      { q: 'What are the benefits of exhibition stall branding over traditional hoardings?', a: 'Exhibition stalls enable face-to-face conversation, product demonstration, sampling, and lead collection — creating active engagement that no passive billboard can achieve. The trade-show audience also tends to be highly qualified: they are present specifically to evaluate products and services in your category.' },
    ],
  },
}

// Fallback for any slug not in FORMAT_DATA
function buildFallback(slug: string): FormatData {
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    name, category: 'OOH Advertising', tagline: `${name} outdoor advertising`,
    desc: `${name} advertising is available in Rewari, Haryana. Contact us for current inventory, availability, and rates for this format.`,
    specs: ['Contact us for specifications', 'Custom sizing available', 'ISR guaranteed'],
    idealFor: ['Brand awareness', 'Local campaigns', 'Event promotions'],
    related: ['hoarding', 'unipole', 'led-display'],
    faqs: [
      { q: `Is ${name} advertising available in Rewari?`, a: `Yes — we offer ${name} advertising in Rewari, Haryana. Contact us via WhatsApp at +91 81687 40234 or use the Get Quote form to enquire about current availability and rates.` },
      { q: 'How quickly can I get a quote for this format?', a: 'We respond to all enquiries within 24 hours. WhatsApp us directly at +91 81687 40234 for the fastest response.' },
      { q: 'What is the minimum booking period?', a: 'Minimum booking is typically 1 month. Contact us for format-specific terms and current availability in Rewari.' },
    ],
  }
}

// ── Static params ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const { data } = await supabaseAdmin
      .from('rh_settings')
      .select('value')
      .eq('key', 'listing_types')
      .single()
    const types: string[] = Array.isArray(data?.value) ? (data.value as string[]) : [...ALL_SLUGS]
    return types.map(slug => ({ slug }))
  } catch {
    return [...ALL_SLUGS].map(slug => ({ slug }))
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const fd = FORMAT_DATA[slug] ?? buildFallback(slug)
  const title = `${fd.name} Advertising in Rewari, Haryana — OOH Locations & Rates`
  const description = `${fd.desc.split('.')[0]}. Browse available ${fd.name.toLowerCase()} locations in Rewari and get a quote within 24 hours.`
  return {
    title,
    description,
    alternates: { canonical: `https://rewarihoardings.com/type/${slug}` },
    openGraph: { title, description, url: `https://rewarihoardings.com/type/${slug}`, type: 'website' },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TypePage({ params }: Props) {
  const { slug } = await params
  const fd = FORMAT_DATA[slug] ?? buildFallback(slug)
  const ed = EDITORIALS[slug] ?? buildFallbackEditorial(fd.name)

  const supabase = await createClient()
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('type', slug as ListingRow['type'])
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  const all: ListingRow[] = listings ?? []
  const availableCount = all.filter(l => l.availability === 'available').length

  const relatedFormats = fd.related
    .filter(r => r !== slug)
    .map(r => ({ slug: r, data: FORMAT_DATA[r] ?? buildFallback(r) }))

  const breadcrumbs = [
    { name: 'Home',       url: 'https://rewarihoardings.com' },
    { name: 'Rewari',     url: 'https://rewarihoardings.com/city/rewari' },
    { name: fd.name,      url: `https://rewarihoardings.com/type/${slug}` },
  ]

  const waText = encodeURIComponent(`Hi, I'm looking for a ${fd.name} in Rewari. Please share available options.`)

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={fd.faqs.map(f => ({ question: f.q, answer: f.a }))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: ed.headline,
            description: `${fd.desc.split('.')[0]}. Browse available ${fd.name.toLowerCase()} locations in Rewari and get a quote within 24 hours.`,
            url: `https://rewarihoardings.com/type/${slug}`,
            datePublished: '2025-01-01',
            dateModified: '2026-05-14',
            author: { '@type': 'Organization', name: 'Rewari Hoardings', url: 'https://rewarihoardings.com' },
            publisher: {
              '@type': 'Organization',
              name: 'Rewari Hoardings',
              url: 'https://rewarihoardings.com',
              logo: { '@type': 'ImageObject', url: 'https://rewarihoardings.com/logo.png' },
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://rewarihoardings.com/type/${slug}` },
            about: { '@type': 'Thing', name: `${fd.name} Outdoor Advertising` },
          }),
        }}
      />

      {/* ── Breadcrumb nav ── */}
      <div className="bg-[#0A0A0A] border-b border-[#1a1a1a] px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-condensed text-[12px] uppercase tracking-[0.08em] text-[#555] flex-wrap">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <Link href="/city/rewari" className="hover:text-white transition-colors no-underline">Rewari</Link>
          <span>/</span>
          <span className="text-[#888]">{fd.name}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[12px] uppercase tracking-[0.12em] px-3 py-1">
                {fd.category}
              </span>
              <span className="font-condensed text-[12px] text-[#555] uppercase tracking-[0.1em]">
                {fd.tagline}
              </span>
            </div>

            <h1
              className="font-condensed font-black text-white uppercase leading-[0.95] tracking-[-0.02em] mb-5"
              style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}
            >
              <span className="text-[#FFE600]">{fd.name}</span>
              <span className="block">Advertising</span>
              <span className="block" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)', color: 'transparent' }}>in Rewari</span>
            </h1>

            <p className="font-sans text-[16px] text-[#888] leading-[1.65] max-w-[560px] mb-8">
              {fd.desc}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/get-quote"
                className="inline-flex items-center gap-2 bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[14px] uppercase tracking-[0.08em] px-6 py-3 hover:bg-yellow-300 transition-colors no-underline">
                Get a Quote →
              </Link>
              <a href={`https://wa.me/918168740234?text=${waText}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-white font-condensed font-semibold text-[14px] uppercase tracking-[0.08em] px-6 py-3 border border-white/25 hover:border-white/60 hover:bg-white/5 transition-colors no-underline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Stats panel */}
          <div className="bg-[#111] border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
            {[
              { label: `${fd.name} Locations in Rewari`, value: String(all.length), yellow: true },
              { label: 'Available for Booking', value: String(availableCount), yellow: false },
            ].map(s => (
              <div key={s.label} className="px-6 py-5">
                <p className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mb-1">{s.label}</p>
                <p className={`font-condensed font-black text-[44px] leading-none ${s.yellow ? 'text-[#FFE600]' : 'text-white'}`}>{s.value}</p>
              </div>
            ))}
            <div className="px-6 py-5">
              <p className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mb-3">Response Time</p>
              <p className="font-condensed font-black text-[44px] text-white leading-none">24h</p>
            </div>
            <div className="p-4">
              <Link href="/get-quote"
                className="flex items-center justify-center w-full bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[13px] uppercase tracking-[0.1em] py-3 hover:bg-yellow-300 transition-colors no-underline">
                Get a Free Quote →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Listings grid ── */}
      <section className="bg-[#141414] px-10 py-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-condensed font-black text-[32px] text-white uppercase tracking-[-0.01em] leading-none mb-2">
            Available <span className="text-[#FFE600]">{fd.name}</span> Locations
          </h2>
          <p className="font-sans text-[14px] text-[#666] mb-8">All published inventory in Rewari, Haryana</p>

          {all.length > 0 ? (
            <>
              <p className="font-condensed text-[12px] text-[#444] uppercase tracking-[0.1em] mb-5">
                {all.length} location{all.length !== 1 ? 's' : ''} · {availableCount} available now
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
                {all.map(l => <ListingCard key={l.id} l={l} />)}
              </div>
            </>
          ) : (
            <div className="border border-[#2A2A2A] py-20 text-center">
              <div className="opacity-20 flex justify-center mb-4">
                <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none" stroke="white" strokeWidth="1.5">
                  <rect x="6" y="18" width="36" height="22" rx="2" /><line x1="24" y1="6" x2="24" y2="18" /><line x1="14" y1="6" x2="34" y2="6" />
                </svg>
              </div>
              <p className="font-condensed text-[#555] uppercase tracking-wider text-[14px] mb-2">
                No {fd.name.toLowerCase()} listings yet
              </p>
              <p className="font-sans text-[#444] text-[13px] mb-7">
                We may have unlisted {fd.name.toLowerCase()} inventory in Rewari — WhatsApp us to check.
              </p>
              <a href={`https://wa.me/918168740234?text=${waText}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-block bg-[#25D366] text-white font-condensed font-bold text-[14px] uppercase tracking-[0.08em] px-6 py-3 no-underline hover:bg-[#1ebe5a] transition-colors">
                Check Availability on WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Specs + Ideal For ── */}
      <section className="bg-[#F4F4F0] px-10 py-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-condensed font-bold text-[13px] text-[#0A0A0A] uppercase tracking-[0.15em] mb-5">
              Format Specifications
            </h2>
            <ul className="space-y-3">
              {fd.specs.map((spec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] flex-shrink-0 mt-[7px]" />
                  <span className="font-sans text-[15px] text-[#333] leading-[1.5]">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-condensed font-bold text-[13px] text-[#0A0A0A] uppercase tracking-[0.15em] mb-5">
              Ideal For
            </h2>
            <ul className="space-y-3">
              {fd.idealFor.map((use, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[10px] uppercase tracking-[0.1em] px-1.5 py-0.5 flex-shrink-0 mt-[2px]">✓</span>
                  <span className="font-sans text-[15px] text-[#333] leading-[1.5]">{use}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Editorial Article ── */}
      <section className="bg-[#111111] px-10 py-14 border-t border-[#2A2A2A]">
        <article className="max-w-4xl mx-auto">
          <h2 className="font-condensed font-black text-[34px] text-white uppercase tracking-[-0.01em] leading-[1.05] mb-6">
            {ed.headline}
          </h2>
          {ed.paras.map((para, i) => (
            <p key={i} className="font-sans text-[15px] text-[#888] leading-[1.8] mb-5">{para}</p>
          ))}

          <div className="mt-8 pt-8 border-t border-[#2A2A2A] grid grid-cols-1 md:grid-cols-2 gap-8">
            {ed.localities.length > 0 && (
              <div>
                <p className="font-condensed font-bold text-[11px] text-[#FFE600] uppercase tracking-[0.15em] mb-4">
                  Key Locations in Rewari
                </p>
                <div className="flex flex-wrap gap-2">
                  {ed.localities.map(loc => (
                    <Link
                      key={loc.slug}
                      href={`/locality/${loc.slug}`}
                      className="font-condensed font-semibold text-[12px] text-[#666] uppercase tracking-[0.05em] px-3 py-1.5 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline"
                    >
                      {loc.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {ed.listings.length > 0 && (
              <div>
                <p className="font-condensed font-bold text-[11px] text-[#FFE600] uppercase tracking-[0.15em] mb-4">
                  Browse Live Inventory
                </p>
                <div className="flex flex-col gap-2">
                  {ed.listings.map(l => (
                    <Link
                      key={l.slug}
                      href={`/listing/${l.slug}`}
                      className="font-condensed font-semibold text-[13px] text-[#777] hover:text-[#FFE600] transition-colors no-underline flex items-center gap-2"
                    >
                      <span className="text-[#FFE600] text-[10px]">▶</span>
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </section>

      {/* ── Related formats ── */}
      <section className="bg-[#141414] px-10 py-14 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-condensed font-black text-[32px] text-white uppercase tracking-[-0.01em] leading-none mb-8">
            Related <span className="text-[#FFE600]">Formats</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
            {relatedFormats.map(({ slug: rSlug, data: rd }) => (
              <Link key={rSlug} href={`/type/${rSlug}`}
                className="group bg-[#1a1a1a] p-7 hover:bg-[#222] transition-colors no-underline block">
                <p className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mb-2">{rd.category}</p>
                <h3 className="font-condensed font-bold text-[20px] text-white uppercase tracking-[0.02em] mb-2 group-hover:text-[#FFE600] transition-colors">
                  {rd.name}
                </h3>
                <p className="font-sans text-[13px] text-[#666] leading-[1.6] mb-4">
                  {rd.tagline}
                </p>
                <span className="font-condensed text-[12px] text-[#FFE600] uppercase tracking-[0.08em]">
                  View locations →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mr-1 self-center">All formats:</span>
            {['unipole','gantry','hoarding','led-display','bus-shelter','wall-painting','rooftop-hoarding','digital-kiosk','toll-naka','railway-station']
              .filter(s => s !== slug)
              .map(s => (
                <Link key={s} href={`/type/${s}`}
                  className="font-condensed font-semibold text-[12px] text-[#555] uppercase tracking-[0.05em] px-3 py-1.5 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
                  {fmtLabel(s)}
                </Link>
              ))}
            <Link href="/city/rewari"
              className="font-condensed font-semibold text-[12px] text-[#FFE600] uppercase tracking-[0.05em] px-3 py-1.5 border border-[#FFE600]/40 hover:border-[#FFE600] transition-colors no-underline">
              All Rewari →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#0A0A0A] px-10 py-14 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-condensed font-black text-[32px] text-white uppercase tracking-[-0.01em] leading-none mb-8">
            {fd.name} Advertising — <span className="text-[#FFE600]">FAQs</span>
          </h2>
          <div className="divide-y divide-[#1E1E1E] border border-[#1E1E1E]">
            {fd.faqs.map((faq, i) => (
              <div key={i} className="p-7 bg-[#111]">
                <div className="flex items-start gap-5">
                  <span className="font-condensed font-black text-[20px] text-[#FFE600] leading-none flex-shrink-0 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-condensed font-bold text-[17px] text-white uppercase tracking-[0.02em] leading-[1.3] mb-2.5">
                      {faq.q}
                    </h3>
                    <p className="font-sans text-[15px] text-[#777] leading-[1.7]">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#FFE600] px-10 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-condensed font-black text-[#0A0A0A] uppercase leading-none tracking-[-0.01em] mb-2"
              style={{ fontSize: 'clamp(24px, 3vw, 42px)' }}>
              Book a {fd.name} in Rewari
            </h2>
            <p className="font-sans text-[15px] text-black/55">
              Share your requirements — we'll confirm availability and rates within 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link href="/get-quote"
              className="font-condensed font-black text-[14px] uppercase tracking-[0.08em] px-6 py-3.5 bg-[#0A0A0A] text-[#FFE600] hover:bg-[#111] transition-colors no-underline">
              Get a Free Quote →
            </Link>
            <a href={`https://wa.me/918168740234?text=${waText}`}
              target="_blank" rel="noopener noreferrer"
              className="font-condensed font-bold text-[14px] uppercase tracking-[0.08em] px-6 py-3.5 border-2 border-[#0A0A0A]/30 hover:border-[#0A0A0A] text-[#0A0A0A] transition-colors no-underline">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
