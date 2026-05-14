type Props = {
  title: string
  slug: string
  typeLabel: string
  locality: string
  description: string
  photos: string[]
}

export default function ListingSchema({ title, slug, typeLabel, locality, description, photos }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    image: photos.length > 0 ? photos : undefined,
    serviceType: `${typeLabel} Advertising`,
    url: `https://rewarihoardings.com/listing/${slug}`,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Rewari Hoardings',
      url: 'https://rewarihoardings.com',
      telephone: '+918168740234',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Rewari',
        addressRegion: 'Haryana',
        postalCode: '123401',
        addressCountry: 'IN',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Rewari',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Haryana',
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
