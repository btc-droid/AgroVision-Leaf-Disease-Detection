'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/detect') || pathname.startsWith('/history');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/40 shadow-sm px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary-green font-bold text-xl">
          <i className="fa-solid fa-leaf"></i> AgroVision AI
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="font-medium text-gray-700 hover:text-primary-green transition-colors">Login</Link>
              <Link href="/register" className="btn-primary-custom">Get Started</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="font-medium text-gray-700 hover:text-primary-green transition-colors mr-4">Dashboard</Link>
              <button onClick={handleLogout} className="border border-red-500 text-red-500 hover:bg-red-50 font-medium rounded-lg px-4 py-1.5 transition-colors">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-4 flex flex-col gap-4 border-b border-gray-100">
          {!isAuthenticated ? (
            <>
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="font-medium text-gray-700">Login</Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary-custom text-center">Get Started</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="font-medium text-gray-700">Dashboard</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="border border-red-500 text-red-500 font-medium rounded-lg px-4 py-2 text-center">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
