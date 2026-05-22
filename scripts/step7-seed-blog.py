"""
STEP 7 — Create rh_blog table (already done manually), seed 8 posts,
then apply all Rewari local-context string replacements.
"""
import os, re, requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env.local")

SUPABASE_URL = "https://nkqanwzzvbadyzqgcmyi.supabase.co"
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or exit("ERROR: SUPABASE_SERVICE_ROLE_KEY not set in .env.local")

HEADERS = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=representation",
}

# ── Parse dollar-quoted content from SQL seed files ───────────────────────────

def parse_inserts(sql: str) -> list[dict]:
    """
    Extract INSERT rows from the seed SQL.
    Handles dollar-quoting: $blogN$...$blogN$
    Returns list of dicts with keys: slug, title, excerpt, content,
    published_at, is_published, meta_title, meta_description
    """
    rows = []
    # Split on INSERT INTO ... VALUES (
    blocks = re.split(r"INSERT INTO public\.rh_blog\s*\([^)]+\)\s*VALUES\s*\(", sql, flags=re.DOTALL)
    for block in blocks[1:]:
        # Slug (first single-quoted string)
        slug_m = re.match(r"\s*'([^']+)'", block)
        if not slug_m:
            continue
        slug = slug_m.group(1)

        # Title
        title_m = re.search(r"'(.*?)',\s*\$blog", block, re.DOTALL)
        if not title_m:
            continue
        # Actually let's pull all single-quoted fields before the dollar-quote content
        # Fields appear as: 'slug', 'title', 'excerpt', $blogN$content$blogN$, 'published_at', is_published, 'meta_title', 'meta_description'
        # Find the dollar-quote tag
        dq_m = re.search(r"(\$blog\d+\$)", block)
        if not dq_m:
            continue
        tag = dq_m.group(1)

        # Extract content between dollar quotes
        content_m = re.search(re.escape(tag) + r"(.*?)" + re.escape(tag), block, re.DOTALL)
        if not content_m:
            continue
        content = content_m.group(1).strip()

        # Everything before the first dollar-quote: slug, title, excerpt
        before_dq = block[:dq_m.start()]
        # Pull quoted strings (slug already have it, get title and excerpt)
        sq = re.findall(r"'((?:[^'\\]|''|\\.)*)'", before_dq)
        # sq[0] = slug, sq[1] = title, sq[2] = excerpt (may be empty)
        title   = sq[1].replace("''", "'") if len(sq) > 1 else ""
        excerpt = sq[2].replace("''", "'") if len(sq) > 2 else ""

        # Everything after the closing dollar-quote tag
        after_dq = block[content_m.end():]
        # published_at, is_published, meta_title, meta_description
        after_sq = re.findall(r"'((?:[^'\\]|''|\\.)*)'", after_dq)
        published_at  = after_sq[0] if len(after_sq) > 0 else "2025-01-15 10:00:00+05:30"
        meta_title    = after_sq[1].replace("''", "'") if len(after_sq) > 1 else ""
        meta_desc     = after_sq[2].replace("''", "'") if len(after_sq) > 2 else ""

        # is_published appears as bare true/false
        is_pub_m = re.search(r",\s*(true|false)\s*,", after_dq)
        is_published = is_pub_m.group(1) == "true" if is_pub_m else True

        rows.append({
            "slug":             slug,
            "title":            title,
            "excerpt":          excerpt,
            "content":          content,
            "published_at":     published_at,
            "is_published":     is_published,
            "meta_title":       meta_title,
            "meta_description": meta_desc,
        })
    return rows

docs = Path("docs")
sql1 = (docs / "seed-blog-post-1.sql").read_text(encoding="utf-8")
sql2 = (docs / "seed-blog-posts-2-8.sql").read_text(encoding="utf-8")

# Post 1 uses a slightly different format (no ON CONFLICT clause, raw INSERT)
# Parse it separately
post1_slug    = "outdoor-advertising-rewari-complete-guide"
post1_title   = "Outdoor Advertising in Rewari — Complete Guide 2025"
post1_excerpt = (
    "A complete guide to outdoor advertising in Rewari, Haryana — covering every OOH format "
    "available, the best locations on NH-48, how hoarding booking works, typical campaign "
    "durations, and practical tips for first-time advertisers."
)
post1_dq_m = re.search(r"\$blog1\$(.*?)\$blog1\$", sql1, re.DOTALL)
post1_content = post1_dq_m.group(1).strip() if post1_dq_m else ""
post1_published_at   = "2025-01-15 10:00:00+05:30"
post1_meta_title     = "Outdoor Advertising in Rewari — Complete Guide 2025 | Rewari Hoardings"
post1_meta_desc      = (
    "Complete guide to outdoor advertising in Rewari, Haryana — OOH formats, best NH-48 "
    "hoarding locations, booking process, campaign durations, and tips for first-time advertisers."
)

posts = [{
    "slug":             post1_slug,
    "title":            post1_title,
    "excerpt":          post1_excerpt,
    "content":          post1_content,
    "published_at":     post1_published_at,
    "is_published":     True,
    "meta_title":       post1_meta_title,
    "meta_description": post1_meta_desc,
}]

posts += parse_inserts(sql2)
print(f"Parsed {len(posts)} blog posts from seed SQL files")

# ── Insert posts ──────────────────────────────────────────────────────────────

print("\nInserting blog posts...")
ok = skip = err = 0

for post in posts:
    # Check if already exists
    chk = requests.get(
        f"{SUPABASE_URL}/rest/v1/rh_blog",
        headers=HEADERS,
        params={"select": "id", "slug": f"eq.{post['slug']}"},
    )
    if chk.json():
        print(f"  SKIP  {post['slug']}  (already exists)")
        skip += 1
        continue

    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/rh_blog",
        headers=HEADERS,
        json=post,
    )
    if r.status_code in (200, 201):
        words = len(post["content"].split())
        print(f"  OK    {post['slug'][:55]:<57}  {words}w")
        ok += 1
    else:
        print(f"  ERR   {post['slug']}  -> {r.status_code}: {r.text[:120]}")
        err += 1

print(f"\nInserted: {ok}  Skipped: {skip}  Errors: {err}")

# ── Apply Rewari local-context patches ────────────────────────────────────────

print("\nApplying local-context patches...")

# Each entry: (slug, old_text, new_text)
PATCHES = [
    # POST 1
    (
        "outdoor-advertising-rewari-complete-guide",
        "Delhi to Jaipur, Udaipur, and Mumbai",
        "Delhi to Jaipur and Ahmedabad",
    ),
    (
        "outdoor-advertising-rewari-complete-guide",
        "Delhi–Jaipur–Mumbai expressway corridor",
        "Delhi–Jaipur–Ahmedabad corridor",
    ),
    (
        "outdoor-advertising-rewari-complete-guide",
        "The [NH-48 Entry Point](/locality/nh-48-entry-point) is Rewari's single most valuable outdoor advertising location. Every vehicle traveling between Delhi (approximately 80 km north) and Rajasthan enters Rewari at this junction — recording an estimated 20,000 to 35,000 daily vehicle impressions.",
        "The [NH-48 Entry Point](/locality/nh-48-entry-point) is Rewari's single most valuable outdoor advertising location. Every vehicle traveling between Delhi (approximately 80 km north) and Rajasthan enters Rewari at this junction — recording an estimated 20,000 to 35,000 daily vehicle impressions. Traffic peaks sharply between 7 and 10 AM (outbound: Rewari commuters heading to Gurugram 60 km away and Delhi 80 km away, plus HPCL refinery workers commuting toward Bawal) and again between 5 and 8 PM on the return.",
    ),
    (
        "outdoor-advertising-rewari-complete-guide",
        "The bus stand handles 10,000+ daily passengers on routes to Delhi, Gurugram, Bhiwani, Jaipur, and local services.",
        "The bus stand handles 10,000–15,000 daily passengers on HRTC routes to Delhi, Gurugram, Bhiwani, Narnaul, Bawal, and local intra-district services.",
    ),
    (
        "outdoor-advertising-rewari-complete-guide",
        "Whether you are planning your first **outdoor advertising campaign in Rewari** or expanding a regional brand push into Haryana's NH-48 belt",
        "Rewari's economic base spans the auto components and engineering goods industry along the Dharuhera-Rewari corridor, HPCL's refinery at Bawal, wheat and mustard belt agriculture, and a large daily commuter population working in Gurugram and Delhi. Whether you are planning your first **outdoor advertising campaign in Rewari** or expanding a regional brand push into Haryana's NH-48 belt",
    ),

    # POST 2
    (
        "best-hoarding-locations-rewari-2025",
        "No location in Rewari matches the [NH-48 Entry Point](/locality/nh-48-entry-point) for intercity reach. Every vehicle traveling between Delhi and Rajasthan enters Rewari at this junction — an estimated 20,000 to 35,000 vehicles per day, a mix of private cars, commercial trucks, intercity buses, and two-wheelers. This is the only single OOH placement in Rewari that simultaneously reaches local residents and a continuously refreshed traveling audience from across North India.",
        "No location in Rewari matches the [NH-48 Entry Point](/locality/nh-48-entry-point) for intercity reach. Every vehicle traveling on the Delhi–Jaipur–Ahmedabad corridor passes this junction — an estimated 20,000 to 35,000 vehicles per day: private cars with NCR-connected Rewari residents, HPCL refinery workers commuting toward Bawal, auto components industry staff from the Dharuhera corridor, and long-haul freight. Traffic peaks sharply between 7 and 10 AM (outbound) and 5 and 8 PM (return). This is the only single OOH placement in Rewari that simultaneously reaches local residents and a continuously refreshed intercity audience.",
    ),
    (
        "best-hoarding-locations-rewari-2025",
        "[Delhi Road](/locality/delhi-road) is Rewari's highest-volume commuter artery — the primary route for daily NCR commuters, business travelers, and private vehicle owners traveling between Rewari and the national capital. The audience profile skews aspirational: working professionals, car owners, and families with above-average household income. This makes Delhi Road Rewari's strongest location for real estate, automotive, telecom, and premium FMCG brands.",
        "[Delhi Road](/locality/delhi-road) is Rewari's highest-volume commuter artery — the direct route toward Gurugram (60 km) and Delhi (110 km). Peak outbound flow runs 7 to 10 AM as Rewari's salaried professionals head to NCR workplaces; the evening return peaks 5 to 8 PM. The audience profile skews aspirational: working professionals with NCR incomes who live in Rewari, car owners, and middle-to-upper-income families. This makes Delhi Road Rewari's strongest location for real estate, automotive, telecom, and premium FMCG brands targeting the NCR commuter demographic.",
    ),
    (
        "best-hoarding-locations-rewari-2025",
        "The [Rewari Bus Stand](/locality/rewari-bus-stand) handles 10,000+ daily passengers on routes to Delhi, Gurugram, Bhiwani, Jaipur, and local services.",
        "The [Rewari Bus Stand](/locality/rewari-bus-stand) (HRTC) handles 10,000–15,000 daily passengers on routes to Delhi, Gurugram, Bhiwani, Narnaul, Bawal, and local intra-district services.",
    ),
    (
        "best-hoarding-locations-rewari-2025",
        "Rewari Railway Station is a junction station on the Delhi–Jaipur and Delhi–Bhiwani routes, handling 20,000+ passengers per day. Platform hoardings, concourse display panels, and exit-gate boards reach a captive waiting audience that spends 5 to 45 minutes at the station. The demographic spans students, daily NCR commuters, and rural travelers — a broad, mixed audience with strong 18 to 45 age segment representation.",
        "Rewari Junction is a major Haryana rail interchange on the Delhi–Alwar, Delhi–Bhatinda and Rewari–Rohtak routes. Platform hoardings, concourse display panels, and exit-gate boards reach a captive waiting audience with dwell times of 5 to 45 minutes. The demographic spans daily NCR commuters, students from Rewari's colleges, HPCL refinery workers heading toward Bawal, agri traders, and rural visitors from across the district — a genuinely district-wide audience at a single placement.",
    ),

    # POST 3
    (
        "unipole-vs-gantry-rewari",
        "On NH-48, vehicles travel at 70 to 90 km/h. A driver needs to register a brand from 400 to 600 metres away — before they can react, change lane, or look elsewhere.",
        "On NH-48, vehicles travel at 70 to 90 km/h. A driver needs to register a brand from 400 to 600 metres away — before they can react, change lane, or look elsewhere. This is especially valuable during the morning peak (7–10 AM) when thousands of Rewari commuters head to Gurugram (60 km) and Delhi (110 km), and the evening return peak (5–8 PM) — the two highest-density windows on the NH-48 corridor.",
    ),
    (
        "unipole-vs-gantry-rewari",
        "A prime NH-48 unipole delivers more daily impressions from a single placement than almost any city-centre format combination in Rewari.",
        "A prime NH-48 unipole delivers more daily impressions from a single placement than almost any city-centre format combination in Rewari — reaching Gurugram-bound commuters, HPCL refinery workers heading toward Bawal, auto components industry staff from the Dharuhera corridor, and long-haul freight on the Delhi–Jaipur–Ahmedabad route.",
    ),

    # POST 4
    (
        "e-rickshaw-advertising-rewari",
        "connecting specific residential colonies to the bus stand, railway station, and main market areas.",
        "connecting specific residential colonies to Rewari Bus Stand (HRTC), Rewari Junction (railway station), and the main market areas.",
    ),
    (
        "e-rickshaw-advertising-rewari",
        "**Jat College Road residential corridor** — routes connecting residential areas along Jat College Road to central Rewari — see significant e-rickshaw activity, particularly from students and working adults commuting daily. Education brands and coaching institutes find this corridor particularly effective.",
        "**Jat College Road residential corridor** — routes connecting residential areas along Jat College Road and the engineering college campuses to central Rewari — see significant e-rickshaw activity from students, faculty and working adults commuting daily. Education brands, engineering coaching institutes and youth consumer brands find this corridor particularly effective, especially during the March–June admission season.",
    ),

    # POST 5
    (
        "nh-48-corridor-ooh-advertising",
        "intercity Delhi–Jaipur travelers",
        "intercity Delhi–Jaipur–Ahmedabad travelers",
    ),
    (
        "nh-48-corridor-ooh-advertising",
        "between Delhi and Jaipur is one of India's busiest national highway sections",
        "between Delhi and Ahmedabad is one of India's busiest national highway sections",
    ),
    (
        "nh-48-corridor-ooh-advertising",
        "Daily vehicle counts on this corridor are substantial: intercity traffic between Delhi and Rajasthan uses this route continuously, Rewari–Gurugram commuters travel it daily, and commercial freight between Haryana's agri-economy and the Rajasthan market moves through without stopping. An **NH-48 hoarding** on this corridor does not just reach Rewari — it reaches every vehicle traversing the full Delhi–Jaipur route.",
        "Daily vehicle counts on this corridor are substantial: intercity traffic on the Delhi–Jaipur–Ahmedabad route moves continuously, Rewari commuters travel to Gurugram (60 km) and Delhi (80 km) in two clear daily peaks — 7 to 10 AM outbound and 5 to 8 PM return — HPCL refinery workers commute toward Bawal, and auto components industry staff travel the Dharuhera-Rewari corridor. Commercial freight between Haryana and Rajasthan rounds out a genuinely mixed traffic stream. An **NH-48 hoarding** on this corridor does not just reach Rewari — it reaches every vehicle traversing the full Delhi–Ahmedabad route.",
    ),
    (
        "nh-48-corridor-ooh-advertising",
        "Rewari on the eastern end has a 1.5 lakh resident consumer base and a thriving agricultural and trading economy.",
        "Rewari on the eastern end has a 1.5 lakh city population and a 9 lakh district catchment — with a thriving wheat and mustard belt agricultural economy, auto components manufacturing industry, and a large daily commuter population working in Gurugram and Delhi.",
    ),
    (
        "nh-48-corridor-ooh-advertising",
        "The stretch of NH-48 passing the [Rewari Industrial Area](/locality/rewari-industrial-area) and bypass corridor is particularly valuable for B2B brands, logistics companies, and industrial input brands. The audience includes commercial vehicle operators, industrial supply chain workers, and the wholesale trading community servicing the industrial zone. Hoardings here targeting commercial decision-makers outperform city-centre formats for B2B categories by a significant margin.",
        "The stretch of NH-48 passing the [Rewari Industrial Area](/locality/rewari-industrial-area) and bypass corridor sits between two major industrial anchors: the Dharuhera industrial township to the north and IMT Bawal to the south — forming part of one of North India's most active auto components and engineering goods belts. HPCL's refinery at Bawal drives significant daily worker commute traffic through this stretch. The audience includes commercial vehicle operators, auto components manufacturing staff, industrial supply chain workers, and logistics operators on the Delhi–Jaipur freight corridor. Hoardings here targeting commercial decision-makers outperform city-centre formats for B2B categories by a significant margin.",
    ),
    (
        "nh-48-corridor-ooh-advertising",
        "The [Kosli Road](/locality/kosli-road) junction on the NH-48 corridor marks the exit from the Rewari urban catchment toward Kosli and beyond into southern Haryana and Rajasthan. This is a secondary high-value junction for brands with a broader southern Haryana or cross-border mandate — the audience here includes rural consumers from districts south of Rewari and long-distance freight operators.",
        "The [Kosli Road](/locality/kosli-road) junction marks the exit from the Rewari urban catchment toward Kosli, Jhajjar, and southern Haryana. This is a secondary high-value junction for brands with a broader Haryana district mandate — the audience includes rural consumers from Rewari's southern hinterland, wheat and mustard farmers heading to Rewari's grain market, and freight operators on the Haryana–Rajasthan agricultural corridor.",
    ),

    # POST 6
    (
        "society-gate-branding-rewari",
        "**Jat College Road residential colonies** serve a high student and young-family population, making gates in this corridor particularly effective for coaching institutes, edtech brands, nutrition products, and youth-oriented consumer goods.",
        "**Jat College Road residential colonies** serve a high student and young-family population — Jat College and the engineering colleges along this corridor draw students from across the district. Society gates here are particularly effective for coaching institutes, engineering entrance prep courses, edtech brands, nutrition products, and youth-oriented consumer goods. The March–June admission season is the highest-intent window for education-sector campaigns.",
    ),

    # POST 7
    (
        "how-to-book-hoarding-rewari",
        "Local Rewari residents → market-zone formats in Sadar Bazar or Gurudwara Chowk. Daily NCR commuters → [Delhi Road](/locality/delhi-road). Intercity highway audience → [NH-48 Entry Point](/locality/nh-48-entry-point). Residential neighbourhood → society gate or e-rickshaw formats.",
        "Local Rewari residents → market-zone formats in Sadar Bazar or Gurudwara Chowk. Daily NCR commuters (Gurugram 60 km, Delhi 80 km) → [Delhi Road](/locality/delhi-road) during 7–10 AM outbound and 5–8 PM return peaks. Intercity highway audience on the Delhi–Jaipur–Ahmedabad corridor → [NH-48 Entry Point](/locality/nh-48-entry-point). Residential neighbourhood → society gate or e-rickshaw formats. Industrial and B2B audience → Rewari Industrial Area and the Dharuhera-Rewari corridor.",
    ),

    # POST 8
    (
        "ooh-advertising-cost-rewari-2025",
        "This is the clearest value proposition for [OOH advertising in Rewari Haryana](/city/rewari): comparable audience engagement at dramatically lower cost than NCR markets. A prime unipole on NH-48 near Rewari reaches 20,000+ vehicles per day — comparable to a mid-tier location in Gurugram — but at a fraction of the Gurugram rate.",
        "This is the clearest value proposition for [OOH advertising in Rewari Haryana](/city/rewari): comparable audience engagement at dramatically lower cost than NCR markets. A prime unipole on NH-48 near Rewari reaches 20,000+ vehicles per day on the Delhi–Jaipur–Ahmedabad corridor — comparable to a mid-tier location in Gurugram — but at a fraction of the Gurugram rate. And unlike pure commuter-corridor markets, Rewari's audience includes a distinct local consumer base: HPCL refinery workers, auto components industry staff, wheat belt farmers, and engineering college students — demographics not accessible from NCR highway sites.",
    ),
    (
        "ooh-advertising-cost-rewari-2025",
        "For brands expanding from NCR into Tier 2 Haryana, or building their first district-level OOH presence in Haryana, Rewari's pricing structure makes it an accessible entry point with measurable, comparable audience reach.",
        "For brands expanding from NCR into Tier 2 Haryana, or building their first district-level OOH presence in the Rewari–Dharuhera–Bawal belt, Rewari's pricing structure makes it an accessible entry point with measurable, comparable audience reach. Rewari also outperforms the adjacent OOH markets of Dharuhera, Bawal, and Narnaul on audience volume and format variety — making it the natural anchor for any multi-city Haryana corridor campaign.",
    ),
    (
        "ooh-advertising-cost-rewari-2025",
        "For high-traffic evening locations (junctions near Gurudwara Chowk, bus stand approach), illumination is not optional if you need to capture the evening commuter peak between 6 and 9 PM.",
        "For high-traffic evening locations (junctions near Gurudwara Chowk, Delhi Road, and the bus stand approach), illumination is not optional if you need to capture the evening commuter peak. On Delhi Road and NH-48, the 5–8 PM return window is when Rewari's NCR-commuter demographic is heaviest — and an unlit panel is effectively invisible after sunset.",
    ),
]

# Fetch all post content once
print("\nFetching current post content for patching...")
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/rh_blog",
    headers=HEADERS,
    params={"select": "id,slug,content", "limit": "20"},
)
r.raise_for_status()
db_posts = {row["slug"]: row["content"] for row in r.json()}
print(f"Fetched {len(db_posts)} posts from DB")

# Apply patches in-memory, then PATCH each post once
patched: dict[str, str] = {}
patch_counts: dict[str, int] = {}

for slug, old, new in PATCHES:
    if slug not in db_posts:
        print(f"  WARN  {slug}  not in DB — skip patch")
        continue
    current = patched.get(slug, db_posts[slug])
    if old in current:
        patched[slug] = current.replace(old, new, 1)
        patch_counts[slug] = patch_counts.get(slug, 0) + 1
    else:
        print(f"  MISS  {slug}  — string not found (already patched or content mismatch)")

print(f"\nApplying {len(patched)} patched posts to DB...")
p_ok = p_err = 0
for slug, new_content in patched.items():
    r2 = requests.patch(
        f"{SUPABASE_URL}/rest/v1/rh_blog",
        headers=HEADERS,
        params={"slug": f"eq.{slug}"},
        json={"content": new_content},
    )
    if r2.status_code in (200, 201, 204):
        print(f"  OK    {slug[:55]:<57}  ({patch_counts[slug]} replacements)")
        p_ok += 1
    else:
        print(f"  ERR   {slug}  -> {r2.status_code}: {r2.text[:100]}")
        p_err += 1

print(f"\nPatched: {p_ok}  Errors: {p_err}")

# ── Final verification ────────────────────────────────────────────────────────
print("\n--- Final DB state ---")
r3 = requests.get(
    f"{SUPABASE_URL}/rest/v1/rh_blog",
    headers=HEADERS,
    params={"select": "slug,title,is_published,published_at", "order": "published_at.asc"},
)
rows = r3.json()
print(f"{'Slug':<50}  {'Published':<5}  {'Date'}")
print("-" * 80)
for row in rows:
    pub  = "YES" if row["is_published"] else "NO"
    date = (row["published_at"] or "")[:10]
    print(f"  {row['slug']:<48}  {pub:<5}  {date}")
print(f"\nTotal posts: {len(rows)}")
print("\nSTEP 7 COMPLETE")
