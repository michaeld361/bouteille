import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit, JetBrains_Mono, Josefin_Sans } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--serif',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--mono',
  display: 'swap',
})

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bouteille — Bar à vin | Stockel, Brussels',
    template: '%s — Bouteille',
  },
  description:
    'Bouteille is a neighbourhood wine bar in Stockel, Brussels. European wines, seasonal food, and the art of sharing.',
  metadataBase: new URL('https://bouteillebaravin.be'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    alternateLocale: ['fr_BE', 'nl_BE'],
    siteName: 'Bouteille',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`${cormorant.variable} ${outfit.variable} ${jetbrainsMono.variable} ${josefinSans.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  )
}
