"""
STEP 6 — Generate and update audience_profile + meta_description for all listings.
250-300 word SEO-optimised audience_profile for each listing.
155-char meta_description.
Then trigger /api/revalidate for every slug.
"""
import requests

SUPABASE_URL = "https://nkqanwzzvbadyzqgcmyi.supabase.co"
SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcWFud3p6dmJhZHl6cWdjbXlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgzMTIxOCwiZXhwIjoyMDkxNDA3MjE4fQ.Ns-yges6pfgqBXQFPdomgqC5G8GzzcWHPhxucxYQnIU"
SITE_URL     = "https://rewarihoardings.com"

HEADERS = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=representation",
}

# slug -> {audience_profile, meta_description}
CONTENT: dict[str, dict[str, str]] = {

  # ── Original seeded listings ──────────────────────────────────────────────

  "unipole-nh48-entry-rewari": {
    "audience_profile": (
      "This 40x20 ft frontlit unipole at the NH-48 Entry Point in Rewari stands as one of the "
      "highest-impact advertising positions on the Delhi-Jaipur-Ahmedabad highway corridor. Positioned "
      "where four-lane NH-48 traffic first enters Rewari district, it is the literal gateway between "
      "the NCR and Haryana's industrial heartland.\n\n"
      "Traffic at this junction exceeds 45,000 vehicles daily, with peak volumes from 7 to 10 am as "
      "Gurugram and Delhi-bound commuters clear Rewari, and again from 5 to 8 pm on the return. The "
      "vehicle mix includes private cars, commercial trucks serving Bawal's HPCL refinery and IMT "
      "Bawal industrial estates, intercity buses, and a growing number of highway-use two-wheelers. "
      "Frontlit illumination ensures strong visibility through early-morning mist and evening rush.\n\n"
      "The audience spans daily office commuters travelling the 60 km stretch to Gurugram, truck "
      "operators and logistics managers serving the petrochemical and auto-components corridor, and "
      "long-distance travellers heading south toward Jaipur and Ahmedabad. Weekend traffic adds "
      "families on leisure drives. This is not a captive local audience — it is a mobile, aspirational, "
      "income-earning segment with high brand recall potential on repeat journeys.\n\n"
      "This unipole is ideal for real estate developers marketing projects in Rewari and Bawal, "
      "automobile brands targeting highway drivers, fuel and quick-service restaurant chains, and "
      "financial services firms reaching salaried professionals. Logistics and B2B brands benefit from "
      "the high proportion of commercial traffic. Unipole advertising in Rewari at this scale delivers "
      "outdoor advertising impact that inner-city hoardings cannot match.\n\n"
      "To book this high-impact hoarding near the NH-48 Rewari entry and get a quote tailored to your "
      "campaign, call +91 8168740234."
    ),
    "meta_description": "40x20 ft frontlit unipole at NH-48 Entry Point, Rewari — 45,000+ vehicles/day on Delhi-Jaipur highway. Book outdoor advertising in Rewari Haryana: +91 8168740234.",
  },

  "gantry-delhi-road-rewari": {
    "audience_profile": (
      "The 60x15 ft backlit gantry on Delhi Road, Rewari is the city's most dominant format — a full "
      "road-spanning structure that every vehicle entering Rewari from the NH-48 and Delhi direction "
      "must pass beneath. At 900 sq ft of backlit display, gantry advertising in Rewari simply has "
      "no equal for raw visual impact and dwell time.\n\n"
      "Delhi Road carries an estimated 35,000 vehicles daily and functions as Rewari's primary "
      "commercial spine. Morning peaks run from 7:30 to 10 am as students head to Jat College and "
      "engineering institutions, office-goers commute, and commercial activity in Sadar Bazar and the "
      "New Grain Market begins. Evening peaks from 5:30 to 8 pm bring returning commuters, shoppers, "
      "and family outings. The backlit illumination ensures the gantry performs equally in daylight "
      "and after dark, maximising daily reach.\n\n"
      "The audience profile is broad and high-value. It includes daily commuters on the Rewari-Gurugram "
      "corridor, traders and businesspeople from Sadar Bazar, students attending institutions along "
      "Delhi Road, government employees, and residential families from Model Town and Subhash Nagar. "
      "A significant proportion are repeat viewers — the same audience sees this gantry twice a day, "
      "five days a week, building exceptional brand recall.\n\n"
      "This format excels for pan-Haryana brand campaigns, telecom operators, banks and NBFCs targeting "
      "retail customers, FMCG launches, education institutions, and healthcare providers. Retailers "
      "launching in Rewari benefit from the guaranteed visibility to the city's widest demographic "
      "cross-section. Outdoor advertising on Delhi Road, Rewari Haryana is the benchmark buy for any "
      "brand entering this market.\n\n"
      "For a quote on this gantry and to check availability, call +91 8168740234."
    ),
    "meta_description": "60x15 ft backlit gantry on Delhi Road, Rewari — full road-span, 35,000 vehicles/day. Prime outdoor advertising in Rewari Haryana. Get a quote: +91 8168740234.",
  },

  "led-display-rewari-bus-stand": {
    "audience_profile": (
      "This 20x10 ft LED display at Rewari Bus Stand places your brand at the busiest transit node "
      "in Rewari city. The Rewari HRTC bus stand serves inter-district routes to Delhi, Gurugram, "
      "Jhajjar, Narnaul, Mahendergarh, and Bawal, making it the physical crossroads of daily mobility "
      "for a district population of nearly nine lakh people.\n\n"
      "Footfall at the bus stand exceeds 12,000 passengers per day on weekdays, with peaks between "
      "6 and 9 am and 5 and 8 pm when inter-city services are most frequent. The LED format delivers "
      "full-motion content with brightness calibrated for outdoor visibility, making it effective even "
      "in harsh afternoon sun. Unlike static hoardings, an LED display allows multiple creatives in "
      "rotation — ideal for brands running seasonal campaigns or multiple product messages.\n\n"
      "The audience is highly varied: migrant workers and daily wage labourers travelling to Bawal and "
      "Dharuhera industrial estates, students commuting to colleges, women travelling for shopping and "
      "family visits, government employees, and farmers from surrounding villages arriving for market "
      "days. This demographic breadth makes LED advertising at Rewari Bus Stand exceptionally versatile "
      "for mass-market campaigns.\n\n"
      "FMCG brands, mobile and telecom operators, coaching institutes, healthcare clinics, government "
      "scheme awareness campaigns, and retail banks targeting the unbanked rural segment all find this "
      "location highly productive. The dwell time at a bus stand — passengers waiting 15 to 45 minutes "
      "on average — is far higher than roadside hoardings, amplifying message retention.\n\n"
      "To book the LED display at Rewari Bus Stand and receive a campaign proposal, call +91 8168740234."
    ),
    "meta_description": "20x10 ft LED display at Rewari Bus Stand — 12,000+ daily footfall, full-motion content. Book LED advertising in Rewari Haryana. Get quote: +91 8168740234.",
  },

  "premium-unipole-at-naiwali-chowk-rewari": {
    "audience_profile": (
      "This 15x10 ft unipole near Naiwali Chowk on Delhi Road, Rewari occupies one of the most "
      "commercially active stretches of the city. Positioned on the inner-city section of Delhi Road "
      "close to Sadar Bazar, this site captures slow-moving traffic at one of Rewari's busiest "
      "commercial junctions — delivering longer dwell time and higher engagement than fast-moving "
      "highway locations.\n\n"
      "Delhi Road through this section carries an estimated 25,000 vehicles and a significant volume "
      "of pedestrian and two-wheeler traffic daily. The junction slows vehicles naturally, giving "
      "passengers and drivers ample time to absorb the advertising message. Peak hours mirror the "
      "city's commercial rhythm: 10 am to 1 pm when Sadar Bazar traders and shoppers are active, "
      "and 5 to 8 pm during evening markets. Hoarding advertising near Naiwali Chowk in Rewari "
      "means your brand is visible exactly when purchase decisions are being made nearby.\n\n"
      "The audience is strongly retail-oriented. Shoppers visiting Sadar Bazar for electronics, "
      "textiles, and household goods form the core. Traders, kirana store owners restocking inventory, "
      "students from nearby colleges, and residents of Model Town and Subhash Nagar passing through "
      "for daily errands are all regular viewers. The socioeconomic mix skews toward the middle-income "
      "urban consumer — Rewari's most commercially active segment.\n\n"
      "This site is best for FMCG, retail, apparel, mobile phones, two-wheelers, and consumer "
      "electronics. Local businesses launching new outlets in Rewari should strongly consider this "
      "position. Education and coaching brands targeting the student corridor on Delhi Road also "
      "perform well here. Outdoor advertising in Rewari Haryana at this junction guarantees merchant "
      "and shopper visibility simultaneously.\n\n"
      "Call +91 8168740234 to get a quote for this Delhi Road unipole."
    ),
    "meta_description": "15x10 ft unipole near Naiwali Chowk, Delhi Road, Rewari — high-dwell junction next to Sadar Bazar. Book outdoor advertising in Rewari: +91 8168740234.",
  },

  # ── Railway Station panels (7 panels, varied positions) ───────────────────

  "railway-station-rewari-railway-station-rewari": {
    "audience_profile": (
      "This 20x10 ft panel at Rewari Railway Junction's main entrance is among the most strategically "
      "placed advertising surfaces in all of Rewari. The junction serves the Delhi-Alwar, Delhi-Bhatinda, "
      "and Rewari-Sadulpur rail routes, making it one of Haryana's busiest railway nodes outside "
      "Ambala. Estimated daily footfall exceeds 18,000 passengers across all services.\n\n"
      "This main-entrance panel intercepts every arriving and departing passenger, as well as the "
      "steady stream of auto-rickshaw, taxi, and family drop-off traffic in the forecourt. Morning "
      "services between 5:30 and 9 am carry the heaviest load of daily commuters heading to Delhi and "
      "Gurugram. Evening return services from 5 to 9 pm complete the daily cycle, giving brands two "
      "high-attention windows. The broad concourse and queuing area at the entrance increase dwell "
      "time significantly beyond what a roadside hoarding achieves.\n\n"
      "Passengers at Rewari Junction skew toward working-age adults — IT professionals commuting to "
      "Gurugram, government employees, students at Delhi universities, and farmers and traders making "
      "inter-district journeys. A meaningful number of defence personnel from the Rewari cantonment "
      "area also pass through this station regularly. Railway station advertising in Rewari captures "
      "this aspirational, mobile audience in a rare moment of stillness and receptivity.\n\n"
      "Education brands targeting students, banking and insurance firms reaching first-time earners, "
      "telecom operators, and consumer durables brands all perform strongly in railway station "
      "environments. B2B logistics companies and inter-city bus operators also find captive audience "
      "value here. Hoarding near Rewari Railway Station is a high-frequency, high-recall buy.\n\n"
      "For availability and rates on railway station advertising in Rewari, call +91 8168740234."
    ),
    "meta_description": "20x10 ft panel at Rewari Railway Junction main entrance — 18,000+ daily footfall. Railway station advertising in Rewari Haryana. Get quote: +91 8168740234.",
  },

  "railway-station-rewari-railway-station-rewari-2": {
    "audience_profile": (
      "This 20x10 ft station panel at Rewari Railway Junction is positioned within the main waiting "
      "hall — the area where passengers congregate before boarding, creating extended dwell times "
      "rarely seen in any other outdoor advertising environment. Rewari Junction handles services on "
      "the Delhi-Alwar, Delhi-Bhatinda, and Rewari-Sadulpur routes, with over 18,000 daily passengers "
      "passing through.\n\n"
      "The waiting hall accumulates passengers for an average of 20 to 40 minutes per visit, creating "
      "high-frequency, repeated brand exposure within a single journey. Morning peak volumes between "
      "5 and 9 am bring commuters heading to Delhi and Gurugram. Afternoon services carry a mix of "
      "students, traders, and inter-city travellers. This waiting hall panel captures all of them in "
      "a distraction-reduced environment — no traffic noise, no competing storefronts.\n\n"
      "The passenger demographic at this panel is weighted toward long-distance and inter-district "
      "travellers: Rewari farmers and wholesale traders travelling to Delhi's Azadpur and Okhla "
      "markets, students from Rewari enrolled in Delhi colleges, and salaried professionals commuting "
      "daily. A secondary segment of defence families visiting the cantonment is also present. "
      "Railway station panel advertising in Rewari uniquely accesses this outbound, aspirational "
      "middle-class audience.\n\n"
      "Brands selling products where the purchase decision involves research and comparison — mutual "
      "funds, insurance, higher education, home loans, and consumer electronics — find waiting hall "
      "placements especially effective. FMCG and FMCD brands building recall in Tier-2 Haryana also "
      "benefit from the captive, receptive audience.\n\n"
      "Contact us at +91 8168740234 to get a quote for outdoor advertising in Rewari at this waiting "
      "hall position."
    ),
    "meta_description": "20x10 ft panel in Rewari Railway Station waiting hall — 20–40 min average dwell, 18,000 daily footfall. Station advertising Rewari Haryana. Call: +91 8168740234.",
  },

  "railway-station-rewari-railway-station-rewari-3": {
    "audience_profile": (
      "This 20x10 ft panel on Platform 1 at Rewari Railway Junction reaches Delhi and Gurugram-bound "
      "commuters at the precise moment before departure — a high-attention, high-recall advertising "
      "environment that outdoor hoardings elsewhere cannot replicate. Platform 1 serves the primary "
      "Delhi-Rewari passenger services, including morning and evening rush trains that carry the "
      "bulk of the junction's 18,000+ daily passengers.\n\n"
      "Passengers standing on the platform are in a stationary, attentive state for 5 to 20 minutes "
      "while awaiting their train. They have no other entertainment or distraction on the platform, "
      "making advertising here disproportionately memorable. The morning window from 6 to 9 am "
      "is the peak exposure period as office-going professionals board Delhi and Gurugram-bound "
      "services. Evening trains from 5 to 9 pm repeat this cycle with the return commute crowd.\n\n"
      "The audience on Platform 1 is primarily the Rewari commuter class: salaried professionals "
      "employed in Gurugram and Delhi NCR, IT sector employees, government workers, and young "
      "graduates entering the workforce. This demographic is urban-aspirational — digitally aware, "
      "brand-conscious, and actively evaluating financial products, electronics, and lifestyle brands. "
      "Railway station advertising in Rewari at this platform targets this segment with rare precision.\n\n"
      "Banks and NBFCs offering home loans and personal finance, ed-tech platforms and coaching "
      "institutes, mobile and broadband providers, and personal care brands targeting urban "
      "professionals all see strong results at platform-level placements. Hoarding near Rewari "
      "Railway Station on the commuter platform is a category-leading buy.\n\n"
      "Call +91 8168740234 to get a quote and check availability for this platform panel."
    ),
    "meta_description": "20x10 ft platform panel at Rewari Railway Junction — reaches 18,000 daily commuters to Delhi & Gurugram. Book railway advertising Rewari Haryana: +91 8168740234.",
  },

  "railway-station-rewari-railway-station-rewari-4": {
    "audience_profile": (
      "This 20x10 ft panel at Rewari Railway Junction is positioned on the Alwar and Jaipur-side "
      "platform, reaching a distinctly different travel demographic from the Delhi commuter panels. "
      "Trains toward Alwar, Bandikui, and the Rajasthan border carry inter-district traders, "
      "agricultural merchants, and long-distance passengers — audiences with strong purchasing "
      "power in the Tier-2 and Tier-3 market segment.\n\n"
      "Rewari Junction's daily traffic exceeds 18,000 passengers, and the Alwar-direction services "
      "contribute a significant share. Passengers on this side include wholesale traders travelling "
      "between Rewari and Narnaul markets, agricultural merchants transporting produce, and families "
      "visiting relatives across the Rajasthan border. The platform dwell time of 10 to 25 minutes "
      "gives this panel sustained brand exposure per viewer. The outdoor advertising environment at "
      "Rewari Railway Station is one of the few in Haryana where inter-state traveller audiences "
      "are accessible.\n\n"
      "This audience profile is characterised by business-owners, traders, farmers with above-average "
      "disposable income, and rural professionals. They are key decision-makers for agricultural "
      "inputs, farm machinery, two-wheelers, and rural finance products. Jewellers and textile "
      "brands targeting wedding-season purchasing also benefit from the cross-district reach this "
      "platform provides.\n\n"
      "Agricultural inputs, tractor and two-wheeler brands, rural banking and micro-finance, "
      "jewellery, and bulk consumer goods brands targeting Haryana-Rajasthan border trade see "
      "excellent cost-per-reach metrics at this position. Railway station panel advertising in "
      "Rewari on this platform uniquely serves the B2B and rural commerce segment.\n\n"
      "Contact +91 8168740234 to discuss campaign fit and get a quote for this panel."
    ),
    "meta_description": "20x10 ft platform panel at Rewari Railway Junction serving Alwar/Rajasthan routes — traders and inter-district travellers. Station advertising Rewari: +91 8168740234.",
  },

  "railway-station-rewari-railway-station-rewari-5": {
    "audience_profile": (
      "Positioned near the ticketing and inquiry area at Rewari Railway Junction, this 20x10 ft "
      "panel is in the highest foot-traffic zone of the entire station campus. Every passenger — "
      "whether buying a ticket, checking platforms, or navigating the concourse — passes through "
      "this area, making it the single-highest reach placement within the junction's 18,000+ "
      "daily visitor footfall.\n\n"
      "The ticketing zone generates natural queuing behaviour that dramatically increases per-viewer "
      "dwell time. Passengers in ticket queues spend an average of 5 to 15 minutes at this point, "
      "standing face-on to the advertising panel. Unlike platform panels seen fleetingly, this "
      "position benefits from sustained, close-proximity viewing. The mix of passenger types is the "
      "broadest of any panel at the station: commuters, students, families, traders, and first-time "
      "travellers all converge here.\n\n"
      "From an audience profiling perspective, the ticketing area draws a high proportion of "
      "non-frequent travellers — those making special trips for medical visits in Delhi, university "
      "admissions, property transactions, and family occasions. These are high-stakes journeys with "
      "strong brand receptivity. First-time earners opening bank accounts and first-time railway "
      "travellers are disproportionately present, making banking, fintech, and telecom brands "
      "particularly effective here.\n\n"
      "Banks and insurance companies, government scheme awareness campaigns, ed-tech and coaching "
      "brands, telecom operators, and NGO-sector health campaigns all benefit from the broad, "
      "cross-demographic reach. Railway station advertising in Rewari at the ticketing zone "
      "delivers unmatched breadth per booking.\n\n"
      "Call +91 8168740234 to get a quote and confirm availability for this station panel."
    ),
    "meta_description": "20x10 ft panel at Rewari Railway Junction ticketing zone — highest-traffic point, 18,000+ daily footfall. Railway advertising Rewari Haryana. Quote: +91 8168740234.",
  },

  "railway-station-rewari-railway-station-rewari-6": {
    "audience_profile": (
      "This 20x10 ft panel near the exit and taxi stand area at Rewari Railway Junction captures "
      "the highest-converting moment in the passenger journey: arrival. Arriving passengers "
      "from Delhi, Alwar, and beyond are at their most commercially active — orienting to the "
      "city, looking for services, and primed for purchase decisions from accommodation and food "
      "to local retail and services.\n\n"
      "The exit zone of Rewari Railway Junction sees a continuous stream of arriving passengers "
      "across all services throughout the day. The morning arrival window from 7 to 10 am brings "
      "out-station visitors, returning workers, and early business travellers. Afternoon and "
      "evening arrivals bring families, students returning from cities, and traders completing "
      "out-of-town trips. Daily arrivals through this exit contribute substantially to the "
      "junction's overall 18,000+ passenger count.\n\n"
      "Passengers at the exit area are in a discovery mindset — newly arrived in Rewari or returning "
      "after time away, they are actively seeking services. This creates unusually high engagement "
      "with service-category advertising: restaurants and dhabas, hotels, auto-rickshaw and taxi "
      "apps, pharmacies, and urban shopping destinations. Outdoor advertising near Rewari Railway "
      "Station at the exit point reaches the arriving visitor exactly when they need local "
      "information most.\n\n"
      "Hospitality brands, restaurants, urban retail, healthcare providers, and mobile services "
      "should prioritise this panel. Logistics companies and B2B service firms whose clients "
      "arrive by train also find high value here. Hoarding near Rewari Railway Station at "
      "the exit commands the city's arrival moment like no other format.\n\n"
      "Get a quote by calling +91 8168740234 — check availability for this exit-zone station panel."
    ),
    "meta_description": "20x10 ft panel at Rewari Railway Station exit and taxi stand — captures arriving passengers at peak discovery moment. Station advertising Rewari: +91 8168740234.",
  },

  "railway-station-rewari-railway-station-rewari-7": {
    "audience_profile": (
      "This 20x10 ft panel on the footover bridge at Rewari Railway Junction is elevated above "
      "platform level, delivering overhead visibility to passengers on both platforms simultaneously. "
      "This cross-platform reach is unique among all station panel positions — it cannot be avoided "
      "by any passenger navigating between platforms via the bridge, which all inter-platform "
      "travellers must use.\n\n"
      "The footover bridge at Rewari Junction serves the full 18,000+ daily passenger count, as "
      "virtually all passengers changing platforms or exiting from the far side of the station "
      "traverse it. The approach angle from the stairs and the walkway creates a repeated viewing "
      "opportunity — passengers see the panel both ascending and descending. This format is "
      "particularly powerful for high-frequency message recall. Railway station advertising in "
      "Rewari on an elevated panel gains omnidirectional visibility that ground-level panels lack.\n\n"
      "The passenger audience spans the full junction demographic: Gurugram office commuters, Delhi "
      "students, Alwar-bound traders, agricultural merchants, and cantonment families. The elevated "
      "position makes this panel visible not just to bridge users but also to platform staff and "
      "vendors, who number in the hundreds daily. The broad, unavoidable sight-line makes it an "
      "especially strong brand-awareness vehicle for campaigns targeting Rewari district consumers.\n\n"
      "National FMCG brands, mobile network operators, banks running mass-awareness campaigns, and "
      "OTT and streaming platforms targeting young commuters all benefit from the cross-platform "
      "visibility this format provides. Political and government scheme campaigns also value "
      "footover bridge placements for sheer impression volume.\n\n"
      "To get a quote for this elevated station panel and check current availability, "
      "call +91 8168740234."
    ),
    "meta_description": "20x10 ft elevated footover bridge panel at Rewari Railway Junction — cross-platform visibility, 18,000+ daily footfall. Book railway station advertising Rewari: +91 8168740234.",
  },

  # ── Rewari road hoardings ─────────────────────────────────────────────────

  "hoarding-nh-48-entry-point-rewari": {
    "audience_profile": (
      "This 20x10 ft hoarding at the NH-48 Entry Point in Rewari is positioned where the "
      "Delhi-Jaipur-Ahmedabad national highway officially enters Rewari district — one of the "
      "most commercially significant transit points in all of Haryana. Every brand that needs "
      "to intercept highway traffic between Delhi and the Rajasthan corridor should evaluate "
      "hoarding advertising near NH-48 Rewari as a foundational buy.\n\n"
      "Traffic volumes at this entry point consistently exceed 40,000 vehicles per day, comprising "
      "a mix of private cars, commercial trucks, inter-city buses, and transit vehicles. The highway "
      "slows noticeably as it enters the town boundary, increasing dwell time on roadside hoardings. "
      "Morning peaks between 7 and 10 am bring outbound NCR traffic; evening peaks from 5 to 8 pm "
      "bring the return flow. NH-48 also carries heavy goods vehicles around the clock serving "
      "Bawal's HPCL refinery and IMT Bawal's manufacturing corridor.\n\n"
      "The audience at this entry point is heterogeneous and commercially active. Long-distance "
      "travellers making first contact with Rewari are in a discovery state, receptive to local "
      "services and hospitality brands. Daily commuters represent repeat exposure and excellent "
      "recall frequency. Truck drivers and logistics professionals form a durable B2B audience "
      "for fuel, tyres, and fleet services.\n\n"
      "Real estate, automobile dealerships, QSR chains, fuel brands, and financial services "
      "companies targeting highway India all perform strongly at this position. Outdoor advertising "
      "in Rewari Haryana along NH-48 carries the widest geographic catchment of any location "
      "in the district.\n\n"
      "Call +91 8168740234 to get a quote and confirm booking for this NH-48 entry hoarding."
    ),
    "meta_description": "20x10 ft hoarding at NH-48 Entry Point, Rewari — 40,000+ vehicles/day on Delhi-Jaipur highway. Outdoor advertising Rewari Haryana. Get quote: +91 8168740234.",
  },

  "hoarding-mahendergarh-road-rewari": {
    "audience_profile": (
      "This 15x10 ft hoarding on Mahendergarh Road in Rewari occupies the main arterial connecting "
      "Rewari city to Narnaul and the Mahendergarh district beyond. As Rewari's gateway to southern "
      "Haryana, this road carries a steady flow of inter-district commercial and passenger traffic "
      "distinct from the NH-48 highway mix — more local, more agricultural, and more relationship-"
      "driven in its commercial character.\n\n"
      "Daily traffic on Mahendergarh Road is estimated at 15,000 to 20,000 vehicles, dominated by "
      "two-wheelers and light commercial vehicles transporting agricultural produce and goods "
      "between Rewari and Narnaul markets. Tractors, mini-trucks, and small traders are a "
      "consistent feature of the traffic throughout the day. Peak movement occurs in the morning "
      "from 7 to 10 am and late afternoon from 4 to 7 pm, mirroring the agricultural work cycle. "
      "Hoarding advertising in Rewari on Mahendergarh Road reaches audiences that are underserved "
      "by highway and inner-city formats.\n\n"
      "The audience is predominantly rural and semi-rural: farmers from Rewari and Mahendergarh "
      "districts, village traders, agricultural input buyers, and inter-district bus commuters. "
      "This is a price-sensitive, brand-loyal audience that responds strongly to trusted "
      "manufacturers and locally established names. Young people from surrounding villages "
      "travelling to Rewari for education and employment are a growing secondary segment.\n\n"
      "Agricultural inputs, seed and fertiliser brands, tractor and two-wheeler dealerships, "
      "rural banking and microfinance institutions, and government scheme promotions find this "
      "road highly productive. Coaching institutes targeting students from Mahendergarh district "
      "also benefit from this corridor placement.\n\n"
      "Contact +91 8168740234 to get a quote for outdoor advertising in Rewari on Mahendergarh Road."
    ),
    "meta_description": "15x10 ft hoarding on Mahendergarh Road, Rewari — key arterial to Narnaul, 15,000–20,000 vehicles/day. Reach agricultural audiences. Quote: +91 8168740234.",
  },

  "hoarding-rampura-road-rewari": {
    "audience_profile": (
      "This 20x10 ft hoarding on Rampura Road in Rewari is positioned on an inner-city road that "
      "connects Rewari's residential neighbourhoods to the commercial core. Rampura Road functions "
      "as a daily-use commuter route for middle-income families, local traders, and students — "
      "making it ideal for brands targeting Rewari's core urban consumer base.\n\n"
      "Traffic on Rampura Road flows steadily throughout the day, with peaks between 8 and 10 am "
      "as residents travel toward schools, colleges, and the market district, and again between "
      "5 and 7:30 pm during the return commute. Vehicle composition includes a high proportion "
      "of two-wheelers, family cars, and school vehicles. The residential character of the road "
      "means the same households are exposed to this hoarding advertising multiple times per week, "
      "generating strong localised brand recall over a campaign period.\n\n"
      "The audience profile is strongly residential and family-oriented. Homeowners and renters "
      "in Rewari's mid-city neighbourhoods form the primary segment — working couples, young "
      "families with school-going children, local business owners, and government employees. "
      "Outdoor advertising in Rewari Haryana on residential connector roads like Rampura Road "
      "reaches the household decision-maker in their daily environment, not just in transit.\n\n"
      "Consumer durables, home improvement and furnishing brands, private schools and coaching "
      "institutes, healthcare and diagnostic centres, and financial products targeting homeowners "
      "— such as home loans and life insurance — all perform well on Rampura Road. Local retail "
      "businesses launching in Rewari benefit from the neighbourhood-level awareness this "
      "site delivers.\n\n"
      "Call +91 8168740234 to get a quote for this Rampura Road hoarding in Rewari."
    ),
    "meta_description": "20x10 ft hoarding on Rampura Road, Rewari — residential connector, repeat exposure to urban families. Outdoor advertising in Rewari Haryana. Quote: +91 8168740234.",
  },

  "hoarding-pataudi-road-rewari": {
    "audience_profile": (
      "This 20x10 ft hoarding on Pataudi Road in Rewari sits on the route connecting Rewari to "
      "Pataudi and further to Gurugram — making it one of the most upwardly mobile corridors in "
      "the city. Pataudi Road carries a significant number of daily commuters who work in "
      "Gurugram's corporate sector but live in Rewari, a pattern that has grown substantially "
      "as NH-48 connectivity has improved.\n\n"
      "The Rewari-to-Gurugram commute is approximately 50 to 60 km, and Pataudi Road offers "
      "an alternate routing for portions of this journey. Traffic on this road includes private "
      "cars driven by IT and corporate professionals, motorcycles, and shared commuter vehicles. "
      "The morning peak between 7 and 9 am is particularly strong as Gurugram-bound commuters "
      "clear Rewari city limits. Hoarding advertising in Rewari on Pataudi Road reaches one of "
      "the district's highest-income daily traffic segments.\n\n"
      "The audience skews toward dual-income households — working professionals in their 28 to "
      "45 age bracket who are active consumers of lifestyle brands, banking products, and real "
      "estate. Many are evaluating property purchases in the Rewari-Gurugram corridor. "
      "A secondary segment of school-going families and local traders serves the adjacent "
      "residential pockets. This combination makes Pataudi Road a commercially premium "
      "positioning within Rewari's outdoor advertising inventory.\n\n"
      "Real estate developers marketing residential projects in Rewari and Gurugram should "
      "consider this an essential buy. Banks, mutual funds, insurance, automobiles, and "
      "consumer electronics brands targeting the aspirational professional segment will "
      "find strong audience alignment. Outdoor advertising in Rewari Haryana on this "
      "Gurugram-facing corridor commands premium attention.\n\n"
      "Get a quote for this Pataudi Road hoarding by calling +91 8168740234."
    ),
    "meta_description": "20x10 ft hoarding on Pataudi Road, Rewari — key Gurugram commuter corridor, upwardly mobile audience. Outdoor advertising Rewari Haryana. Quote: +91 8168740234.",
  },

  "hoarding-rewari-industrial-area-rewari": {
    "audience_profile": (
      "This 20x10 ft hoarding in Rewari Industrial Area positions your brand at the heart of "
      "Rewari's manufacturing and commercial production zone. The industrial area hosts auto "
      "components manufacturers, fabrication units, logistics warehouses, and small-scale "
      "industrial enterprises that collectively employ tens of thousands of workers and support "
      "a significant B2B supply chain.\n\n"
      "Traffic through the industrial area is dominated by shift-change movement — heavy worker "
      "commuting peaks between 7 and 9 am and 4 to 6 pm as factory shifts rotate. Commercial "
      "vehicles, trucks carrying raw materials and finished goods, and supervisory staff vehicles "
      "create a continuous daytime flow. The proximity to IMT Bawal (approximately 15 km south) "
      "also means vendors, contractors, and procurement professionals from the broader industrial "
      "belt traverse this road regularly. Hoarding advertising in Rewari's industrial area "
      "delivers B2B reach that no other outdoor format in the city can match.\n\n"
      "The audience is bifurcated: blue-collar workers (assembly operators, welders, machine "
      "operators) and white-collar industrial professionals (engineers, purchase managers, "
      "logistics heads). Both segments are commercially active in different ways. Workers are "
      "strong buyers of two-wheelers, consumer electronics, and daily FMCG. Professionals are "
      "key decision-makers for business services, industrial supplies, and financial products.\n\n"
      "Two-wheeler and commercial vehicle brands, tyre and lubricant companies, industrial "
      "equipment suppliers, private ESIC and health insurance products, and vocational training "
      "institutions all achieve high ROI at this location. B2B services targeting industrial "
      "purchasers benefit from the concentrated professional exposure.\n\n"
      "For a quote on outdoor advertising in Rewari Industrial Area, call +91 8168740234."
    ),
    "meta_description": "20x10 ft hoarding in Rewari Industrial Area — B2B and worker audience, auto-components and manufacturing belt. Outdoor advertising Rewari Haryana: +91 8168740234.",
  },

  "hoarding-bitwana-road-crossing-rewari": {
    "audience_profile": (
      "The 20x10 ft hoarding at Bitwana Road Crossing in Rewari captures traffic from multiple "
      "directions simultaneously — a rare advantage that road crossings provide over mid-block "
      "hoardings. This junction connects inner Rewari to outlying residential colonies and "
      "suburban villages, making it a confluence point for both city-centre-bound and outbound "
      "traffic throughout the day.\n\n"
      "Crossings and chowks significantly increase hoarding dwell time because vehicles slow "
      "or stop. Even without a formal signal, the natural give-way behaviour at road crossings "
      "gives drivers and passengers 15 to 45 seconds of uninterrupted viewing time per pass — "
      "substantially more than continuous-flow road hoardings. Daily traffic through Bitwana "
      "Road Crossing is estimated at 12,000 to 15,000 vehicles, with the composition covering "
      "a wide range of Rewari's suburban commuter population.\n\n"
      "Residents of outlying colonies heading to Rewari city for shopping, schools, and services "
      "form the primary audience. Local traders and artisans, students on two-wheelers, and "
      "families in four-wheelers represent the dominant segments. This suburban and peri-urban "
      "demographic is often underserved by advertising concentrated on main arteries — making "
      "hoarding advertising in Rewari at crossing positions a cost-effective way to reach a "
      "less-competed audience.\n\n"
      "Consumer goods brands entering semi-urban Haryana, educational institutions targeting "
      "suburban families, two-wheeler and small-car dealerships, and microfinance or cooperative "
      "bank products designed for semi-urban households all benefit from this crossing placement. "
      "Local service businesses and clinics targeting the suburban catchment can establish strong "
      "brand presence here affordably.\n\n"
      "Call +91 8168740234 to get a quote for outdoor advertising near Bitwana Road Crossing, Rewari."
    ),
    "meta_description": "20x10 ft hoarding at Bitwana Road Crossing, Rewari — multi-directional traffic, high dwell at junction. Outdoor advertising Rewari Haryana. Quote: +91 8168740234.",
  },

  "hoarding-jhajjar-road-rewari": {
    "audience_profile": (
      "This 24x12 ft hoarding on Jhajjar Road in Rewari sits on the northern arterial that "
      "connects Rewari to Jhajjar district — an important commercial link in north Haryana's "
      "road network. At 288 sq ft, this is among the larger format outdoor placements in Rewari, "
      "delivering strong visual impact for brands requiring prominent display space.\n\n"
      "Jhajjar Road carries an estimated 15,000 to 20,000 vehicles daily, with a composition "
      "of passenger vehicles, auto-rickshaws serving the northern residential quarters, "
      "and commercial vehicles transporting goods between the two districts. The road runs "
      "through the northern part of Rewari town before exiting city limits, passing residential "
      "colonies, schools, and local markets. Traffic peaks align with morning and evening "
      "commute windows — 7:30 to 10 am and 4:30 to 7 pm. Outdoor advertising on Jhajjar Road "
      "in Rewari Haryana reaches a distinct traffic stream that differs from the NH-48 and "
      "Delhi Road audiences.\n\n"
      "The primary audience consists of residents of north Rewari's residential areas, Jhajjar "
      "district commuters, students attending schools and coaching centres along this corridor, "
      "and traders making the Rewari-Jhajjar supply route. Families and young professionals "
      "in newly developed residential pockets form a growing segment. This is a "
      "neighbourhood-level audience with strong brand loyalty and high repeat exposure.\n\n"
      "Schools, coaching institutes, consumer goods brands, two-wheeler dealerships, property "
      "developers promoting residential projects in north Rewari, and healthcare providers "
      "benefit significantly from this placement. The larger 24x12 format provides creative "
      "flexibility for brands running multi-message campaigns.\n\n"
      "To get a quote for this Jhajjar Road hoarding, contact us at +91 8168740234."
    ),
    "meta_description": "24x12 ft hoarding on Jhajjar Road, Rewari — large-format north Rewari arterial, 15,000–20,000 vehicles/day. Outdoor advertising Rewari Haryana. Quote: +91 8168740234.",
  },

  "hoarding-pallawas-chowk-rewari": {
    "audience_profile": (
      "This 24x12 ft hoarding at Pallawas Chowk in Rewari occupies one of the city's most "
      "recognisable junction points — a busy chowk where multiple residential and commercial "
      "routes converge. Chowk-based advertising in Rewari benefits from vehicles slowing at "
      "the junction and pedestrian activity around the surrounding shops, making dwell time "
      "significantly higher than mid-road placements.\n\n"
      "Pallawas Chowk handles multi-directional traffic throughout the day, with no pronounced "
      "single-direction dominance. Morning peaks bring school commuters, traders opening "
      "shops, and office-goers. Midday activity is sustained by shoppers, delivery vehicles, "
      "and service professionals. Evening peaks from 5 to 8 pm create a concentrated retail "
      "shopping window as families visit nearby markets. The 24x12 format provides ample "
      "creative surface for bold messaging visible from all approach directions.\n\n"
      "The audience at Pallawas Chowk is a cross-section of Rewari's urban middle-income "
      "population: shopkeepers and traders, homemaking families, school-and-college-going youth, "
      "and local service professionals. The junction's residential catchment includes established "
      "Rewari neighbourhoods with relatively high per-household disposable income. This makes "
      "outdoor advertising in Rewari Haryana at Pallawas Chowk highly productive for brands "
      "targeting aspirational, decision-making households.\n\n"
      "Consumer electronics, home appliances, fashion and apparel, private banking, education, "
      "and real estate brands targeting Rewari's urban family segment perform strongly at chowk "
      "locations. Local businesses and franchises launching in Rewari benefit from the high "
      "name-recognition this central junction provides.\n\n"
      "Call +91 8168740234 to book outdoor advertising at Pallawas Chowk and get a campaign quote."
    ),
    "meta_description": "24x12 ft hoarding at Pallawas Chowk, Rewari — busy multi-directional junction, high dwell and pedestrian footfall. Book outdoor advertising Rewari: +91 8168740234.",
  },

  "hoarding-pallawas-chowk-rewari-2": {
    "audience_profile": (
      "This second 30x10 ft hoarding at Pallawas Chowk in Rewari complements the existing "
      "placement at this junction with a wider format, delivering 300 sq ft of display surface "
      "from a different approach angle. Brands requiring dominance at a key Rewari chowk can "
      "book both panels for full junction ownership — a strategy proven to multiply recall rates "
      "significantly versus single-side placements.\n\n"
      "Pallawas Chowk remains among Rewari's most consistently trafficked junctions throughout "
      "the day. The 30x10 format's wider horizontal span makes it particularly legible for "
      "vehicles approaching from the broader approach road, while the height-to-width ratio "
      "suits banner-style creative executions with bold taglines and product imagery. Traffic "
      "volumes across both panels at this junction collectively reach 20,000 to 25,000 vehicles "
      "daily. Peak periods during school-start and evening shopping windows deliver the highest "
      "impact impressions.\n\n"
      "As with the paired panel at this chowk, the audience skews urban-residential: families, "
      "working adults, traders, and students who use this junction as part of their daily routing. "
      "The wider 30x10 format may be particularly effective for brands running seasonal campaigns "
      "— Diwali retail, festive finance, or wedding-season jewellery — where creative breadth "
      "amplifies category association. Hoarding near Pallawas Chowk Rewari gives brands two "
      "concurrent impressions on the same commuter audience.\n\n"
      "For category exclusivity at Pallawas Chowk and brands seeking Rewari market dominance, "
      "booking both panels at this junction provides unmatched local presence. Retail chains, "
      "banks, real estate developers, and political campaigns all benefit from junction dominance.\n\n"
      "Contact +91 8168740234 to discuss dual-panel or single-panel bookings at Pallawas Chowk."
    ),
    "meta_description": "30x10 ft hoarding at Pallawas Chowk, Rewari — wide-format junction panel, 25,000 combined daily vehicles. Outdoor advertising Rewari Haryana. Quote: +91 8168740234.",
  },

  "hoarding-pilot-chowk-rewari": {
    "audience_profile": (
      "This 20x10 ft hoarding at Pilot Chowk in Rewari is positioned at one of the city's "
      "most strategically named junctions — a well-known reference point that local residents "
      "use as a navigation landmark. Pilot Chowk is embedded in the city's directional "
      "vocabulary, meaning the surrounding area benefits from consistent footfall and vehicle "
      "flow from people seeking this junction as a destination or waypoint.\n\n"
      "The chowk experiences sustained multi-directional traffic across the day, with no single "
      "dominant approach direction. Early morning sees school and college commuters; midday "
      "brings commercial activity from nearby shops and service establishments; the evening "
      "peak from 5 to 8 pm sees the highest mixed-traffic volume as Rewari's working population "
      "returns home. Daily vehicle and pedestrian count through Pilot Chowk is estimated at "
      "12,000 to 18,000. Hoarding advertising in Rewari at this junction benefits from "
      "genuine multi-demographic reach.\n\n"
      "The catchment audience includes urban Rewari households from adjacent residential "
      "neighbourhoods, students at nearby educational institutions, traders and shopkeepers "
      "using the junction for commercial transit, and government employees whose offices "
      "are located in this part of the city. The audience is broad but urban — "
      "Rewari's middle and lower-middle income families who are the backbone of consumer "
      "spending in the city.\n\n"
      "FMCG brands, two-wheelers, consumer electronics, telecom, and affordable banking "
      "products targeting the mass urban consumer in Rewari find this placement highly "
      "cost-effective. Local businesses, coaching institutes, and healthcare clinics "
      "targeting the surrounding residential area also benefit.\n\n"
      "To get a quote for outdoor advertising at Pilot Chowk, Rewari, call +91 8168740234."
    ),
    "meta_description": "20x10 ft hoarding at Pilot Chowk, Rewari — known local landmark, multi-directional traffic, 12,000–18,000 vehicles/day. Outdoor advertising Rewari: +91 8168740234.",
  },

  "hoarding-pilot-chowk-rewari-2": {
    "audience_profile": (
      "This second 20x10 ft hoarding at Pilot Chowk in Rewari adds a second visible face to "
      "what is already one of the city's most recognisable junctions. Brands that book both "
      "panels at Pilot Chowk achieve full visual dominance at the junction, ensuring their "
      "creative is unavoidable regardless of the direction a viewer approaches from — a "
      "strategy that significantly amplifies aided and unaided brand recall.\n\n"
      "This panel captures approach traffic from a different bearing than the primary Pilot "
      "Chowk hoarding, meaning it reaches vehicles and pedestrians that the first panel does "
      "not see — effectively expanding the combined catchment beyond the junction itself to "
      "the adjacent access roads. Pilot Chowk's daily traffic of 12,000 to 18,000 vehicles "
      "is distributed across multiple entry points, and this complementary panel ensures "
      "comprehensive coverage. Outdoor advertising in Rewari Haryana at an established chowk "
      "like Pilot Chowk delivers consistent brand presence across the full daily traffic cycle.\n\n"
      "The audience profile mirrors the primary panel: urban Rewari households, young "
      "professionals, students, local traders, and daily wage earners using the chowk as "
      "part of their regular routing. The secondary panel may skew toward commuters approaching "
      "from the residential side streets, adding a neighbourhood-dwelling audience segment "
      "to the main-road traveller audience captured by the first panel.\n\n"
      "Consumer goods and durables, telecom, education, and local services brands benefit "
      "most from multi-panel bookings at this junction. Political and awareness campaigns "
      "requiring total area saturation should consider both Pilot Chowk panels together.\n\n"
      "Contact +91 8168740234 to discuss competitive rates for dual-panel bookings "
      "or single availability at Pilot Chowk, Rewari."
    ),
    "meta_description": "Second 20x10 ft hoarding at Pilot Chowk, Rewari — complementary angle for junction dominance, 18,000 daily vehicles. Outdoor advertising Rewari Haryana: +91 8168740234.",
  },

  "hoarding-kulana-road-rewari": {
    "audience_profile": (
      "This 30x10 ft hoarding on Kulana Road in Rewari is a large-format placement on one "
      "of Rewari's outer residential arteries connecting the city to the Kulana area and "
      "outlying villages. At 300 sq ft of display surface, this is a dominant roadside "
      "presence — visible from a considerable distance and legible at highway approach speeds.\n\n"
      "Kulana Road carries daily traffic in the range of 10,000 to 14,000 vehicles, with a "
      "composition that leans toward two-wheelers and small commercial vehicles making "
      "local and short inter-town trips. Agricultural and rural commerce traffic is "
      "present throughout the day, reflecting the peri-urban and village catchment "
      "this road serves. The wider 30x10 format is particularly effective on roads "
      "with approach distances, as the full horizontal span becomes visible to drivers "
      "well before they reach the hoarding — delivering extended viewing time.\n\n"
      "The audience on Kulana Road is primarily rural and peri-urban Rewari residents: "
      "farming families, agricultural input traders, young workers commuting from "
      "surrounding villages into Rewari for employment, and students accessing "
      "educational institutions in the city. This demographic is brand-conscious "
      "but price-sensitive, and typically loyal to brands that establish visibility "
      "in their daily environment. Hoarding advertising near Kulana Road in Rewari "
      "reaches a segment that digital advertising consistently underserves.\n\n"
      "Two-wheeler brands, agricultural equipment, rural banking and microfinance, "
      "daily consumer goods, coaching institutes targeting village students, and "
      "government welfare scheme promotions all find strong audience alignment on "
      "Kulana Road. The large format is well-suited to brands needing to establish "
      "visual identity in a new market.\n\n"
      "Call +91 8168740234 to get a quote for the Kulana Road large-format hoarding in Rewari."
    ),
    "meta_description": "30x10 ft large-format hoarding on Kulana Road, Rewari — peri-urban arterial, rural-commuter audience, extended visibility. Quote: +91 8168740234.",
  },

  # ── Dharuhera hoardings ───────────────────────────────────────────────────

  "hoarding-city-center-dharuhera": {
    "audience_profile": (
      "This 20x10 ft hoarding in the City Center of Dharuhera is positioned at the commercial "
      "and civic heart of one of Haryana's fastest-growing industrial satellite towns. Located "
      "approximately 20 km south of Rewari on the NH-48 Delhi-Jaipur corridor, Dharuhera has "
      "transformed over the past two decades from a small town to a thriving industrial hub "
      "anchored by the Hero MotoCorp plant and a broad ecosystem of auto-components "
      "suppliers.\n\n"
      "The City Center location captures peak commercial traffic as residents, industrial "
      "workers, and service professionals converge on shops, banks, and government offices. "
      "Daily footfall through Dharuhera's commercial centre is significant for a Tier-3 town — "
      "driven by the large industrial workforce from nearby plants that earn regular salaries "
      "and spend them locally. Morning peaks from 9 to 11 am and evening peaks from 5 to 8 pm "
      "reflect office and retail hours. Outdoor advertising in Dharuhera Haryana at the "
      "city centre achieves the broadest local demographic reach.\n\n"
      "The primary audience is Dharuhera's permanent and migrant industrial workforce: "
      "engineers, supervisors, and factory floor workers employed at Hero MotoCorp and the "
      "Dharuhera industrial belt, along with local businesspeople, government employees, and "
      "their families. This is a relatively young, income-earning, brand-aware audience "
      "with disposable income and aspiration. Consumer spending in Dharuhera has grown "
      "consistently alongside industrial employment.\n\n"
      "Consumer electronics, two-wheelers and cars, real estate and housing projects, "
      "banking and financial services, FMCG brands, and QSR chains expanding into "
      "Haryana industrial towns should prioritise Dharuhera City Center. Hoarding "
      "advertising near Dharuhera's commercial core establishes brand authority in "
      "this growth market before competition intensifies.\n\n"
      "Get a quote for outdoor advertising in Dharuhera by calling +91 8168740234."
    ),
    "meta_description": "20x10 ft hoarding at City Center, Dharuhera — commercial core of NH-48 industrial hub, Hero MotoCorp workforce audience. Outdoor advertising Dharuhera: +91 8168740234.",
  },

  "hoarding-bestech-flats-dharuhera": {
    "audience_profile": (
      "This 20x10 ft hoarding near Bestech Flats in Dharuhera targets one of the most "
      "significant residential concentrations in the NH-48 industrial corridor. Bestech "
      "Flats is a well-known landmark residential development in Dharuhera that houses "
      "middle-income families — largely industrial and corporate sector employees at "
      "nearby plants including Hero MotoCorp, Maruti Suzuki vendors, and the broader "
      "auto-components cluster.\n\n"
      "Located on the residential approach road to Bestech Flats, this hoarding intercepts "
      "the daily outbound and inbound movement of apartment residents — an audience that "
      "is defined by regularity, repeat exposure, and household-level purchasing authority. "
      "Traffic through this micro-location is lower in volume but higher in engagement "
      "quality than highway-adjacent positions, as viewers are within their neighbourhood "
      "environment and not in high-speed transit. Outdoor advertising in Dharuhera Haryana "
      "at established residential landmarks achieves strong, durable brand recall.\n\n"
      "Residents of Bestech and nearby housing are predominantly dual-income families, "
      "engineers and middle managers in their 28 to 45 age bracket, with children in "
      "school and active household purchasing cycles. Many are originally from other "
      "states and cities, making them more receptive to national brands and aspirational "
      "consumer products. This distinguishes the Dharuhera residential audience from "
      "Rewari's more locally rooted demographic.\n\n"
      "Home furnishing and interior brands, private schools, health and wellness services, "
      "consumer electronics, automobiles, real estate investment, and premium FMCG products "
      "resonate strongly at this location. Financial planning products and insurance are "
      "especially well-received by this engineering and salaried professional audience.\n\n"
      "Contact +91 8168740234 for a quote on hoarding advertising near Bestech Flats, Dharuhera."
    ),
    "meta_description": "20x10 ft hoarding near Bestech Flats, Dharuhera — residential enclave, industrial salaried families, repeat daily exposure. Outdoor advertising Dharuhera: +91 8168740234.",
  },

  "hoarding-sector-6-nhai-dharuhera": {
    "audience_profile": (
      "This 20x10 ft hoarding in Sector 6, NHAI area of Dharuhera occupies a high-visibility "
      "location adjacent to one of the most active infrastructure and industrial zones along "
      "the NH-48 corridor. The NHAI office and Sector 6 industrial cluster attract a steady "
      "flow of government contractors, infrastructure professionals, engineers, and B2B "
      "service providers — making this a uniquely government-and-industry-facing "
      "advertising position in Dharuhera.\n\n"
      "Traffic in the Sector 6 NHAI area includes a mix of institutional and industrial "
      "movement: NHAI staff and contractor vehicles, sector-based manufacturing units, "
      "logistics operators handling inter-state freight on NH-48, and construction "
      "equipment movement. The proximity to the NHAI office ensures a regular presence "
      "of government procurement staff and engineering consultants. Outdoor advertising "
      "in Dharuhera Haryana near NHAI positions brands in the line of sight of "
      "decision-makers with significant institutional purchasing authority.\n\n"
      "The audience profile is weighted toward professionals and B2B buyers: civil engineers, "
      "infrastructure contractors, procurement and logistics managers, and government "
      "department officials. Secondary audiences include factory workers from nearby "
      "industrial units and truck drivers resting on NH-48. The professional-government "
      "mix here is unusual in Haryana's outdoor advertising landscape, providing a "
      "niche channel for B2B brands.\n\n"
      "Construction materials and equipment, civil engineering firms, fleet and logistics "
      "services, B2B SaaS and ERP solutions marketed to industry, industrial insurance, "
      "and infrastructure sector financial services find strong audience alignment at "
      "this Sector 6 NHAI location. Hoarding near Dharuhera's NHAI area is a strategic "
      "choice for brands targeting infrastructure India.\n\n"
      "Call +91 8168740234 to get a quote for outdoor advertising at Sector 6 NHAI, Dharuhera."
    ),
    "meta_description": "20x10 ft hoarding in Sector 6 NHAI, Dharuhera — B2B and government audience, infrastructure corridor on NH-48. Outdoor advertising Dharuhera Haryana: +91 8168740234.",
  },

  "hoarding-subash-chowk-dharuhera": {
    "audience_profile": (
      "This 20x10 ft hoarding at Subash Chowk in Dharuhera stands at one of the town's "
      "most central and recognisable intersections — a meeting point for traffic from the "
      "industrial belt, the NH-48 feeder roads, and Dharuhera's residential sectors. "
      "Subash Chowk is a genuine community hub, functioning as the town's navigational "
      "centre and shopping reference point in the same way that major chowks do in "
      "every Haryana town.\n\n"
      "The chowk generates high multi-directional traffic throughout the day: industrial "
      "workers passing through during shift changes, local traders and vendors, families "
      "shopping at the market cluster, and students accessing coaching and educational "
      "facilities nearby. Daily vehicle and pedestrian count at Subash Chowk exceeds "
      "18,000, with strong afternoon and evening peaks corresponding to shift ends "
      "at nearby industrial units and evening market activity. Hoarding advertising "
      "in Dharuhera at Subash Chowk captures the full width of the town's working "
      "and consumer population.\n\n"
      "The audience at Subash Chowk is Dharuhera's broadest cross-section: factory "
      "workers and supervisors from the Hero MotoCorp ecosystem, local traders and "
      "shopkeepers, families from established Dharuhera neighbourhoods, students, "
      "and inter-city travellers using Dharuhera as a transit point on NH-48. "
      "This heterogeneous audience makes Subash Chowk a strong brand-awareness "
      "buy for any campaign targeting the Dharuhera-Rewari growth corridor.\n\n"
      "FMCG, two-wheelers, consumer electronics, telecom, banking, retail chains "
      "entering Dharuhera, and educational institutions all benefit from the breadth "
      "of reach at this chowk. Political campaigns and government scheme awareness "
      "also find this location highly productive. Outdoor advertising in Dharuhera "
      "Haryana at Subash Chowk is the anchor buy for any Dharuhera campaign.\n\n"
      "To book this hoarding and get a quote, call +91 8168740234."
    ),
    "meta_description": "20x10 ft hoarding at Subash Chowk, Dharuhera — central town junction, 18,000+ daily vehicles, broadest local audience. Outdoor advertising Dharuhera Haryana: +91 8168740234.",
  },
}

# ── Fetch all listings slugs ──────────────────────────────────────────────────
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/listings",
    headers=HEADERS,
    params={"select": "id,slug,type,city,locality,meta_title", "order": "created_at.asc", "limit": "50"},
)
r.raise_for_status()
all_listings = r.json()
print(f"Found {len(all_listings)} listings in DB")

# ── Update each listing ──────────────────────────────────────────────────────
ok = skip = err = 0

for listing in all_listings:
    slug = listing["slug"]
    if slug not in CONTENT:
        print(f"  SKIP  {slug}  (no content defined)")
        skip += 1
        continue

    payload = {
        "audience_profile":  CONTENT[slug]["audience_profile"],
        "meta_description":  CONTENT[slug]["meta_description"],
    }

    r2 = requests.patch(
        f"{SUPABASE_URL}/rest/v1/listings",
        headers=HEADERS,
        params={"slug": f"eq.{slug}"},
        json=payload,
    )
    if r2.status_code not in (200, 201, 204):
        print(f"  ERR   {slug}  -> {r2.status_code}: {r2.text[:120]}")
        err += 1
    else:
        aud_words = len(CONTENT[slug]["audience_profile"].split())
        meta_len  = len(CONTENT[slug]["meta_description"])
        print(f"  OK    {slug[:52]:<54}  {aud_words}w  meta:{meta_len}ch")
        ok += 1

print(f"\nUpdated: {ok}  Skipped: {skip}  Errors: {err}")

# ── Trigger ISR revalidation for every updated slug ──────────────────────────
print("\nTriggering ISR revalidation...")
rev_ok = rev_err = 0

for listing in all_listings:
    slug = listing["slug"]
    if slug not in CONTENT:
        continue
    r3 = requests.post(
        f"{SITE_URL}/api/revalidate",
        headers={"Content-Type": "application/json"},
        json={"slug": slug, "type": listing.get("type"), "locality": listing.get("locality")},
        timeout=10,
    )
    if r3.status_code == 200:
        rev_ok += 1
    else:
        print(f"  REVALIDATE WARN  {slug}  -> {r3.status_code}")
        rev_err += 1

print(f"Revalidated: {rev_ok}  Errors: {rev_err}")
print("\nSTEP 6 COMPLETE")
