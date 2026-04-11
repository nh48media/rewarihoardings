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

  return NextResponse.json({ revalidated: true, timestamp: Date.now() })
}
