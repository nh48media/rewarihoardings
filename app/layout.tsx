import type { Metadata } from 'next'
import { Barlow_Condensed, Barlow } from 'next/font/google'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Rewari Hoardings',
    default: 'Rewari Hoardings — Rewari\'s #1 OOH Advertising Marketplace',
  },
  description:
    'Find and book hoardings, unipoles, LED displays, and outdoor advertising inventory in Rewari, Haryana. Browse 15+ prime locations.',
  metadataBase: new URL('https://rewarihoardings.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-black text-foreground">
        {children}
      </body>
    </html>
  )
}
