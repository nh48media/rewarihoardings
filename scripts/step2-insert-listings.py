"""
STEP 2+3+5 — Clean, slug, meta-generate, and insert all 23 listings.
Step 4 (photo upload) runs separately after this.
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

# ── load extracted JSON ────────────────────────────────────────────────────────
raw = json.loads(Path("docs/extracted-listings.json").read_text(encoding="utf-8"))
extracted = raw["listings"]   # 23 listings (section dividers already excluded)

# ── user corrections keyed by slide number ─────────────────────────────────────
CORRECTIONS = {
    9:  {"locality": "Mahendergarh Road"},
    11: {"locality": "Pataudi Road"},
    12: {"locality": "Rampura Road", "latitude": 28.191757, "longitude": 76.60584},
    13: {"locality": "Rewari Industrial Area"},
    14: {"locality": "Bitwana Road Crossing"},
    15: {"locality": "Jhajjar Road"},
    16: {"locality": "Pallawas Chowk"},
    17: {"locality": "Pilot Chowk"},
    18: {"locality": "Pilot Chowk"},
    19: {"locality": "Kulana Road"},
    20: {"locality": "Pallawas Chowk"},
    # city corrections
    22: {"city": "Dharuhera"},
    23: {"city": "Dharuhera"},
    24: {"city": "Dharuhera"},
    25: {"city": "Dharuhera"},
}

# Slides with is_featured = True
FEATURED_SLIDES = {2, 3, 4, 5, 6, 7, 8}

# Slides with no NL marker → illuminated: false (safer default per user)
NO_NL_SLIDES = {10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}

# ── type display labels ────────────────────────────────────────────────────────
TYPE_LABELS = {
    "hoarding":         "Hoarding",
    "railway-station":  "Railway Station Panel",
    "unipole":          "Unipole",
    "gantry":           "Gantry",
    "led-display":      "LED Display",
}

# ── slug generation ────────────────────────────────────────────────────────────
_used_slugs: set[str] = set()

def make_slug(listing_type: str, locality: str, city: str) -> str:
    city_suffix = city.lower().replace(" ", "-")
    loc_part    = re.sub(r"[^a-z0-9\s]", "", locality.lower())
    loc_part    = re.sub(r"\s+", "-", loc_part.strip())
    base        = f"{listing_type}-{loc_part}-{city_suffix}"[:60]
    slug        = base
    n = 2
    while slug in _used_slugs:
        slug = f"{base[:57]}-{n}"
        n += 1
    _used_slugs.add(slug)
    return slug

# ── meta generation ────────────────────────────────────────────────────────────
def make_meta(row: dict) -> tuple[str, str]:
    type_label = TYPE_LABELS.get(row["type"], row["type"].title())
    w, h       = int(row["size_width_ft"]), int(row["size_height_ft"])
    locality   = row["locality"]
    city       = row["city"]

    illu_note = ""
    if row["illuminated"] and row.get("illumination_type"):
        illu_note = f" {row['illumination_type'].title()}."

    meta_title = f"{type_label} at {locality}, {city} | {w}×{h} ft | Rewari Hoardings"
    meta_desc  = (
        f"Book a {w}×{h} ft {type_label.lower()} at {locality}, {city}.{illu_note}"
        f" Get quote: +91 8168740234."
    )
    return meta_title[:110], meta_desc[:160]

# ── build rows ─────────────────────────────────────────────────────────────────
rows_to_insert = []

for item in extracted:
    slide = item["_slide"]
    row   = {
        "title":             item["title"],
        "type":              item["type"],
        "city":              item["city"],
        "locality":          item["locality"],
        "landmark":          item.get("landmark") or "",
        "latitude":          None,
        "longitude":         None,
        "size_width_ft":     item["size_width_ft"],
        "size_height_ft":    item["size_height_ft"],
        "facing":            "",
        "illuminated":       item["illuminated"],
        "illumination_type": item["illumination_type"] or None,
        "structure_type":    None,
        "traffic_count":     None,
        "availability":      "available",
        "is_featured":       slide in FEATURED_SLIDES,
        "is_published":      True,
        "cover_photo":       None,
        "photos":            [],
        "notes_internal":    item["notes_internal"],
        "_slide":            slide,
        "_images":           item.get("_images", []),
    }

    # Apply user corrections
    if slide in CORRECTIONS:
        for k, v in CORRECTIONS[slide].items():
            row[k] = v

    # Illumination: slides with no NL → false/null
    if slide in NO_NL_SLIDES:
        row["illuminated"]       = False
        row["illumination_type"] = None

    # Rebuild clean title from raw text
    loc   = row["locality"]
    city  = row["city"]
    raw_t = item.get("_raw_title", item["title"])
    clean_t = re.sub(r'\b(REWARI|DHARUHERA)\s*[-–]\s*', '', raw_t, flags=re.I)
    clean_t = re.sub(r'\s*\d+\s*[xX]\s*\d+\s*(NL)?\s*$', '', clean_t, flags=re.I).strip()
    clean_t = clean_t.title()
    if row.get("landmark"):
        row["title"] = f"{clean_t} — {row['landmark']}, {city}"
    else:
        row["title"] = f"{clean_t} — {loc}, {city}"

    # Generate slug (Step 3)
    row["slug"] = make_slug(row["type"], row["locality"], row["city"])

    # Generate meta (Step 5)
    row["meta_title"], row["meta_description"] = make_meta(row)

    rows_to_insert.append(row)

# ── check for existing slugs in DB (avoid conflicts) ──────────────────────────
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/listings",
    headers=HEADERS,
    params={"select": "slug"},
)
r.raise_for_status()
existing_slugs = {row["slug"] for row in r.json()}
print(f"Existing listings in DB: {len(existing_slugs)}")

conflicts = [row for row in rows_to_insert if row["slug"] in existing_slugs]
if conflicts:
    print(f"WARNING: {len(conflicts)} slug conflicts found — they will be SKIPPED:")
    for c in conflicts:
        print(f"  - {c['slug']}")

to_insert = [row for row in rows_to_insert if row["slug"] not in existing_slugs]
print(f"Listings to insert: {len(to_insert)}")

# ── print preview ──────────────────────────────────────────────────────────────
print("\n--- PREVIEW (all rows) ---")
print(f"{'Sl':>3}  {'Slug':<55}  {'Type':<18}  {'Locality':<26}  {'City':<10}  {'Size':<8}  {'NL':>3}  {'Feat':>4}")
print("-" * 145)
for row in rows_to_insert:
    nl    = "NL"  if not row["illuminated"] else "Lit"
    feat  = "YES" if row["is_featured"]      else "-"
    print(f"{row['_slide']:>3}  {row['slug']:<55}  {row['type']:<18}  {row['locality']:<26}  {row['city']:<10}  {row['size_width_ft']}x{row['size_height_ft']:<5}  {nl:>3}  {feat:>4}")

# ── strip internal fields and insert ──────────────────────────────────────────
DB_FIELDS = [
    "slug","title","type","city","locality","landmark",
    "latitude","longitude","size_width_ft","size_height_ft",
    "facing","illuminated","illumination_type","structure_type",
    "traffic_count","availability","is_featured","is_published",
    "cover_photo","photos","meta_title","meta_description","notes_internal",
]

def clean(row):
    d = {k: row[k] for k in DB_FIELDS if k in row}
    # Remove None-valued optional fields to let DB defaults apply
    return {k: v for k, v in d.items() if v is not None or k in ("cover_photo","latitude","longitude","illumination_type")}

if to_insert:
    payload = [clean(r) for r in to_insert]
    r2 = requests.post(
        f"{SUPABASE_URL}/rest/v1/listings",
        headers=HEADERS,
        json=payload,
    )
    if r2.status_code not in (200, 201):
        print(f"\nERROR {r2.status_code}: {r2.text[:500]}")
        raise SystemExit(1)
    inserted = r2.json()
    print(f"\nInserted {len(inserted)} rows successfully.")
    for row in inserted:
        print(f"  {row['slug']}")
else:
    print("\nNothing new to insert.")

# Save slug map for photo upload step
slug_map = {row["_slide"]: {"slug": row["slug"], "images": row["_images"]} for row in rows_to_insert}
Path("docs/slug-map.json").write_text(json.dumps(slug_map, indent=2), encoding="utf-8")
print(f"\nSlug map saved to docs/slug-map.json for Step 4.")
print("\nSTEP 2+3+5 COMPLETE")
