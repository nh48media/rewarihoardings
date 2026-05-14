export type EditorialEntry = {
  headline: string
  paras: string[]
  localities: { slug: string; name: string }[]
  listings: { slug: string; name: string }[]
}

const L = {
  nh48:       { slug: 'nh-48-entry-point',       name: 'NH-48 Entry Point' },
  delhi:      { slug: 'delhi-road',               name: 'Delhi Road' },
  sadar:      { slug: 'sadar-bazar',              name: 'Sadar Bazar' },
  busstand:   { slug: 'rewari-bus-stand',         name: 'Rewari Bus Stand' },
  railway:    { slug: 'rewari-railway-station',   name: 'Rewari Junction' },
  subhash:    { slug: 'subhash-nagar',            name: 'Subhash Nagar' },
  model:      { slug: 'model-town',               name: 'Model Town' },
  gurudwara:  { slug: 'gurudwara-chowk',          name: 'Gurudwara Chowk' },
  grain:      { slug: 'new-grain-market',         name: 'New Grain Market' },
  majra:      { slug: 'majra-chowk',              name: 'Majra Chowk' },
  jatcollege: { slug: 'jat-college-road',         name: 'Jat College Road' },
  circular:   { slug: 'circular-road',            name: 'Circular Road' },
  dharan:     { slug: 'dharan-road',              name: 'Dharan Road' },
  industrial: { slug: 'rewari-industrial-area',   name: 'Rewari Industrial Area' },
  kosli:      { slug: 'kosli-road',               name: 'Kosli Road' },
}

const SL = {
  unipole: { slug: 'unipole-nh48-entry-rewari',    name: 'Premium Unipole — NH-48 Entry Point' },
  gantry:  { slug: 'gantry-delhi-road-rewari',      name: 'Road-Spanning Gantry — Delhi Road' },
  led:     { slug: 'led-display-rewari-bus-stand',  name: 'LED Display — Rewari Bus Stand' },
}

export const EDITORIALS: Record<string, EditorialEntry> = {
  unipole: {
    headline: 'Unipole Advertising in Rewari — The Dominant NH-48 Format',
    paras: [
      'Among all outdoor advertising formats in Rewari, unipole advertising stands apart for one defining quality: height. Mounted on a single galvanised steel pole rising 25 to 60 feet above the ground, a unipole panel clears every roadside obstruction — trees, boundary walls, flyovers — and delivers clean sightlines at highway speeds. On NH-48, where vehicles travel at 70 to 90 km/h, height equals visibility. Two daily traffic peaks define the NH-48 audience: the morning window between 7 and 10 AM, when thousands of Rewari commuters head toward Gurugram (60 km) and Delhi (110 km), and the evening return between 5 and 8 PM. Workers commuting to and from the HPCL refinery at Bawal and the auto components manufacturers along the Dharuhera-Rewari corridor add a significant industrial-worker segment to this daily flow. A prime unipole at the NH-48 Entry Point records 20,000 to 35,000 vehicle impressions per day — the highest single-placement count in the district.',
      'The strongest unipole positions in Rewari are on the NH-48 entry and exit corridors, where intercity and commuter traffic density peaks simultaneously. The NH-48 Entry Point is the single most valuable position — every vehicle arriving from or departing toward Delhi passes this point. Delhi Road is the second-strongest corridor, carrying the full daily commuter load in both directions during the two peak windows. For brands booking unipole advertising in Rewari, these two locations consistently deliver the highest reach per rupee of any fixed OOH format in the city.',
      'Unipole advertising in Rewari suits brand categories with a broad geographic mandate — telecom operators, NBFC and banking brands entering Tier 2 Haryana, real estate developers targeting the NCR-adjacent buyer, and FMCG companies building district-level awareness. Campaigns typically run 1 to 12 months. Enquire early for NH-48 positions during Diwali, election, and school admissions seasons — inventory fills quickly at these peaks. Submit an enquiry through the listing page or WhatsApp +91 81687 40234; we confirm availability within 24 hours.',
    ],
    localities: [L.nh48, L.delhi, L.majra, L.gurudwara],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  gantry: {
    headline: 'Gantry Advertising in Rewari — Maximum Junction Dominance on NH-48 and Delhi Road',
    paras: [
      'A gantry is the only outdoor advertising format in Rewari from which there is no escape. Spanning the full width of the road from kerb to kerb, a gantry panel sits directly in the line of sight of every driver on the carriageway below. At Delhi Road Main Crossing — where Rewari\'s commuter traffic concentrates during the 7–10 AM and 5–8 PM peak windows — every vehicle heading toward Gurugram or returning from Delhi passes beneath the gantry and has no visual alternative. This unavoidability is what separates gantry advertising from every other format in Rewari.',
      'Gantries in Rewari are typically 30 to 60 feet wide, mounted 15 to 25 feet above road level, with approach sightlines of 200 to 400 metres. Both faces reach opposing carriageway directions simultaneously, effectively doubling audience reach from one placement. The most productive gantry locations are at Delhi Road Main Crossing — the city\'s dominant commuter route to Gurugram and Delhi — and at the NH-48 entry gantry point, where intercity and city-bound traffic diverge. At signalised junctions, vehicles queue for 30 to 90 seconds per cycle, giving gantry messaging extended contact time that open-highway unipoles at vehicle speed cannot match.',
      'Gantry hoarding booking in Rewari is most in demand from automotive brands, real estate developers targeting the NCR commuter segment, and FMCG companies running junction-dominance campaigns. Prime junction inventory — especially Delhi Road Crossing — fills quickly ahead of Diwali, election periods, and the March–June school admissions season. Enquire 3 to 4 weeks in advance to secure your preferred location. Contact us via the listing enquiry form or WhatsApp for current availability.',
    ],
    localities: [L.delhi, L.nh48, L.gurudwara, L.majra],
    listings:   [SL.gantry, SL.unipole, SL.led],
  },

  hoarding: {
    headline: 'Hoarding Advertising in Rewari — The Classic OOH Format for Citywide Local Reach',
    paras: [
      'The traditional roadside hoarding remains the backbone of outdoor advertising in Rewari. A two-legged steel structure supporting a large-format panel, the classic hoarding is the most widely distributed OOH format across the city — positioned at market entry points, commercial frontages, and arterial junctions where local brand awareness and repeat impressions build brand equity. For brands building a Rewari presence, hoarding advertising offers the widest geographic distribution at accessible monthly costs.',
      'The strongest hoarding locations in Rewari are along Delhi Road, which carries the full daily commuter load between Rewari and the NCR; in and around Sadar Bazar, where dense pedestrian and trader footfall creates captive audiences alongside vehicular traffic; and at Gurudwara Chowk, the city\'s busiest internal junction where multiple major roads converge. Rewari Bus Stand area hoardings are also strong performers — the mix of HRTC passengers heading to Narnaul, Bawal, Delhi, and Gurugram creates a continuously refreshed audience throughout the day.',
      'Hoarding booking in Rewari is flexible — most locations are available on monthly cycles, with longer campaigns attracting better rates. Standard sizes range from 20×10 ft in market lanes to 40×15 ft on arterial roads. Illuminated (frontlit) hoardings extend effectiveness into the evening peak — particularly valuable at busy junctions where post-work commuter traffic spikes between 5 and 8 PM. For brands that want consistent local market presence rather than short-burst highway reach, hoarding advertising in Rewari delivers the best combination of locality distribution and high-frequency impressions.',
    ],
    localities: [L.sadar, L.delhi, L.gurudwara, L.busstand],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  'rooftop-hoarding': {
    headline: 'Rooftop Hoarding Advertising in Rewari — Skyline Presence Above the Clutter',
    paras: [
      'In Rewari\'s dense commercial core, ground-level hoardings face a constant battle for sightlines — trees, parked vehicles, and competing signage block visibility from many angles. Rooftop hoardings solve this by rising above the clutter. Anchored on the roof of a commercial building and rising a further 10 to 25 feet above the roofline, a rooftop hoarding delivers multi-directional visibility across the surrounding area that no ground-mounted structure can match. Rooftop hoarding advertising in Rewari is particularly effective in Sadar Bazar — where grain dealers, cloth merchants, and hardware traders occupy dense multi-storey blocks — and in Model Town, where building concentration creates a natural commercial skyline.',
      'The audience for a rooftop hoarding is distinctive: it reaches vehicles on the road and pedestrians at street level from two or three directions simultaneously. This 360-degree visibility makes rooftop formats especially valuable for brand categories needing market-wide recall rather than directional reach. Real estate developers, consumer durables brands, and banking institutions with a district-wide message find rooftop hoardings in Rewari exceptionally cost-effective for sustained awareness campaigns that need to stand above the competitive clutter of the market environment.',
      'Most rooftop hoarding locations in Rewari are illuminated — frontlit floodlights or LED backlighting extend visibility into the evening peak (5–9 PM), when Sadar Bazar and the commercial lanes around Gurudwara Chowk see their highest pedestrian footfall. Campaign durations typically run 3 to 12 months. To book rooftop hoarding advertising in Rewari, check our live inventory for available positions in Sadar Bazar and Model Town commercial buildings, or WhatsApp us for exact panel dimensions and visibility data.',
    ],
    localities: [L.sadar, L.model, L.gurudwara, L.grain],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  'wall-painting': {
    headline: 'Wall Painting Advertising in Rewari — Long-Duration Presence in Every Market Lane',
    paras: [
      'Wall painting advertising in Rewari is one of the most permanent and resilient OOH formats in India\'s Tier 2 markets. A brand-painted wall in Sadar Bazar or New Grain Market is present every day for months or years, building deep repeated impressions with local shoppers, traders, and daily commuters who pass the same route habitually. Unlike printed formats that degrade in sun and rain, quality exterior paint campaigns in Rewari typically last 18 to 36 months with minimal maintenance — delivering one of the lowest effective cost-per-day rates of any outdoor format in the city.',
      'The best wall painting locations in Rewari are high-footfall market walls in Sadar Bazar and New Grain Market, where grain dealers, cloth merchants, and wholesale traders concentrate. The outer walls of commercial buildings facing Circular Road and the gable ends of shop blocks on Dharan Road reach both city residents and the rural visitors from surrounding wheat and mustard farming villages who travel these routes regularly, especially during the Rabi harvest season (March–April) and Kharif harvest (September–October). For rural reach beyond Rewari city, walls on Kosli Road toward Jhajjar and on routes to surrounding villages offer access to the district\'s farming audience that urban OOH formats never touch.',
      'Wall painting advertising in Rewari is ideal for FMCG companies building district-level trade awareness, agri-input brands targeting farmer audiences on village approach roads, and local businesses seeking permanent neighbourhood recognition. Booking involves location scouting, property owner negotiation, and professional paint execution — all of which Rewari Hoardings handles end-to-end. Contact us with your target localities and we\'ll identify suitable wall surfaces with footfall estimates.',
    ],
    localities: [L.sadar, L.grain, L.circular, L.kosli],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  'construction-hoarding': {
    headline: 'Construction Hoarding Advertising in Rewari — Months of Uninterrupted Exposure',
    paras: [
      'Construction hoarding advertising converts the unavoidable visual disruption of an active construction site into a brand asset. The perimeter fencing of any active project — residential complex, commercial building, road widening, or infrastructure development — can be wrapped with large-format brand panels facing passing traffic for the full construction duration. Rewari sits between two growing industrial zones: IMT Bawal to the south and the Dharuhera industrial township to the north. The infrastructure, road-widening, and residential development activity along Delhi Road and the NH-48 approach corridor means construction hoardings can provide 12 to 36 months of unobstructed exposure to arterial audiences — a duration no conventional hoarding contract matches at fixed cost.',
      'Unlike conventional hoardings where monthly renewal decisions can disrupt campaign continuity, construction hoarding advertising in Rewari runs for the full construction period. This makes it ideal for brands running sustained awareness campaigns: real estate developers, FMCG companies building district-level recall ahead of Rewari\'s retail expansion, and political parties preparing for election cycles. Construction hoardings also benefit from the natural curiosity of pedestrians slowing to observe site activity, increasing passive engagement with adjacent brand panels.',
      'Construction hoardings in Rewari are available as full perimeter wraps or partial-section bookings where multiple brands share a long perimeter. Panel heights run 8 to 12 feet — at eye level for pedestrians and visible above low-profile roadside structures for vehicle audiences. Availability depends on active construction sites — WhatsApp us to enquire about current perimeter advertising opportunities on Rewari\'s arterial roads and the Bawal-Rewari development corridor.',
    ],
    localities: [L.delhi, L.industrial, L.nh48, L.majra],
    listings:   [SL.gantry, SL.unipole, SL.led],
  },

  'led-display': {
    headline: 'LED Display Advertising in Rewari — Dynamic Digital Impact at High-Footfall Locations',
    paras: [
      'LED display advertising in Rewari brings full-motion video, animated graphics, and dynamically updated content to outdoor locations — visible at full brightness day and night. Unlike static formats that carry a single message for weeks, LED screens run content loops of 4 to 8 advertisers in 10 to 30 second slots, making them accessible for brands that cannot commit to exclusive static bookings. The most effective LED display location in Rewari is near Rewari Bus Stand — an HRTC hub handling daily routes to Delhi, Gurugram, Bhiwani, Narnaul, and Bawal — where concentrated footfall creates the highest daily impression count per screen in the city.',
      'LED display advertising in Rewari is best for brands with time-sensitive or campaign-specific messaging — product launches, promotional offers, festival specials, or event announcements. The ability to update content remotely means a single screen booking can serve morning commuter messaging (aimed at the 7–10 AM HRTC departure rush), afternoon promotional content, and evening leisure-context creatives on the same day. This creative flexibility, combined with the premium visual quality of outdoor LED, gives advertisers a format that delivers disproportionate impact relative to its cost.',
      'For brands booking LED display advertising in Rewari, the Bus Stand location is the premium choice — high dwell time, 15,000+ daily impressions, and a diverse audience spanning commuters, students, and rural market visitors. LED screens near Gurudwara Chowk and Sadar Bazar serve the local market audience with strong daytime visibility. Book LED advertising in Rewari on weekly or monthly slots — supply artwork as MP4 or high-resolution JPEG at the screen\'s exact pixel dimensions and we confirm upload timelines with your booking confirmation.',
    ],
    localities: [L.busstand, L.gurudwara, L.sadar, L.railway],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'led-video-wall': {
    headline: 'LED Video Wall Advertising in Rewari — Cinema-Scale Visual Impact at Commercial Hubs',
    paras: [
      'LED video walls bring cinema-screen visual scale to outdoor and semi-outdoor environments. Assembled from modular LED tiles to any custom size — 10×6 ft to 40×20 ft with no visible seams — video walls deliver ultra-high brightness and video-quality resolution at close viewing distances. LED video wall advertising in Rewari is best suited to high-footfall locations where pedestrian dwell time is significant: market entry points, event venues, and commercial plaza forecourts near Sadar Bazar and the bus stand, where audiences spend time in front of the screen rather than passing at speed.',
      'The primary advantage of LED video wall advertising over conventional LED screens is scale and resolution at proximity. While a roadside LED display is designed for viewing from 30 to 100 metres at vehicle speed, a video wall commands attention at pedestrian distance — a 20×10 ft display at a market entrance in Sadar Bazar creates an immersive visual environment that stops pedestrians and holds attention for 15 to 30 seconds. This makes video walls ideal for event-based brand activations, product launch showcases, and permanent brand installations at premium commercial venues in Rewari.',
      'LED video wall advertising in Rewari is available for permanent location installations and temporary event deployments. For brands seeking a permanent high-impact presence at a Rewari commercial hub near Gurudwara Chowk or the bus stand forecourt, a permanent installation creates a landmark brand presence that becomes part of the city\'s visual landscape. For events, temporary walls can be deployed with 5 to 7 days lead time. Contact us to discuss suitable locations and formats for your campaign.',
    ],
    localities: [L.sadar, L.busstand, L.gurudwara, L.model],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'digital-kiosk': {
    headline: 'Digital Kiosk Advertising in Rewari — Pedestrian-Level Digital at Market Junctions',
    paras: [
      'Digital kiosk advertising in Rewari places slim freestanding digital display units at pedestrian eye level in high-footfall zones — bus stops, market entry corridors, and commercial street junctions. These units deliver close-range digital advertising to foot traffic passing within 1 to 5 metres, a proximity that large highway formats cannot achieve. In Rewari\'s market zones — Sadar Bazar, New Grain Market, and the commercial streets around Gurudwara Chowk — digital kiosks add a premium digital layer to the advertising environment, reaching the active urban shopper who is physically present in the commercial area and in active purchase mode.',
      'The key advantage of digital kiosk advertising in Rewari over larger outdoor screens is contextual precision. A digital kiosk at the entrance to Sadar Bazar speaks to shoppers entering the market. A unit near Rewari Bus Stand reaches daily commuters heading to Gurugram, Narnaul, or Bawal during a predictable journey. A kiosk near the government hospital on Circular Road is seen by health-focused audiences. This contextual alignment between location and audience mindset drives recall effectiveness that mass-reach highway formats cannot replicate.',
      'Digital kiosks support time-of-day content scheduling — different messages for the morning commuter rush (7–10 AM), afternoon shoppers, and the evening market crowd. FMCG, quick-service food, finance, and healthcare brands find digital kiosk advertising particularly effective for offer-led campaigns that change weekly. Contact us with your target locality, campaign duration, and content format to check availability.',
    ],
    localities: [L.busstand, L.sadar, L.model, L.railway],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'bus-shelter': {
    headline: 'Bus Shelter Advertising in Rewari — High-Dwell Transit Audience on Every Route',
    paras: [
      'Bus shelter advertising in Rewari captures a uniquely valuable audience: commuters at rest. Unlike a driver who has 2 seconds to absorb a highway hoarding, a passenger waiting at a bus shelter is stationary, idle, and will dwell on nearby advertising for 5 to 25 minutes. This extended dwell time enables detailed messaging — phone numbers, QR codes, detailed product offers — that high-speed highway formats cannot support. Bus shelter panels in Rewari are backlit, maintaining full visibility during the 7–10 AM departure peak and the 5–8 PM evening return when commuters fill the shelters on routes to Delhi, Gurugram, Bhiwani, Narnaul, and Bawal.',
      'The highest-footfall bus shelter locations in Rewari are at Rewari Bus Stand itself — the main HRTC transit hub. Shelters along Delhi Road and near Rewari Junction are secondary high-performers, reaching the daily commuter demographic — working-age, income-earning adults who represent Rewari\'s core salaried consumer segment. Bus shelter advertising in Rewari works especially well for healthcare, education, and telecom brands targeting the mass commuter market.',
      'Bus shelter advertising in Rewari is available on individual panel bookings. A single well-chosen panel at Rewari Bus Stand delivers more qualified daily impressions than many larger formats at lower-priority locations. Minimum booking periods start at two weeks, making bus shelter advertising one of the more flexible short-term options. Contact us with your target localities to see available panels and get a comparison against other short-range formats in the same area.',
    ],
    localities: [L.busstand, L.delhi, L.railway, L.gurudwara],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'pole-kiosk': {
    headline: 'Pole Kiosk Advertising in Rewari — Brand Saturation Along Every Market Lane',
    paras: [
      'Pole kiosk advertising creates brand saturation that no single large-format hoarding can deliver. By positioning double-sided panels at 80 to 150 metre intervals along a street or market corridor, pole kiosks build a brand corridor — a repeated, cumulative impression that every pedestrian and slow-moving vehicle experiences travelling the length of the road. Pole kiosk advertising in Rewari is most effective in Sadar Bazar, New Grain Market, and the commercial lanes around Gurudwara Chowk, where dense footfall — shoppers, grain traders, cloth merchants, and daily-service workers — makes every panel a high-frequency touchpoint.',
      'Pole kiosks in Rewari are typically double-sided — facing traffic from both directions — mounted 6 to 10 feet above ground. They are sold as individual units or corridor clusters of 8 to 20+ kiosks. For a brand seeking market-wide presence in a specific locality, a cluster of 10 to 15 pole kiosks across the main commercial street of Sadar Bazar creates the impression of total market ownership at a fraction of the cost of multiple large-format hoardings. OOH advertising in Rewari through pole kiosks is the most affordable path to locality saturation.',
      'Pole kiosk advertising in Rewari works particularly well for franchise rollouts, healthcare chains, coaching institutes on Jat College Road, and political campaigns needing deep locality penetration. Directional campaigns guiding foot and vehicle traffic to a specific address — using sequential pole kiosks with arrow and distance indicators — also perform exceptionally well in Rewari\'s market areas. Book pole kiosk advertising as a single unit or a corridor package and we\'ll map the optimal positions for your target locality.',
    ],
    localities: [L.sadar, L.grain, L.gurudwara, L.circular],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'traffic-booth': {
    headline: 'Traffic Booth Advertising in Rewari — Unavoidable Brand Presence at Every Red Light',
    paras: [
      'Traffic booth advertising in Rewari places brand messaging at the most attention-rich moment in a driver\'s day: the red-light stop. A driver halted at a junction has nowhere to look but forward — and directly in front of them, at eye level, is the traffic booth wrapped in your brand\'s message. This captive engagement lasts 30 to 90 seconds per stop cycle. For commuters who cross the same junction every weekday during the 7–10 AM and 5–8 PM peak windows, the impression repeats twice daily — building frequency that roadside hoardings at vehicle speed cannot match.',
      'Rewari\'s most productive traffic booth advertising locations are at Delhi Road Main Crossing — the city\'s primary commuter junction — and at Gurudwara Chowk, where signal cycles are longest and vehicle volumes peak through the commercial day. Traffic booth advertising in Rewari is particularly effective for FMCG brands seeking maximum daily frequency with regular commuters, financial products targeting the salaried NCR workforce, and local businesses wanting strong daily recall with the city\'s habitual junction users.',
      'Traffic booth hoarding advertising in Rewari is sold monthly per booth. Some booths offer 4 to 6 advertising faces depending on booth design and junction geometry — brands can book a single face or a full wrap. For frequency-first strategies where repetition with a defined commuter audience is the primary goal, traffic booths deliver the highest cost-per-frequency efficiency of any fixed OOH format in Rewari. Contact us to check availability at specific junctions and confirm booth face dimensions.',
    ],
    localities: [L.delhi, L.gurudwara, L.busstand, L.sadar],
    listings:   [SL.gantry, SL.unipole, SL.led],
  },

  'toll-naka': {
    headline: 'Toll Naka Advertising in Rewari — Premium Captive Reach on NH-48',
    paras: [
      'Toll plaza advertising along NH-48 near Rewari delivers one of the most captive audiences in outdoor media. Every vehicle on the highway — private cars, trucks, buses, two-wheelers — must slow to a stop at the toll barrier. Drivers and passengers spend 45 to 180 seconds in the toll queue with nothing to do but observe their surroundings. Among the regular traffic through this toll are workers commuting toward the HPCL refinery in Bawal, auto components industry employees on the Rewari–Dharuhera corridor, and long-haul freight operators on the Delhi–Jaipur–Ahmedabad route — audiences that are difficult to reach through any city-centre format.',
      'The demographic at NH-48 toll plazas near Rewari skews toward vehicle-owning households with above-average income, commercial transport operators, and long-distance business travelers — categories that over-index for automobile brands, financial services, and premium FMCG. For a brand targeting the Haryana–Rajasthan–Delhi travel corridor, NH-48 toll naka advertising in Rewari is one of the most precise intercity audience formats available. The forced queue is the longest dwell of any highway OOH format — ideal for messaging that benefits from more than a 2-second impression.',
      'Toll naka advertising formats near Rewari include side hoardings adjacent to toll booths, overhead gantries spanning approach lanes, and booth-face panels visible to queuing traffic. Availability at specific toll points depends on the toll operator\'s advertising agreements. Contact us to check current availability and format options at NH-48 toll plazas near Rewari — for long-duration highway bookings, early enquiry is recommended as inventory is limited.',
    ],
    localities: [L.nh48, L.delhi, L.majra, L.kosli],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  'road-divider': {
    headline: 'Road Divider Advertising in Rewari — Double-Sided Reach on Dual Carriageways',
    paras: [
      'Road divider advertising in Rewari delivers one distinctive advantage over all other fixed OOH formats: it faces traffic from both directions simultaneously. Panels mounted on the central median of a dual-carriageway road are inherently double-sided, reaching vehicles traveling in both directions with a single placement. On Delhi Road and the NH-48 service road — Rewari\'s busiest dual-carriageway stretches — a corridor of road divider panels creates a brand presence that every vehicle encounters multiple times per journey. The commuter audience on Delhi Road alone — thousands of private car and two-wheeler riders making the Rewari–Gurugram run daily — represents repeated exposure to the same individual audience across every weekday.',
      'Road divider advertising in Rewari is sized for vehicle-speed viewing: panels of 3×6 ft to 4×8 ft, mounted 4 to 8 feet above road level at passenger-eye height. Messaging needs to be bold, brief, and instantly legible — a brand name, a phone number, or a single proposition. For brands running frequency-first campaigns, a corridor of 10 to 15 road divider panels along Delhi Road creates an unmissable brand presence for the thousands of daily commuters on that route — at both the morning 7–10 AM and evening 5–8 PM peaks.',
      'Road divider panel advertising in Rewari is ideal for high-repetition local campaigns: mobile and telecom operators, banking and payment brands, and FMCG companies building distribution-area awareness. Healthcare chains and pharmacy brands also find road dividers effective because the passing audience includes patients and caregivers making route-based decisions. Contact us to check available positions on Delhi Road and NH-48 service roads. Corridor bookings of 5 or more panels attract package rates.',
    ],
    localities: [L.delhi, L.nh48, L.circular, L.busstand],
    listings:   [SL.gantry, SL.unipole, SL.led],
  },

  'footpath-kiosk': {
    headline: 'Footpath Kiosk Advertising in Rewari — Reaching the Active Shopper at Eye Level',
    paras: [
      'Of all outdoor advertising formats in Rewari, footpath kiosks speak to the most commercially valuable audience at the most commercially valuable moment: the shopper, mid-browse, walking through a market. Positioned at pedestrian eye level along Sadar Bazar lanes, New Grain Market corridors, and the commercial streets of Model Town, footpath kiosks engage active buyers within 1 to 3 metres — a proximity that creates genuine message absorption in a way that even the largest highway hoarding cannot achieve from 200 metres away.',
      'Footpath kiosk advertising in Rewari works through proximity and context. A kiosk advertising a pharmacy in Sadar Bazar\'s chemist lane speaks to people actively seeking health products. A coaching institute kiosk near a market serving the Jat College Road residential area speaks to parents and students in the right neighbourhood. A finance company kiosk outside New Grain Market speaks to grain traders and wholesale buyers thinking about business finance. This contextual precision makes footpath kiosk advertising in Rewari highly cost-effective for hyperlocal targeting with minimal audience wastage.',
      'Footpath kiosks in Rewari are available as individual panels or cluster bookings across a market corridor. Portrait orientation (2×3 ft to 3×5 ft) is standard, with illumination available at select locations for evening visibility in the peak shopping hours (5–9 PM). Minimum booking periods start at 2 weeks — making footpath kiosks one of the most accessible short-term OOH options for local businesses, event promotions, and seasonal campaigns in Rewari. Contact us to see available positions in your target market area.',
    ],
    localities: [L.sadar, L.grain, L.model, L.jatcollege],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'railway-station': {
    headline: 'Rewari Junction Advertising — Captive Audience at One of Haryana\'s Busiest Rail Junctions',
    paras: [
      'Rewari Railway Station is not a typical small-town station — it is Rewari Junction, one of Haryana\'s busiest rail junctions, sitting at the intersection of the Delhi–Rewari–Alwar, Delhi–Rewari–Bhatinda, and Delhi–Rewari–Rohtak routes. The junction handles 20,000+ passengers per day — a broad mix of daily NCR commuters (the Rewari–Delhi Mainline serves thousands of Rewari residents working in Delhi and Gurugram), students traveling between Rewari and the NCR, HPCL refinery workers and auto industry employees commuting toward Bawal, and rural passengers from district villages arriving on connecting services. Railway advertising here reaches this audience during extended platform and concourse dwell time of 10 to 45 minutes.',
      'Station advertising formats at Rewari Junction include platform hoardings (visible to waiting passengers across both platforms), concourse panels (seen by every passenger entering and exiting the station), exit-gate panels (the first brand impression a visitor sees on arriving in Rewari), and backlit display boards. Each format reaches the audience at a different stage of their journey — a concourse panel during full transit focus, a platform hoarding during the extended pre-departure wait, an exit panel as passengers enter the city.',
      'Railway station advertising in Rewari is particularly effective for FMCG brands targeting mass commuter audiences, educational institutions reaching the large student traveler demographic on the Delhi–Rewari route, telecom brands building awareness among frequent junction travelers, and healthcare brands reaching patients traveling to Rewari\'s hospitals from district villages. Indian Railways advertising requires coordination with the zonal railway authority — Rewari Hoardings manages all approvals and booking coordination. Contact us for available formats and current rate cards.',
    ],
    localities: [L.railway, L.busstand, L.delhi, L.nh48],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'auto-rickshaw': {
    headline: 'Auto Rickshaw Advertising in Rewari — Mobile Reach Across Every Market and Locality',
    paras: [
      'Auto rickshaw advertising turns Rewari\'s large auto fleet into a network of mobile billboards penetrating every corner of the city — including the narrow market lanes and residential streets where fixed hoardings are absent. An auto rickshaw branded on its rear panel, hood, and sides carries your message to every road in Rewari, reaching pedestrians at market entry points, residents in back lanes, and slow-moving vehicle traffic at junctions. Auto rickshaw advertising in Rewari is one of the most cost-effective ways to achieve citywide brand saturation at a local market price point.',
      'Rewari\'s auto fleet operates across all major routes — between Rewari Junction, the bus stand, Sadar Bazar, Delhi Road, and residential colonies in Subhash Nagar and Model Town. Autos from the station to the market and back are among the most consistent route users. A campaign of 50 to 100 branded autos delivers cumulative daily impressions across every locality in the city, compounding into strong brand recall within 2 to 4 weeks. For FMCG brands entering Rewari\'s local retail distribution network, auto rickshaw advertising acts as a cost-efficient local ambassador that reaches the consumer where they live and shop.',
      'Auto rickshaw branding campaigns in Rewari run for 1 to 3 months, with fleet sizes from 10 autos for a targeted locality push to 200+ for city-wide saturation. Creative can be applied to the rear panel only (most economical), rear plus sides (medium saturation), or full wrap including hood (maximum impact). To book auto rickshaw advertising in Rewari, contact us with your campaign duration, target reach, and desired localities — we\'ll design the fleet composition and route coverage for your audience.',
    ],
    localities: [L.sadar, L.busstand, L.subhash, L.model],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'e-rickshaw': {
    headline: 'E-Rickshaw Advertising in Rewari — Last-Mile Reach Into Residential Corridors',
    paras: [
      'E-rickshaws have become the dominant last-mile transport in Rewari\'s residential zones, running fixed daily routes through Subhash Nagar, Model Town, and the corridors connecting to Jat College Road and the engineering college campuses in the district — localities that larger vehicles don\'t fully serve. E-rickshaw advertising in Rewari taps into these fixed, predictable routes to deliver brand messages to the same residential audiences day after day, building the neighbourhood-level recall that shapes purchase decisions for everyday consumer categories.',
      'The audience for e-rickshaw advertising in Rewari is primarily residential — homemakers, students, daily workers, and shoppers making last-mile connections. Routes from Subhash Nagar and Model Town to the bus stand and main market carry a particularly useful demographic: students at Jat College and nearby engineering colleges commuting daily, and working adults making the morning and evening connection to Rewari Junction or the bus stand for onward travel to Gurugram and Delhi. This audience over-indexes for FMCG, pharmacy, coaching, and daily-service categories.',
      'E-rickshaw advertising campaigns in Rewari are structured by route and locality — you specify the residential areas you want to penetrate and we identify operators on those routes. Campaign sizes range from 15 to 300 vehicles, with 1 to 3 month durations standard. Branding options include rear panel, side canopy wrap, and front fascia. For hyperlocal brands — coaching institutes, local clinics, neighbourhood grocery chains — e-rickshaw advertising in Rewari delivers verified locality-level penetration at rates significantly below any fixed OOH format.',
    ],
    localities: [L.subhash, L.model, L.jatcollege, L.busstand],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'bus-branding': {
    headline: 'Bus Branding in Rewari — Large-Format Mobile Advertising on Highway and City Routes',
    paras: [
      'Bus branding in Rewari converts the Haryana Roadways (HRTC) and private bus fleet into large moving advertisements across the city and beyond. A fully wrapped bus is the largest mobile advertising surface in any OOH market. On routes between Rewari and Delhi, Gurugram, Bhiwani, Narnaul, and Bawal, a branded bus carries your message well beyond Rewari city limits — reaching passengers and roadside audiences at every stop and junction along the full route corridor.',
      'Bus branding in Rewari is available at different investment levels: full bus wrap (maximum visual impact), rear panel only (most affordable, targeting following traffic), or side panel booking (reaching pedestrians and vehicles at stops along the route). For city-wide saturation at accessible cost, side panel bookings on 10 to 20 city buses deliver consistent daily reach across all served localities. For intercity brand exposure, full wraps on Rewari–Delhi, Rewari–Gurugram, and Rewari–Narnaul route buses create a rolling brand statement across the full NH-48 and connecting road corridors.',
      'Bus branding campaigns in Rewari are priced per bus per month, with full wraps commanding a premium over partial panel bookings. Route selection matters: Rewari–Delhi and Rewari–Gurugram route buses reach the high-value commuter demographic; Rewari–Narnaul and Rewari–Bawal routes deliver district-wide rural and industrial reach; local city routes provide dense coverage of Rewari\'s own residential and market audience. An effective campaign combines city and highway routes for complementary reach. Contact us to book bus branding in Rewari and we\'ll recommend the optimal route mix for your brief.',
    ],
    localities: [L.busstand, L.delhi, L.nh48, L.railway],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  'mobile-van': {
    headline: 'Mobile Van Advertising in Rewari — Targeted Locality Activation on Demand',
    paras: [
      'Mobile van advertising in Rewari is the most geographically flexible OOH format available. A branded van — wrapped on all sides with your campaign creative — drives a planned route through the specific localities, market areas, and time windows that best match your target audience. Unlike every fixed OOH format in Rewari, a mobile van can be directed to a specific street, a specific market during haat day, or a specific residential colony during a community event — delivering geographic and temporal targeting that fixed formats cannot achieve.',
      'Mobile van advertising in Rewari is most effective when deployed with purpose: a new store launch directing traffic to a Sadar Bazar address; a coaching institute enrolment drive running through Jat College Road, Subhash Nagar, and the engineering college residential areas; an FMCG rural push covering Kosli Road and district villages during the Rabi harvest period; or a festival sale announcement running through all major localities in the week before Diwali. The van can be equipped with a PA system for audio branding alongside the visual display, compounding the sensory impact in busy market environments.',
      'Mobile van campaigns in Rewari are typically booked by the day or week, with half-day deployments available for targeted market activations. A single branded van covers 4 to 6 major localities per day. Contact us 3 to 5 days in advance to book mobile van advertising in Rewari. Share your target localities, time windows, and campaign message and we\'ll design the optimal route plan.',
    ],
    localities: [L.sadar, L.jatcollege, L.subhash, L.kosli],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'tractor-branding': {
    headline: 'Tractor Branding Advertising in Rewari — Rural OOH That Reaches the Fields',
    paras: [
      'Tractor branding advertising reaches an audience that conventional urban OOH cannot touch: the farming community of Rewari district and surrounding villages. Rewari district sits deep in Haryana\'s wheat and mustard belt. Thousands of farmers who own or operate tractors travel to fields, to the New Grain Market in Rewari for wheat and mustard sales, and to agricultural input shops in Sadar Bazar for seeds, fertilisers, and crop protection products. A branded tractor carries your message into rural lanes, district roads, and mandis that no fixed hoarding serves.',
      'The timing of tractor branding campaigns in Rewari matters enormously. Rabi sowing (October–November) and Rabi harvest (March–April) are peak periods of wheat and mustard activity — maximum tractor movement and peak agri-input spending. Kharif sowing (June–July) covers the other half of the agricultural calendar. Harvest season campaigns reach farmers with post-harvest income and immediate purchasing capacity — the ideal window for equipment, input, and rural finance brands. Outside of peak agricultural periods, tractor branding still reaches the farming audience on regular maintenance trips, market visits, and social occasions.',
      'Beyond agri-input brands, tractor branding advertising in Rewari works well for rural finance and Kisan Credit products, consumer durables aimed at farm households, and government scheme communication campaigns. Fleet sizes range from 20 to 200 tractors depending on geographic coverage required. For brands wanting to reach rural Haryana audiences around Rewari without per-village fixed installations, tractor branding delivers genuine agricultural-community reach at an efficient campaign cost. Contact us to discuss seasonal availability and fleet composition.',
    ],
    localities: [L.grain, L.sadar, L.kosli, L.industrial],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  'society-gate': {
    headline: 'Society Gate Advertising in Rewari — Your Brand at Every Resident\'s Entry and Exit',
    paras: [
      'Society gate advertising in Rewari positions a brand at the most predictable chokepoint in any resident\'s day: the gate of their residential colony. Every resident passes their colony gate 2 to 6 times daily — morning departure to the bus stand or railway junction, school runs, evening return, and errand trips. In Rewari\'s planned residential areas — Subhash Nagar, Model Town, and the colonies along Jat College Road — formal gate structures make branding clean and prominent. Unlike a highway hoarding reaching thousands of different people each day, a society gate reaches the same households, repeatedly, building deep neighbourhood-level brand recall.',
      'Society gate advertising in Rewari is most effective in Subhash Nagar and Model Town, where defined boundary walls and formal entry gates make branding apply cleanly, and where the resident demographic — middle-income families, government employees, business owners — aligns well with FMCG, financial services, real estate, and education brand categories. For local businesses — a coaching institute, a pharmacy, a grocery delivery service — society gate advertising is the most direct route to neighbourhood-level customer acquisition. The gate is literally the resident\'s first and last brand touchpoint every day.',
      'Society gate branding in Rewari is typically sold monthly per gate, with multi-gate packages for brands targeting multiple neighbourhoods. Creative formats include fabric arch banners, metal panel inserts on gate pillars, and flex banners on railings. A campaign covering 10 to 20 gates across Rewari\'s key residential colonies creates blanket neighbourhood presence at a cost comparable to a single small-format roadside hoarding. Contact us to identify available society gates in your target residential localities.',
    ],
    localities: [L.subhash, L.model, L.jatcollege, L.circular],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'school-college-gate': {
    headline: 'School & College Gate Advertising in Rewari — Reaching Parents and Students at the Source',
    paras: [
      'School and college gate advertising in Rewari reaches one of the most commercially valuable audiences for education and youth-oriented brands: parents in active education-investment mode. During the morning drop-off (7–9 AM) and afternoon pick-up (1–4 PM), hundreds of parents wait at school gates — a predictable, reliable dwell context that creates extended brand exposure in a frame of mind directly receptive to education and child-related messaging. For coaching institutes and edtech brands, no format in Rewari delivers this contextual precision.',
      'Rewari has several prominent educational institutions generating significant daily gate traffic — from primary schools in Subhash Nagar and Model Town to Jat College (one of Rewari\'s oldest institutions) and multiple engineering colleges and technical institutes in the district. Gate advertising reaches both students and parents across the academic calendar, with timing that aligns naturally with key decisions — admission season (March–June), textbook season (June–July), and exam preparation season (December–February). Coaching institutes booking school college gate advertising in Rewari during admission season report among the highest-conversion rates of any OOH format.',
      'School and college gate advertising in Rewari is sold per institution per month, with multi-school bundle packages for brands seeking blanket youth-demographic coverage. Creative formats include gate arch banners, entrance board panels, and pillar wraps. For brands targeting a specific grade range or age segment — say, Class 11–12 students for engineering entrance coaching, or engineering college students for banking products — we identify institutions matching the exact academic profile. Contact us to book school college gate advertising in Rewari.',
    ],
    localities: [L.jatcollege, L.subhash, L.model, L.busstand],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'market-gate': {
    headline: 'Market Gate Advertising in Rewari — Reaching Shoppers in Active Purchase Mode',
    paras: [
      'Market gate advertising in Rewari delivers a brand impression to shoppers in active purchase mode — entering a market with money to spend and intent to buy. Every visitor to Sadar Bazar, New Grain Market, or the Cloth Market must pass through the market gate, making it the single highest-concentration shopping-intent audience touchpoint in the city\'s commercial environment. Market gate advertising converts this mandatory entry into a brand opportunity that directly precedes purchase decisions inside the market.',
      'The audience at Rewari\'s major market gates is commercially focused and commercially specific. Sadar Bazar attracts retail shoppers, homemakers, and local traders across all consumer categories. New Grain Market brings wholesale grain traders, wheat and mustard farmers selling post-harvest, and FMCG distributors representing both consumer and trade audiences. A cooking oil brand at the grain market gate, a fabric care product at the cloth market entry, or a crop finance product at the wholesale entrance — contextual alignment between product and audience dramatically improves conversion from impression to enquiry.',
      'Market gate advertising in Rewari is available as gate arch banners, entrance-pillar inserts, and large-format boards adjacent to market entry points. Campaign durations range from 2 weeks for festival sale events to 6 months for sustained brand building. Weekly haat market days — specific wholesale market days at locations around Rewari and the surrounding district — offer short-term high-concentration audience opportunities for brands targeting the trading community. Contact us to book market gate advertising in Rewari.',
    ],
    localities: [L.sadar, L.grain, L.gurudwara, L.busstand],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'hospital-branding': {
    headline: 'Hospital Branding in Rewari — Reaching Health-Focused Audiences at Healthcare Points',
    paras: [
      'Hospital branding in Rewari places your brand in front of an audience that is, by definition, thinking about health. Patients, caregivers, and family members visiting Rewari\'s government hospital on Circular Road and private clinics in the Circular Road and Dharan Road healthcare zones are in an active health-concern mindset — more receptive to health, medicine, insurance, and nutrition brand messaging than in any other context. The government hospital draws patients from across the district\'s nine lakh population, making it one of the few Rewari locations where genuine district-wide audience reach concentrates in a single physical venue.',
      'The dwell time advantage of hospital advertising in Rewari is significant. A patient waiting in an outpatient department or a caregiver in a waiting room may spend 30 minutes to 4 hours in the same environment — far exceeding any other OOH format. This extended exposure enables detailed messaging that a 10-second LED slot or passing highway format cannot achieve: a pharmaceutical brand can communicate product benefits, a health insurance company can present a policy proposition, and a nutrition supplement can make a complete health argument.',
      'Hospital branding in Rewari is available at government hospital facilities (highest daily patient volume, district-wide catchment) and private hospitals and multi-specialty clinics in the Circular Road healthcare zone. Formats include entrance gate panels, courtyard hoardings, OPD waiting-area display boards, and pharmacy-adjacent panels. Category restrictions apply — consult with us before booking to confirm your product category is appropriate for healthcare facility advertising in Rewari.',
    ],
    localities: [L.circular, L.dharan, L.busstand, L.subhash],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'petrol-pump': {
    headline: 'Petrol Pump Advertising in Rewari — Captive Dwell at Every Fill-Up',
    paras: [
      'Petrol pump advertising in Rewari captures motorists during a behaviour that is habitual, predictable, and offers one of the longest vehicle-side dwell times in OOH: the fuel stop. A driver filling their tank is stationary for 3 to 8 minutes with nothing to do but observe surroundings. Pump topper panels at eye level, canopy banners overhead, and pillar wraps beside the pump nozzle all deliver unavoidable brand impressions to a captive audience. The pumps on NH-48 south of Rewari city serve a particularly interesting demographic: commuters traveling toward the Bawal industrial corridor, including workers at the HPCL refinery and auto components manufacturers — a salaried industrial workforce with predictable daily movement patterns.',
      'The best petrol pump advertising locations in Rewari are on NH-48 — pumps serving intercity travelers in addition to local motorists, with a premium demographic skew toward vehicle-owning households and commercial operators. Delhi Road pumps are the strongest city-side option, serving Rewari\'s daily commuter population during the 7–10 AM and 5–8 PM peak windows when tanks are filled for the Gurugram and Delhi commute. Petrol pump advertising in Rewari is particularly effective for tyre, lubricant, and automotive brands; banking and credit card brands targeting the vehicle-owning segment; and FMCG brands reaching the car-owning consuming class.',
      'Petrol pump advertising formats in Rewari include pump topper displays, canopy banners (large-format, visible from 100+ metres), pillar wraps, entrance hoarding boards, and digital display positions at select modern pumps. Contact us to view available petrol pump advertising positions on NH-48 and Delhi Road in Rewari, with daily vehicle count data and format dimensions for each site.',
    ],
    localities: [L.nh48, L.delhi, L.majra, L.busstand],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  'dhaba-restaurant': {
    headline: 'Dhaba & Restaurant Advertising in Rewari — Reaching Highway Travellers Over a Meal',
    paras: [
      'Highway dhaba advertising on NH-48 near Rewari reaches one of the most captive and relaxed audiences in outdoor advertising: long-distance travellers who have stopped for a meal. A truck driver on the Delhi–Ahmedabad route, a family on a Rajasthan road trip, or a commercial bus passenger at an NH-48 dhaba is stationary and spending 20 to 60 minutes in a single location. The combination of dwell time, relaxed mental state, and social dining context makes dhaba advertising in Rewari among the highest-engagement formats for reaching highway travellers — a genuine intercity audience fundamentally different from the commuter and local market audiences that city-centre formats serve.',
      'The NH-48 dhaba corridor near Rewari serves a distinctive demographic: long-haul truck drivers (key audience for lubricants, tyres, and agri equipment brands), intercity bus passengers on Rewari–Delhi and Rewari–Jaipur services (FMCG, telecom, and finance audiences), and private car travelers on the Delhi–Jaipur–Ahmedabad route (premium consumer demographic). Dhaba advertising formats — entrance boards visible from the road, interior banners seen by all seated diners, and menu-card panel inserts read up close — each reach this audience at a different engagement level.',
      'Dhaba advertising campaigns near Rewari are available as single-dhaba bookings or as corridor packages spanning multiple NH-48 highway eateries. For brands seeking continuous presence along the full NH-48 approach and exit from Rewari, a network of 3 to 5 dhaba locations creates a brand corridor that any regular highway traveller encounters repeatedly. Contact us to see available dhaba advertising positions on NH-48 near Rewari with footfall data and format options for each location.',
    ],
    localities: [L.nh48, L.delhi, L.majra, L.kosli],
    listings:   [SL.unipole, SL.gantry, SL.led],
  },

  'no-parking-board': {
    headline: 'No-Parking Board Advertising in Rewari — Hyper-Local Brand Placement at Zero Attention Cost',
    paras: [
      'No-parking board advertising in Rewari is a micro-format that creates macro saturation at minimal cost. Branded no-parking signs — panels of 12×18 inches to 18×24 inches combining the official no-parking message with a brand name, logo, or phone number — are placed on shop frontages, building entrances, compound walls, and utility poles across market lanes and commercial areas. Every driver searching for parking in Rewari\'s dense commercial zones reads no-parking boards carefully — making it one of the few outdoor formats that captures near-100% readership from its target audience at the exact moment of maximum vehicular attention.',
      'The strategic value of no-parking board advertising in Rewari is in volume and distribution. Two hundred boards distributed across every commercial lane in Sadar Bazar, New Grain Market, and the bus stand area create a pervasive brand presence that makes a brand feel established and omnipresent in the market. For local brands — a pharmacy on Circular Road, a clinic, a courier service, a hyperlocal delivery app — appearing on no-parking boards throughout their service area creates the sense of market authority at the cost of a modest saturation campaign.',
      'No-parking board campaigns in Rewari are sold in minimum batches of 50 to 100 boards, with larger city-wide saturation campaigns using 200 to 500 boards. Production and installation is handled by Rewari Hoardings with property owner permissions secured. All boards are placed in compliance with municipal guidelines. For brands seeking hyperlocal awareness in Rewari\'s market areas at the most affordable OOH entry point, no-parking board advertising delivers unmatched cost-per-location at scale.',
    ],
    localities: [L.sadar, L.grain, L.gurudwara, L.busstand],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'atm-branding': {
    headline: 'ATM Branding in Rewari — Financial Audience at a Moment of Maximum Receptivity',
    paras: [
      'ATM branding in Rewari targets a financially active audience at the moment they are most engaged with financial services: while performing a banking transaction. A person standing at an ATM is holding their bank card, waiting for cash, and has 2 to 4 minutes of mandatory dwell time. Exterior booth wraps, door panel inserts, and adjacent display boards at Rewari\'s commercial ATMs deliver brand messaging at this moment of peak financial receptivity — an audience context that no highway hoarding can replicate. ATM advertising in Rewari is among the most contextually precise formats available.',
      'ATM users in Rewari skew toward financially active adults with bank accounts and regular transaction behaviour — a demographic that over-indexes for financial products, credit, insurance, and premium consumer brands. Commercial ATMs in Sadar Bazar, Model Town, and the bank branch clusters on Delhi Road serve a mix of grain traders, business owners, government employees, and salaried workers from the Rewari–Gurugram commuter segment representing the city\'s most commercially active consumer base.',
      'ATM branding formats in Rewari include exterior booth wraps, door panel inserts, and kiosk panels adjacent to the ATM enclosure. Availability at bank-owned ATMs requires coordination with the respective bank\'s property teams — Rewari Hoardings manages this process. For commercial ATM locations in market areas, direct arrangement with site owners is possible. Contact us to explore ATM advertising availability in your target commercial zones in Rewari.',
    ],
    localities: [L.sadar, L.model, L.delhi, L.gurudwara],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'water-tank': {
    headline: 'Water Tank Hoarding in Rewari — Elevated Visibility Above the Urban Skyline',
    paras: [
      'Water tank hoarding advertising in Rewari exploits a structural feature unique to Indian residential zones: elevated municipal or building water tanks that rise above the surrounding roofline. In Rewari\'s planned residential areas — Subhash Nagar, Model Town, and the colonies along Circular Road — water tanks tower at 20 to 60 feet, providing 360-degree visibility across a radius of 300 to 500 metres. Branding on a water tank surface in Rewari creates a landmark advertisement visible from every approach direction, becoming a long-term feature of the neighbourhood\'s visual landscape that residents associate with their immediate community environment.',
      'Water tank hoarding advertising in Rewari is the closest thing to a neighbourhood billboard but addresses the full surrounding residential population simultaneously from all directions. For a brand building awareness among residents of Subhash Nagar or Model Town — government employees, business owners, and working professionals who commute to Gurugram and Delhi — a painted water tank at the centre of that neighbourhood delivers daily impressions to the entire surrounding population without recurring monthly rental costs. Paint-based campaigns typically last 18 to 36 months.',
      'Water tank advertising in Rewari is available as painted designs (most durable, 18–36 months lifespan) or vinyl wrap (crisper graphics, 12–24 months lifespan). The advertising surface area varies by tank — typically 100 to 600 sqft depending on size and geometry. All tanks in our inventory have confirmed advertising permissions from the municipal corporation, housing society, or building owner. For long-duration neighbourhood awareness at residential scale, water tank hoarding advertising in Rewari delivers unmatched visibility-per-rupee.',
    ],
    localities: [L.subhash, L.model, L.circular, L.dharan],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'pamphlet-distribution': {
    headline: 'Pamphlet Distribution in Rewari — Street-Level Targeting for Hyperlocal Campaigns',
    paras: [
      'Pamphlet distribution in Rewari delivers your brand message directly into the hands of your target audience — at their door, in their hands at a market stall, or outside a specific institution. No outdoor format matches the geographic precision of well-planned pamphlet distribution: a campaign can be executed exclusively in specific residential colonies of Subhash Nagar, at the entrance to Sadar Bazar, outside the gate of Jat College or an engineering college, or at Rewari Junction as passengers exit — with zero wastage on audiences outside your target area.',
      'The practical speed advantage of pamphlet distribution in Rewari makes it uniquely valuable for time-sensitive campaigns. A design approved today can be printed overnight and distributed by morning — a 24 to 48 hour turnaround that no other OOH format offers. This speed makes pamphlet distribution the natural first-response format for last-minute event announcements, flash sale campaigns, competitive market-entry moves, and any campaign where a fast local market reaction is commercially critical.',
      'Pamphlet distribution in Rewari is structured by locality and route. A residential colony campaign targets 500 to 3,000 households per locality with door-to-door delivery. A market campaign distributes at the entrance of Sadar Bazar or Rewari Bus Stand to foot traffic in active purchase mode. An institution campaign targets parents and students at school and college entry points during arrival and departure peaks. We plan, supervise, and report on all pamphlet distribution — ensuring verified delivery and accurate locality coverage.',
    ],
    localities: [L.sadar, L.subhash, L.busstand, L.jatcollege],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'newspaper-insert': {
    headline: 'Newspaper Insert Advertising in Rewari — Delivering Your Campaign Into Every Morning Home',
    paras: [
      'Newspaper insert advertising in Rewari delivers a brand\'s printed message directly into the home — tucked inside the morning Hindi daily that thousands of Rewari households read with their morning tea. Unlike a highway hoarding a driver passes at speed, a newspaper insert enters the home as a physical object that the reader handles, examines, and often keeps if the message is relevant. This physical, in-hand experience creates a different quality of brand engagement than any outdoor format, combining broad local press reach with the intimacy of direct-to-home delivery.',
      'Newspaper insert advertising in Rewari is available through the major Hindi dailies with strong district circulation — Dainik Bhaskar, Amar Ujala, and Punjab Kesari are the highest-reach options. Insertion in the Rewari district edition allows geographic targeting without paying for state-wide distribution. Minimum insert quantities typically start at 5,000 copies, with full city coverage campaigns running 15,000 to 30,000 inserts. The insert itself can be any size from A5 to A3, full-colour, with design freedom not available in standard display ads.',
      'Newspaper insert advertising in Rewari is particularly effective for real estate project launches (reaching decision-making households at home), retail sale events (creating urgency before a sale date), banking and insurance products (reaching the home-based financial decision maker in the Rewari–Gurugram commuter household), and coaching institute enrollments (reaching parents at home during the March–June admissions season). Book newspaper inserts in Rewari 7 to 10 days before your desired publication date.',
    ],
    localities: [L.sadar, L.subhash, L.model, L.busstand],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'newspaper-ad': {
    headline: 'Newspaper Advertising in Rewari — Brand Credibility in the Local Daily Press',
    paras: [
      'Newspaper display advertising in Rewari carries a credibility advantage that no outdoor format can match: editorial context. A brand advertisement placed in a trusted local Hindi daily — Dainik Bhaskar, Amar Ujala, or Punjab Kesari — benefits from the inherent trust readers place in the publication. Unlike a roadside hoarding, a newspaper ad in Rewari is encountered in an active reading context: the audience is engaged and processing information rather than absorbing impressions at speed. This active context is particularly valuable for complex messages — property launches, financial products, legal announcements, and institutional communications requiring more than 7 words.',
      'The Rewari district edition of major Hindi dailies reaches households across the city and surrounding district — including villages, tehsils, and smaller towns that urban outdoor advertising never reaches. For brands with a genuine district-wide mandate — an agricultural input company, a cooperative bank, a government scheme reaching the farming communities of the wheat and mustard belt — newspaper advertising in Rewari delivers geographic reach beyond the city\'s physical boundaries. Classified ad formats are available at very low cost; quarter-page, half-page, and full-page display ads are available for brands needing visual impact.',
      'Newspaper advertising in Rewari requires 2 to 3 days of lead time for most placements. For high-demand periods — election season, Diwali, harvest season, and school admissions (March–June) — booking 2 to 3 weeks ahead secures preferred placement. District-edition targeted runs are available at a fraction of the cost of full state or national editions. Contact us for current rate cards, circulation data, and availability across Hindi dailies serving Rewari district.',
    ],
    localities: [L.sadar, L.busstand, L.grain, L.railway],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'flex-banner': {
    headline: 'Flex Banner Advertising in Rewari — The Fastest Large-Format Option for Any Campaign',
    paras: [
      'Flex banner advertising in Rewari is the most versatile, fast-executing large-format OOH option in the local market. A PVC flex vinyl banner can be printed at any size, in any design, and installed on virtually any surface — a shop front, a compound wall, an event venue facade, or a market lane overhead — within 24 to 48 hours of artwork approval. This combination of design freedom, size flexibility, and rapid turnaround makes flex banner advertising the format of choice for last-minute campaigns, festival promotions, event announcements, and short-duration offers that need to appear in the Rewari market quickly.',
      'Flex banners dominate Rewari\'s commercial landscape during peak seasons — Diwali, Holi, the wheat harvest period when farmers visit New Grain Market with income to spend, school admissions season, and Eid. The density of banners in Sadar Bazar and New Grain Market during these periods demonstrates how effectively flex banner advertising creates market saturation for retail and event brands. A coordinated campaign covering 20 to 50 key surfaces in Rewari can create the impression of total market ownership at a fraction of the cost of equivalent fixed hoarding bookings.',
      'Flex banner advertising in Rewari is priced per square foot of printed area plus installation labour — highly scalable from a single shop-front banner to a full market-lane campaign of 30 to 50 surfaces. Standard minimum booking is 2 weeks. Standard outdoor flex (440 GSM or 550 GSM) lasts 6 to 12 months. Contact us for flex banner printing, placement, and installation in Rewari — same-day printing is available for urgent campaigns.',
    ],
    localities: [L.sadar, L.grain, L.gurudwara, L.busstand],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'poster': {
    headline: 'Poster Advertising in Rewari — High-Volume Presence in Markets and Public Spaces',
    paras: [
      'Poster advertising in Rewari delivers brand presence through volume — dozens to hundreds of printed sheets pasted across walls, utility poles, shop frontages, and public notice boards throughout the target locality. In Rewari\'s dense market areas, where large-format hoardings cannot reach every wall and every lane, posters create a saturation of brand impressions that makes a campaign feel omnipresent across the commercial environment. Poster advertising in Rewari is the high-frequency hyperlocal format for brands and campaigns that need pervasive visual presence in a specific market zone at low budget.',
      'The most effective poster advertising locations in Rewari are the walls and poles of Sadar Bazar, New Grain Market, and the commercial lanes connecting the bus stand to the main market area. These zones see the highest density of local shoppers and daily commuters. Posters in Rewari are printed on A2, A1, or double-crown format paper (or weatherproof coated stock for longer campaigns) and applied with industrial adhesive paste. For events, product launches, and political campaigns, poster advertising creates fast and visible city-wide saturation.',
      'Poster campaigns in Rewari are priced by unit count and executed in batches of 200 to 5,000 posters depending on coverage scope. A Sadar Bazar saturation campaign typically requires 200 to 500 posters; a city-wide political or event campaign may use 2,000 to 5,000 across all major localities. Standard paper posters last 2 to 4 weeks; weatherproof stock lasts 4 to 8 weeks. Same-day printing is available for urgent poster advertising campaigns in Rewari.',
    ],
    localities: [L.sadar, L.grain, L.gurudwara, L.busstand],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'cinema-advertising': {
    headline: 'Cinema Advertising in Rewari — Captive Screen Audience in the Dark',
    paras: [
      'Cinema advertising in Rewari delivers what no outdoor format can: a captive audience in a dark room, screen brightly lit, distraction eliminated, and attention fully locked to the display. Pre-show cinema advertising reaches an urban, entertainment-seeking audience that is deliberately present, voluntarily stationary, and in a high-receptivity mindset. A 30-second on-screen ad in a Rewari cinema runs before every show — 4 to 6 times daily, 7 days a week — delivering 120 to 180 ad exposures per month to a concentrated, demographically consistent audience that is absent from highway and market-zone OOH.',
      'The cinema audience in Rewari skews toward urban youth aged 15 to 40 — students from Jat College and the district\'s engineering colleges, young working adults, and couples. This audience is distinct from the highway or market-zone OOH demographic, which skews older and more mixed. For brands targeting Rewari\'s young consumer class — a soft drink, a fashion seasonal campaign, a new smartphone model, or a real estate project aimed at young home buyers — cinema advertising delivers a more age-filtered audience than any outdoor format in the city.',
      'Cinema advertising formats in Rewari include on-screen slides (10 to 15 second static images shown pre-film multiple times per show), on-screen video spots (30 to 60 seconds), lobby standee displays, and poster panels in the cinema foyer and corridors. A complete cinema branding package combining on-screen and lobby formats creates a full cinema-journey brand experience. Contact us to book cinema advertising in Rewari — we\'ll confirm available screen slots, current show schedules, and artwork specifications.',
    ],
    localities: [L.sadar, L.busstand, L.model, L.gurudwara],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'look-walker': {
    headline: 'Look Walker Advertising in Rewari — Human Billboards That Stop Crowds',
    paras: [
      'A look walker is an OOH format that cannot be ignored. A person carrying a large illuminated display board on their front and back — walking through a crowded market in Rewari — is an inherently curiosity-generating presence that stops pedestrians, draws eye contact, and delivers brand messages at human scale and human proximity. Look walker advertising in Rewari is the most attention-generating format available, combining the reach of outdoor advertising with the personal engagement of a human touchpoint in a busy public space. Eye-contact rates for look walkers in market contexts typically run 70 to 90% — far above any static outdoor format.',
      'Look walkers in Rewari perform best at high-footfall, high-energy locations during peak hours — the evening market in Sadar Bazar and near New Grain Market (6–10 PM), Rewari Bus Stand during the departure rush (8–10 AM, 5–8 PM), Gurudwara Chowk on market days, and any special event venue during active hours. The format remains novel enough in Rewari\'s market environment to attract genuine attention — ensuring high-impact recall for brands that need a memorable, people-stopping presence.',
      'Look walker campaigns in Rewari are typically booked by the deployment day, with half-day (4 hours) and full-day (8 hours) options. A single look walker covers a defined market zone; a team of 4 to 6 across multiple locations creates city-wide activation impact. Look walkers are commonly paired with pamphlet distribution or product sampling to convert visual attention into a physical touchpoint. To book look walker advertising in Rewari, contact us 3 to 5 days in advance with your target locations, hours, and campaign message.',
    ],
    localities: [L.sadar, L.busstand, L.gurudwara, L.grain],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },

  'exhibition-stall': {
    headline: 'Exhibition Stall Advertising in Rewari — Face-to-Face Brand Activation at Trade Shows and Melas',
    paras: [
      'Exhibition stall advertising in Rewari converts passive brand awareness into active audience engagement. At trade shows, government melas, Kisan melas, and annual fairs in and around Rewari, a branded stall places your brand representatives face-to-face with a self-selected, category-interested audience. People present at an agricultural Kisan mela are actively seeking farming solutions. People at a housing fair are actively considering property. This self-selection quality means exhibition stall audiences in Rewari are pre-qualified in a way that no passive outdoor format can deliver.',
      'Rewari district\'s large farming population — centred on wheat and mustard cultivation across the district\'s agricultural belt — makes Kisan melas and agricultural exhibitions particularly high-value for agri-input, rural finance, and farm equipment brands. Government melas held by the district administration attract rural families from across the district\'s nine lakh population. Seasonal exhibitions during Navratri and Diwali draw Rewari city consumers in a festive, open-to-purchase mindset. The audience at each event type has a distinct commercial profile — matching product and event is critical.',
      'Exhibition stall sizes at Rewari events range from 10×10 ft shell scheme stalls to large custom-built pavilions for premium brand activations. Stall branding includes fascia panels, backwall graphics, floor decals, product display fixtures, and digital screen integration. For brands new to Rewari\'s market, exhibition stalls provide a cost-effective test of audience receptivity and a direct channel for lead collection before committing to long-duration OOH campaigns. Contact us for the current events calendar and available stall positions.',
    ],
    localities: [L.industrial, L.grain, L.busstand, L.sadar],
    listings:   [SL.led, SL.unipole, SL.gantry],
  },
}

export function buildFallbackEditorial(name: string): EditorialEntry {
  return {
    headline: `${name} Advertising in Rewari — Locations, Rates & Booking`,
    paras: [
      `${name} advertising in Rewari is available across the city's key commercial zones and arterial roads. Whether you need highway-facing coverage on NH-48 — the Delhi–Jaipur–Ahmedabad corridor passing through Rewari — or market-level presence in Sadar Bazar and Rewari Bus Stand, ${name.toLowerCase()} formats can be placed strategically to reach your target audience. Rewari's combination of a 1.5 lakh city population, a 9 lakh district catchment, and daily commuter flows to Gurugram and Delhi makes any OOH advertising in Rewari, Haryana inherently more cost-effective than comparable placements in NCR.`,
      `The strongest ${name.toLowerCase()} advertising locations in Rewari are determined by your target audience profile. Highway and arterial road placements on Delhi Road and NH-48 reach intercity travellers and daily NCR commuters — peak traffic runs 7–10 AM and 5–8 PM on weekdays. Market-zone placements in Sadar Bazar, New Grain Market, and Gurudwara Chowk reach local shoppers, grain traders, and district visitors. Residential area placements in Subhash Nagar and Model Town reach neighbourhood-level consumer and household audiences including the commuter families who work in Gurugram and Delhi.`,
      `To book ${name.toLowerCase()} advertising in Rewari, submit an enquiry through our listing form or WhatsApp us at +91 81687 40234. We confirm availability, share specifications, and respond with a rate quote within 24 hours. Minimum booking periods are typically 1 month for most formats, with longer campaigns attracting better rates.`,
    ],
    localities: [
      L.nh48, L.delhi, L.sadar, L.busstand,
    ],
    listings: [SL.unipole, SL.gantry, SL.led],
  }
}
