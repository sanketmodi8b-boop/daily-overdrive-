import type { Article, Category, SortOption } from '../types/blog';

export const DEFAULT_ARTICLE_IMAGE =
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80';

export const DEFAULT_FITTING_IMAGE =
  'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=1200&q=80';

/**
 * Calculates estimated reading time in minutes based on 200 words per minute.
 * Strips HTML tags before counting words.
 */
export function calcReadTime(content: string, wpm: number = 200): number {
  if (!content || typeof content !== 'string') return 1;
  const stripped = content.replace(/<[^>]*>/g, ' ');
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;
  return Math.max(1, Math.ceil(words.length / wpm));
}

/**
 * Formats ISO date string or YYYY-MM-DD into human-readable journal format.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Convert category name to URL-friendly path segment
 */
export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Convert slug back to Category type
 */
export function slugToCategory(slug: string): Category {
  const normalized = slug.toLowerCase();
  switch (normalized) {
    case 'news':
      return 'News';
    case 'exotics':
      return 'Exotics';
    case 'culture':
      return 'Culture';
    case 'maintenance':
      return 'Maintenance';
    case 'daily-drivers':
    case 'dailydrivers':
      return 'Daily Drivers';
    default:
      return 'All';
  }
}

/**
 * Filters and sorts articles deterministically.
 */
export function filterAndSortArticles(
  articles: Article[],
  options: {
    category?: Category;
    search?: string;
    tag?: string | null;
    sortBy?: SortOption;
  }
): Article[] {
  const { category = 'All', search = '', tag = null, sortBy = 'latest' } = options;
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = articles.filter((article) => {
    // Category match
    if (category !== 'All' && article.category !== category) {
      return false;
    }

    // Tag match
    if (tag && !article.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())) {
      return false;
    }

    // Search query match across title, summary, content, category, and tags
    if (normalizedSearch) {
      const inTitle = article.title.toLowerCase().includes(normalizedSearch);
      const inSummary = article.summary.toLowerCase().includes(normalizedSearch);
      const inCategory = article.category.toLowerCase().includes(normalizedSearch);
      const inTags = article.tags.some((t) => t.toLowerCase().includes(normalizedSearch));
      const inContent = article.content.toLowerCase().includes(normalizedSearch);

      if (!inTitle && !inSummary && !inCategory && !inTags && !inContent) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'readTime': {
        const timeA = calcReadTime(a.content);
        const timeB = calcReadTime(b.content);
        return timeA - timeB;
      }
      case 'title':
        return a.title.localeCompare(b.title);
      case 'latest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });
}
