export type Category = 'All' | 'News' | 'Exotics' | 'Culture' | 'Maintenance' | 'Daily Drivers';

export type SortOption = 'latest' | 'oldest' | 'readTime' | 'title';

export interface ArticlePhoto {
  url: string;
  title: string;
  caption: string;
  type: 'car' | 'fitting';
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  category: Exclude<Category, 'All'>;
  date: string;
  image: string;
  fittingsImage: string;
  gallery: ArticlePhoto[];
  summary: string;
  content: string;
  featured?: boolean;
  tags: string[];
}

export interface FilterOptions {
  category: Category;
  searchQuery: string;
  selectedTag?: string | null;
  sortBy: SortOption;
}
