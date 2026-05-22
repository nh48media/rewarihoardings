"""
STEP 2b — Fix slug/locality issues from the bulk insert:
  1. Slug hyphens broken for railway-station entries (rewarirailwaystation → rewari-railway-station)
  2. Locality stored as slug-string for slides 2-8 ("rewari-railway-station") and slide 10 ("nh-48")
  3. Dharuhera slides have empty locality — derive from title
"""
import json, os, re, requests
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

def patch_slug(old_slug: str, updates: dict):
    r = requests.patch(
        f"{SUPABASE_URL}/rest/v1/listings",
        headers=HEADERS,
        params={"slug": f"eq.{old_slug}"},
        json=updates,
    )
    if r.status_code not in (200, 201, 204):
        print(f"  ERROR {r.status_code}: {r.text[:200]}")
        return False
    return True

fixes = [
    # ── Railway station: fix slug + locality display name ──
    ("railway-station-rewarirailwaystation-rewari",
     {"slug": "railway-station-rewari-railway-station-rewari",
      "locality": "Rewari Railway Station"}),

    ("railway-station-rewarirailwaystation-rewari-2",
     {"slug": "railway-station-rewari-railway-station-rewari-2",
      "locality": "Rewari Railway Station"}),

    ("railway-station-rewarirailwaystation-rewari-3",
     {"slug": "railway-station-rewari-railway-station-rewari-3",
      "locality": "Rewari Railway Station"}),

    ("railway-station-rewarirailwaystation-rewari-4",
     {"slug": "railway-station-rewari-railway-station-rewari-4",
      "locality": "Rewari Railway Station"}),

    ("railway-station-rewarirailwaystation-rewari-5",
     {"slug": "railway-station-rewari-railway-station-rewari-5",
      "locality": "Rewari Railway Station"}),

    ("railway-station-rewarirailwaystation-rewari-6",
     {"slug": "railway-station-rewari-railway-station-rewari-6",
      "locality": "Rewari Railway Station"}),

    ("railway-station-rewarirailwaystation-rewari-7",
     {"slug": "railway-station-rewari-railway-station-rewari-7",
      "locality": "Rewari Railway Station"}),

    # ── HUDA Bypass: fix locality to display name ──
    ("hoarding-nh48-rewari",
     {"locality": "NH-48 Entry Point",
      "slug": "hoarding-nh-48-entry-point-rewari"}),

    # ── Dharuhera: set locality from title location ──
    ("hoarding--dharuhera",
     {"locality": "City Center",
      "slug": "hoarding-city-center-dharuhera"}),

    ("hoarding--dharuhera-2",
     {"locality": "Bestech Flats",
      "slug": "hoarding-bestech-flats-dharuhera"}),

    ("hoarding--dharuhera-3",
     {"locality": "Sector 6 NHAI",
      "slug": "hoarding-sector-6-nhai-dharuhera"}),

    ("hoarding--dharuhera-4",
     {"locality": "Subash Chowk",
      "slug": "hoarding-subash-chowk-dharuhera"}),
]

print(f"Applying {len(fixes)} fixes...\n")
ok = err = 0
for old_slug, updates in fixes:
    success = patch_slug(old_slug, updates)
    if success:
        print(f"  OK  {old_slug:<55} -> {updates.get('slug', old_slug)}")
        ok += 1
    else:
        err += 1

print(f"\nFixed: {ok}  Errors: {err}")

# ── Update slug-map.json with corrected slugs ─────────────────────────────────
slug_map_path = Path("docs/slug-map.json")
slug_map = json.loads(slug_map_path.read_text(encoding="utf-8"))

old_to_new = {old: upd.get("slug", old) for old, upd in fixes}

# Remap by re-reading current slugs from DB
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/listings",
    headers=HEADERS,
    params={"select": "slug,notes_internal", "notes_internal": "like.Extracted from agency PPTX%"},
)
r.raise_for_status()
db_rows = r.json()

# Build slide→slug map from notes_internal (contains "slide N")
updated_map = {}
for row in db_rows:
    m = re.search(r'slide (\d+)', row["notes_internal"])
    if m:
        slide_n = m.group(1)
        if slide_n in slug_map:
            updated_map[slide_n] = {
                "slug":   row["slug"],
                "images": slug_map[slide_n]["images"],
            }

slug_map_path.write_text(json.dumps(updated_map, indent=2), encoding="utf-8")
print(f"\nUpdated slug-map.json with {len(updated_map)} entries.")

print("\nSTEP 2b COMPLETE")
