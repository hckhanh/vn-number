import './global.css'

import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import { inter, jetbrainsMono } from '@/lib/fonts'

export const metadata: Metadata = {
  title: {
    default:
      'vn-number - Vietnamese Number Utilities for JavaScript & TypeScript',
    template: '%s | vn-number',
  },
  description:
    'A bunch of utility functions that work with numbers in Vietnamese language. Zero dependencies, type-safe, and built for Edge runtime. Read, format, and display numbers in Vietnamese.',
  keywords: [
    'vietnamese',
    'vietnam',
    'vn',
    'number',
    'number formatting',
    'currency',
    'vnd',
    'vietnamese dong',
    'read number',
    'typescript',
    'javascript',
    'vietnamese language',
    'number to text',
    'format currency',
    'percentage',
  ],
  authors: [
    {
      name: 'Khánh Hoàng',
      url: 'https://www.khanh.id',
    },
  ],
  creator: 'Khánh Hoàng',
  metadataBase: new URL('https://vn-number.khanh.id'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vn-number.khanh.id',
    title: 'vn-number - Vietnamese Number Utilities',
    description:
      'A bunch of utility functions that work with numbers in Vietnamese language. Read, format, and display numbers in Vietnamese.',
    siteName: 'vn-number',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vn-number - Vietnamese Number Utilities',
    description:
      'A bunch of utility functions that work with numbers in Vietnamese language. Read, format, and display numbers in Vietnamese.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      lang='en'
      suppressHydrationWarning
    >
      <body className='flex min-h-screen flex-col'>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
