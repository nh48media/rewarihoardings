-- ============================================================
--  rewarihoardings.com — Supabase Schema
--  Project: Same Supabase project as nh48media.com
--  Run this in Supabase Dashboard > SQL Editor
-- ============================================================


-- ─────────────────────────────────────────
--  TABLE: listings
-- ─────────────────────────────────────────
create table public.listings (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  type              text not null,
  city              text not null default 'Rewari',
  locality          text not null,
  landmark          text,
  address_full      text,
  latitude          numeric(9,6),
  longitude         numeric(9,6),
  size_width_ft     numeric(5,1),
  size_height_ft    numeric(5,1),
  facing            text,
  illuminated       boolean default false,
  illumination_type text,
  visibility_grade  text default 'high',
  traffic_count     text,
  audience_profile  text,
  structure_type    text,
  availability      text default 'available',
  is_featured       boolean default false,
  is_published      boolean default false,
  photos            text[],
  cover_photo       text,
  meta_title        text,
  meta_description  text,
  notes_internal    text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Constraints
alter table public.listings
  add constraint listings_type_check
    check (type in (
      'unipole','gantry','hoarding','rooftop-hoarding','wall-painting',
      'construction-hoarding','led-display','led-video-wall','digital-kiosk',
      'bus-shelter','pole-kiosk','traffic-booth','toll-naka','road-divider',
      'footpath-kiosk','auto-rickshaw','e-rickshaw','bus-branding','mobile-van',
      'tractor-branding','society-gate','school-college-gate','market-gate',
      'hospital-branding','petrol-pump','dhaba-restaurant','no-parking-board',
      'atm-branding','pamphlet-distribution','newspaper-insert','newspaper-ad',
      'flex-banner','poster','railway-station','cinema-advertising','look-walker',
      'exhibition-stall','water-tank'
    ));

alter table public.listings
  add constraint listings_availability_check
    check (availability in ('available','booked','coming-soon'));

alter table public.listings
  add constraint listings_visibility_check
    check (visibility_grade in ('high','medium','low'));

-- Indexes
create index listings_slug_idx        on public.listings(slug);
create index listings_type_idx        on public.listings(type);
create index listings_locality_idx    on public.listings(locality);
create index listings_availability_idx on public.listings(availability);
create index listings_published_idx   on public.listings(is_published);
create index listings_featured_idx    on public.listings(is_featured);


-- ─────────────────────────────────────────
--  TABLE: rh_leads
-- ─────────────────────────────────────────
create table public.rh_leads (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid references public.listings(id) on delete set null,
  listing_slug    text,
  listing_title   text,
  name            text not null,
  phone           text not null,
  email           text,
  company         text,
  message         text,
  source          text default 'form',
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  status          text default 'new',
  admin_notes     text,
  ip_address      text,
  user_agent      text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Constraints
alter table public.rh_leads
  add constraint rh_leads_source_check
    check (source in ('form','whatsapp','direct'));

alter table public.rh_leads
  add constraint rh_leads_status_check
    check (status in ('new','contacted','negotiating','closed-won','closed-lost'));

-- Indexes
create index rh_leads_status_idx     on public.rh_leads(status);
create index rh_leads_created_at_idx on public.rh_leads(created_at desc);
create index rh_leads_listing_id_idx on public.rh_leads(listing_id);
create index rh_leads_phone_idx      on public.rh_leads(phone);


-- ─────────────────────────────────────────
--  TABLE: rh_settings
-- ─────────────────────────────────────────
create table public.rh_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz default now()
);

-- Seed default settings
insert into public.rh_settings (key, value) values
  ('contact_whatsapp',    '"918168740234"'),
  ('contact_email',       '"info@rewarihoardings.com"'),
  ('enquiry_email_bcc',   '"love@nh48media.com"'),
  ('site_tagline',        '"Rewari''s #1 Hoarding Inventory Marketplace"'),
  ('homepage_hero_text',  '"Find the Perfect Hoarding in Rewari"'),
  ('ga4_measurement_id',  '""'),
  ('listing_types', '["unipole","gantry","hoarding","rooftop-hoarding","wall-painting","construction-hoarding","led-display","led-video-wall","digital-kiosk","bus-shelter","pole-kiosk","traffic-booth","toll-naka","road-divider","footpath-kiosk","auto-rickshaw","e-rickshaw","bus-branding","mobile-van","tractor-branding","society-gate","school-college-gate","market-gate","hospital-branding","petrol-pump","dhaba-restaurant","no-parking-board","atm-branding","pamphlet-distribution","newspaper-insert","newspaper-ad","flex-banner","poster","railway-station","cinema-advertising","look-walker","exhibition-stall","water-tank"]'),
  ('rewari_localities',   '["NH-48 Entry Point","Delhi Road","Sadar Bazar","Rewari Bus Stand","Rewari Railway Station","Subhash Nagar","Model Town","Gurudwara Chowk","New Grain Market","Majra Chowk","Jat College Road","Circular Road","Dharan Road","Rewari Industrial Area","Kosli Road"]');


-- ─────────────────────────────────────────
--  AUTO-UPDATE updated_at TRIGGER
-- ─────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.update_updated_at();

create trigger rh_leads_updated_at
  before update on public.rh_leads
  for each row execute function public.update_updated_at();

create trigger rh_settings_updated_at
  before update on public.rh_settings
  for each row execute function public.update_updated_at();


-- ─────────────────────────────────────────
--  ROW LEVEL SECURITY
-- ─────────────────────────────────────────
alter table public.listings   enable row level security;
alter table public.rh_leads   enable row level security;
alter table public.rh_settings enable row level security;

-- listings: public can read published only
create policy "Public read published listings"
  on public.listings for select
  using (is_published = true);

-- listings: authenticated (admin) full access
create policy "Admin full access listings"
  on public.listings for all
  using (auth.role() = 'authenticated');

-- rh_leads: public can insert (enquiry form)
create policy "Public insert leads"
  on public.rh_leads for insert
  with check (true);

-- rh_leads: authenticated (admin) full access
create policy "Admin full access leads"
  on public.rh_leads for all
  using (auth.role() = 'authenticated');

-- rh_settings: public can read
create policy "Public read settings"
  on public.rh_settings for select
  using (true);

-- rh_settings: authenticated (admin) full access
create policy "Admin full access settings"
  on public.rh_settings for all
  using (auth.role() = 'authenticated');


-- ─────────────────────────────────────────
--  STORAGE BUCKET: hoarding-photos
-- ─────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hoarding-photos',
  'hoarding-photos',
  true,
  5242880,
  array['image/jpeg','image/webp','image/png']
)
on conflict (id) do nothing;

-- Storage: public read
create policy "Public read hoarding photos"
  on storage.objects for select
  using (bucket_id = 'hoarding-photos');

-- Storage: authenticated upload
create policy "Admin upload hoarding photos"
  on storage.objects for insert
  with check (
    bucket_id = 'hoarding-photos'
    and auth.role() = 'authenticated'
  );

-- Storage: authenticated delete
create policy "Admin delete hoarding photos"
  on storage.objects for delete
  using (
    bucket_id = 'hoarding-photos'
    and auth.role() = 'authenticated'
  );


-- ─────────────────────────────────────────
--  SAMPLE LISTINGS (Phase 1 placeholders)
--  Replace with real data once locations confirmed
-- ─────────────────────────────────────────
insert into public.listings (
  slug, title, type, city, locality, landmark,
  size_width_ft, size_height_ft, facing,
  illuminated, illumination_type, visibility_grade,
  traffic_count, structure_type, availability,
  is_featured, is_published,
  meta_title, meta_description
) values
(
  'unipole-nh48-entry-rewari',
  'Premium Unipole — NH-48 Entry Point, Rewari',
  'unipole', 'Rewari', 'NH-48 Entry Point', 'Near Rewari Toll Plaza',
  40, 20, 'NH-48 Inbound',
  true, 'Frontlit', 'high',
  '~25,000 vehicles/day', 'Ground-mounted', 'available',
  true, true,
  'Unipole at NH-48 Entry, Rewari | 40×20 ft | Rewari Hoardings',
  'Book a 40×20 ft frontlit unipole at NH-48 entry point, Rewari. ~25,000 vehicles/day. Get quote: +91 8168740234.'
),
(
  'gantry-delhi-road-rewari',
  'Road-Spanning Gantry — Delhi Road Crossing, Rewari',
  'gantry', 'Rewari', 'Delhi Road', 'Delhi Road Main Crossing',
  60, 15, 'Both Sides',
  true, 'Backlit', 'high',
  '~20,000 vehicles/day', 'Gantry span', 'available',
  true, true,
  'Gantry at Delhi Road, Rewari | 60×15 ft | Rewari Hoardings',
  'Book a 60×15 ft backlit gantry at Delhi Road main crossing, Rewari. Both sides visibility. Get quote: +91 8168740234.'
),
(
  'led-display-rewari-bus-stand',
  'LED Display — Rewari Bus Stand',
  'led-display', 'Rewari', 'Rewari Bus Stand', 'Rewari Bus Stand Main Gate',
  20, 10, 'South',
  true, 'LED', 'high',
  '~15,000 footfall/day', 'Ground-mounted', 'coming-soon',
  false, true,
  'LED Display near Rewari Bus Stand | 20×10 ft | Rewari Hoardings',
  'Book a 20×10 ft LED display panel near Rewari Bus Stand. High footfall location. Get quote: +91 8168740234.'
);
