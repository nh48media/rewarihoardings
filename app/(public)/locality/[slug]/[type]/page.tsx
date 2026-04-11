export default function LocalityTypePage({
  params,
}: {
  params: { slug: string; type: string }
}) {
  return (
    <main>
      <h1>
        {params.type} Advertising in {params.slug}, Rewari
      </h1>
    </main>
  )
}
