// components/CardGrid.tsx
import { Bolt } from 'lucide-react';

export default function CardGrid() {
  const cards = [
    { title: 'Browse', color: 'bg-muted' },
    { title: 'Interview Guide', color: 'bg-muted' },
    { title: 'Mock Tests', color: 'bg-muted' },
    { title: 'Quick Start', color: 'bg-gradient-to-br from-pink-300 via-purple-300 to-lime-200' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 px-2 md:justify-center">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`min-w-[150px] h-[150px] rounded-2xl p-4 flex flex-col justify-between ${card.color} shrink-0`}
        >
          <div className="bg-black/10 p-2 rounded-xl w-fit">
            <Bolt className="w-5 h-5 text-black" />
          </div>
          <p className="text-sm font-medium">{card.title}</p>
        </div>
      ))}
    </div>
  );
}
