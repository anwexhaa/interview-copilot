'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Bot } from 'lucide-react'

export default function CopilotSticky() {
  const router = useRouter()
  const pathname = usePathname()

  // Don’t show it on the root Copilot page itself
  if (pathname === '/') return null

  return (
    <div
      onClick={() => router.push('/')}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-pink-300 via-purple-300 to-lime-200 p-4 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105"
    >
      <Bot className="w-5 h-5 text-black" />
    </div>
  )
}
