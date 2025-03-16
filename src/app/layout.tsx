import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Sentiment360 - Real-Time Customer Feedback Analysis',
  description: 'Transform customer feedback into actionable insights with AI-powered sentiment analysis',
  icons: {
    icon: [
      {
        url: '/images/logo.png',
        href: '/images/logo.png',
      }
    ],
    apple: [
      {
        url: '/images/logo.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
    shortcut: [
      {
        url: '/images/logo.png',
        type: 'image/png',
      }
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background`}>
        <AuthProvider>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
