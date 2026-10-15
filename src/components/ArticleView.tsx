import React, { useEffect, useState } from 'react';
import {
  Clock,
  Calendar,
  Bookmark,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Gauge,
  Tag,
  Wrench,
  Car,
  Layers,
  ZoomIn,
  X,
} from 'lucide-react';
import type { Article, ArticlePhoto } from '../types/blog';
import { calcReadTime, formatDate, categoryToSlug } from '../utils/blog';
import { getPageSeoData, updateDocumentHead } from '../utils/seo';
import { SeoClassInspector } from './SeoClassInspector';
import { OptimizedImage } from './OptimizedImage';

interface ArticleViewProps {
  article: Article;
  onNavigate: (path: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  allArticles: Article[];
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onNavigate,
  isBookmarked,
  onToggleBookmark,
  allArticles,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeMediaFilter, setActiveMediaFilter] = useState<'all' | 'car' | 'fitting'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<ArticlePhoto | null>(null);

  const readTime = calcReadTime(article.content);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : `/article/${article.slug}`;
  const seoData = getPageSeoData(currentPath, article.slug, null, false, article);

  // Synchronize dynamic HTML <head> metadata for search engines and crawlers
  useEffect(() => {
    updateDocumentHead(seoData, article);
  }, [article, seoData]);

  // Track window scroll progress for top meter bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut Esc to close photo lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate(path);
  };

  // Find prev / next articles
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Filter gallery photos
  const filteredGallery = article.gallery.filter((p) => {
    if (activeMediaFilter === 'all') return true;
    return p.type === activeMediaFilter;
  });

  return (
    <article className="min-h-screen pb-28">
      {/* 1. Academic SEO Class Project Inspector Bar */}
      <SeoClassInspector seo={seoData} uniqueUrl={seoData.canonicalUrl} />

      {/* Top Reading Progress Bar */}
      <div className="fixed top-20 left-0 right-0 h-1 bg-transparent z-40 pointer-events-none">
        <div
          className="h-full bg-[#d90429] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10">
        {/* Clean Breadcrumb Navigation with explicit anchor text */}
        <nav aria-label="Article Breadcrumb" className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#d90429] dark:hover:text-[#d90429] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Journal Feed</span>
          </a>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
            <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:underline">
              Journal Home
            </a>
            <span className="text-slate-400">/</span>
            <a
              href={`/category/${categoryToSlug(article.category)}`}
              onClick={(e) => handleLinkClick(e, `/category/${categoryToSlug(article.category)}`)}
              className="text-[#d90429] hover:underline font-bold"
            >
              {article.category} Section
            </a>
          </div>
        </nav>

        {/* Category Pill Tag */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded bg-[#d90429]/10 text-[#d90429] dark:bg-[#d90429]/20 text-xs font-bold uppercase tracking-widest border border-[#d90429]/30">
            {article.category} Analysis
          </span>
        </div>

        {/* Labeled Page Heading (H1) for SEO Class Project */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
            Page Heading (&lt;h1&gt;)
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Target Keyword: "{article.primaryKeyword}"
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
          {article.h1Heading || article.title}
        </h1>

        {/* Subhead / Excerpt */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
          {article.summary}
        </p>

        {/* Professional Metadata & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-[#222631] text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              <Gauge className="w-4 h-4 text-[#d90429]" />
              The Daily Overdrive
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(article.date)}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {readTime} min read
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#222631] bg-white dark:bg-[#121620] text-slate-700 dark:text-slate-300 hover:border-[#d90429] dark:hover:border-[#d90429] transition-all cursor-pointer shadow-sm text-xs font-bold"
              aria-label={`Share ${article.title}`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Article'}</span>
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer shadow-sm text-xs font-bold ${
                isBookmarked
                  ? 'border-[#d90429] bg-[#d90429] text-white shadow-md shadow-red-600/30'
                  : 'border-slate-200 dark:border-[#222631] bg-white dark:bg-[#121620] text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
              aria-label={isBookmarked ? `Remove ${article.title} from saved articles` : `Save ${article.title} for later`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Saved' : 'Save Article'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Car Photograph - Optimized fast delivery with descriptive alt text */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-200 dark:border-[#222631]">
          <OptimizedImage
            src={article.image}
            alt={article.imageAlt}
            targetWidth={720}
            quality={70}
            priority={true}
            aspectRatioClass="aspect-[16/9]"
            fallbackTitle={article.title}
          />
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 bg-[#0b0e14]/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
              <Car className="w-3.5 h-3.5 text-[#d90429]" /> Vehicle in Motion
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-3 px-1">
          <span>The Daily Overdrive Archive // {article.category}</span>
          <span className="font-mono text-emerald-400 dark:text-emerald-400">
            Alt Text Verified ✓: "{article.imageAlt.slice(0, 50)}..."
          </span>
        </div>
      </div>

      {/* Article Body Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className="article-prose text-slate-800 dark:text-slate-200"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Mechanical Fittings & Technical Hardware Spotlight Card */}
        {article.fittingsImage && (
          <div className="my-16 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-[#222631] shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-[#1e2433]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-[#d90429] border border-red-500/20">
                  <Wrench className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Mechanical Fittings &amp; Hardware Spotlight
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Critical engineering tolerance &amp; component teardown
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-[#d90429] tracking-widest bg-red-500/10 px-2.5 py-1 rounded">
                Fig. 2.0 Hardware
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div
                onClick={() =>
                  setSelectedPhoto({
                    url: article.fittingsImage,
                    title: 'Mechanical Fitting Detail',
                    caption: article.fittingsImageAlt,
                    type: 'fitting',
                    alt: article.fittingsImageAlt,
                  })
                }
                className="relative cursor-pointer group"
              >
                <OptimizedImage
                  src={article.fittingsImage}
                  alt={article.fittingsImageAlt}
                  targetWidth={500}
                  quality={70}
                  aspectRatioClass="aspect-[4/3]"
                  fallbackTitle="Mechanical Hardware Component"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-xl">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black/75 px-3.5 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                    <ZoomIn className="w-4 h-4 text-[#d90429]" /> Inspect Fitting
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 bg-[#d90429] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-md">
                    <Wrench className="w-3 h-3" /> Technical Fitting
                  </span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white text-base">
                  Precision Metallurgy &amp; High-Tolerance Assembly
                </p>
                <p>
                  High-performance vehicles demand specialized mechanical fittings calibrated to endure extreme vibrational frequencies, thermal cycles exceeding 800°C, and sustained hydraulic pressure.
                </p>
                <div className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-500/20">
                  <strong>Fitting Alt Tag:</strong> "{article.fittingsImageAlt}"
                </div>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="inline-flex items-center gap-1 bg-white dark:bg-[#0b0e14] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#222631]">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Track-vetted
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white dark:bg-[#0b0e14] px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#222631]">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Billet alloy
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photos & Mechanical Fittings Gallery Section */}
        {article.gallery.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-[#222631]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                  Photography &amp; <span className="text-[#d90429]">Fittings Gallery</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  High-resolution car dynamics and detailed mechanical hardware photography (Optimized lightweight sizes).
                </p>
              </div>

              {/* Gallery Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121620] p-1 rounded-xl border border-slate-200 dark:border-[#222631] text-xs">
                <button
                  onClick={() => setActiveMediaFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeMediaFilter === 'all'
                      ? 'bg-[#d90429] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-label="Show all gallery media"
                >
                  <Layers className="w-3.5 h-3.5 inline mr-1" /> All ({article.gallery.length})
                </button>
                <button
                  onClick={() => setActiveMediaFilter('car')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeMediaFilter === 'car'
                      ? 'bg-[#d90429] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-label="Filter gallery to car photos only"
                >
                  <Car className="w-3.5 h-3.5 inline mr-1" /> Cars
                </button>
                <button
                  onClick={() => setActiveMediaFilter('fitting')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeMediaFilter === 'fitting'
                      ? 'bg-[#d90429] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-label="Filter gallery to mechanical fittings only"
                >
                  <Wrench className="w-3.5 h-3.5 inline mr-1" /> Fittings
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGallery.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative flex flex-col bg-white dark:bg-[#121620] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#222631] hover:border-slate-400 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <OptimizedImage
                      src={photo.url}
                      alt={photo.alt || `${photo.title} - ${photo.caption}`}
                      targetWidth={480}
                      quality={70}
                      aspectRatioClass="aspect-[16/10]"
                      fallbackTitle={photo.title}
                    />
                    <div className="absolute top-3 left-3 pointer-events-none z-10">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-md ${
                          photo.type === 'car'
                            ? 'bg-[#0b0e14]/90 text-white border border-white/10'
                            : 'bg-[#d90429] text-white'
                        }`}
                      >
                        {photo.type === 'car' ? (
                          <>
                            <Car className="w-3 h-3" /> Vehicle
                          </>
                        ) : (
                          <>
                            <Wrench className="w-3 h-3" /> Fitting
                          </>
                        )}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <span className="p-2.5 rounded-full bg-black/75 backdrop-blur-sm border border-white/20">
                        <ZoomIn className="w-4 h-4 text-[#d90429]" />
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-[#d90429] transition-colors">
                        {photo.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    </div>
                    <span className="mt-2 text-[9px] font-mono text-emerald-400 dark:text-emerald-400 block truncate">
                      Alt: "{photo.alt}"
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic Tags */}
        {article.tags.length > 0 && (
          <div className="mt-14 pt-8 border-t border-slate-200 dark:border-[#222631]">
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Tag className="w-3.5 h-3.5 text-[#d90429]" /> Filed under topics:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {article.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/?tag=${tag}`}
                  onClick={(e) => handleLinkClick(e, `/?tag=${tag}`)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#121620] hover:bg-red-500/10 border border-slate-200 dark:border-[#222631] text-slate-700 dark:text-slate-300 hover:text-[#d90429] transition-colors"
                >
                  Explore #{tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Previous / Next Article Navigation with explicit anchor text */}
        <div className="mt-14 pt-10 border-t border-slate-200 dark:border-[#222631] grid grid-cols-1 sm:grid-cols-2 gap-5">
          {prevArticle ? (
            <a
              href={`/article/${prevArticle.slug}`}
              onClick={(e) => handleLinkClick(e, `/article/${prevArticle.slug}`)}
              className="flex flex-col items-start p-6 rounded-2xl border border-slate-200 dark:border-[#222631] hover:border-[#d90429] dark:hover:border-[#d90429] bg-white dark:bg-[#121620] text-left transition-all cursor-pointer group shadow-sm"
              aria-label={`Read previous article: ${prevArticle.title}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2 group-hover:text-[#d90429] transition-colors">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Previous Analysis
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                {prevArticle.title}
              </span>
            </a>
          ) : (
            <div />
          )}

          {nextArticle && (
            <a
              href={`/article/${nextArticle.slug}`}
              onClick={(e) => handleLinkClick(e, `/article/${nextArticle.slug}`)}
              className="flex flex-col items-end p-6 rounded-2xl border border-slate-200 dark:border-[#222631] hover:border-[#d90429] dark:hover:border-[#d90429] bg-white dark:bg-[#121620] text-right transition-all cursor-pointer group shadow-sm"
              aria-label={`Read next article: ${nextArticle.title}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2 group-hover:text-[#d90429] transition-colors">
                Next Analysis <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                {nextArticle.title}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Photo Inspection */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-4xl w-full bg-[#121620] rounded-3xl overflow-hidden border border-[#222631] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#222631]">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                    selectedPhoto.type === 'car' ? 'bg-[#0b0e14] text-white' : 'bg-[#d90429] text-white'
                  }`}
                >
                  {selectedPhoto.type === 'car' ? 'Vehicle Photography' : 'Mechanical Fitting Hardware'}
                </span>
                <span className="text-xs font-bold text-white">{selectedPhoto.title}</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#222631] cursor-pointer"
                aria-label="Close photo inspection modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.alt || selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 bg-[#0b0e14] text-xs text-slate-300 flex items-center justify-between gap-4">
              <p>{selectedPhoto.caption}</p>
              <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                Alt: "{selectedPhoto.alt || selectedPhoto.title}"
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
