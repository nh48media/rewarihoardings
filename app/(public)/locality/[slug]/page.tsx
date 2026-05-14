import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import ListingCard, { fmtLabel } from '@/components/listing/ListingCard'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import FAQSchema from '@/components/seo/FAQSchema'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import type { ListingRow } from '@/types/database'

export const revalidate = 3600

// ── All known locality slugs — fallback when rh_settings is absent ─────────────

const ALL_LOCALITY_SLUGS = [
  'nh-48', 'delhi-road', 'sadar-bazar', 'rewari-bus-stand',
  'rewari-railway-station', 'subhash-nagar', 'model-town',
  'gurudwara-chowk', 'new-grain-market', 'majra-chowk',
  'jat-college-road', 'circular-road', 'dharan-road',
  'rewari-industrial-area', 'kosli-road',
] as const

// ── Locality editorial data ────────────────────────────────────────────────────

type LocalityData = {
  name: string
  tagline: string
  desc: string
  character: string   // e.g. "Highway", "Market", "Residential"
  nearby: string[]    // slugs of geographically close localities
  faqs: { q: string; a: string }[]
}

const LOCALITY_DATA: Record<string, LocalityData> = {
  'nh-48': {
    name: 'NH-48',
    tagline: "Rewari's prime highway corridor — Delhi to Jaipur to Ahmedabad",
    desc: 'NH-48 (formerly NH-8) is the four-lane national highway connecting Delhi to Jaipur, Udaipur and Ahmedabad — and it cuts directly through Rewari district. The stretch near Rewari handles 20,000–35,000 vehicles per day across two clear daily peaks: a heavy outbound flow between 7 and 10 AM as Rewari workers head toward Gurugram (60 km) and Delhi (110 km), and a matching return between 5 and 8 PM. HPCL refinery workers from Bawal, auto components industry commuters from the Dharuhera corridor, and NCR-bound professionals all pass this stretch daily. Unipoles, gantries and toll naka panels here deliver brand impressions simultaneously to Rewari\'s local audience and the full intercity Delhi–Ahmedabad corridor.',
    character: 'Highway',
    nearby: ['delhi-road', 'rewari-industrial-area', 'kosli-road'],
    faqs: [
      { q: 'Which OOH formats work best on NH-48 near Rewari?', a: 'Unipoles and gantries dominate NH-48 — their height and span cut through highway visual clutter at driving speeds. Toll naka panels near the Rewari toll plaza create a captive queue audience for both Delhi-bound and Jaipur-bound traffic. Petrol pump panels and dhaba branding add dwell-time impressions for the intercity traveller.' },
      { q: 'When is peak traffic on NH-48 near Rewari?', a: 'There are two clear daily peaks on NH-48 at Rewari. The morning window (7–10 AM) carries heavy outbound traffic — Rewari commuters heading to Gurugram and Delhi, HPCL refinery workers toward Bawal, and long-haul freight. The evening peak (5–8 PM) reverses the flow. Weekday volume is roughly double weekend volume.' },
      { q: 'Can I target only Delhi-bound traffic on NH-48?', a: 'Yes — hoarding faces are selected by direction. North/east-facing panels capture Delhi-bound traffic; south/west-facing panels target Jaipur, Ahmedabad and Rewari-returning traffic. Our team will recommend specific sites based on your campaign direction and audience preference.' },
    ],
  },

  'delhi-road': {
    name: 'Delhi Road',
    tagline: 'Primary arterial road linking Rewari city to NH-48 and the NCR',
    desc: 'Delhi Road is Rewari city\'s main commercial artery — the direct connection between the city centre and NH-48, pointing toward Gurugram (60 km) and Delhi (110 km). It carries the city\'s heaviest daily commuter volume, with two defined peak windows: 7–10 AM outbound as Rewari professionals head to NCR workplaces, and 5–8 PM inbound on the return. The road runs through a dense retail strip of shops, showrooms, coaching institutes and service businesses. A gantry or large-format hoarding on Delhi Road reaches Rewari\'s most aspirational demographic — salaried professionals with NCR incomes who live in Rewari and make purchasing decisions here.',
    character: 'Arterial Road',
    nearby: ['nh-48', 'gurudwara-chowk', 'circular-road'],
    faqs: [
      { q: 'What is the reach of a hoarding on Delhi Road, Rewari?', a: 'A well-positioned hoarding on Delhi Road reaches an estimated 15,000–25,000 individuals daily. The audience skews heavily toward working-age Rewari residents who commute to Gurugram and Delhi — one of the city\'s most aspirational demographics for real estate, automotive, banking and premium consumer brands.' },
      { q: 'What are the peak hours on Delhi Road, Rewari?', a: 'Delhi Road sees its heaviest traffic during the morning commute (7–10 AM) and the evening return (5–8 PM). Weekend afternoon traffic is strong due to the retail strip. A hoarding here captures the same commuter audience six to ten times per week throughout a campaign — a very high-frequency format for the NCR commuter demographic.' },
      { q: 'Is Delhi Road good for local retail advertising?', a: 'Absolutely. Delhi Road\'s retail strip means high footfall in addition to vehicular traffic. Flex banners, rooftop hoardings and LED displays near key junctions along this road are well-suited to local retail, real estate and service businesses targeting both Rewari city shoppers and the large NCR-commuter resident population.' },
    ],
  },

  'sadar-bazar': {
    name: 'Sadar Bazar',
    tagline: "Rewari's historic commercial heart — grain, cloth, hardware and retail",
    desc: 'Sadar Bazar is the traditional commercial heart of Rewari — a dense, high-footfall market packed with grain dealers, cloth merchants, hardware traders, and retail shops that have served the district for generations. Traders and shoppers from across Rewari district and surrounding villages converge here daily. OOH advertising here targets a purchase-ready audience at close range: rooftop hoardings, LED displays and look walkers are especially effective in this pedestrian-heavy zone where dwell time runs well above city-road averages.',
    character: 'Commercial Market',
    nearby: ['gurudwara-chowk', 'new-grain-market', 'rewari-bus-stand'],
    faqs: [
      { q: 'What OOH formats work best in Sadar Bazar?', a: 'Rooftop hoardings, LED displays and pole kiosks are top performers in Sadar Bazar — the close-range, pedestrian-heavy environment favours formats visible from shorter distances. Look walkers during peak market hours are effective for new product launches. Pamphlet distribution and flex banners see strong response for event and sale campaigns.' },
      { q: 'Who is the audience in Sadar Bazar?', a: 'Sadar Bazar draws a mixed audience: wholesale buyers, retail shoppers, grain traders, cloth merchants, and village visitors from across Rewari district. Daily footfall is among the highest in the city, concentrated in the 25–55 age bracket — an active purchasing demographic with strong local market familiarity.' },
      { q: 'Is Sadar Bazar good for FMCG or consumer brand campaigns?', a: 'Yes — FMCG, apparel, electronics, kitchenware and local services all perform well here. The point-of-purchase proximity means an OOH impression in Sadar Bazar sits close to an immediate buying decision, making it particularly valuable for product launches, festive promotions and seasonal sale campaigns.' },
    ],
  },

  'rewari-bus-stand': {
    name: 'Rewari Bus Stand',
    tagline: "High-dwell HRTC transit hub — city's most captive audience",
    desc: 'Rewari Bus Stand (HRTC) is the city\'s primary intercity transit node, handling routes to Delhi, Gurugram, Bhiwani, Narnaul, Bawal, Jhajjar, and local intra-district services. An estimated 10,000–15,000 daily passengers and bystanders pass through — farmers from surrounding villages, students heading to colleges in Rewari and Gurugram, daily commuters, and rural visitors running city errands. Two high-density windows define the day: the 7–10 AM HRTC departure rush and the 5–8 PM return peak. Bus shelter panels, LED displays and auto stand branding at this junction deliver captive impressions to a genuinely cross-district audience.',
    character: 'Transit Hub',
    nearby: ['sadar-bazar', 'rewari-railway-station', 'circular-road'],
    faqs: [
      { q: 'How many people pass through Rewari Bus Stand daily?', a: 'Rewari Bus Stand handles an estimated 10,000–15,000 daily passengers across HRTC routes to Delhi, Gurugram, Bhiwani, Narnaul, Bawal and local intra-district services. Footfall peaks sharply during the 7–10 AM departure rush and the 5–8 PM evening return — the two best windows for OOH impression density.' },
      { q: 'Which formats give the best ROI near the bus stand?', a: 'Bus shelter panels offer captive dwell-time impressions to waiting passengers. The LED display near the entry gives high-visibility impact for both passengers and passing road traffic. Auto and e-rickshaw branding at the adjacent stand creates mobile reach throughout the city. Pamphlet distribution at the exit sees strong pickup during the morning rush.' },
      { q: 'Can I run a campaign targeting intercity travellers at the bus stand?', a: 'Yes — the bus stand audience spans both Rewari city residents and visitors from Narnaul, Bawal, Bhiwani and surrounding villages, making it ideal for brands targeting a district-wide audience. LED display slots and shelter panels capture this audience during peak dwell time, when attention to advertising is highest.' },
    ],
  },

  'rewari-railway-station': {
    name: 'Rewari Railway Station',
    tagline: 'Rewari Junction — major Haryana rail interchange on Delhi–Alwar and Delhi–Bhatinda routes',
    desc: 'Rewari Junction is one of Haryana\'s most strategically positioned railway junctions — the intersection of multiple major routes including Delhi–Alwar, Delhi–Bhatinda, and Rewari–Rohtak. Daily trains carry commuters to Delhi and Gurugram, workers heading toward the HPCL refinery at Bawal, students, agri traders, and intercity travellers from across the district. The station forecourt, platform approaches and surrounding roads create a concentrated OOH zone. Approach road hoardings, auto and e-rickshaw branding at the station taxi stand, and platform panels all reach a genuinely district-wide audience with high average dwell time.',
    character: 'Railway Junction',
    nearby: ['rewari-bus-stand', 'circular-road', 'gurudwara-chowk'],
    faqs: [
      { q: 'Is railway station advertising in Rewari high-impact?', a: 'Rewari Junction is one of the more significant stations in Haryana — it sits at the intersection of the Delhi–Alwar, Delhi–Bhatinda and Rewari–Rohtak rail routes. Platform and forecourt panels deliver high-dwell impressions to daily commuters, HPCL refinery workers, students and intercity travellers from across the district.' },
      { q: 'What formats are available near Rewari Railway Station?', a: 'Hoardings and unipoles on the station approach road capture inbound traffic. Auto and e-rickshaw branding at the station taxi stand creates mobile reach through the city. Platform and concourse panels (subject to railway authority permissions) reach waiting passengers directly. Contact us for current inventory availability.' },
      { q: 'What is the audience profile at Rewari Railway Station?', a: 'The station audience is a broad cross-section of Rewari district — daily commuters to Delhi and Gurugram, workers traveling to the HPCL refinery and industrial units at Bawal, students, agri traders visiting city markets, and rural visitors from surrounding villages. Rewari Junction is one of the few OOH locations in the city that delivers genuinely district-wide audience reach at a single placement.' },
    ],
  },

  'subhash-nagar': {
    name: 'Subhash Nagar',
    tagline: 'Established residential colony — high-income household reach',
    desc: 'Subhash Nagar is one of Rewari\'s well-established residential colonies, home to government employees, business owners and professional households. Society gate branding, wall paintings and e-rickshaw advertising through the mohalla streets are the dominant formats. The area is a prime target for real estate, home appliances, financial services and education brands seeking upper-middle-class household reach.',
    character: 'Residential',
    nearby: ['model-town', 'jat-college-road', 'circular-road'],
    faqs: [
      { q: 'What OOH formats work in a residential area like Subhash Nagar?', a: 'Society gate branding is the highest-impact format — every resident sees it daily. Wall paintings on perimeter walls give long-term visibility. E-rickshaw advertising through mohalla lanes reaches households not accessible by main road hoardings. Flex banners are popular for local events and festivals.' },
      { q: 'Which brands typically advertise in Subhash Nagar?', a: 'Real estate projects, home appliances, insurance and financial services, private schools, hospitals and coaching institutes find strong response here. The resident demographic is middle-to-upper-middle income with high purchase capacity for large-ticket items.' },
      { q: 'Is Subhash Nagar a good area for hyperlocal campaigns?', a: 'Yes — its contained residential geography makes it ideal for hyperlocal campaigns where precise targeting is important. A society gate + wall painting + e-rickshaw combination can deliver near-100% household coverage within the colony.' },
    ],
  },

  'model-town': {
    name: 'Model Town',
    tagline: 'Planned residential sector with high household density',
    desc: 'Model Town is a planned residential sector in Rewari with well-laid streets and a significant concentration of middle and upper-middle income households. Similar in character to Subhash Nagar, it is a prime area for residential society advertising. Society gate panels, wall paintings and e-rickshaw routes through the sector are the most effective OOH touchpoints for reaching resident households directly.',
    character: 'Residential',
    nearby: ['subhash-nagar', 'circular-road', 'jat-college-road'],
    faqs: [
      { q: 'How does advertising in Model Town differ from highway advertising?', a: 'Model Town OOH is proximity advertising — formats are close-range and repeated-exposure. Rather than one big impression at speed, you achieve frequent, low-distance impressions over days and weeks. It is better suited to brands building household familiarity (schools, clinics, FMCG) than brands seeking single-exposure brand recall.' },
      { q: 'What is the best format for reaching Model Town households?', a: 'Society gate branding is first choice — it creates a single high-visibility touchpoint that all residents walk or drive past. Wall paintings on common walls add to ambient exposure. E-rickshaw routes through the sector streets ensure mobile coverage into lanes not served by any fixed format.' },
      { q: 'Is Model Town good for a school or coaching institute campaign?', a: 'Excellent fit. Model Town households are primarily middle-income families who prioritise education. School and coaching institute campaigns see strong response through society gate branding, poster campaigns and pamphlet distribution within the colony during admission season.' },
    ],
  },

  'gurudwara-chowk': {
    name: 'Gurudwara Chowk',
    tagline: 'Central junction — highest footfall intersection in Rewari',
    desc: 'Gurudwara Chowk is one of the most central and heavily trafficked junctions in Rewari city, where multiple major roads converge. The chowk sees sustained footfall and vehicular traffic throughout the day — a landmark spot known to virtually every Rewari resident. Hoardings, gantries and LED displays here have among the highest OOH impression rates in the city.',
    character: 'Junction',
    nearby: ['sadar-bazar', 'delhi-road', 'circular-road'],
    faqs: [
      { q: 'Why is Gurudwara Chowk one of the best OOH locations in Rewari?', a: 'Gurudwara Chowk is a convergence point for traffic from Delhi Road, Circular Road and several inner-city arteries. Nearly every Rewari resident passes through this junction regularly. Impression frequency is exceptional — a hoarding here delivers more repeat exposures per rupee than almost any other location in the city.' },
      { q: 'Is a gantry or a hoarding better at Gurudwara Chowk?', a: 'A gantry is the premium choice — it spans the road and is unavoidable for all traffic. Hoardings on either side of the junction offer lower cost with still-strong visibility. A traffic booth wrap gives ground-level proximity branding. The right choice depends on budget and whether you want dominance or presence.' },
      { q: 'What is the traffic volume at Gurudwara Chowk daily?', a: 'As a central convergence junction, Gurudwara Chowk sees among the highest vehicular and pedestrian traffic volumes in Rewari city — estimated at 25,000–40,000 vehicle passes per day, with peak congestion during morning and evening commute hours creating natural dwell time.' },
    ],
  },

  'new-grain-market': {
    name: 'New Grain Market',
    tagline: 'Rewari\'s wholesale agricultural trading hub — wheat, mustard and seasonal crops',
    desc: 'New Grain Market (Nayi Anaj Mandi) is the primary wholesale trading centre for agricultural commodities in Rewari district. Rewari sits deep in Haryana\'s wheat and mustard belt — farmers from Rewari, Mahendragarh and Bhiwani districts bring their Rabi harvest (wheat, mustard) in March–April and Kharif crops in September–October. Thousands of farmers, commission agents, traders and transporters converge here during trading seasons. Market gate branding and hoarding advertising reaches a large rural audience with strong purchasing power for agri-inputs, tractors, two-wheelers and rural financial services.',
    character: 'Agricultural Market',
    nearby: ['sadar-bazar', 'gurudwara-chowk', 'majra-chowk'],
    faqs: [
      { q: 'Who visits the New Grain Market in Rewari?', a: 'New Grain Market draws farmers from across Rewari, Mahendragarh and Bhiwani districts bringing wheat, mustard and seasonal vegetables to sell. The visitor base also includes commission agents, wholesale traders, transporters and rural shopkeepers — a substantial rural district audience with high purchasing power for their category, concentrated at a single location.' },
      { q: 'What OOH formats are most effective at New Grain Market?', a: 'Market gate branding is the signature format — the branded archway at the entrance sees every visitor. Hoardings within and around the market compound deliver sustained exposure. Flex banners during peak Rabi harvest (March–April) and Kharif arrival (September–October) capture the highest footfall windows. Pamphlet distribution at weighbridge queues sees strong pickup.' },
      { q: 'Is New Grain Market a good location for agri-input or farm equipment brands?', a: 'It is one of the best locations in the district for those categories. The audience is exactly the wheat and mustard farming community that purchases seeds, fertilisers, pesticides, tractors and farm equipment. A campaign presence here during Rabi sowing (October–November) or Rabi harvest (March–April) delivers direct, intent-matched impressions to the core rural buyer.' },
    ],
  },

  'majra-chowk': {
    name: 'Majra Chowk',
    tagline: 'Key inner-city junction connecting north and south Rewari',
    desc: 'Majra Chowk is a prominent inner-city intersection that connects north and south Rewari, functioning as a routing node for significant city traffic. While not as central as Gurudwara Chowk, its position on multiple inner-city routes gives it strong daily impression volumes. Hoardings and traffic booth branding at this junction target mid-city Rewari residents and commuters.',
    character: 'Junction',
    nearby: ['new-grain-market', 'circular-road', 'delhi-road'],
    faqs: [
      { q: 'What makes Majra Chowk a good OOH location in Rewari?', a: 'Majra Chowk sits at the intersection of several inner-city routes used by Rewari residents for daily commutes. While it lacks the highway scale of NH-48 or the centrality of Gurudwara Chowk, it offers strong local-audience reach at lower cost — ideal for city-focused brands targeting mid-Rewari households.' },
      { q: 'Which formats work best at Majra Chowk?', a: 'Hoardings on corner plots at the junction give high visibility. Traffic booth branding creates ground-level, close-range impressions during signal stops. Pole kiosks running along the approach roads add frequency to any campaign.' },
      { q: 'How does Majra Chowk compare to Gurudwara Chowk for advertising?', a: 'Gurudwara Chowk has higher traffic volume and is a more recognisable city landmark. Majra Chowk offers similar junction-format benefits at a typically lower rate — making it a good secondary location to extend reach when Gurudwara Chowk inventory is occupied, or as a standalone site for hyperlocal north-city campaigns.' },
    ],
  },

  'jat-college-road': {
    name: 'Jat College Road',
    tagline: 'Education corridor — Jat College, engineering institutes and student catchment',
    desc: 'Jat College Road anchors Rewari\'s education belt — Jat College (one of the district\'s oldest degree colleges) is joined by engineering colleges, polytechnics, coaching institutes, student hostels and supporting services along this corridor. The road sees heavy daily footfall from students, parents during admission season, and faculty — creating a concentrated 17–28 demographic. College gate branding, hoardings near college entrances and pole kiosks along the road reach this audience at close range and high frequency throughout the academic year.',
    character: 'Educational Corridor',
    nearby: ['subhash-nagar', 'model-town', 'dharan-road'],
    faqs: [
      { q: 'Is Jat College Road good for education-sector advertising?', a: 'It is one of the best locations in Rewari for education advertising — Jat College, the engineering colleges and the coaching institute cluster all draw students and parents actively seeking educational options. The critical admission windows are March–June (after board results) and July–August (engineering admissions). Campaigns timed to these windows see strong response.' },
      { q: 'What formats are recommended on Jat College Road?', a: 'College gate branding is the flagship format — it reaches all students and parents entering the premises daily. Hoardings on the approach road and flex banners near hostel areas deliver sustained awareness. Pamphlet distribution outside the college gate after lecture hours sees strong pickup from the student audience. Pole kiosks along the road add frequency.' },
      { q: 'Beyond education, what other brands advertise on Jat College Road?', a: 'Food delivery, smartphone brands, banking and credit products, gym and fitness services, and healthcare brands targeting the 17–28 age group all perform well here. The engineering college student demographic is a fast-moving consumer base — mobile-first, early adopters — with brand preferences still forming, making this a high-value corridor for consumer brand launches.' },
    ],
  },

  'circular-road': {
    name: 'Circular Road',
    tagline: 'Ring road connecting Rewari\'s major localities',
    desc: 'Circular Road forms a ring connecting many of Rewari\'s key areas including Gurudwara Chowk, the Bus Stand, hospitals and residential sectors. As an internal city ring road, it sees a sustained, distributed flow of Rewari city traffic throughout the day — a mix of residents, delivery vehicles, auto and e-rickshaws. Hoardings and unipoles along Circular Road offer city-wide resident reach at high frequency.',
    character: 'Ring Road',
    nearby: ['gurudwara-chowk', 'rewari-bus-stand', 'majra-chowk'],
    faqs: [
      { q: 'What is Circular Road\'s advantage for OOH advertising in Rewari?', a: 'Circular Road connects multiple neighbourhoods — commuters from Subhash Nagar, Model Town, the bus stand area and central market all use it. A hoarding on Circular Road delivers citywide resident coverage rather than a single-corridor audience, making it efficient for brands wanting broad Rewari city reach without the premium cost of highway sites.' },
      { q: 'Which formats work on Circular Road?', a: 'Standard hoardings and unipoles work well on the straighter sections. Hospital branding near the government hospital stretch reaches a specific health-aware audience. Pole kiosks at intervals provide frequency. Auto and e-rickshaw advertising along Circular Road routes adds mobile coverage.' },
      { q: 'Is Circular Road good for healthcare or hospital advertising?', a: 'Yes — the government hospital and several private clinics are located on or near Circular Road. Hoarding and pole kiosk advertising here reaches patients and families already in a healthcare mindset. Diagnostic centres, specialist clinics and pharmaceutical brands find this stretch particularly effective.' },
    ],
  },

  'dharan-road': {
    name: 'Dharan Road',
    tagline: 'Outer approach road — connecting Rewari to surrounding villages',
    desc: 'Dharan Road is an approach road on the periphery of Rewari city connecting the urban area to surrounding villages and rural hinterland. It carries a mix of city-edge residential, agricultural and light industrial traffic. Wall paintings and hoardings along this corridor reach a rural and semi-urban audience — effective for agri-inputs, rural banking, government scheme awareness and village-audience FMCG brands.',
    character: 'Outer Road',
    nearby: ['jat-college-road', 'kosli-road', 'rewari-industrial-area'],
    faqs: [
      { q: 'What kind of audience does Dharan Road reach?', a: 'Dharan Road reaches a rural and semi-urban audience — villagers commuting to Rewari city for trade and services, agricultural traffic, and residents of peripheral neighbourhoods. It is less useful for premium urban brand campaigns but highly effective for reaching the rural district audience that forms the bulk of Rewari\'s surrounding population.' },
      { q: 'Which OOH formats are suited to Dharan Road?', a: 'Wall paintings are dominant — long-term, low-maintenance and highly visible on open roadside walls. Hoardings at road junctions reach the higher-traffic nodes. Flex banners and poster campaigns are common for local announcements and rural service promotion.' },
      { q: 'Is Dharan Road relevant for agri or rural-sector advertisers?', a: 'Yes — it is one of the better rural-reach corridors near Rewari city. Seed companies, fertiliser brands, tractor manufacturers, rural finance companies and government scheme communications all find this corridor effective for village-audience campaigns at lower cost than city-centre placements.' },
    ],
  },

  'rewari-industrial-area': {
    name: 'Rewari Industrial Area',
    tagline: 'Auto components and manufacturing belt — part of the Dharuhera-Rewari-Bawal industrial corridor',
    desc: 'Rewari\'s industrial corridor sits between two major manufacturing hubs — the Dharuhera industrial township to the north and IMT Bawal to the south — forming part of one of North India\'s most active auto components and engineering goods belts. The area houses auto parts manufacturers, engineering goods units, light manufacturing facilities and large warehousing operations. HPCL\'s refinery at Bawal generates significant daily worker commute traffic through this corridor. Advertising here targets factory workers (a large, high-frequency daily commuter base), supervisory and managerial staff, B2B procurement managers, and the logistics operators who move goods along the NH-48 industrial belt.',
    character: 'Industrial',
    nearby: ['nh-48', 'dharan-road', 'kosli-road'],
    faqs: [
      { q: 'Who is the audience in Rewari Industrial Area?', a: 'The industrial corridor audience is primarily factory and warehouse workers (several thousand daily commuters), supervisory and managerial staff at auto components and engineering units, B2B procurement and logistics managers, and HPCL refinery workers commuting through toward Bawal. It is one of the few OOH locations in Rewari with meaningful B2B audience density alongside a large blue-collar worker base.' },
      { q: 'What brands advertise in Rewari\'s industrial corridors?', a: 'Worker-facing consumer brands (two-wheelers, mobile phones, FMCG, PF-linked financial products), B2B industrial suppliers (tools, safety equipment, lubricants, consumables), staffing and recruitment services, and group health insurance products all perform well here. The daily commuter pattern creates repeated weekly exposure that builds strong brand recall over a campaign.' },
      { q: 'Which OOH formats are recommended for the Rewari Industrial Area?', a: 'Wall paintings at factory boundary walls give the longest-duration exposure at the lowest recurring cost. Hoardings at the industrial entry roads capture all inbound commuter and logistics traffic. Gate branding at major factory entries reaches workers at point of arrival. Flex banners near the main gate work for recruitment drives and shift-specific promotional campaigns.' },
    ],
  },

  'kosli-road': {
    name: 'Kosli Road',
    tagline: 'South Rewari corridor connecting to Kosli and Jhajjar',
    desc: 'Kosli Road runs south from Rewari city towards Kosli and the Jhajjar district, carrying town-to-town traffic along with peripheral city residential and agricultural movements. It is a growing corridor with increasing residential development at its city end. Hoardings, unipoles and wall paintings along this road reach Rewari south-city residents and inter-town travellers heading to Kosli and Jhajjar.',
    character: 'Town Connector',
    nearby: ['rewari-industrial-area', 'dharan-road', 'nh-48'],
    faqs: [
      { q: 'Who travels on Kosli Road and what is the traffic volume?', a: 'Kosli Road carries daily commuters between Rewari and Kosli town (roughly 25 km), agricultural and light commercial traffic from villages along the route, and residents of south Rewari residential areas. Traffic volume is moderate — lower than NH-48 but significant for targeting audiences moving between the two towns.' },
      { q: 'Is Kosli Road a good location for a campaign targeting southern Rewari districts?', a: 'Yes — if your campaign targets Kosli, Jhajjar or the southern Rewari hinterland, Kosli Road sites near the city edge capture outbound traffic effectively. For campaigns targeting south Rewari city residents, sites near the city-end junction give the best density of local impressions.' },
      { q: 'What formats are available on Kosli Road?', a: 'Unipoles and hoardings at the main junction near city limits are the anchor formats. Wall paintings on open roadside structures offer long-term peripheral coverage. Flex banners near the first few kilometres of the road target the residential zones closest to Rewari city.' },
    ],
  },
}

function buildFallback(slug: string): LocalityData {
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    name,
    tagline: `Outdoor advertising in ${name}, Rewari`,
    desc: `Browse available OOH advertising locations in ${name}, Rewari, Haryana. High-visibility spots targeting local and transit audiences.`,
    character: 'Area',
    nearby: ['gurudwara-chowk', 'sadar-bazar', 'circular-road'],
    faqs: [
      { q: `What OOH advertising options are available in ${name}, Rewari?`, a: `We have a range of outdoor advertising formats available in ${name} — from hoardings and unipoles to e-rickshaw branding and flex banners. Contact us to check current availability and rates.` },
      { q: `How do I book advertising space in ${name}?`, a: `You can enquire via our Get Quote form or WhatsApp us directly at +91 81687 40234. We will share available inventory, panel photos and pricing within 24 hours.` },
      { q: `What is the typical campaign duration for OOH advertising in Rewari?`, a: `Minimum booking is usually one month. Most brands book for 3–6 months for awareness campaigns. Short-term flex banner and pamphlet campaigns can run for 1–2 weeks for event or sale promotions.` },
    ],
  }
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

// ── Static params ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const { data } = await supabaseAdmin
      .from('rh_settings')
      .select('value')
      .eq('key', 'rewari_localities')
      .single()
    const localities: string[] = Array.isArray(data?.value) ? (data.value as string[]) : [...ALL_LOCALITY_SLUGS]
    return localities.map(loc => ({ slug: slugify(loc) }))
  } catch {
    return [...ALL_LOCALITY_SLUGS].map(slug => ({ slug }))
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ld = LOCALITY_DATA[slug] ?? buildFallback(slug)
  const title = `Hoardings in ${ld.name}, Rewari — OOH Advertising Locations`
  const description = `${ld.desc.split('.')[0]}. Browse available outdoor advertising locations in ${ld.name}, Rewari and get a quote within 24 hours.`
  return {
    title,
    description,
    alternates: { canonical: `https://rewarihoardings.com/locality/${slug}` },
    openGraph: { title, description, url: `https://rewarihoardings.com/locality/${slug}`, type: 'website' },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LocalityPage({ params }: Props) {
  const { slug } = await params
  const ld = LOCALITY_DATA[slug] ?? buildFallback(slug)

  // Resolve canonical locality name for DB query (match how listings store it)
  // Try to find the stored name from settings, fallback to ld.name
  const supabase = await createClient()
  const { data: settingsData } = await supabase
    .from('rh_settings')
    .select('value')
    .eq('key', 'rewari_localities')
    .single()
  const storedLocalities: string[] = Array.isArray(settingsData?.value) ? (settingsData.value as string[]) : []
  const localityName = storedLocalities.find(loc => slugify(loc) === slug) ?? ld.name

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('locality', localityName)
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  const all: ListingRow[] = listings ?? []
  const availableCount = all.filter(l => l.availability === 'available').length
  const typesInLocality = [...new Set(all.map(l => l.type))]

  const breadcrumbs = [
    { name: 'Home',        url: 'https://rewarihoardings.com' },
    { name: 'Rewari',      url: 'https://rewarihoardings.com/city/rewari' },
    { name: ld.name,       url: `https://rewarihoardings.com/locality/${slug}` },
  ]

  const waText = encodeURIComponent(`Hi, I'm looking for outdoor advertising in ${ld.name}, Rewari. Please share available options.`)

  return (
    <>
      <LocalBusinessSchema />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={ld.faqs.map(f => ({ question: f.q, answer: f.a }))} />

      {/* ── Breadcrumb nav ── */}
      <div className="bg-[#0A0A0A] border-b border-[#1a1a1a] px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-condensed text-[12px] uppercase tracking-[0.08em] text-[#555] flex-wrap">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <Link href="/city/rewari" className="hover:text-white transition-colors no-underline">Rewari</Link>
          <span>/</span>
          <span className="text-[#888]">{ld.name}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[rgba(255,230,0,0.1)] border border-[rgba(255,230,0,0.3)] px-3 py-1.5 mb-5 font-condensed font-semibold text-[12px] text-[#FFE600] uppercase tracking-[0.12em]">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {ld.character} · Rewari · Haryana
            </div>

            <h1 className="font-condensed font-black text-white uppercase leading-none tracking-[-0.01em] mb-3" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
              Hoardings in{' '}
              <span className="text-[#FFE600]">{ld.name}</span>
            </h1>
            <p className="font-condensed text-[#555] text-[15px] uppercase tracking-[0.05em] mb-5">{ld.tagline}</p>
            <p className="font-sans text-[15px] text-[#777] leading-[1.7] max-w-[580px] mb-8">{ld.desc}</p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a href={`https://wa.me/918168740234?text=${waText}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFE600] text-[#0A0A0A] font-condensed font-black text-[14px] uppercase tracking-[0.08em] px-6 py-3 no-underline hover:bg-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.122 1.522 5.855L.057 23.882l6.174-1.618A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.876 9.876 0 01-5.034-1.375l-.36-.214-3.742.98 1.001-3.649-.235-.375A9.855 9.855 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z" />
                </svg>
                WhatsApp Us
              </a>
              <Link href="/get-quote"
                className="inline-block border border-[#FFE600]/40 text-[#FFE600] font-condensed font-bold text-[14px] uppercase tracking-[0.08em] px-6 py-3 no-underline hover:border-[#FFE600] transition-colors">
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Stats panel */}
          <div className="border border-[#2A2A2A] bg-[#111]">
            <div className="border-b border-[#2A2A2A] px-6 py-4">
              <div className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.14em] mb-1">Location</div>
              <div className="font-condensed font-bold text-white text-[15px] uppercase tracking-[0.04em]">{ld.name}, Rewari</div>
            </div>
            <div className="border-b border-[#2A2A2A] px-6 py-4">
              <div className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.14em] mb-1">Area type</div>
              <div className="font-condensed font-bold text-[#FFE600] text-[15px] uppercase tracking-[0.04em]">{ld.character}</div>
            </div>
            <div className="border-b border-[#2A2A2A] px-6 py-4">
              <div className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.14em] mb-2">Inventory</div>
              <div className="flex gap-6">
                <div>
                  <div className="font-condensed font-black text-[32px] text-[#FFE600] leading-none">{all.length}</div>
                  <div className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.1em] mt-0.5">Total</div>
                </div>
                <div>
                  <div className="font-condensed font-black text-[32px] text-white leading-none">{availableCount}</div>
                  <div className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.1em] mt-0.5">Available</div>
                </div>
              </div>
            </div>
            {typesInLocality.length > 0 && (
              <div className="px-6 py-4">
                <div className="font-condensed text-[10px] text-[#555] uppercase tracking-[0.14em] mb-2">Formats here</div>
                <div className="font-condensed font-bold text-white text-[13px] uppercase leading-[1.7]">
                  {typesInLocality.map(fmtLabel).join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Format type filter chips ── */}
      {typesInLocality.length > 0 && (
        <div className="bg-[#0A0A0A] px-10 py-5 border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
            <span className="font-condensed text-[11px] text-[#555] uppercase tracking-[0.1em] mr-1">Browse by format:</span>
            {typesInLocality.map(type => (
              <Link key={type} href={`/locality/${slug}/${type}`}
                className="font-condensed font-semibold text-[13px] text-[#666] uppercase tracking-[0.05em] px-3 py-1.5 border border-[#2A2A2A] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
                {fmtLabel(type)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Listings grid ── */}
      <section className="bg-[#141414] px-10 py-14" id="inventory">
        <div className="max-w-7xl mx-auto">
          {all.length > 0 ? (
            <>
              <p className="font-condensed text-[12px] text-[#444] uppercase tracking-[0.1em] mb-6">
                {all.length} location{all.length !== 1 ? 's' : ''} in {ld.name}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
                {all.map(l => <ListingCard key={l.id} l={l} />)}
              </div>
            </>
          ) : (
            <div className="border border-[#2A2A2A] py-20 text-center">
              <p className="font-condensed text-[#555] uppercase tracking-wider text-[14px] mb-3">
                No listings in {ld.name} yet
              </p>
              <p className="font-sans text-[#444] text-[13px] mb-8">
                We may have unlisted inventory — WhatsApp us to check availability.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href={`https://wa.me/918168740234?text=${waText}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block bg-[#25D366] text-white font-condensed font-bold text-[14px] uppercase tracking-[0.08em] px-6 py-3 no-underline hover:bg-[#1ebe5a] transition-colors">
                  WhatsApp Us
                </a>
                <Link href="/city/rewari"
                  className="inline-block border border-[#FFE600]/40 text-[#FFE600] font-condensed font-bold text-[14px] uppercase tracking-[0.08em] px-6 py-3 no-underline hover:border-[#FFE600] transition-colors">
                  View All Rewari Listings
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Nearby localities ── */}
      {ld.nearby.length > 0 && (
        <section className="bg-[#0A0A0A] px-10 py-14 border-t border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-condensed font-black text-white uppercase text-[22px] tracking-[0.02em] mb-2">
              Nearby Locations
            </h2>
            <p className="font-sans text-[14px] text-[#555] mb-8">
              Expand your campaign reach to adjacent areas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
              {ld.nearby.map(nearSlug => {
                const nd = LOCALITY_DATA[nearSlug] ?? buildFallback(nearSlug)
                return (
                  <Link key={nearSlug} href={`/locality/${nearSlug}`}
                    className="bg-[#0A0A0A] p-6 group no-underline hover:bg-[#111] transition-colors">
                    <div className="font-condensed text-[10px] text-[#444] uppercase tracking-[0.12em] mb-1.5">{nd.character}</div>
                    <div className="font-condensed font-black text-white text-[18px] uppercase tracking-[0.02em] group-hover:text-[#FFE600] transition-colors mb-2">
                      {nd.name}
                    </div>
                    <div className="font-sans text-[13px] text-[#555] leading-[1.55] line-clamp-2">{nd.tagline}</div>
                    <div className="mt-4 font-condensed text-[12px] text-[#FFE600] uppercase tracking-[0.08em] opacity-0 group-hover:opacity-100 transition-opacity">
                      View locations →
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── All localities strip ── */}
      <section className="bg-[#0F0F0F] px-10 py-10 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <p className="font-condensed text-[11px] text-[#444] uppercase tracking-[0.12em] mb-4">All Rewari localities</p>
          <div className="flex flex-wrap gap-2">
            {ALL_LOCALITY_SLUGS.filter(s => s !== slug).map(s => {
              const d = LOCALITY_DATA[s] ?? buildFallback(s)
              return (
                <Link key={s} href={`/locality/${s}`}
                  className="font-condensed text-[12px] text-[#555] uppercase tracking-[0.05em] px-3 py-1.5 border border-[#1E1E1E] hover:border-[#FFE600] hover:text-[#FFE600] transition-colors no-underline">
                  {d.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#0A0A0A] px-10 py-16 border-t border-[#2A2A2A]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-condensed font-black text-white uppercase text-[28px] tracking-[0.02em] mb-2">
            Advertising in {ld.name}
          </h2>
          <p className="font-sans text-[14px] text-[#555] mb-12">Common questions about OOH advertising in this area.</p>
          <div className="space-y-0">
            {ld.faqs.map((faq, i) => (
              <div key={i} className="border-t border-[#1E1E1E] py-8">
                <div className="flex gap-5">
                  <span className="font-condensed font-black text-[#FFE600] text-[28px] leading-none flex-shrink-0 mt-0.5 w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-condensed font-bold text-white text-[17px] uppercase tracking-[0.03em] leading-[1.3] mb-3">
                      {faq.q}
                    </h3>
                    <p className="font-sans text-[14px] text-[#666] leading-[1.7]">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-[#1E1E1E]" />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#FFE600] px-10 py-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="font-condensed font-black text-[#0A0A0A] uppercase text-[28px] leading-none tracking-[-0.01em] mb-2">
              Book a spot in {ld.name}
            </h2>
            <p className="font-sans text-[#333] text-[14px] leading-[1.6]">
              Get availability, panel photos and pricing within 24 hours. No commitment required.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a href={`https://wa.me/918168740234?text=${waText}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-block bg-[#0A0A0A] text-[#FFE600] font-condensed font-black text-[14px] uppercase tracking-[0.08em] px-7 py-3.5 no-underline hover:bg-[#111] transition-colors">
              WhatsApp Now
            </a>
            <Link href="/get-quote"
              className="inline-block border-2 border-[#0A0A0A] text-[#0A0A0A] font-condensed font-bold text-[14px] uppercase tracking-[0.08em] px-7 py-3.5 no-underline hover:bg-[#0A0A0A] hover:text-[#FFE600] transition-colors">
              Get Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
