# rewarihoardings.com — Project Briefing for Claude Code

## What this project is
Rewari Hoardings is a dedicated OOH (outdoor advertising) inventory 
marketplace for Rewari, Haryana. Advertisers browse hoarding listings 
and submit enquiries — no prices shown publicly.

## Tech stack
- Next.js 14 App Router
- Supabase (existing project — same as nh48media.com)
- Tailwind CSS
- Vercel deployment
- TypeScript

## Brand
- Primary: #FFE600 (electric yellow)
- Background: #0A0A0A (deep black)
- Font: Barlow Condensed (headings/UI) + Barlow (body)
- NOT the saffron/ink palette of NH48 Media

## Supabase config
- Same project as nh48media
- New tables: listings, rh_leads, rh_settings
- New storage bucket: hoarding-photos (public)
- Phone for WhatsApp: +91 8168740234

## Key rules
- NEVER show prices publicly anywhere
- All enquiries go to form (/api/enquiry → rh_leads) + WhatsApp
- Admin panel at /admin — protected by Supabase Auth session
- ISR on listing pages (revalidate: 3600) + on-demand via /api/revalidate

## URL structure (summary)
- /listing/[slug]         — individual listing
- /city/rewari            — all Rewari listings
- /type/[slug]            — format type pages (40 types)
- /locality/[slug]        — locality pages (15 localities)
- /locality/[loc]/[type]  — locality × type matrix (90+ pages)
- /blog/[slug]            — blog
- /admin                  — protected admin panel
- /get-quote              — global quote page

## Phase 1 scope
- 15–20 listings (locations TBD)
- 50+ indexable pages at launch
- Admin panel: listings CRUD, lead inbox, photo upload, settings
- WhatsApp FAB on all public pages

## Database tables (already designed)
See schema in /docs/schema.sql

## Completed work
- Homepage layout: /docs/homepage-reference.html
- Full URL structure: /docs/url-structure.md
- OOH format taxonomy: 40 formats across 7 categories
- Admin panel spec: 5 modules (dashboard, listings, leads, photos, settings)
- Supabase schema SQL: listings + rh_leads + rh_settings + RLS policies
