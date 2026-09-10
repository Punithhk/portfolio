'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useAdmin } from './AdminContext';

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('Visitor');
  const { isAdmin, pin } = useAdmin();

  useEffect(() => {
    const directName = localStorage.getItem('visitor_name');
    if (directName) {
      setVisitorName(directName);
      return;
    }

    const savedData = localStorage.getItem('visitor') || localStorage.getItem('visitorData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.visitor_name) {
          setVisitorName(parsed.visitor_name);
        }
      } catch (e) {
        console.error('Error parsing visitor data from storage', e);
      }
    }
  }, []);

  // Prioritize Google session user name, then local storage, then fallback
  const displayName = session?.user?.name || visitorName;
  const badgeText = isAdmin ? `Welcome, ${pin || 'Admin'}` : `Welcome, ${displayName}`;

  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Left Side: Brand Logo & Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-lg font-black tracking-wider text-white uppercase">
            HKP Portfolio
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link href="/projects" className="hover:text-cyan-400 transition">Projects</Link>
            <Link href="/events" className="hover:text-cyan-400 transition">Events</Link>
          </div>
        </div>

        {/* Right Side: Welcome / Admin Badge & Mobile Hamburger Button */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:inline-block px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/20 text-cyan-400 text-xs font-medium">
            {badgeText}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-slate-300 hover:text-white focus:outline-none p-1"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 space-y-3 flex flex-col">
          <div className="sm:hidden px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/20 text-cyan-400 text-xs font-medium text-center mb-2">
            {badgeText}
          </div>
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)} 
            className="text-slate-300 hover:text-cyan-400 text-sm font-medium py-1"
          >
            Home
          </Link>
          <Link 
            href="/projects" 
            onClick={() => setIsOpen(false)} 
            className="text-slate-300 hover:text-cyan-400 text-sm font-medium py-1"
          >
            Projects
          </Link>
          <Link 
            href="/events" 
            onClick={() => setIsOpen(false)} 
            className="text-slate-300 hover:text-cyan-400 text-sm font-medium py-1"
          >
            Events
          </Link>
        </div>
      )}
    </nav>
  );
}