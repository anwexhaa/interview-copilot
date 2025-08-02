'use client';
import { useEffect, useState } from 'react';

type Problem = {
  titleSlug: string;
  title: string;
  difficulty: string;
  url: string;
};

export default function TimedPracticePage() {
  const [questions, setQuestions] = useState<Problem[]>([]);

  useEffect(() => {
    const loadProblems = async () => {
      const res = await fetch('/data/leetcodeProblems.json');
      const data: Problem[] = await res.json();

      const filtered = data.filter(p => p.difficulty === 'Medium');
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 15); // Choose 15 questions

      setQuestions(selected);
    };

    loadProblems();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-accent"> Timed Practice: 15 Mediums</h1>
      <ul className="space-y-4">
        {questions.map((q, i) => (
          <li key={i} className="flex justify-between items-center bg-neutral-800 p-4 rounded shadow">
            <span>{q.title || q.titleSlug.replace(/-/g, ' ')}</span>
            <a
              href={q.url}
              target="_blank"
              className="text-sm text-blue-400 hover:underline"
            >
              Solve
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
