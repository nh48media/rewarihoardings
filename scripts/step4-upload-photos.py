"""
STEP 4 — Upload photos to Supabase Storage hoarding-photos/{slug}/cover.{ext}
Then UPDATE listings.cover_photo and listings.photos with the public CDN URL.
"""
import json, mimetypes, os, requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env.local")

SUPABASE_URL = "https://nkqanwzzvbadyzqgcmyi.supabase.co"
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or exit("ERROR: SUPABASE_SERVICE_ROLE_KEY not set in .env.local")
BUCKET       = "hoarding-photos"
CDN_BASE     = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}"

STORAGE_HDR = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
}
REST_HDR = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=representation",
}

PHOTOS_DIR = Path("public/extracted-photos")
slug_map   = json.loads(Path("docs/slug-map.json").read_text(encoding="utf-8"))

print(f"Uploading {len(slug_map)} photos...\n")
ok = skip = err = 0

for slide_str, entry in slug_map.items():
    slug   = entry["slug"]
    images = entry["images"]

    if not images:
        print(f"  SKIP  slide {slide_str:<3}  {slug}  (no image)")
        skip += 1
        continue

    # Use first image file
    img_file  = PHOTOS_DIR / images[0]
    if not img_file.exists():
        print(f"  MISS  slide {slide_str:<3}  {slug}  ({images[0]} not found)")
        err += 1
        continue

    ext       = img_file.suffix.lstrip(".")  # jpg or png
    mime      = "image/jpeg" if ext == "jpg" else "image/png"
    storage_path = f"{slug}/cover.{ext}"
    upload_url   = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}"
    public_url   = f"{CDN_BASE}/{storage_path}"

    # Upload (upsert: replace if exists)
    with open(img_file, "rb") as fh:
        r = requests.post(
            upload_url,
            headers={**STORAGE_HDR, "Content-Type": mime, "x-upsert": "true"},
            data=fh.read(),
        )

    if r.status_code not in (200, 201):
        print(f"  ERR   slide {slide_str:<3}  {slug}  upload failed {r.status_code}: {r.text[:100]}")
        err += 1
        continue

    # Update listing with cover_photo
    r2 = requests.patch(
        f"{SUPABASE_URL}/rest/v1/listings",
        headers=REST_HDR,
        params={"slug": f"eq.{slug}"},
        json={"cover_photo": public_url, "photos": [public_url]},
    )
    if r2.status_code not in (200, 201, 204):
        print(f"  ERR   slide {slide_str:<3}  {slug}  DB update failed {r2.status_code}: {r2.text[:100]}")
        err += 1
        continue

    print(f"  OK    slide {slide_str:<3}  {slug}")
    ok += 1

print(f"\nUploaded: {ok}  Skipped: {skip}  Errors: {err}")

# ── verify final state from DB ────────────────────────────────────────────────
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/listings",
    headers=REST_HDR,
    params={
        "select": "slug,cover_photo,is_published,is_featured,locality,city",
        "notes_internal": "like.Extracted from agency PPTX%",
        "order": "created_at.asc",
    },
)
r.raise_for_status()
rows = r.json()

print(f"\n--- Final DB state ({len(rows)} listings) ---")
print(f"{'Slug':<55}  {'City':<10}  {'Locality':<26}  {'Photo':>5}  {'Pub':>3}  {'Feat':>4}")
print("-" * 115)
for row in rows:
    has_photo = "YES" if row.get("cover_photo") else "NO"
    pub       = "YES" if row.get("is_published") else "NO"
    feat      = "YES" if row.get("is_featured")  else "-"
    loc       = (row.get("locality") or "")[:26]
    city      = (row.get("city") or "")[:10]
    print(f"  {row['slug']:<53}  {city:<10}  {loc:<26}  {has_photo:>5}  {pub:>3}  {feat:>4}")

print("\nSTEP 4 COMPLETE")
