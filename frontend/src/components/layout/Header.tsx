'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, Sun, Moon, Database, ChevronDown, Menu, X, Shield, 
  Activity, Cpu, Network, Clock, Layers, BookOpen, Globe2, Compass, AlertCircle
} from 'lucide-react';
import GlobalSearchModal from './GlobalSearchModal';

export default function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    // Keyboard shortcut for Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const navLinks = [
    { name: 'What is PLF?', href: '/what-is-plf' },
    { name: 'Technologies', href: '/technologies' },
    { name: 'Species', href: '/species' },
    { name: 'Applications', href: '/applications' },
    { name: 'Research Landscape', href: '/research-landscape' },
    { name: 'Literature', href: '/literature' },
    { name: 'Existing Systems', href: '/existing-systems' },
    { name: 'Comparison', href: '/comparison' },
    { name: 'Research Gaps', href: '/research-gaps' },
    { name: 'Africa & Pastoralism', href: '/regional-plf' },
    { name: 'Timeline', href: '/timeline' },
    { name: 'Knowledge Graph', href: '/knowledge-graph' },
    { name: 'Sources', href: '/sources' },
    { name: 'Glossary', href: '/glossary' },
    { name: 'Methodology', href: '/methodology' },
    { name: 'Crawler Admin', href: '/admin' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-sand-300/50 dark:border-forest-800/50 bg-sand-50/95 dark:bg-forest-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-forest-950/90 p-0.5 border border-sand-300/80 dark:border-forest-700/60 shadow-md group-hover:scale-105 transition-all duration-200 flex items-center justify-center overflow-hidden" style={{boxShadow:'0 4px 12px rgba(15,61,58,0.15)'}}>
                <Image
                  src="/logo-emblem.png"
                  alt="PLF Research Intelligence Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-forest-800 dark:text-sand-300 flex items-center gap-1.5 font-heading">
                  PLF Research Intelligence
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-burgundy-700/10 text-burgundy-700 dark:text-sand-300 border border-burgundy-700/20">
                    Living DB
                  </span>
                </span>
                <p className="text-[11px] text-forest-600 dark:text-sand-400/70 hidden sm:block">
                  A Living Knowledge Base for Precision Livestock Farming
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1">
              {[
                { href: '/what-is-plf', label: 'What is PLF?' },
                { href: '/technologies', label: 'Technologies' },
                { href: '/species', label: 'Species' },
                { href: '/applications', label: 'Use Cases' },
                { href: '/literature', label: 'Literature' },
                { href: '/research-gaps', label: 'Research Gaps' },
                { href: '/regional-plf', label: 'Africa Focus' },
                { href: '/timeline', label: 'Timeline' },
                { href: '/knowledge-graph', label: 'Knowledge Graph' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'bg-forest-700/10 text-forest-700 dark:bg-forest-700/20 dark:text-sand-300 font-semibold'
                      : 'text-forest-800/70 dark:text-sand-400/70 hover:text-forest-800 dark:hover:text-sand-300 hover:bg-sand-300/20 dark:hover:bg-forest-700/20'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions: Search button, Dark mode, Mobile menu toggle */}
            <div className="flex items-center space-x-2">
              
              {/* Search Shortcut Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-sand-300/30 dark:bg-forest-700/20 hover:bg-sand-300/50 dark:hover:bg-forest-700/30 text-forest-700 dark:text-sand-300 text-xs transition border border-sand-300/50 dark:border-forest-700/40"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search Knowledge Base...</span>
                <kbd className="hidden sm:inline font-mono text-[10px] bg-white/80 dark:bg-forest-900/80 px-1.5 py-0.5 rounded border border-sand-300/60 dark:border-forest-700/40">
                  ⌘K
                </kbd>
              </button>

              {/* Dark mode button */}
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle Theme"
                className="p-2 rounded-xl text-forest-700 dark:text-sand-400 hover:bg-sand-300/30 dark:hover:bg-forest-700/25 transition"
              >
                {isDark ? <Sun className="w-4 h-4 text-sand-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-forest-700 dark:text-sand-400 hover:bg-sand-300/30 dark:hover:bg-forest-700/25"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-sand-300/50 dark:border-forest-700/40 bg-sand-50/98 dark:bg-forest-900/98 px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-forest-700/12 text-forest-700 dark:bg-forest-700/25 dark:text-sand-300 font-semibold'
                    : 'text-forest-800/70 dark:text-sand-400/70 hover:bg-sand-300/25 dark:hover:bg-forest-700/20'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
