# rewarihoardings.com — Admin Panel Specification

## Overview

The admin panel lives at `/admin` on the same domain (rewarihoardings.com/admin).
It is a Next.js App Router route group `(admin)` protected by `middleware.ts`.
Single admin user — Supabase email/password auth. No multi-user system in Phase 1.

**Access:** rewarihoardings.com/admin/login
**Auth:** Supabase Auth session cookie (7-day persistence)
**Protection:** `middleware.ts` runs at the edge on every `/admin/*` request,
redirects to `/admin/login` if no valid session found.

---

## File Structure

```
app/
└── admin/
    ├── layout.tsx                  Auth guard layout + sidebar
    ├── page.tsx                    Dashboard
    ├── login/
    │   └── page.tsx                Login page
    ├── listings/
    │   ├── page.tsx                Listings table
    │   ├── new/
    │   │   └── page.tsx            Add listing form
    │   └── [id]/
    │       └── edit/
    │           └── page.tsx        Edit listing form
    ├── leads/
    │   └── page.tsx                Leads inbox
    ├── photos/
    │   └── page.tsx                Photo library
    └── settings/
        └── page.tsx                Site settings
```

---

## Sidebar Navigation

Persistent on all admin pages. Desktop only (no mobile hamburger in Phase 1).

```
┌──────────────────────────┐
│  RH  Rewari Hoardings    │  links to /
│  Admin Panel             │
├──────────────────────────┤
│  Dashboard               │  /admin
│  Listings          [20]  │  badge = total listing count
│  Leads              [3]  │  badge = new (unread) lead count
│  Photos                  │  /admin/photos
│  Settings                │  /admin/settings
├──────────────────────────┤
│  View Live Site ↗        │  opens rewarihoardings.com in new tab
│  Logout                  │  clears session → /admin/login
└──────────────────────────┘
```

Active route: yellow left border + slightly darker background row.

---

## Module 1 — Dashboard `/admin`

Morning overview. No editing happens here.

### Stats Row (4 cards)
- Total listings (all)
- Leads today
- Leads this week
- Total leads all-time

### Quick Actions
- `+ Add New Listing` → /admin/listings/new
- `View All Leads` → /admin/leads

### Recent Leads Table (last 10)
Columns: Name | Phone | Listing | Source | Time | Status badge

Status badge colours:
- New → blue
- Contacted → amber
- Negotiating → purple
- Closed Won → green
- Closed Lost → red

### Listings Status Summary
- Published count
- Draft (unpublished) count
- Featured count
- Booked / unavailable count

---

## Module 2 — Listings Manager `/admin/listings`

### 2a. Listings Table

Filters: Type dropdown | Locality dropdown | Availability dropdown | Search box

Table columns:
| Column | Sortable | Notes |
|--------|----------|-------|
| Cover thumbnail | — | 48×48px, placeholder if none |
| Title | yes | Truncated at 40 chars |
| Type badge | filter | Yellow badge |
| Locality | filter | — |
| Size | — | "40 × 20 ft" |
| Availability | filter | Coloured dot + text |
| Published | — | On/off toggle, saves instantly |
| Featured | — | On/off toggle, saves instantly |
| Actions | — | Edit | Delete |

Pagination: 20 rows per page.

Bulk actions: Select rows → Publish all | Unpublish all | Delete selected (with confirmation).

---

### 2b. Add Listing `/admin/listings/new`

Single long-form page. Six sections. No multi-step wizard.

#### Section 1 — Identity
- Title* (free text)
- Slug* (auto-generated from title, editable)
  - Preview shown: rewarihoardings.com/listing/[slug]
- Format Type* (dropdown — 40 types from rh_settings.listing_types)
- City* (locked to "Rewari")
- Locality* (dropdown from rh_settings.rewari_localities)
- Landmark (free text, e.g. "Near Rewari Toll Plaza")
- Full Address (textarea)
- Latitude / Longitude (number fields — paste from Google Maps)

#### Section 2 — Physical Specs
- Width (ft)* + Height (ft)* → auto-displays sqft live
- Facing (dropdown): North | South | East | West | NH-48 Inbound | NH-48 Outbound | Both Sides
- Structure Type (dropdown): Ground-mounted | Rooftop | Bridge-mounted | Wall | Gantry span
- Illuminated (toggle)
  - If ON → Illumination Type: Frontlit | Backlit | LED | Neon
- Visibility Grade (radio): High | Medium | Low

#### Section 3 — Audience Data
- Traffic Count (text, e.g. "~25,000 vehicles/day")
- Audience Profile (textarea — editorial description shown on listing page)

#### Section 4 — Photos
- Drag & drop upload zone (or click to browse)
- Accepts: JPG, WEBP, PNG | Max 5MB each | Multiple files at once
- Upload goes DIRECTLY to Supabase Storage (browser → Storage, not via API route)
  - Path: hoarding-photos/{listing-slug}/{timestamp}-{filename}
  - Returns public CDN URL, stored in listings.photos[] array
- Uploaded photos shown as thumbnail grid
- Drag to reorder | Set as Cover (yellow badge) | Delete individual photo
- Cover photo = listings.cover_photo field

#### Section 5 — SEO
- Meta Title (pre-filled, character counter 0/60)
  - Template: "[Type] at [Locality], Rewari | [W]×[H] ft | Rewari Hoardings"
- Meta Description (pre-filled, character counter 0/160)
  - Template: "Book a [W]×[H] ft [type] at [landmark], [locality], Rewari. [traffic]. Get quote: +91 8168740234."

#### Section 6 — Status & Admin
- Availability (radio): Available | Booked | Coming Soon
- Featured (toggle) — shows in homepage featured grid
- Published (toggle) — controls public visibility via RLS
- Internal Notes (textarea — NEVER shown publicly)
  - e.g. "Owner: Ravi Sharma 98XXX. Rate: ₹18k/month. Booked till March."

#### Sticky Bottom Action Bar
- `Save as Draft` | `Save & Publish` | `Preview ↗`

On Save & Publish:
1. Sets is_published = true
2. Calls /api/revalidate to trigger ISR revalidation of:
   - /listing/[slug]
   - /city/rewari
   - /type/[type-slug]
   - /locality/[locality-slug]

---

### 2c. Edit Listing `/admin/listings/[id]/edit`

Identical to Add form, pre-populated with existing data.
Extra: `View Live Page ↗` link at top → opens public listing URL.

---

## Module 3 — Leads Manager `/admin/leads`

Sales inbox. Every form submission lands here automatically.
WhatsApp enquiries logged manually via "+ Log WhatsApp Lead" button.

### Filters
- Status tabs: All | New | Contacted | Negotiating | Closed Won | Closed Lost
- Date range picker
- Search by name or phone
- Filter by listing (dropdown)

### Table Columns
| Column | Notes |
|--------|-------|
| Name + Company | Stacked |
| Phone | Clickable tel: link |
| Listing | Which listing, or "General" |
| Source | "Form" or "WhatsApp" badge |
| Time | Relative ("2 hours ago") — hover for full timestamp |
| Status | Coloured badge, click to change |

### Lead Detail Panel (inline expand on row click)

```
Name — Company
Phone · Email

Enquired about: [Listing Title]  [View listing ↗]

Message:
[full message text]

UTM: source / medium / campaign
Received: date + time

Status:    [dropdown]
Notes:     [editable textarea]

[WhatsApp ↗]   [Save]   [Delete]
```

WhatsApp button pre-fills message:
"Hi [Name], thanks for your enquiry about [Listing] on rewarihoardings.com..."

### Status Change
Inline dropdown → saves immediately to rh_leads.status via Supabase PATCH.

### Manual Lead Entry
`+ Log WhatsApp Lead` button → small modal form:
- Name, Phone, Company, Which listing, Message/notes
- Saves to rh_leads with source = 'whatsapp'

### Export CSV
Top-right button. Downloads all leads matching current filter as CSV.
Client-side: fetch from Supabase → format as CSV → download via Blob URL.
No backend API needed.

### New Lead Badge
Sidebar shows red count badge on "Leads" = count of status = 'new' records.
Updates on every page load.

---

## Module 4 — Photo Library `/admin/photos`

Standalone view of the entire hoarding-photos Supabase Storage bucket.

### Grid View
All uploaded photos across all listings.
Each thumbnail shows: filename | which listing | file size | upload date.

### Per-Photo Actions
- Click → full size preview
- Copy URL → copies Supabase CDN URL to clipboard (useful for blog posts)
- Delete → removes from Storage + removes URL from listing's photos[] array

### Upload Zone
Drag photos here with a listing selector dropdown.
Useful for batch-uploading before creating listings.

### Storage Stats
- Total files uploaded
- Total storage used vs 1GB free tier

Note: Phase 1 can skip this module — photo management inside the listing
form covers 95% of use cases. Add when photo library grows large.

---

## Module 5 — Settings `/admin/settings`

Edits the rh_settings table. No code changes needed to update config.

### Contact Settings
- WhatsApp Number (updates wa.me links sitewide)
- Contact Email
- BCC Email for leads (currently love@nh48media.com)

### Site Copy
- Site Tagline
- Hero Heading
- Hero Sub-heading

### Listings Config
- Format Types List (editable tag list — add/remove)
- Rewari Localities (editable tag list — add/remove)
- Default Availability for new listings

### SEO & Analytics
- GA4 Measurement ID
- Google Search Console verification meta tag value

### On-Demand ISR
- `Revalidate All Pages` button
  → POST /api/revalidate with REVALIDATE_SECRET
  → Forces Next.js to regenerate all cached pages
- `Revalidate /city/rewari` (targeted)

---

## Login Page `/admin/login`

- Black background
- Centered RH yellow logo mark
- Email + Password fields
- Login button
- On success → redirect to /admin
- On failure → inline error message
- No "forgot password" UI — use Supabase Dashboard directly

---

## Key Technical Decisions

### Auth (middleware.ts)
```typescript
// middleware.ts — runs at edge on every /admin/* request
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    if (req.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
  return res
}

export const config = {
  matcher: ['/admin/:path*']
}
```

### Photo Upload (direct to Supabase Storage)
Do NOT route photo uploads through Next.js API routes.
Vercel has a 4.5MB body limit on serverless functions.
Use the supabase-js client directly from the browser with an authenticated session.

```typescript
const { data, error } = await supabase.storage
  .from('hoarding-photos')
  .upload(`${slug}/${Date.now()}-${file.name}`, file, {
    cacheControl: '3600',
    upsert: false
  })
const publicUrl = supabase.storage
  .from('hoarding-photos')
  .getPublicUrl(data.path).data.publicUrl
```

### On-Demand ISR (api/revalidate/route.ts)
```typescript
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { secret, slug, type, locality } = await req.json()
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  if (slug)     revalidatePath(`/listing/${slug}`)
  if (type)     revalidatePath(`/type/${type}`)
  if (locality) revalidatePath(`/locality/${locality}`)
  revalidatePath('/city/rewari')
  revalidatePath('/')
  return NextResponse.json({ revalidated: true })
}
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=           # from Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # from Supabase Dashboard > Settings > API
SUPABASE_SERVICE_ROLE_KEY=          # for server-side operations
REVALIDATE_SECRET=                  # random string, e.g. generate with: openssl rand -hex 32
```

---

## Phase 1 Build Order

1. middleware.ts + /admin/login page (auth gate)
2. Sidebar layout (admin)/layout.tsx
3. Dashboard /admin (stats + recent leads)
4. Add Listing form /admin/listings/new (most important)
5. Listings table /admin/listings
6. Edit Listing /admin/listings/[id]/edit
7. Leads inbox /admin/leads
8. Settings /admin/settings
9. Photo library /admin/photos (optional Phase 1)
