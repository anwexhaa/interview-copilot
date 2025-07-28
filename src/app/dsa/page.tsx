'use client';

import { useRouter } from 'next/navigation';

export default function DsaPage() {
  const router = useRouter();

  return (
    <div className="p-6 text-white font-sans">
      <h1 className="text-3xl font-bold mb-2">DSA Practice</h1>
      <p className="mb-6 text-gray-400 text-base">Sharpen your skills with daily challenges and curated problem sets.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          title=" Daily DSA"
          description="Solve one handpicked problem every day."
          onClick={() => router.push('/dsa/daily')}
        />
        <Card
          title=" Topic-wise Practice"
          description="Arrays, Trees, DP, and more."
          onClick={() => router.push('/dsa/topics')}
        />
        <Card
          title=" Blind 75"
          description="Finish the legendary list in 2 weeks."
          onClick={() => router.push('/dsa/blind75')}
        />
        <Card
          title=" Timed Practice"
          description="Simulate real interview conditions."
          onClick={() => router.push('/dsa/timed')}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition rounded-xl p-6 shadow-md font-sans"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
