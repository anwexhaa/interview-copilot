'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  const [search, setSearch] = useState('')

  return (
    <div className="w-64 h-screen border-r border-muted bg-secondary p-4 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        {/* Brand */}
        <div className="text-xl font-bold tracking-tight">
          Interview Copilot
        </div>

        {/* New Chat Button */}
        <button className="bg-primary text-primary-foreground py-2 px-4 rounded-xl hover:opacity-90 flex items-center gap-2 text-sm">
          <Plus size={16} />
          New Chat
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-background text-foreground border border-muted rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          />
        </div>

        {/* Chat List */}
        <div className="flex flex-col gap-2 text-sm max-h-[calc(100vh-260px)] overflow-y-auto">
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href="#"
              className="hover:bg-muted rounded-lg p-2 transition-all duration-150"
            >
              Chat {i}
            </Link>
          ))}
        </div>
      </div>

      {/* Avatar at bottom */}
      <div className="flex justify-center pt-4">
        <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center border border-gray-600 text-sm">
          N
        </div>
      </div>
    </div>
  )
}
