'use client';
import { useEffect, useState } from 'react';

type Problem = {
  title: string;
  titleSlug: string;
  difficulty: string;
  url: string;
};

type TopicsMap = {
  [topic: string]: string[];
};

export default function TopicsPage() {
  const [topicsData, setTopicsData] = useState<TopicsMap>({});
  const [problemsMap, setProblemsMap] = useState<{ [slug: string]: Problem }>({});

  useEffect(() => {
    const fetchData = async () => {
      const [topicsRes, problemsRes] = await Promise.all([
        fetch('/data/topics.json'),
        fetch('/data/leetcodeProblems.json')
      ]);
      const topicsJson: TopicsMap = await topicsRes.json();
      const problemsJson: Problem[] = await problemsRes.json();

      const map: { [slug: string]: Problem } = {};
      problemsJson.forEach(p => map[p.titleSlug] = p);

      setTopicsData(topicsJson);
      setProblemsMap(map);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen px-8 py-10 text-white font-sans bg-black">
      <h1 className="text-3xl font-bold mb-8 text-accent">Topic-wise DSA Practice</h1>

      {Object.entries(topicsData).map(([topic, slugs]) => (
        <div key={topic} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 underline underline-offset-4">{topic}</h2>
          <ul className="space-y-2">
            {slugs.map(slug => {
              const prob = problemsMap[slug];
              return prob ? (
                <li key={slug} className="flex justify-between items-center bg-neutral-800 p-3 rounded-md shadow">
                  <span className="capitalize">{prob.title || slug.replace(/-/g, ' ')}</span>
                  <a href={prob.url} target="_blank" className="text-sm text-blue-400 hover:underline">
                    Solve
                  </a>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
