'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Circle, Trophy } from 'lucide-react'

const fontClass = 'font-sans'

type Problem = {
  title: string
  titleSlug: string
  url: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  isComplete?: boolean
}

export default function Blind75Page() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const allProblemsRes = await fetch('/data/leetcodeProblems.json')
        const blind75Res = await fetch('/data/blind75.json')

        const allProblems: Problem[] = await allProblemsRes.json()
        const blind75Objs: { titleSlug: string }[] = await blind75Res.json()

        const blind75Slugs = Array.from(new Set(blind75Objs.map(obj => obj.titleSlug))).slice(0, 75)

        const orderedProblems = blind75Slugs
          .map(slug => {
            const normalizedSlug = slug.trim().toLowerCase()
            const problem = allProblems.find(p =>
              p.titleSlug.trim().toLowerCase() === normalizedSlug
            )

            if (!problem) {
              console.warn('Problem not found:', slug)
              return null
            }

            return {
              ...problem,
              url: `https://leetcode.com/problems/${slug}`, // 🔥 Always set url here
              isComplete: localStorage.getItem(`completed-${slug}`) === 'true'
            }
          })
          .filter(Boolean) as Problem[]

        setProblems(orderedProblems)
        setCompletedCount(orderedProblems.filter(p => p.isComplete).length)
      } catch (error) {
        console.error('Failed to load problems:', error)
      }
    }

    loadProblems()
  }, [])

  const toggleComplete = (titleSlug: string) => {
    setProblems(prev => {
      const updated = prev.map(problem =>
        problem.titleSlug === titleSlug
          ? { ...problem, isComplete: !problem.isComplete }
          : problem
      )

      localStorage.setItem(
        `completed-${titleSlug}`,
        String(updated.find(p => p.titleSlug === titleSlug)?.isComplete)
      )

      setCompletedCount(updated.filter(p => p.isComplete).length)
      return updated
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    return difficulty === 'Easy'
      ? 'text-emerald-400'
      : difficulty === 'Medium'
      ? 'text-yellow-400'
      : 'text-rose-400'
  }

  return (
    <div className={`flex h-screen bg-zinc-950 text-white ${fontClass}`}>
      {/* Left: Problem List */}
      <div className="w-3/5 overflow-y-auto p-8 space-y-3 bg-zinc-900">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h1 className="text-2xl font-bold text-yellow-400">Blind 75 Problems</h1>
        </div>

        {problems.map((problem, idx) => (
          <div
            key={problem.titleSlug}
            className={`p-4 rounded-lg border transition-all ${problem.isComplete ? 'border-emerald-800 bg-emerald-900/10' : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700/50'}`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleComplete(problem.titleSlug)}
                className="shrink-0 mt-1"
                aria-label={problem.isComplete ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {problem.isComplete ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-500 hover:text-zinc-300" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="truncate">
                    <span className="text-xs text-zinc-400">#{idx + 1}</span>
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-medium hover:text-yellow-400 transition-colors truncate"
                      title={problem.title}
                    >
                      {problem.title || problem.titleSlug.replace(/-/g, ' ')}
                    </a>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                      problem.difficulty
                    )} bg-zinc-700/50 shrink-0`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Progress Tracker */}
      <div className="w-2/5 bg-gradient-to-b from-zinc-900 to-zinc-800 p-10 flex flex-col justify-center items-center border-l border-zinc-700">
        <div className="relative w-56 h-56 mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(completedCount / 75) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold">{completedCount}</span>
            <span className="text-zinc-400 text-sm">of 75</span>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Difficulty Breakdown</h3>
            <div className="space-y-4">
              {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                const total = problems.filter(p => p.difficulty === difficulty).length
                const completed = problems.filter(p => p.difficulty === difficulty && p.isComplete).length
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0

                return (
                  <div key={difficulty} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300">{difficulty}</span>
                      <span className="text-zinc-400">{completed}/{total} ({percent}%)</span>
                    </div>
                    <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          difficulty === 'Easy'
                            ? 'bg-emerald-500'
                            : difficulty === 'Medium'
                            ? 'bg-yellow-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
