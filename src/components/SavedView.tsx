import React from 'react';
import { Bookmark, ArrowLeft, Trash2, ArrowRight } from 'lucide-react';
import type { Article } from '../types/blog';
import { ArticleCard } from './ArticleCard';

interface SavedViewProps {
  bookmarkedArticles: Article[];
  onNavigate: (path: string) => void;
  onToggleBookmark: (id: number) => void;
  onClearAll: () => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  bookmarkedArticles,
  onNavigate,
  onToggleBookmark,
  onClearAll,
}) => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e5ea] dark:border-[#222631] pb-6">
        <div>
          <a
            href="/"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onNavigate('/');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#d90429] mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
          </a>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#d90429]">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                Saved <span className="text-[#d90429]">Dispatches</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {bookmarkedArticles.length} {bookmarkedArticles.length === 1 ? 'article' : 'articles'} in your personal reading queue
              </p>
            </div>
          </div>
        </div>

        {bookmarkedArticles.length > 0 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer border border-[#e2e5ea] dark:border-[#222631]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Reading List</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {bookmarkedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookmarkedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelect={(slug) => onNavigate(`/article/${slug}`)}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-[#15181e] border border-[#e2e5ea] dark:border-[#222631] flex items-center justify-center text-slate-400 mb-4">
            <Bookmark className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Saved Stories Yet
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Click the bookmark icon on any dispatch across the journal to save it for offline or later reading.
          </p>
          <a
            href="/"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onNavigate('/');
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#d90429] hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>Explore All Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};
