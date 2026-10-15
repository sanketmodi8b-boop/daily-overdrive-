import React from 'react';
import { ArrowRight, Bookmark, Clock, Calendar } from 'lucide-react';
import type { Article } from '../types/blog';
import { calcReadTime, formatDate } from '../utils/blog';

interface HeroFeaturedProps {
  article: Article;
  onRead: (slug: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  article,
  onRead,
  isBookmarked,
  onToggleBookmark,
}) => {
  const readTime = calcReadTime(article.content);

  return (
    <section className="mb-14" aria-labelledby="featured-story-heading">
      <div
        onClick={() => onRead(article.slug)}
        className="relative rounded-3xl overflow-hidden bg-slate-900 border border-[#e2e5ea] dark:border-[#222631] shadow-xl group cursor-pointer"
      >
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={article.image}
            alt={article.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=80';
            }}
            className="w-full h-full object-cover object-center opacity-45 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-[#0d0f12]/70 to-[#0d0f12]/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-4xl text-white">
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold">
            <span className="bg-[#d90429] text-white uppercase tracking-[0.2em] px-3 py-1 rounded text-[11px] font-bold">
              Lead Story
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded text-[11px] uppercase tracking-wider">
              {article.category}
            </span>
            <div className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{readTime} min read</span>
            </div>
          </div>

          <h2
            id="featured-story-heading"
            className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 group-hover:text-red-100 transition-colors"
          >
            {article.title}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-8 line-clamp-2 leading-relaxed max-w-2xl font-normal">
            {article.summary}
          </p>

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/15">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              The Daily Overdrive Investigation
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(article.id);
                }}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#d90429] border-[#d90429] text-white shadow-md shadow-red-600/40'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
                aria-label={isBookmarked ? 'Remove featured from saved' : 'Save featured'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#d90429] group-hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all">
                <span>Read Feature</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
