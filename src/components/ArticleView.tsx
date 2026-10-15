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

  // Track window scroll progress
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
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
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
    <article className="min-h-screen pb-24">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-20 left-0 right-0 h-1 bg-transparent z-40">
        <div
          className="h-full bg-[#d90429] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header & Meta */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-8">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[#d90429] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal</span>
          </button>

          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate('/')} className="hover:underline cursor-pointer">
              Journal
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate(`/category/${categoryToSlug(article.category)}`)}
              className="text-[#d90429] hover:underline cursor-pointer uppercase font-bold"
            >
              {article.category}
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
          {article.title}
        </h1>

        {/* Subhead / Excerpt */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
          {article.summary}
        </p>

        {/* Clean Editorial Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#e2e5ea] dark:border-[#222631] text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              <Gauge className="w-4 h-4 text-[#d90429]" />
              The Daily Overdrive
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2e5ea] dark:border-[#222631] bg-white dark:bg-[#15181e] text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-colors cursor-pointer"
              aria-label="Share article link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'border-[#d90429] bg-red-50 dark:bg-red-950/40 text-[#d90429]'
                  : 'border-[#e2e5ea] dark:border-[#222631] bg-white dark:bg-[#15181e] text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
              aria-label={isBookmarked ? 'Remove from saved' : 'Save article'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Car Photograph */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="relative aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-[#e2e5ea] dark:border-[#222631] group">
          <img
            src={article.image}
            alt={article.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#0d0f12]/85 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded border border-white/10">
              <Car className="w-3.5 h-3.5 text-[#d90429]" /> Vehicle in Motion
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-2 px-1">
          <span>The Daily Overdrive Archive // {article.category}</span>
          <span className="hidden sm:inline">Fig. 1.0 — Track & Vehicle Dynamics</span>
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
          <div className="my-14 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15181e] border border-[#e2e5ea] dark:border-[#222631] shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-[#222631]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#d90429]">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Mechanical Fittings & Hardware Spotlight
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Critical engineering tolerance & component teardown
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Fig. 2.0 Hardware
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div
                onClick={() =>
                  setSelectedPhoto({
                    url: article.fittingsImage,
                    title: 'Mechanical Fitting Detail',
                    caption: 'High-tolerance engineering component fitted to vehicle platform.',
                    type: 'fitting',
                  })
                }
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group"
              >
                <img
                  src={article.fittingsImage}
                  alt="Mechanical fitting component"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    <ZoomIn className="w-4 h-4" /> Inspect Fitting
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-[#d90429] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
                    <Wrench className="w-3 h-3" /> Technical Fitting
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Precision Engineering & Component Assembly
                </p>
                <p>
                  Every high-performance vehicle requires specialized fittings engineered to withstand thermal cycling, extreme hydraulic pressures, and vibration loads. From billet aluminum brackets to braided aerospace lines, tolerances are measured in hundredths of a millimeter.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Track-vetted
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Billet metallurgy
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photos & Mechanical Fittings Gallery Section */}
        {article.gallery.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#e2e5ea] dark:border-[#222631]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                  Photography & <span className="text-[#d90429]">Fittings Gallery</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  High-resolution car dynamics and detailed mechanical hardware photography.
                </p>
              </div>

              {/* Gallery Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#15181e] p-1 rounded-xl border border-[#e2e5ea] dark:border-[#222631] text-xs">
                <button
                  onClick={() => setActiveMediaFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeMediaFilter === 'all'
                      ? 'bg-[#d90429] text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 inline mr-1" /> All ({article.gallery.length})
                </button>
                <button
                  onClick={() => setActiveMediaFilter('car')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeMediaFilter === 'car'
                      ? 'bg-[#d90429] text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 inline mr-1" /> Cars
                </button>
                <button
                  onClick={() => setActiveMediaFilter('fitting')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeMediaFilter === 'fitting'
                      ? 'bg-[#d90429] text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 inline mr-1" /> Fittings
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGallery.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative flex flex-col bg-white dark:bg-[#15181e] rounded-2xl overflow-hidden border border-[#e2e5ea] dark:border-[#222631] shadow-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow ${
                          photo.type === 'car'
                            ? 'bg-[#0d0f12]/85 text-white'
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
                      <span className="p-2 rounded-full bg-black/60 backdrop-blur-sm">
                        <ZoomIn className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 group-hover:text-[#d90429] transition-colors">
                      {photo.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic Tags */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#e2e5ea] dark:border-[#222631]">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Tag className="w-3.5 h-3.5" /> Filed under:
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#15181e] border border-slate-200 dark:border-[#222631] text-slate-700 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Previous / Next Article Navigation */}
        <div className="mt-12 pt-8 border-t border-[#e2e5ea] dark:border-[#222631] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevArticle ? (
            <button
              onClick={() => onNavigate(`/article/${prevArticle.slug}`)}
              className="flex flex-col items-start p-5 rounded-2xl border border-[#e2e5ea] dark:border-[#222631] hover:border-[#d90429] bg-white dark:bg-[#15181e] text-left transition-all cursor-pointer group"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5 group-hover:text-[#d90429]">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous Story
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                {prevArticle.title}
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextArticle && (
            <button
              onClick={() => onNavigate(`/article/${nextArticle.slug}`)}
              className="flex flex-col items-end p-5 rounded-2xl border border-[#e2e5ea] dark:border-[#222631] hover:border-[#d90429] bg-white dark:bg-[#15181e] text-right transition-all cursor-pointer group"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5 group-hover:text-[#d90429]">
                Next Story <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                {nextArticle.title}
              </span>
            </button>
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
          <div className="relative max-w-4xl w-full bg-[#15181e] rounded-3xl overflow-hidden border border-[#222631] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#222631]">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                    selectedPhoto.type === 'car' ? 'bg-[#0d0f12] text-white' : 'bg-[#d90429] text-white'
                  }`}
                >
                  {selectedPhoto.type === 'car' ? 'Vehicle Photography' : 'Mechanical Fitting Hardware'}
                </span>
                <span className="text-xs font-bold text-white">{selectedPhoto.title}</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#222631] cursor-pointer"
                aria-label="Close photo inspection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-4 bg-[#121316] text-xs text-slate-300">
              <p>{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
