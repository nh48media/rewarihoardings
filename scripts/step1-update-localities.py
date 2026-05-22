"""
STEP 1 — Append 9 new localities to rh_settings 'rewari_localities'
"""
import json, requests

SUPABASE_URL = "https://nkqanwzzvbadyzqgcmyi.supabase.co"
SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rcWFud3p6dmJhZHl6cWdjbXlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTgzMTIxOCwiZXhwIjoyMDkxNDA3MjE4fQ.Ns-yges6pfgqBXQFPdomgqC5G8GzzcWHPhxucxYQnIU"

HEADERS = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=representation",
}

NEW_LOCALITIES = [
    "Pataudi Road",
    "Rampura Road",
    "Bitwana Road Crossing",
    "Pallawas Chowk",
    "Kulana Road",
    "Mahendergarh Road",
    "Jhajjar Road",
    "Bawal Road",
    "Pilot Chowk",
]

# ── read current value ────────────────────────────────────────────────────────
r = requests.get(
    f"{SUPABASE_URL}/rest/v1/rh_settings",
    headers=HEADERS,
    params={"key": "eq.rewari_localities", "select": "key,value"},
)
r.raise_for_status()
rows = r.json()

if not rows:
    print("ERROR: rewari_localities key not found in rh_settings")
    raise SystemExit(1)

current = rows[0]["value"]   # already parsed (supabase returns jsonb as Python obj)
print(f"Current localities ({len(current)}):")
for loc in current:
    print(f"  - {loc}")

# ── merge ─────────────────────────────────────────────────────────────────────
existing_lower = {l.lower() for l in current}
to_add = [l for l in NEW_LOCALITIES if l.lower() not in existing_lower]

if not to_add:
    print("\nAll new localities already present — nothing to add.")
    raise SystemExit(0)

updated = current + to_add

# ── patch ─────────────────────────────────────────────────────────────────────
r2 = requests.patch(
    f"{SUPABASE_URL}/rest/v1/rh_settings",
    headers=HEADERS,
    params={"key": "eq.rewari_localities"},
    json={"value": updated},
)
r2.raise_for_status()

print(f"\nAdded {len(to_add)} new localities:")
for l in to_add:
    print(f"  + {l}")

print(f"\nUpdated list ({len(updated)} total):")
for loc in updated:
    print(f"  - {loc}")

print("\nSTEP 1 COMPLETE")
