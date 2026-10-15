import React, { useState } from 'react';
import { Search, X, Sun, Moon, Bookmark, Menu, Gauge } from 'lucide-react';
import type { Category } from '../types/blog';
import { categoryToSlug } from '../utils/blog';

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentCategory: Category;
  bookmarkCount: number;
  onNavigate: (path: string) => void;
  activePath: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  currentCategory,
  bookmarkCount,
  onNavigate,
  activePath,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navCategories: { name: Exclude<Category, 'All'>; path: string }[] = [
    { name: 'News', path: '/category/news' },
    { name: 'Exotics', path: '/category/exotics' },
    { name: 'Culture', path: '/category/culture' },
    { name: 'Maintenance', path: '/category/maintenance' },
    { name: 'Daily Drivers', path: '/category/daily-drivers' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f6f7f9]/95 dark:bg-[#0d0f12]/95 backdrop-blur-md border-b border-[#e2e5ea] dark:border-[#222631] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Masthead Logo */}
          <a
            href="/"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onNavigate('/');
            }}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            aria-label="The Daily Overdrive Home"
          >
            <div className="w-10 h-10 rounded-lg bg-[#d90429] flex items-center justify-center text-white shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform">
              <Gauge className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic block leading-none text-[#121316] dark:text-[#f8f9fa]">
                The Daily <span className="text-[#d90429]">Overdrive</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400 font-bold block mt-1">
                Automotive Journal
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links - Clean Editorial Style */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <a
              href="/"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onNavigate('/');
              }}
              className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-md ${
                activePath === '/' && currentCategory === 'All'
                  ? 'text-[#d90429] bg-red-50 dark:bg-red-950/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#d90429] dark:hover:text-[#d90429]'
              }`}
            >
              All Stories
            </a>
            {navCategories.map((item) => {
              const isActive = activePath === item.path || currentCategory === item.name;
              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    onNavigate(item.path);
                  }}
                  className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-md ${
                    isActive
                      ? 'text-[#d90429] bg-red-50 dark:bg-red-950/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#d90429] dark:hover:text-[#d90429]'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Search, Saved Stories & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search */}
            <div className="hidden sm:flex relative items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search journal..."
                aria-label="Search articles"
                className="w-44 focus:w-64 pl-9 pr-8 py-2 text-xs rounded-lg border border-[#e2e5ea] dark:border-[#222631] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#d90429] focus:border-[#d90429] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1e222b]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Saved Articles Link */}
            <a
              href="/saved"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onNavigate('/saved');
              }}
              className={`relative p-2.5 rounded-lg border transition-colors cursor-pointer ${
                activePath === '/saved'
                  ? 'border-[#d90429] bg-red-50 dark:bg-red-950/40 text-[#d90429]'
                  : 'border-[#e2e5ea] dark:border-[#222631] bg-white dark:bg-[#15181e] text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
              }`}
              title="Saved reading list"
              aria-label={`Saved reading list with ${bookmarkCount} articles`}
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#d90429] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </a>

            {/* Dark Mode Switcher */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-lg border border-[#e2e5ea] dark:border-[#222631] bg-white dark:bg-[#15181e] text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to daylight theme' : 'Switch to tarmac dark theme'}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg border border-[#e2e5ea] dark:border-[#222631] bg-white dark:bg-[#15181e] text-slate-700 dark:text-slate-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {searchOpen && (
          <div className="sm:hidden pb-4 pt-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-[#e2e5ea] dark:border-[#222631] bg-white dark:bg-[#15181e] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#d90429]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-[#e2e5ea] dark:border-[#222631] space-y-1">
            <a
              href="/"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onNavigate('/');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-[#d90429]"
            >
              All Stories
            </a>
            {navCategories.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onNavigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-[#d90429]"
              >
                {item.name}
              </a>
            ))}
            <a
              href="/saved"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                onNavigate('/saved');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-wider text-[#d90429] flex items-center justify-between"
            >
              <span>Saved Reading List</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60">
                {bookmarkCount}
              </span>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};
