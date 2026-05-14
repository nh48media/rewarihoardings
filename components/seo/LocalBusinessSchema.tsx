const schema = {
  '@context': 'https://schema.org',
  '@type': 'AdvertisingAgency',
  name: 'Rewari Hoardings',
  alternateName: 'RewarHoardings.com',
  description:
    "Rewari's dedicated outdoor advertising marketplace. Find and book hoardings, unipoles, gantries, LED displays and more across the NH-48 corridor.",
  url: 'https://rewarihoardings.com',
  telephone: '+918168740234',
  email: 'lovelashseo@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rewari',
    addressLocality: 'Rewari',
    addressRegion: 'Haryana',
    postalCode: '123401',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.1953,
    longitude: 76.6165,
  },
  areaServed: {
    '@type': 'City',
    name: 'Rewari',
    containedInPlace: { '@type': 'State', name: 'Haryana', containedInPlace: { '@type': 'Country', name: 'India' } },
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+918168740234',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
    hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '18:00' },
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '18:00' },
  ],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Bank Transfer, UPI',
  parentOrganization: { '@type': 'Organization', name: 'NH48 Media', url: 'https://nh48media.com' },
  sameAs: ['https://nh48media.com'],
}

export default function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
