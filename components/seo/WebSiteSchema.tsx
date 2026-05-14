export default function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rewari Hoardings',
    alternateName: 'RewarHoardings.com',
    url: 'https://rewarihoardings.com',
    description:
      "Rewari's dedicated outdoor advertising marketplace. Find and book hoardings, unipoles, gantries, LED displays and more across the NH-48 corridor.",
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://rewarihoardings.com/city/rewari?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
