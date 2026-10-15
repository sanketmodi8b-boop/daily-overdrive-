import React from 'react';
import { ArrowRight, Bookmark, Clock, Calendar, Gauge } from 'lucide-react';
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
  const articleUrl = `/article/${article.slug}`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onRead(article.slug);
  };

  return (
    <section className="mb-16" aria-labelledby="featured-story-heading">
      <div className="relative rounded-3xl overflow-hidden bg-[#0b0e14] border border-slate-200 dark:border-[#222631] shadow-2xl group min-h-[460px] flex items-end">
        {/* Background Image with Rich Automotive Lighting */}
        <a
          href={articleUrl}
          onClick={handleLinkClick}
          className="absolute inset-0 z-0 block cursor-pointer"
          aria-label={`Read featured lead: ${article.title}`}
        >
          <img
            src={article.image}
            alt={article.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=80';
            }}
            className="w-full h-full object-cover object-center opacity-75 group-hover:opacity-85 group-hover:scale-105 transition-all duration-1000 ease-out"
          />
          {/* Subtle Directional Tarmac Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/75 to-transparent sm:bg-gradient-to-r sm:from-[#0b0e14] sm:via-[#0b0e14]/85 sm:to-transparent" />
        </a>

        {/* Content Container - Ample Breathing Room, Unclustered */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl text-white pointer-events-none">
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold">
            <span className="bg-[#d90429] text-white uppercase tracking-[0.2em] px-3 py-1 rounded text-[11px] font-bold shadow-md shadow-red-600/30">
              Lead Story
            </span>
            <span className="bg-white/15 backdrop-blur-md text-white px-3 py-1 rounded text-[11px] uppercase tracking-wider border border-white/10 font-bold">
              {article.category}
            </span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{readTime} min read</span>
            </div>
          </div>

          <h2 id="featured-story-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-5">
            <a
              href={articleUrl}
              onClick={handleLinkClick}
              className="pointer-events-auto hover:text-red-300 transition-colors"
            >
              {article.title}
            </a>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-8 line-clamp-2 leading-relaxed font-normal">
            {article.summary}
          </p>

          <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/15">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 font-bold">
              <Gauge className="w-3.5 h-3.5 text-[#d90429]" />
              The Daily Overdrive Investigation
            </div>

            <div className="flex items-center gap-3 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(article.id);
                }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#d90429] border-[#d90429] text-white shadow-lg shadow-red-600/40'
                    : 'bg-black/50 hover:bg-black/70 border-white/20 text-white backdrop-blur-md'
                }`}
                aria-label={isBookmarked ? 'Remove featured from saved' : 'Save featured'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <a
                href={articleUrl}
                onClick={handleLinkClick}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d90429] hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 group-hover:scale-102"
              >
                <span>Read Feature</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
