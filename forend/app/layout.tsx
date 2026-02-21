import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AAM NEWS - Breaking News, Latest Updates & Headlines',
  description: 'AAM NEWS delivers breaking news, live updates, and in-depth coverage of world events, politics, business, technology, sports, and entertainment.',
  keywords: ['news', 'breaking news', 'AAM NEWS', 'Somali news', 'world news', 'politics', 'technology'],
  authors: [{ name: 'AAM NEWS Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aam-news.vercel.app', // Update this with actual production URL
    siteName: 'AAM NEWS',
    title: 'AAM NEWS - Breaking News & Latest Updates',
    description: 'The most reliable source for breaking news and in-depth coverage.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AAM NEWS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AAM NEWS - Breaking News & Latest Updates',
    description: 'The most reliable source for breaking news and in-depth coverage.',
    images: ['/og-image.png'],
    creator: '@aamnews',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
