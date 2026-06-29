import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/shared/Providers'

export const metadata: Metadata = {
  title: 'SupplyGuardian AI - Autonomous Procurement Operating System',
  description: 'AI-powered procurement operating system that autonomously discovers suppliers, evaluates risk, negotiates contracts, and protects enterprise supply chains.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-brand-carbon text-brand-text antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
