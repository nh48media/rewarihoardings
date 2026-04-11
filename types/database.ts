export type ListingFormat =
  | 'unipole' | 'gantry' | 'hoarding' | 'rooftop-hoarding' | 'wall-painting'
  | 'construction-hoarding' | 'led-display' | 'led-video-wall' | 'digital-kiosk'
  | 'bus-shelter' | 'pole-kiosk' | 'traffic-booth' | 'toll-naka' | 'road-divider'
  | 'footpath-kiosk' | 'auto-rickshaw' | 'e-rickshaw' | 'bus-branding' | 'mobile-van'
  | 'tractor-branding' | 'society-gate' | 'school-college-gate' | 'market-gate'
  | 'hospital-branding' | 'petrol-pump' | 'dhaba-restaurant' | 'no-parking-board'
  | 'atm-branding' | 'pamphlet-distribution' | 'newspaper-insert' | 'newspaper-ad'
  | 'flex-banner' | 'poster' | 'railway-station' | 'cinema-advertising' | 'look-walker'
  | 'exhibition-stall' | 'water-tank'

export type ListingAvailability = 'available' | 'booked' | 'coming-soon'
export type ListingVisibility   = 'high' | 'medium' | 'low'
export type LeadSource  = 'form' | 'whatsapp' | 'direct'
export type LeadStatus  = 'new' | 'contacted' | 'negotiating' | 'closed-won' | 'closed-lost'

// ── Row types (SELECT results) — must be `type` not `interface` ──────────────
// Using `interface` breaks the `extends Record<string, unknown>` check inside
// supabase-js v2 generics, causing Schema to resolve as `never`.

export type ListingRow = {
  id:                string
  slug:              string
  title:             string
  type:              ListingFormat
  city:              string
  locality:          string
  landmark:          string | null
  address_full:      string | null
  latitude:          number | null
  longitude:         number | null
  size_width_ft:     number | null
  size_height_ft:    number | null
  facing:            string | null
  illuminated:       boolean
  illumination_type: string | null
  visibility_grade:  ListingVisibility
  traffic_count:     string | null
  audience_profile:  string | null
  structure_type:    string | null
  availability:      ListingAvailability
  is_featured:       boolean
  is_published:      boolean
  photos:            string[]
  cover_photo:       string | null
  meta_title:        string | null
  meta_description:  string | null
  notes_internal:    string | null
  created_at:        string
  updated_at:        string
}

export type RhLeadRow = {
  id:            string
  listing_id:    string | null
  listing_slug:  string | null
  listing_title: string | null
  name:          string
  phone:         string
  email:         string | null
  company:       string | null
  message:       string | null
  source:        LeadSource
  utm_source:    string | null
  utm_medium:    string | null
  utm_campaign:  string | null
  status:        LeadStatus
  admin_notes:   string | null
  ip_address:    string | null
  user_agent:    string | null
  created_at:    string
  updated_at:    string
}

export type RhSettingRow = {
  key:        string
  value:      unknown
  updated_at: string
}

// ── Database schema (supabase-js v2 format) ───────────────────────────────────

export type Database = {
  public: {
    Tables: {
      listings: {
        Row:    ListingRow
        Insert: Omit<ListingRow, 'id' | 'created_at' | 'updated_at'> &
                Partial<Pick<ListingRow, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<ListingRow, 'id'>>
        Relationships: []
      }
      rh_leads: {
        Row:    RhLeadRow
        Insert: Omit<RhLeadRow, 'id' | 'created_at' | 'updated_at'> &
                Partial<Pick<RhLeadRow, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Omit<RhLeadRow, 'id'>>
        Relationships: []
      }
      rh_settings: {
        Row:    RhSettingRow
        Insert: Omit<RhSettingRow, 'updated_at'> & Partial<Pick<RhSettingRow, 'updated_at'>>
        Update: Partial<RhSettingRow>
        Relationships: []
      }
    }
    Views:          { [_ in never]: never }
    Functions:      { [_ in never]: never }
    Enums:          { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
