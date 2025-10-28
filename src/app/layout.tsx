import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/components/providers/toast-provider'
import PWARegistration from '@/components/pwa/pwa-registration'
import InstallPrompt from '@/components/pwa/install-prompt'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Adopt ton Triple Monstre',
  description: 'Adoptez et prenez soin de vos petits monstres virtuels ! Un jeu Tamagotchi moderne avec des créatures uniques générées procéduralement.',
  applicationName: 'Adopt ton Triple Monstre',
  keywords: ['tamagotchi', 'monstre', 'jeu', 'virtual pet', 'pixel art', 'adopt', 'monstres'],
  authors: [{ name: 'My Digital School' }],
  creator: 'My Digital School',
  publisher: 'My Digital School',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Triple Monstre'
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Adopt ton Triple Monstre',
    title: 'Adopt ton Triple Monstre',
    description: 'Adoptez et prenez soin de vos petits monstres virtuels !'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adopt ton Triple Monstre',
    description: 'Adoptez et prenez soin de vos petits monstres virtuels !'
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#f7533c' }
    ]
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7533c' },
    { media: '(prefers-color-scheme: dark)', color: '#f7533c' }
  ]
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return (
    <html lang='fr'>
      <head>
        <link rel='manifest' href='/manifest.json' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Triple Monstre' />
        <meta name='msapplication-TileColor' content='#f7533c' />
        <meta name='msapplication-config' content='/browserconfig.xml' />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWARegistration />
        {children}
        <InstallPrompt />
        <ToastProvider />
      </body>
    </html>
  )
}
