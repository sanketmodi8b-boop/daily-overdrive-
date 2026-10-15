import React from 'react';
import { Gauge, ArrowUp } from 'lucide-react';
import type { Category } from '../types/blog';
import { categoryToSlug } from '../utils/blog';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories: Exclude<Category, 'All'>[] = [
    'News',
    'Exotics',
    'Culture',
    'Maintenance',
    'Daily Drivers',
  ];

  return (
    <footer className="bg-white dark:bg-[#0d0f12] border-t border-[#e2e5ea] dark:border-[#222631] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d90429] flex items-center justify-center text-white shadow-md shadow-red-600/20">
                <Gauge className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black tracking-tight uppercase italic text-[#121316] dark:text-[#f8f9fa]">
                The Daily <span className="text-[#d90429]">Overdrive</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              An independent automotive journal examining the mechanical art, aerodynamics, and powertrain engineering shaping modern car culture.
            </p>
          </div>

          {/* Categories links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Sections
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onNavigate(`/category/${categoryToSlug(cat)}`)}
                    className="text-slate-600 dark:text-slate-400 hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Journal Standards */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Editorial Policy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Written for drivers and engineering purists. Every technical article is vetted against real-world chassis telemetry and thermodynamic principles.
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#d90429] hover:underline cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-[#222631] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} The Daily Overdrive. All rights reserved.</p>
          <p className="tracking-wide">High-octane technical journalism.</p>
        </div>
      </div>
    </footer>
  );
};
