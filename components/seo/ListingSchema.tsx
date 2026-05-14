const AVAIL_SCHEMA: Record<string, string> = {
  available:    'https://schema.org/InStock',
  booked:       'https://schema.org/SoldOut',
  'coming-soon': 'https://schema.org/PreOrder',
}

type Props = {
  title: string
  slug: string
  typeLabel: string
  locality: string
  description: string
  photos: string[]
  availability: string
  landmark: string | null
}

export default function ListingSchema({
  title, slug, typeLabel, locality, description, photos, availability, landmark,
}: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    image: photos.length > 0 ? photos : undefined,
    sku: slug,
    category: `${typeLabel} Outdoor Advertising`,
    brand: { '@type': 'Brand', name: 'Rewari Hoardings' },
    offers: {
      '@type': 'Offer',
      availability: AVAIL_SCHEMA[availability] ?? 'https://schema.org/InStock',
      priceCurrency: 'INR',
      areaServed: `${locality}, Rewari, Haryana`,
      seller: {
        '@type': 'AdvertisingAgency',
        name: 'Rewari Hoardings',
        url: 'https://rewarihoardings.com',
        telephone: '+918168740234',
        address: {
          '@type': 'PostalAddress',
          streetAddress: landmark ?? locality,
          addressLocality: 'Rewari',
          addressRegion: 'Haryana',
          postalCode: '123401',
          addressCountry: 'IN',
        },
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
