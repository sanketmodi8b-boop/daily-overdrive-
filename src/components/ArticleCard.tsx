import React from 'react';
import { Bookmark, Clock, ArrowRight, Calendar } from 'lucide-react';
import type { Article } from '../types/blog';
import { calcReadTime, formatDate } from '../utils/blog';

interface ArticleCardProps {
  article: Article;
  onSelect: (slug: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  priority?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  priority = false,
}) => {
  const readTime = calcReadTime(article.content);

  return (
    <article
      onClick={() => onSelect(article.slug)}
      className="group flex flex-col bg-white dark:bg-[#15181e] rounded-2xl overflow-hidden border border-[#e2e5ea] dark:border-[#222631] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Article Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={article.image}
          alt={article.title}
          loading={priority ? 'eager' : 'lazy'}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Minimal Category Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#121316]/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded border border-white/10">
            {article.category}
          </span>
        </div>

        {/* Bookmark Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          className={`absolute top-4 right-4 z-10 p-2 rounded-lg backdrop-blur-md transition-all ${
            isBookmarked
              ? 'bg-[#d90429] text-white shadow-md shadow-red-600/40'
              : 'bg-black/40 hover:bg-black/60 text-white'
          }`}
          aria-label={isBookmarked ? `Remove ${article.title} from saved` : `Save ${article.title}`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
        <div>
          {/* Metadata bar without writer names */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {formatDate(article.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {readTime} min read
              </span>
            </div>
            {article.gallery?.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#d90429] font-bold">
                Car & Fittings
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-[#d90429] transition-colors">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6">
            {article.summary}
          </p>
        </div>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#222631] flex items-center justify-between text-xs font-bold text-[#d90429]">
          <span className="uppercase tracking-wider">Read Full Analysis</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </article>
  );
};
