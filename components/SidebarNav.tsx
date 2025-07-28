'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Grid,
  AtSign,
  Plus,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: <Home size={20} />, key: 'home' },
    { href: '/dsa', icon: <Grid size={20} />, key: 'dsa' },
    { href: '/copilot', icon: <AtSign size={20} />, key: 'copilot' },
  ];

  return (
    <aside className="w-16 bg-[#1C1C1C] flex flex-col items-center py-4 justify-between text-white">
      {/* Top section */}
      <div className="flex flex-col items-center">
        {/* Logo + Plus */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Image
            src="/ad-logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-md object-contain"
          />
          <button className="bg-white text-black p-2 rounded-md hover:opacity-90">
            <Plus size={20} />
          </button>
        </div>

        {/* Nav Icons */}
        <div className="flex flex-col items-center gap-6">
          {navItems.map(({ href, icon, key }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={key}
                href={href}
                className={`p-2 rounded-md transition-all ${
                  isActive ? 'bg-[#2A2A2A]' : 'hover:text-gray-300'
                }`}
              >
                {icon}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <button className="hover:text-gray-300">
          <Settings size={20} />
        </button>
        <div className="w-8 h-8 rounded-full border overflow-hidden">
          <img src="/avatar.jpg" alt="Avatar" />
        </div>
      </div>
    </aside>
  );
}
