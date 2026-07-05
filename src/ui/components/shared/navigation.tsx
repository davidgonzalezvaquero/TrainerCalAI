'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Inicio' },
  { href: '/routines', label: 'Rutinas' },
  { href: '/meals', label: 'Comidas' },
  { href: '/stats', label: 'Estadísticas' },
  { href: '/settings', label: 'Ajustes' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">🏋️</span>
            <span className="font-bold text-white">TrainerCalAI</span>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}