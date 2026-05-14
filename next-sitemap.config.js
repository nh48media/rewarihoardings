function slugify(s) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://rewarihoardings.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
  exclude: ['/admin', '/admin/*', '/api/*'],

  additionalPaths: async () => {
    const { createClient } = require('@supabase/supabase-js')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const now = new Date().toISOString()
    const results = []

    // Static routes
    results.push(
      { loc: '/',             changefreq: 'daily',   priority: 1.0, lastmod: now },
      { loc: '/city/rewari', changefreq: 'daily',   priority: 0.9, lastmod: now },
      { loc: '/get-quote',   changefreq: 'monthly', priority: 0.8, lastmod: now },
      { loc: '/blog',        changefreq: 'weekly',  priority: 0.7, lastmod: now },
      { loc: '/about',       changefreq: 'monthly', priority: 0.5, lastmod: now },
      { loc: '/contact',     changefreq: 'monthly', priority: 0.5, lastmod: now }
    )

    // Fetch published listings + localities setting in parallel
    const [listingsRes, localityRes] = await Promise.all([
      supabase
        .from('listings')
        .select('slug, type, locality, updated_at')
        .eq('is_published', true),
      supabase
        .from('rh_settings')
        .select('value')
        .eq('key', 'rewari_localities')
        .single(),
    ])

    const listings = listingsRes.data ?? []
    const localities = Array.isArray(localityRes.data?.value)
      ? localityRes.data.value
      : []

    // /listing/[slug] — one per published listing
    for (const l of listings) {
      results.push({
        loc: `/listing/${l.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: l.updated_at ?? now,
      })
    }

    // /type/[slug] — only for types that actually have published listings
    const publishedTypes = [...new Set(listings.map(l => l.type).filter(Boolean))]
    for (const type of publishedTypes) {
      results.push({
        loc: `/type/${type}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: now,
      })
    }

    // /locality/[slug] — one per locality in settings
    for (const loc of localities) {
      results.push({
        loc: `/locality/${slugify(loc)}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: now,
      })
    }

    // /locality/[slug]/[type] — only for (locality × type) combos with real listings
    const seen = new Set()
    for (const l of listings) {
      if (!l.locality || !l.type) continue
      const key = `${slugify(l.locality)}|${l.type}`
      if (!seen.has(key)) {
        seen.add(key)
        results.push({
          loc: `/locality/${slugify(l.locality)}/${l.type}`,
          changefreq: 'weekly',
          priority: 0.6,
          lastmod: now,
        })
      }
    }

    return results
  },
}
