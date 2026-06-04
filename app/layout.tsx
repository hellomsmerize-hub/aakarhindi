import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display, Yatra_One, Tiro_Devanagari_Hindi } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const yatraOne = Yatra_One({
  weight: '400',
  subsets: ['latin', 'devanagari'],
  variable: '--font-yatra',
  display: 'swap',
})

const tiroDevanagari = Tiro_Devanagari_Hindi({
  weight: '400',
  subsets: ['devanagari'],
  variable: '--font-tiro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Aakar Hindi',
    template: '%s | Aakar Hindi',
  },
  description: 'Master Hindi. Excel in Exams.',
  keywords: ['Hindi tuition', 'PSLE Hindi', 'O-Level Hindi', 'Hindi learning', 'Singapore'],
  openGraph: {
    title: 'Aakar Hindi',
    description: 'Master Hindi. Excel in Exams.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable} ${yatraOne.variable} ${tiroDevanagari.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-navy">
        {children}
      </body>
    </html>
  )
}
