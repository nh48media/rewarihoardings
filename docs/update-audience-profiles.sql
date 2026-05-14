-- ─────────────────────────────────────────────────────────────────────────────
--  Update audience_profile for the 3 seeded listings
--  Run in Supabase Dashboard › SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Premium Unipole — NH-48 Entry Point, Rewari
UPDATE public.listings
SET audience_profile = $ap1$
The NH-48 Entry Point unipole sits at Rewari's most strategically valuable advertising position — the precise junction where National Highway 48 enters the city from the Delhi direction. Every vehicle traveling the Delhi–Jaipur–Mumbai expressway corridor passes this point, generating an estimated 25,000 vehicle impressions per day across a genuinely intercity audience.

Traffic here is a high-quality mix: private cars driven by NCR residents traveling toward Rajasthan, commercial vehicles on the Delhi–Jaipur logistics route, two-wheelers entering Rewari from surrounding villages, and daily commuters connecting Rewari to the National Capital Region. The Rewari Toll Plaza immediately adjacent creates a natural slow-down zone, maximising dwell time and creative engagement for westbound traffic.

Audience demographics skew toward the aspirational middle class — private vehicle owners, business owners traveling the Delhi–Haryana–Rajasthan belt, and NCR professionals with Rewari roots. This location outperforms every other Rewari position for brand awareness campaigns targeting the intercepted long-distance traveler.

Best-suited campaign categories include automotive brands targeting two-wheeler and four-wheeler buyers, real estate developers marketing residential projects along the NH-48 belt, telecom and banking brands seeking district-level awareness at the city gateway, FMCG and consumer goods brands targeting the Haryana corridor, and education institutions reaching families across the Rewari–NCR–Rajasthan triangle. The 40×20 ft frontlit panel ensures full creative visibility from both directions, day and night.
$ap1$
WHERE slug = 'unipole-nh48-entry-rewari';


-- 2. Road-Spanning Gantry — Delhi Road Crossing, Rewari
UPDATE public.listings
SET audience_profile = $ap2$
The Delhi Road Gantry spans the full width of Rewari's highest-volume commuter artery at Delhi Road Main Crossing — the primary road connecting the city to the National Capital Region. Its 60×15 ft backlit panel delivers both-sides visibility to approximately 20,000 daily vehicles, making it the city's dominant junction-level advertising format.

The audience profile here is distinctly commuter-oriented: daily office workers traveling to Gurugram and Delhi, private car and two-wheeler owners on the NCR–Rewari run, and mid-to-senior professionals with strong disposable income. This route carries Rewari's most aspirational demographic — upwardly mobile residents who work in the NCR and live in Rewari — making it the city's strongest location for premium brand categories.

Nearby landmarks driving footfall include Rewari's main government offices, the district courts complex, school and college clusters near the Circular Road junction, and the residential hubs of Model Town and Subhash Nagar. The gantry format spans the full road width, guaranteeing visual contact with every driver on both carriageways — no line-of-sight escape from the structure.

Ideal campaign categories for this position include real estate developers targeting NCR commuters considering a Rewari address, automotive brands reaching daily private vehicle owners, banking and NBFC brands building awareness with salaried professionals, telecom brands seeking the upwardly mobile commuter demographic, and educational institutions targeting students on the Delhi–Rewari corridor.
$ap2$
WHERE slug = 'gantry-delhi-road-rewari';


-- 3. LED Display — Rewari Bus Stand
UPDATE public.listings
SET audience_profile = $ap3$
The Rewari Bus Stand LED display is positioned at the main gate of Haryana Roadways' Rewari hub — one of the city's highest-footfall transit points with an estimated 15,000 daily passengers and bystanders. The bus stand handles routes to Delhi, Gurugram, Bhiwani, Narnaul, Jhajjar, Jaipur, and local intra-district services, drawing a broad cross-section of Rewari's population to a single concentrated location.

The LED format's full-motion video capability runs branded content in time-slot rotation, enabling dynamic creative — promotional offers, countdown campaigns, seasonal messaging — that static formats cannot deliver. The south-facing panel reaches passengers boarding and alighting, auto and e-rickshaw drivers waiting in the forecourt, and the dense pedestrian traffic along the Bus Stand Road frontage.

Audience demographics span a wide range: daily intercity commuters (a high-frequency, recall-ready audience), students traveling to colleges in Rewari and Gurugram, rural visitors from surrounding blocks arriving on intra-district services, shoppers accessing the adjacent Sadar Bazar commercial zone, and local residents using the bus stand as a neighbourhood transit interchange. Dwell time for waiting passengers exceeds ten minutes on average — significantly longer than highway or junction formats.

Best-suited campaign types include FMCG and packaged consumer goods, mobile and telecom offers, local retail and service brand promotions, educational institution awareness targeting students, healthcare and pharmacy brands, and time-sensitive promotional campaigns that benefit from the LED panel's updateable creative flexibility.
$ap3$
WHERE slug = 'led-display-rewari-bus-stand';
