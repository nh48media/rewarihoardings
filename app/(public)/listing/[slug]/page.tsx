export const revalidate = 3600

export default function ListingPage({ params }: { params: { slug: string } }) {
  return <main><h1>Listing: {params.slug}</h1></main>
}
