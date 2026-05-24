'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: 'fa-chart-pie' },
    { name: 'AI Detection', href: '/detect', icon: 'fa-microscope' },
    { name: 'History', href: '/history', icon: 'fa-clock-rotate-left' },
  ];

  return (
    <div className="w-64 bg-white/90 border-r border-gray-100 p-6 backdrop-blur-md hidden md:block shrink-0 min-h-[calc(100vh-68px)]">
      <div className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider px-4">Menu</div>
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive ? 'bg-primary-green/10 text-primary-green' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <i className={`fa-solid ${item.icon} ${isActive ? 'text-primary-green' : 'text-gray-400'}`}></i>
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
