import './globals.css'
import { Inter } from 'next/font/google'
import EnhancedNavigation from '@/components/EnhancedNavigation'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MAITRI - AI Assistant for Astronaut Well-Being',
  description: 'AI-Powered Multimodal Assistant for Psychological & Physical Well-Being of Astronauts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <EnhancedNavigation />
          <main className="min-h-screen">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  )
}

