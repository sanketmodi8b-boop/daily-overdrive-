import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Category, SortOption } from '../types/blog';
import { categoryToSlug } from '../utils/blog';

interface CategoryFilterProps {
  categories: Category[];
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onClearSearch: () => void;
  totalFilteredCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  currentCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  searchQuery,
  onClearSearch,
  totalFilteredCount,
}) => {
  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e2e5ea] dark:border-[#222631] pb-4">
        {/* Category Horizontal Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none" role="tablist">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#d90429] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-[#15181e]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort & Count Controls */}
        <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Showing <strong className="text-slate-900 dark:text-white">{totalFilteredCount}</strong> dispatches
          </span>

          <div className="flex items-center gap-2 bg-white dark:bg-[#15181e] border border-[#e2e5ea] dark:border-[#222631] rounded-lg px-3 py-1.5 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="sort-select"
              value={sortBy}
              aria-label="Sort articles"
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="latest" className="bg-white dark:bg-[#15181e]">
                Latest Published
              </option>
              <option value="oldest" className="bg-white dark:bg-[#15181e]">
                Oldest First
              </option>
              <option value="readTime" className="bg-white dark:bg-[#15181e]">
                Shortest Read
              </option>
              <option value="title" className="bg-white dark:bg-[#15181e]">
                Title (A-Z)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Search Filter Chip */}
      {searchQuery && (
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[#d90429]">
            Searching: &ldquo;{searchQuery}&rdquo;
            <button
              onClick={onClearSearch}
              className="hover:text-red-900 dark:hover:text-red-300 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
          <button
            onClick={onClearSearch}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer ml-1"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
