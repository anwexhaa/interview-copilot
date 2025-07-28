'use client';
import { useEffect, useState } from 'react';

type LeetCodeProblem = {
  titleSlug: string;
  url: string;
  difficulty: string;
};

export default function DailyPage() {
  const [problem, setProblem] = useState<LeetCodeProblem | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch('/data/leetcodeProblems.json');
      const data: LeetCodeProblem[] = await res.json();

      const today = new Date();
      const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
      const index = seed % data.length;

      setProblem(data[index]);
    };

    fetchProblem();
  }, []);

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans">
        <p className="text-lg font-medium">Loading today’s challenge...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-neutral-900 to-black text-white px-6 py-10 font-sans">
      <div className="max-w-md w-full text-center border border-neutral-700 rounded-lg p-6 bg-neutral-800/70 shadow-lg backdrop-blur">
        <h1 className="text-2xl font-bold mb-4"> Daily LeetCode Challenge</h1>
        
        <p className="mb-2 text-lg font-medium">
          <span className="text-neutral-400">Difficulty:</span>{' '}
          <span
            className={`font-semibold ${
              problem.difficulty === 'Easy'
                ? 'text-green-400'
                : problem.difficulty === 'Medium'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}
          >
            {problem.difficulty}
          </span>
        </p>

        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition font-medium"
        >
          Solve: {problem.titleSlug.replace(/-/g, ' ')}
        </a>
      </div>
    </div>
  );
}
