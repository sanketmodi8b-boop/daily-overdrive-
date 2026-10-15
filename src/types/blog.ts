export type Category = 'All' | 'News' | 'Exotics' | 'Culture' | 'Maintenance' | 'Daily Drivers';

export type SortOption = 'latest' | 'oldest' | 'readTime' | 'title';

export interface ArticlePhoto {
  url: string;
  title: string;
  caption: string;
  type: 'car' | 'fitting';
  alt: string; // Required descriptive alt text for SEO compliance
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  category: Exclude<Category, 'All'>;
  date: string;
  image: string;
  imageAlt: string; // Explicit descriptive alt text for primary car image
  fittingsImage: string;
  fittingsImageAlt: string; // Explicit descriptive alt text for mechanical fitting image
  gallery: ArticlePhoto[];
  summary: string;
  content: string;
  featured?: boolean;
  tags: string[];

  // SEO Project Specifications (Required for Academic Evaluation)
  seoTitle: string; // Max 60 characters with primary keyword near start
  seoDescription: string; // Max 160 characters, honest summary, organic keyword, click reason
  h1Heading: string; // Distinct page heading
  primaryKeyword: string; // Free organic non-paid keyword
  clickReason: string; // Reason to click / call to action
}

export interface FilterOptions {
  category: Category;
  searchQuery: string;
  selectedTag?: string | null;
  sortBy: SortOption;
}

export interface PageSeoData {
  metaTitle: string;
  metaDescription: string;
  h1Heading: string;
  primaryKeyword: string;
  clickReason: string;
  canonicalUrl: string;
  pageType: 'home' | 'article' | 'category' | 'saved';
  titleCharCount: number;
  descCharCount: number;
  isTitleValid: boolean; // <= 60 chars
  isDescValid: boolean; // <= 160 chars
  imageAltList: {
    src: string;
    alt: string;
    label: string;
  }[];
  linksAnchorList: {
    text: string;
    href: string;
    label: string;
  }[];
}
