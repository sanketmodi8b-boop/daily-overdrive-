import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroFeatured } from './components/HeroFeatured';
import { CategoryFilter } from './components/CategoryFilter';
import { ArticleCard } from './components/ArticleCard';
import { ArticleView } from './components/ArticleView';
import { SavedView } from './components/SavedView';
import { NewsletterBanner } from './components/NewsletterBanner';
import { Footer } from './components/Footer';
import { ARTICLES_DATA } from './data/articles';
import { filterAndSortArticles, slugToCategory, categoryToSlug } from './utils/blog';
import { useRouter } from './hooks/useRouter';
import type { Article, Category, SortOption } from './types/blog';
import { SearchX } from 'lucide-react';

export default function App() {
  const { currentPath, routeState, navigate } = useRouter();

  // --- Persistent Dark Mode ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('theme');
    if (stored === 'light') return false;
    if (stored === 'dark') return true;
    return true; // Default to dark automotive theme
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // --- Filtering & Sorting State ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // Derive current category from URL route if on /category/:slug
  const currentCategory: Category = useMemo(() => {
    if (routeState.categorySlug) {
      return slugToCategory(routeState.categorySlug);
    }
    return 'All';
  }, [routeState.categorySlug]);

  // Sync document title for non-article routes
  useEffect(() => {
    if (routeState.articleSlug) {
      // Handled dynamically inside ArticleView
    } else if (routeState.isSavedPage) {
      document.title = 'Saved Dispatches — The Daily Overdrive';
    } else if (routeState.categorySlug) {
      document.title = `${currentCategory} Archive — The Daily Overdrive`;
    } else {
      document.title = 'The Daily Overdrive | Premier Automotive Journal';
    }
  }, [routeState, currentCategory]);

  // --- Bookmarks State with Persistence ---
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('daily_overdrive_bookmarks');
      return stored ? JSON.parse(stored) : [1];
    } catch {
      return [1];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('daily_overdrive_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearAllBookmarks = () => {
    setBookmarkedIds([]);
  };

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    return filterAndSortArticles(ARTICLES_DATA, {
      category: currentCategory,
      search: searchQuery,
      sortBy: sortBy,
    });
  }, [currentCategory, searchQuery, sortBy]);

  // Bookmarked articles list
  const bookmarkedArticles = useMemo(() => {
    return ARTICLES_DATA.filter((a) => bookmarkedIds.includes(a.id));
  }, [bookmarkedIds]);

  // Lead featured article
  const leadArticle = useMemo(() => {
    return ARTICLES_DATA.find((a) => a.featured) || ARTICLES_DATA[0];
  }, []);

  // Currently viewed article if on /article/:slug
  const activeArticle = useMemo(() => {
    if (!routeState.articleSlug) return null;
    return ARTICLES_DATA.find((a) => a.slug === routeState.articleSlug) || null;
  }, [routeState.articleSlug]);

  const handleSelectCategory = (cat: Category) => {
    if (cat === 'All') {
      navigate('/');
    } else {
      navigate(`/category/${categoryToSlug(cat)}`);
    }
  };

  const categoriesList: Category[] = [
    'All',
    'News',
    'Exotics',
    'Culture',
    'Maintenance',
    'Daily Drivers',
  ];

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#121316] dark:bg-[#0d0f12] dark:text-[#f8f9fa] flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentCategory={currentCategory}
        bookmarkCount={bookmarkedIds.length}
        onNavigate={navigate}
        activePath={currentPath}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Route 1: Dedicated Article Page (/article/:slug) */}
        {activeArticle ? (
          <ArticleView
            article={activeArticle}
            onNavigate={navigate}
            isBookmarked={bookmarkedIds.includes(activeArticle.id)}
            onToggleBookmark={toggleBookmark}
            allArticles={ARTICLES_DATA}
          />
        ) : routeState.articleSlug ? (
          /* 404 for invalid article slug */
          <div className="max-w-xl mx-auto px-4 py-28 text-center">
            <h2 className="text-2xl font-black mb-3">Dispatch Not Found</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              The article you are looking for has been archived or relocated.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-lg bg-[#d90429] text-white font-bold text-xs uppercase tracking-wider"
            >
              Return to Journal
            </button>
          </div>
        ) : routeState.isSavedPage ? (
          /* Route 2: Saved Stories Page (/saved) */
          <SavedView
            bookmarkedArticles={bookmarkedArticles}
            onNavigate={navigate}
            onToggleBookmark={toggleBookmark}
            onClearAll={clearAllBookmarks}
          />
        ) : (
          /* Route 3: Home & Category Archive Pages (/, /category/:category) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 w-full">
            {/* Lead Story Marquee on Home (only when on '/' and no active search) */}
            {currentCategory === 'All' && !searchQuery && leadArticle && (
              <HeroFeatured
                article={leadArticle}
                onRead={(slug) => navigate(`/article/${slug}`)}
                isBookmarked={bookmarkedIds.includes(leadArticle.id)}
                onToggleBookmark={toggleBookmark}
              />
            )}

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase italic text-slate-900 dark:text-white">
                {currentCategory === 'All' ? (
                  <>
                    Latest <span className="text-[#d90429]">Dispatches</span>
                  </>
                ) : (
                  <>
                    {currentCategory} <span className="text-[#d90429]">Archive</span>
                  </>
                )}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-normal max-w-2xl">
                {currentCategory === 'All'
                  ? 'Deep technical dives, exotic aerodynamics, and mechanical culture.'
                  : `Curated dispatches and engineering breakdowns in ${currentCategory}.`}
              </p>
            </div>

            {/* Clean Category Navigation & Sorting */}
            <CategoryFilter
              categories={categoriesList}
              currentCategory={currentCategory}
              onSelectCategory={handleSelectCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              totalFilteredCount={filteredArticles.length}
            />

            {/* Articles Grid or Empty Fallback */}
            {filteredArticles.length > 0 ? (
              <div
                id="blogGrid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredArticles.map((article, idx) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onSelect={(slug) => navigate(`/article/${slug}`)}
                    isBookmarked={bookmarkedIds.includes(article.id)}
                    onToggleBookmark={toggleBookmark}
                    priority={idx < 3}
                  />
                ))}
              </div>
            ) : (
              <div
                id="noResults"
                className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-white dark:bg-[#15181e] border border-[#e2e5ea] dark:border-[#222631]"
              >
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#1e222b] text-slate-400 mb-4">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  No Dispatches Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  No articles matched your criteria. Clear filters or explore all topics.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    navigate('/');
                  }}
                  className="px-5 py-2 rounded-lg bg-[#d90429] hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Newsletter Subscription */}
            <NewsletterBanner />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
