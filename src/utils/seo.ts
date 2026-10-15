import type { Article, Category, PageSeoData } from '../types/blog';
import { categoryToSlug } from './blog';

/**
 * Optimizes image URLs by reducing resolution and compression quality for rapid delivery.
 * Unsplash URLs are transformed to modern web sizes (e.g., w=720, q=70) to prevent slow loads.
 */
export function getOptimizedImageUrl(url: string, width: number = 720, quality: number = 70): string {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', width.toString());
      parsed.searchParams.set('q', quality.toString());
      return parsed.toString();
    } catch {
      return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, `q=${quality}`);
    }
  }
  return url;
}

/**
 * Standard Home Page SEO Metadata
 * Title: <= 60 chars with main keyword near start
 * Description: <= 160 chars, honest summary, organic keyword, click reason
 */
export const HOME_SEO_METADATA: PageSeoData = {
  metaTitle: 'Automotive News & Tech: The Daily Overdrive Journal', // 52 chars
  metaDescription:
    'Explore in-depth automotive engineering, exotic track tests, and classic car culture. Read our latest expert analyses to upgrade your motoring knowledge today.', // 157 chars
  h1Heading: 'The Daily Overdrive: Engineering, Exotics & Car Culture',
  primaryKeyword: 'Automotive News & Tech',
  clickReason: 'Read our latest expert analyses to upgrade your motoring knowledge today.',
  canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://dailyoverdrive.app/',
  pageType: 'home',
  titleCharCount: 52,
  descCharCount: 157,
  isTitleValid: true,
  isDescValid: true,
  imageAltList: [
    {
      src: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=720&q=70',
      alt: 'High-voltage electric vehicle proving ground mule with aerodynamic race aero',
      label: 'Featured Hero Automobile',
    },
    {
      src: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=480&q=70',
      alt: 'McLaren hypercar with active aerodynamic rear wing deployed on test track',
      label: 'Exotics Article Card',
    },
  ],
  linksAnchorList: [
    { text: 'Browse All Automotive News & Tech', href: '/', label: 'Home Navigation' },
    { text: 'Explore Exotics & Supercars', href: '/category/exotics', label: 'Category Link' },
    { text: 'Read Automotive Maintenance Guides', href: '/category/maintenance', label: 'Category Link' },
    { text: 'View Saved Bookmarked Articles', href: '/saved', label: 'Bookmarks Link' },
  ],
};

/**
 * Category-specific SEO Metadata
 */
export const CATEGORY_SEO_CONFIGS: Record<
  Exclude<Category, 'All'>,
  { metaTitle: string; metaDescription: string; h1: string; keyword: string; clickReason: string }
> = {
  News: {
    metaTitle: 'Automotive News & EV Tech: The Daily Overdrive', // 46 chars
    metaDescription:
      'Stay informed on EV technology breakthroughs, industry developments, and new powertrain releases. Read our news analyses to understand the automotive future.', // 157 chars
    h1: 'Automotive News & Emerging Powertrain Engineering',
    keyword: 'Automotive News & EV Tech',
    clickReason: 'Read our news analyses to understand the automotive future.',
  },
  Exotics: {
    metaTitle: 'Exotic Cars & Track Tests: The Daily Overdrive', // 46 chars
    metaDescription:
      'Experience track-tested exotic supercars, active aero dynamics, and V12 hyper-SUVs. Read our in-depth tests to discover peak automotive performance.', // 149 chars
    h1: 'Exotic Supercars, Hypercars & Dynamic Track Profiles',
    keyword: 'Exotic Cars & Track Tests',
    clickReason: 'Read our in-depth tests to discover peak automotive performance.',
  },
  Culture: {
    metaTitle: 'Car Culture & Restomods: The Daily Overdrive', // 44 chars
    metaDescription:
      'Celebrate manual gearboxes, bespoke restomods, and passionate automotive enthusiast culture. Read our cultural retrospectives to connect with true driving.', // 155 chars
    h1: 'Car Culture, Analog Manuals & Bespoke Restomod Builds',
    keyword: 'Car Culture & Restomods',
    clickReason: 'Read our cultural retrospectives to connect with true driving.',
  },
  Maintenance: {
    metaTitle: 'Car Maintenance & DIY Care: The Daily Overdrive', // 47 chars
    metaDescription:
      'Master essential vehicle care with active suspension maintenance and classic car winter storage guides. Read our engineering tips to safeguard your vehicle.', // 156 chars
    h1: 'Vehicle Maintenance, Suspension Upkeep & Winter Care',
    keyword: 'Car Maintenance & DIY Care',
    clickReason: 'Read our engineering tips to safeguard your vehicle.',
  },
  'Daily Drivers': {
    metaTitle: 'Daily Driver Car Reviews: The Daily Overdrive', // 45 chars
    metaDescription:
      'Find the best daily driver cars, lightweight hot hatches, and AWD vs 4WD winter comparisons. Read our real-world buyer breakdowns to choose your daily car.', // 156 chars
    h1: 'Daily Drivers, Underrated Hot Hatches & Winter AWD',
    keyword: 'Daily Driver Car Reviews',
    clickReason: 'Read our real-world buyer breakdowns to choose your daily car.',
  },
};

/**
 * Saved Articles Page SEO Metadata
 */
export const SAVED_SEO_METADATA: PageSeoData = {
  metaTitle: 'Saved Articles & Bookmarks: The Daily Overdrive', // 46 chars
  metaDescription:
    'Access your curated collection of bookmarked automotive engineering guides and supercar reviews. Read your saved articles offline anytime at your convenience.', // 159 chars
  h1Heading: 'Your Saved Automotive Engineering & Culture Reading List',
  primaryKeyword: 'Saved Articles & Bookmarks',
  clickReason: 'Read your saved articles offline anytime at your convenience.',
  canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}/saved` : 'https://dailyoverdrive.app/saved',
  pageType: 'saved',
  titleCharCount: 46,
  descCharCount: 159,
  isTitleValid: true,
  isDescValid: true,
  imageAltList: [],
  linksAnchorList: [
    { text: 'Return to Main Automotive Feed', href: '/', label: 'Home Link' },
    { text: 'Browse Latest News & Tech', href: '/category/news', label: 'News Category' },
  ],
};

/**
 * Dynamically resolves SEO metadata for any route
 */
export function getPageSeoData(
  currentPath: string,
  articleSlug: string | null,
  categorySlug: string | null,
  isSavedPage: boolean,
  article?: Article | null
): PageSeoData {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dailyoverdrive.app';

  // 1. Article Page
  if (article && articleSlug) {
    const canonical = `${origin}/article/${article.slug}`;
    const title = article.seoTitle || article.title;
    const desc = article.seoDescription || article.summary;

    const images = [
      {
        src: getOptimizedImageUrl(article.image, 720, 70),
        alt: article.imageAlt || `Vehicle overview for ${article.title}`,
        label: 'Primary Vehicle Photo',
      },
      {
        src: getOptimizedImageUrl(article.fittingsImage, 500, 70),
        alt: article.fittingsImageAlt || `Mechanical engineering fittings for ${article.title}`,
        label: 'Hardware Fittings Photo',
      },
      ...article.gallery.map((g) => ({
        src: getOptimizedImageUrl(g.url, 480, 70),
        alt: g.alt || `${g.title} - ${g.caption}`,
        label: `${g.type.toUpperCase()}: ${g.title}`,
      })),
    ];

    const links = [
      { text: `Back to All Automotive Articles`, href: '/', label: 'Feed Return Anchor' },
      {
        text: `View all ${article.category} Category Articles`,
        href: `/category/${categoryToSlug(article.category)}`,
        label: 'Category Taxonomy Anchor',
      },
      ...article.tags.map((t) => ({
        text: `Explore articles tagged #${t}`,
        href: `/?tag=${t}`,
        label: `Tag Anchor #${t}`,
      })),
    ];

    return {
      metaTitle: title,
      metaDescription: desc,
      h1Heading: article.h1Heading || article.title,
      primaryKeyword: article.primaryKeyword || article.category,
      clickReason: article.clickReason || 'Read our in-depth engineering breakdown to learn more.',
      canonicalUrl: canonical,
      pageType: 'article',
      titleCharCount: title.length,
      descCharCount: desc.length,
      isTitleValid: title.length <= 60 && title.length >= 25,
      isDescValid: desc.length <= 160 && desc.length >= 70,
      imageAltList: images,
      linksAnchorList: links,
    };
  }

  // 2. Saved Page
  if (isSavedPage) {
    return SAVED_SEO_METADATA;
  }

  // 3. Category Page
  if (categorySlug) {
    const catKeys = Object.keys(CATEGORY_SEO_CONFIGS) as Exclude<Category, 'All'>[];
    const matchedCategory = catKeys.find((c) => categoryToSlug(c) === categorySlug.toLowerCase());

    if (matchedCategory) {
      const cfg = CATEGORY_SEO_CONFIGS[matchedCategory];
      const canonical = `${origin}/category/${categorySlug}`;
      return {
        metaTitle: cfg.metaTitle,
        metaDescription: cfg.metaDescription,
        h1Heading: cfg.h1,
        primaryKeyword: cfg.keyword,
        clickReason: cfg.clickReason,
        canonicalUrl: canonical,
        pageType: 'category',
        titleCharCount: cfg.metaTitle.length,
        descCharCount: cfg.metaDescription.length,
        isTitleValid: cfg.metaTitle.length <= 60,
        isDescValid: cfg.metaDescription.length <= 160,
        imageAltList: [
          {
            src: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=720&q=70',
            alt: `${matchedCategory} automotive editorial showcase vehicle`,
            label: `${matchedCategory} Header Vehicle`,
          },
        ],
        linksAnchorList: [
          { text: 'Return to Full Journal Feed', href: '/', label: 'Home Link' },
          { text: `Filter articles within ${matchedCategory}`, href: `/category/${categorySlug}`, label: 'Self Category' },
        ],
      };
    }
  }

  // 4. Default: Home Page
  return HOME_SEO_METADATA;
}

/**
 * Dynamically modifies document <head> tags for SEO (Title, Meta Description, Canonical, OG, Twitter, JSON-LD)
 */
export function updateDocumentHead(seo: PageSeoData, article?: Article | null): void {
  if (typeof document === 'undefined') return;

  // 1. Title tag (<title>)
  document.title = seo.metaTitle;

  // 2. Meta description (<meta name="description">)
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', seo.metaDescription);

  // 3. Canonical link (<link rel="canonical">)
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', seo.canonicalUrl);

  // 4. OpenGraph tags
  const ogTags: Record<string, string> = {
    'og:title': seo.metaTitle,
    'og:description': seo.metaDescription,
    'og:url': seo.canonicalUrl,
    'og:type': seo.pageType === 'article' ? 'article' : 'website',
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // 5. Twitter Card tags
  const twitterTags: Record<string, string> = {
    'twitter:card': 'summary_large_image',
    'twitter:title': seo.metaTitle,
    'twitter:description': seo.metaDescription,
  };

  Object.entries(twitterTags).forEach(([name, content]) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // 6. Schema.org JSON-LD Structured Data
  let ldJsonScript = document.querySelector('script[type="application/ld+json"]#seo-ld-json');
  if (!ldJsonScript) {
    ldJsonScript = document.createElement('script');
    ldJsonScript.setAttribute('type', 'application/ld+json');
    ldJsonScript.setAttribute('id', 'seo-ld-json');
    document.head.appendChild(ldJsonScript);
  }

  const structuredData =
    seo.pageType === 'article' && article
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.seoTitle || article.title,
          description: article.seoDescription || article.summary,
          image: [article.image, article.fittingsImage],
          datePublished: article.date,
          dateModified: article.date,
          keywords: [article.primaryKeyword, ...article.tags].join(', '),
          publisher: {
            '@type': 'Organization',
            name: 'The Daily Overdrive',
            url: seo.canonicalUrl,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': seo.canonicalUrl,
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'The Daily Overdrive',
          headline: seo.h1Heading,
          description: seo.metaDescription,
          url: seo.canonicalUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${seo.canonicalUrl}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

  ldJsonScript.textContent = JSON.stringify(structuredData, null, 2);
}
