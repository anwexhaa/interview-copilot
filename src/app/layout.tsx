// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import SidebarNav from '../../components/SidebarNav'

export const metadata: Metadata = {
  title: 'Interview Copilot',
  description: 'Your AI-powered job prep workspace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-sans">
        <div className="flex h-screen w-screen">
          <SidebarNav />
          <main className="flex flex-col flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
