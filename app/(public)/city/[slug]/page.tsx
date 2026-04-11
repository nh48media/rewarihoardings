export default function CityPage({ params }: { params: { slug: string } }) {
  return <main><h1>OOH Advertising in {params.slug}</h1></main>
}
