import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type LeadInsert = Database['public']['Tables']['rh_leads']['Insert']

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    name?: string
    phone?: string
    email?: string
    company?: string
    message?: string
    listing_id?: string
    listing_slug?: string
    listing_title?: string
  }

  const { name, phone, email, company, message, listing_id, listing_slug, listing_title } = body

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
  }

  const supabase = await createClient()

  const payload: LeadInsert = {
    name,
    phone,
    email:          email          ?? null,
    company:        company        ?? null,
    message:        message        ?? null,
    listing_id:     listing_id     ?? null,
    listing_slug:   listing_slug   ?? null,
    listing_title:  listing_title  ?? null,
    source:         'form',
    status:         'new',
    admin_notes:    null,
    utm_source:     req.nextUrl.searchParams.get('utm_source')   ?? null,
    utm_medium:     req.nextUrl.searchParams.get('utm_medium')   ?? null,
    utm_campaign:   req.nextUrl.searchParams.get('utm_campaign') ?? null,
    ip_address:     req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? null,
    user_agent:     req.headers.get('user-agent') ?? null,
  }

  const { error } = await supabase.from('rh_leads').insert(payload)

  if (error) {
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
