-- ─────────────────────────────────────────────────────────────────────────────
--  Inject Rewari local context into all 8 blog posts
--  Uses replace() for targeted string replacements — safe to re-run.
--  Run in Supabase Dashboard › SQL Editor after seed posts are inserted.
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════
--  POST 1: outdoor-advertising-rewari-complete-guide
-- ═══════════════════════════════════════════════════════

-- Fix highway destination (Mumbai → Ahmedabad)
UPDATE public.rh_blog
SET content = replace(content,
  'Delhi to Jaipur, Udaipur, and Mumbai',
  'Delhi to Jaipur and Ahmedabad')
WHERE slug = 'outdoor-advertising-rewari-complete-guide';

UPDATE public.rh_blog
SET content = replace(content,
  'Delhi–Jaipur–Mumbai expressway corridor',
  'Delhi–Jaipur–Ahmedabad corridor')
WHERE slug = 'outdoor-advertising-rewari-complete-guide';

-- Add peak traffic times and HPCL context to the NH-48 Entry Point section
UPDATE public.rh_blog
SET content = replace(content,
  'The [NH-48 Entry Point](/locality/nh-48-entry-point) is Rewari''s single most valuable outdoor advertising location. Every vehicle traveling between Delhi (approximately 80 km north) and Rajasthan enters Rewari at this junction — recording an estimated 20,000 to 35,000 daily vehicle impressions.',
  'The [NH-48 Entry Point](/locality/nh-48-entry-point) is Rewari''s single most valuable outdoor advertising location. Every vehicle traveling between Delhi (approximately 80 km north) and Rajasthan enters Rewari at this junction — recording an estimated 20,000 to 35,000 daily vehicle impressions. Traffic peaks sharply between 7 and 10 AM (outbound: Rewari commuters heading to Gurugram 60 km away and Delhi 80 km away, plus HPCL refinery workers commuting toward Bawal) and again between 5 and 8 PM on the return.')
WHERE slug = 'outdoor-advertising-rewari-complete-guide';

-- Update bus stand routes to include Narnaul and Bawal
UPDATE public.rh_blog
SET content = replace(content,
  'The bus stand handles 10,000+ daily passengers on routes to Delhi, Gurugram, Bhiwani, Jaipur, and local services.',
  'The bus stand handles 10,000–15,000 daily passengers on HRTC routes to Delhi, Gurugram, Bhiwani, Narnaul, Bawal, and local intra-district services.')
WHERE slug = 'outdoor-advertising-rewari-complete-guide';

-- Update audience section with HPCL and auto components
UPDATE public.rh_blog
SET content = replace(content,
  'Whether you are planning your first **outdoor advertising campaign in Rewari** or expanding a regional brand push into Haryana''s NH-48 belt',
  'Rewari''s economic base spans the auto components and engineering goods industry along the Dharuhera-Rewari corridor, HPCL''s refinery at Bawal, wheat and mustard belt agriculture, and a large daily commuter population working in Gurugram and Delhi. Whether you are planning your first **outdoor advertising campaign in Rewari** or expanding a regional brand push into Haryana''s NH-48 belt')
WHERE slug = 'outdoor-advertising-rewari-complete-guide';


-- ═══════════════════════════════════════════════════════
--  POST 2: best-hoarding-locations-rewari-2025
-- ═══════════════════════════════════════════════════════

-- Update NH-48 Entry Point section with specific peaks and HPCL workers
UPDATE public.rh_blog
SET content = replace(content,
  'No location in Rewari matches the [NH-48 Entry Point](/locality/nh-48-entry-point) for intercity reach. Every vehicle traveling between Delhi and Rajasthan enters Rewari at this junction — an estimated 20,000 to 35,000 vehicles per day, a mix of private cars, commercial trucks, intercity buses, and two-wheelers. This is the only single OOH placement in Rewari that simultaneously reaches local residents and a continuously refreshed traveling audience from across North India.',
  'No location in Rewari matches the [NH-48 Entry Point](/locality/nh-48-entry-point) for intercity reach. Every vehicle traveling on the Delhi–Jaipur–Ahmedabad corridor passes this junction — an estimated 20,000 to 35,000 vehicles per day: private cars with NCR-connected Rewari residents, HPCL refinery workers commuting toward Bawal, auto components industry staff from the Dharuhera corridor, and long-haul freight. Traffic peaks sharply between 7 and 10 AM (outbound) and 5 and 8 PM (return). This is the only single OOH placement in Rewari that simultaneously reaches local residents and a continuously refreshed intercity audience.')
WHERE slug = 'best-hoarding-locations-rewari-2025';

-- Update Delhi Road section with specific commute distances and peak times
UPDATE public.rh_blog
SET content = replace(content,
  '[Delhi Road](/locality/delhi-road) is Rewari''s highest-volume commuter artery — the primary route for daily NCR commuters, business travelers, and private vehicle owners traveling between Rewari and the national capital. The audience profile skews aspirational: working professionals, car owners, and families with above-average household income. This makes Delhi Road Rewari''s strongest location for real estate, automotive, telecom, and premium FMCG brands.',
  '[Delhi Road](/locality/delhi-road) is Rewari''s highest-volume commuter artery — the direct route toward Gurugram (60 km) and Delhi (110 km). Peak outbound flow runs 7 to 10 AM as Rewari''s salaried professionals head to NCR workplaces; the evening return peaks 5 to 8 PM. The audience profile skews aspirational: working professionals with NCR incomes who live in Rewari, car owners, and middle-to-upper-income families. This makes Delhi Road Rewari''s strongest location for real estate, automotive, telecom, and premium FMCG brands targeting the NCR commuter demographic.')
WHERE slug = 'best-hoarding-locations-rewari-2025';

-- Update Bus Stand section with specific HRTC routes
UPDATE public.rh_blog
SET content = replace(content,
  'The [Rewari Bus Stand](/locality/rewari-bus-stand) handles 10,000+ daily passengers on routes to Delhi, Gurugram, Bhiwani, Jaipur, and local services.',
  'The [Rewari Bus Stand](/locality/rewari-bus-stand) (HRTC) handles 10,000–15,000 daily passengers on routes to Delhi, Gurugram, Bhiwani, Narnaul, Bawal, and local intra-district services.')
WHERE slug = 'best-hoarding-locations-rewari-2025';

-- Update Railway Station section to use Rewari Junction and specific routes
UPDATE public.rh_blog
SET content = replace(content,
  'Rewari Railway Station is a junction station on the Delhi–Jaipur and Delhi–Bhiwani routes, handling 20,000+ passengers per day. Platform hoardings, concourse display panels, and exit-gate boards reach a captive waiting audience that spends 5 to 45 minutes at the station. The demographic spans students, daily NCR commuters, and rural travelers — a broad, mixed audience with strong 18 to 45 age segment representation.',
  'Rewari Junction is a major Haryana rail interchange on the Delhi–Alwar, Delhi–Bhatinda and Rewari–Rohtak routes. Platform hoardings, concourse display panels, and exit-gate boards reach a captive waiting audience with dwell times of 5 to 45 minutes. The demographic spans daily NCR commuters, students from Rewari''s colleges, HPCL refinery workers heading toward Bawal, agri traders, and rural visitors from across the district — a genuinely district-wide audience at a single placement.')
WHERE slug = 'best-hoarding-locations-rewari-2025';


-- ═══════════════════════════════════════════════════════
--  POST 3: unipole-vs-gantry-rewari
-- ═══════════════════════════════════════════════════════

-- Add peak traffic context to the unipole highway section
UPDATE public.rh_blog
SET content = replace(content,
  'On NH-48, vehicles travel at 70 to 90 km/h. A driver needs to register a brand from 400 to 600 metres away — before they can react, change lane, or look elsewhere.',
  'On NH-48, vehicles travel at 70 to 90 km/h. A driver needs to register a brand from 400 to 600 metres away — before they can react, change lane, or look elsewhere. This is especially valuable during the morning peak (7–10 AM) when thousands of Rewari commuters head to Gurugram (60 km) and Delhi (110 km), and the evening return peak (5–8 PM) — the two highest-density windows on the NH-48 corridor.')
WHERE slug = 'unipole-vs-gantry-rewari';

-- Add HPCL worker context to the corridor description
UPDATE public.rh_blog
SET content = replace(content,
  'A prime NH-48 unipole delivers more daily impressions from a single placement than almost any city-centre format combination in Rewari.',
  'A prime NH-48 unipole delivers more daily impressions from a single placement than almost any city-centre format combination in Rewari — reaching Gurugram-bound commuters, HPCL refinery workers heading toward Bawal, auto components industry staff from the Dharuhera corridor, and long-haul freight on the Delhi–Jaipur–Ahmedabad route.')
WHERE slug = 'unipole-vs-gantry-rewari';


-- ═══════════════════════════════════════════════════════
--  POST 4: e-rickshaw-advertising-rewari
-- ═══════════════════════════════════════════════════════

-- Add engineering colleges to the Jat College Road corridor
UPDATE public.rh_blog
SET content = replace(content,
  '**Jat College Road residential corridor** — routes connecting residential areas along Jat College Road to central Rewari — see significant e-rickshaw activity, particularly from students and working adults commuting daily. Education brands and coaching institutes find this corridor particularly effective.',
  '**Jat College Road residential corridor** — routes connecting residential areas along Jat College Road and the engineering college campuses to central Rewari — see significant e-rickshaw activity from students, faculty and working adults commuting daily. Education brands, engineering coaching institutes and youth consumer brands find this corridor particularly effective, especially during the March–June admission season.')
WHERE slug = 'e-rickshaw-advertising-rewari';

-- Add Rewari Junction to bus stand reference
UPDATE public.rh_blog
SET content = replace(content,
  'connecting specific residential colonies to the bus stand, railway station, and main market areas.',
  'connecting specific residential colonies to Rewari Bus Stand (HRTC), Rewari Junction (railway station), and the main market areas.')
WHERE slug = 'e-rickshaw-advertising-rewari';


-- ═══════════════════════════════════════════════════════
--  POST 5: nh-48-corridor-ooh-advertising  [most updates]
-- ═══════════════════════════════════════════════════════

-- Fix highway destination throughout
UPDATE public.rh_blog
SET content = replace(content,
  'intercity Delhi–Jaipur travelers',
  'intercity Delhi–Jaipur–Ahmedabad travelers')
WHERE slug = 'nh-48-corridor-ooh-advertising';

UPDATE public.rh_blog
SET content = replace(content,
  'between Delhi and Jaipur is one of India''s busiest national highway sections',
  'between Delhi and Ahmedabad is one of India''s busiest national highway sections')
WHERE slug = 'nh-48-corridor-ooh-advertising';

-- Add morning/evening peaks and HPCL to the Why section
UPDATE public.rh_blog
SET content = replace(content,
  'Daily vehicle counts on this corridor are substantial: intercity traffic between Delhi and Rajasthan uses this route continuously, Rewari–Gurugram commuters travel it daily, and commercial freight between Haryana''s agri-economy and the Rajasthan market moves through without stopping. An **NH-48 hoarding** on this corridor does not just reach Rewari — it reaches every vehicle traversing the full Delhi–Jaipur route.',
  'Daily vehicle counts on this corridor are substantial: intercity traffic on the Delhi–Jaipur–Ahmedabad route moves continuously, Rewari commuters travel to Gurugram (60 km) and Delhi (80 km) in two clear daily peaks — 7 to 10 AM outbound and 5 to 8 PM return — HPCL refinery workers commute toward Bawal, and auto components industry staff travel the Dharuhera-Rewari corridor. Commercial freight between Haryana and Rajasthan rounds out a genuinely mixed traffic stream. An **NH-48 hoarding** on this corridor does not just reach Rewari — it reaches every vehicle traversing the full Delhi–Ahmedabad route.')
WHERE slug = 'nh-48-corridor-ooh-advertising';

-- Add HPCL and IMT Bawal to industrial area section
UPDATE public.rh_blog
SET content = replace(content,
  'The stretch of NH-48 passing the [Rewari Industrial Area](/locality/rewari-industrial-area) and bypass corridor is particularly valuable for B2B brands, logistics companies, and industrial input brands. The audience includes commercial vehicle operators, industrial supply chain workers, and the wholesale trading community servicing the industrial zone. Hoardings here targeting commercial decision-makers outperform city-centre formats for B2B categories by a significant margin.',
  'The stretch of NH-48 passing the [Rewari Industrial Area](/locality/rewari-industrial-area) and bypass corridor sits between two major industrial anchors: the Dharuhera industrial township to the north and IMT Bawal to the south — forming part of one of North India''s most active auto components and engineering goods belts. HPCL''s refinery at Bawal drives significant daily worker commute traffic through this stretch. The audience includes commercial vehicle operators, auto components manufacturing staff, industrial supply chain workers, and logistics operators on the Delhi–Jaipur freight corridor. Hoardings here targeting commercial decision-makers outperform city-centre formats for B2B categories by a significant margin.')
WHERE slug = 'nh-48-corridor-ooh-advertising';

-- Update Kosli Road section to add southern Haryana context
UPDATE public.rh_blog
SET content = replace(content,
  'The [Kosli Road](/locality/kosli-road) junction on the NH-48 corridor marks the exit from the Rewari urban catchment toward Kosli and beyond into southern Haryana and Rajasthan. This is a secondary high-value junction for brands with a broader southern Haryana or cross-border mandate — the audience here includes rural consumers from districts south of Rewari and long-distance freight operators.',
  'The [Kosli Road](/locality/kosli-road) junction marks the exit from the Rewari urban catchment toward Kosli, Jhajjar, and southern Haryana. This is a secondary high-value junction for brands with a broader Haryana district mandate — the audience includes rural consumers from Rewari''s southern hinterland, wheat and mustard farmers heading to Rewari''s grain market, and freight operators on the Haryana–Rajasthan agricultural corridor.')
WHERE slug = 'nh-48-corridor-ooh-advertising';

-- Add specific Rewari catchment detail to the intro
UPDATE public.rh_blog
SET content = replace(content,
  'Rewari on the eastern end has a 1.5 lakh resident consumer base and a thriving agricultural and trading economy.',
  'Rewari on the eastern end has a 1.5 lakh city population and a 9 lakh district catchment — with a thriving wheat and mustard belt agricultural economy, auto components manufacturing industry, and a large daily commuter population working in Gurugram and Delhi.')
WHERE slug = 'nh-48-corridor-ooh-advertising';


-- ═══════════════════════════════════════════════════════
--  POST 6: society-gate-branding-rewari
-- ═══════════════════════════════════════════════════════

-- Add engineering college context to Jat College Road residential section
UPDATE public.rh_blog
SET content = replace(content,
  '**Jat College Road residential colonies** serve a high student and young-family population, making gates in this corridor particularly effective for coaching institutes, edtech brands, nutrition products, and youth-oriented consumer goods.',
  '**Jat College Road residential colonies** serve a high student and young-family population — Jat College and the engineering colleges along this corridor draw students from across the district. Society gates here are particularly effective for coaching institutes, engineering entrance prep courses, edtech brands, nutrition products, and youth-oriented consumer goods. The March–June admission season is the highest-intent window for education-sector campaigns.')
WHERE slug = 'society-gate-branding-rewari';


-- ═══════════════════════════════════════════════════════
--  POST 7: how-to-book-hoarding-rewari
-- ═══════════════════════════════════════════════════════

-- Add specific Rewari commuter audience context to the brief-writing section
UPDATE public.rh_blog
SET content = replace(content,
  'Local Rewari residents → market-zone formats in Sadar Bazar or Gurudwara Chowk. Daily NCR commuters → [Delhi Road](/locality/delhi-road). Intercity highway audience → [NH-48 Entry Point](/locality/nh-48-entry-point). Residential neighbourhood → society gate or e-rickshaw formats.',
  'Local Rewari residents → market-zone formats in Sadar Bazar or Gurudwara Chowk. Daily NCR commuters (Gurugram 60 km, Delhi 80 km) → [Delhi Road](/locality/delhi-road) during 7–10 AM outbound and 5–8 PM return peaks. Intercity highway audience on the Delhi–Jaipur–Ahmedabad corridor → [NH-48 Entry Point](/locality/nh-48-entry-point). Residential neighbourhood → society gate or e-rickshaw formats. Industrial and B2B audience → Rewari Industrial Area and the Dharuhera-Rewari corridor.')
WHERE slug = 'how-to-book-hoarding-rewari';


-- ═══════════════════════════════════════════════════════
--  POST 8: ooh-advertising-cost-rewari-2025
-- ═══════════════════════════════════════════════════════

-- Add Rewari's economic base context to the NCR comparison section
UPDATE public.rh_blog
SET content = replace(content,
  'This is the clearest value proposition for [OOH advertising in Rewari Haryana](/city/rewari): comparable audience engagement at dramatically lower cost than NCR markets. A prime unipole on NH-48 near Rewari reaches 20,000+ vehicles per day — comparable to a mid-tier location in Gurugram — but at a fraction of the Gurugram rate.',
  'This is the clearest value proposition for [OOH advertising in Rewari Haryana](/city/rewari): comparable audience engagement at dramatically lower cost than NCR markets. A prime unipole on NH-48 near Rewari reaches 20,000+ vehicles per day on the Delhi–Jaipur–Ahmedabad corridor — comparable to a mid-tier location in Gurugram — but at a fraction of the Gurugram rate. And unlike pure commuter-corridor markets, Rewari''s audience includes a distinct local consumer base: HPCL refinery workers, auto components industry staff, wheat belt farmers, and engineering college students — demographics not accessible from NCR highway sites.')
WHERE slug = 'ooh-advertising-cost-rewari-2025';

-- Add Dharuhera and Bawal context to the competing markets reference
UPDATE public.rh_blog
SET content = replace(content,
  'For brands expanding from NCR into Tier 2 Haryana, or building their first district-level OOH presence in Haryana, Rewari''s pricing structure makes it an accessible entry point with measurable, comparable audience reach.',
  'For brands expanding from NCR into Tier 2 Haryana, or building their first district-level OOH presence in the Rewari–Dharuhera–Bawal belt, Rewari''s pricing structure makes it an accessible entry point with measurable, comparable audience reach. Rewari also outperforms the adjacent OOH markets of Dharuhera, Bawal, and Narnaul on audience volume and format variety — making it the natural anchor for any multi-city Haryana corridor campaign.')
WHERE slug = 'ooh-advertising-cost-rewari-2025';

-- Add illumination evening peak reference with local timing
UPDATE public.rh_blog
SET content = replace(content,
  'For high-traffic evening locations (junctions near Gurudwara Chowk, bus stand approach), illumination is not optional if you need to capture the evening commuter peak between 6 and 9 PM.',
  'For high-traffic evening locations (junctions near Gurudwara Chowk, Delhi Road, and the bus stand approach), illumination is not optional if you need to capture the evening commuter peak. On Delhi Road and NH-48, the 5–8 PM return window is when Rewari''s NCR-commuter demographic is heaviest — and an unlit panel is effectively invisible after sunset.')
WHERE slug = 'ooh-advertising-cost-rewari-2025';
