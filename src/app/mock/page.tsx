'use client'

import Link from 'next/link'
import clsx from 'clsx'

const mockOptions = [
  {
    title: 'System Design',
    description: 'Mock interviews for system design problems',
    link: '/mock/system-design',
  },
  {
    title: 'DSA Only',
    description: 'Timed mock interviews for DSA questions',
    link: '/mock/dsa-only',
  },
  {
    title: 'AI Interview',
    description: 'ML/AI-specific interview prep',
    link: '/mock/ai-interview',
  },
]

export default function MockInterviewPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background text-foreground font-sans px-4 py-16 md:px-20">
      
      {/* Centered heading */}
      <h1 className="text-3xl font-bold mb-10 text-accent text-center">
         Mock Interviews
      </h1>

      {/* Card container */}
      <div className="flex flex-row flex-wrap md:justify-center gap-6 w-full max-w-6xl px-2">
        {mockOptions.map((item, i) => (
          <Link
            href={item.link}
            key={i}
            className={clsx(
              'flex-shrink-0 w-64 h-64 p-6 rounded-2xl shadow-lg transform transition-transform duration-300',
              'bg-gradient-to-br from-pink-300 via-purple-300 to-lime-200 text-black hover:scale-105 hover:shadow-2xl'
            )}
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm">{item.description}</p>
              </div>
              <p className="mt-auto text-sm underline">Start →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
