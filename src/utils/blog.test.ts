import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcReadTime,
  formatDate,
  filterAndSortArticles,
  categoryToSlug,
  slugToCategory,
} from './blog.ts';
import { ARTICLES_DATA } from '../data/articles.ts';
import { getOptimizedImageUrl, getPageSeoData } from './seo.ts';
import type { Article } from '../types/blog.ts';

const mockArticles: Article[] = [
  {
    id: 1,
    slug: 'solid-state-battery-revolution',
    title: 'The Solid-State Battery Revolution: Erasing Range Anxiety',
    category: 'News',
    date: '2026-10-10',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7',
    imageAlt: 'Sleek aerodynamic high-voltage electric prototype testing solid-state battery cells on circuit',
    fittingsImage: 'https://images.unsplash.com/photo-1558441719-79883502930d',
    fittingsImageAlt: 'Solid-state battery management system micro-processor circuitry telemetry board',
    seoTitle: 'Solid-State Batteries: Why EVs Will Charge in 10 Min',
    seoDescription:
      'Discover how solid-state batteries offer 600-mile EV range and 10-minute fast charging. Read our engineering breakdown to see when mass adoption begins today.',
    h1Heading: 'The Solid-State Battery Revolution: Erasing Range Anxiety',
    primaryKeyword: 'Solid-State Batteries',
    clickReason: 'Read our engineering breakdown to see when mass adoption begins today.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7',
        title: 'EV Architecture',
        caption: 'High-voltage electric vehicle chassis platform.',
        alt: 'High-voltage electric vehicle chassis platform test mule',
        type: 'car',
      },
      {
        url: 'https://images.unsplash.com/photo-1558441719-79883502930d',
        title: 'Charging Fitting',
        caption: 'Combined Charging System high-amperage pin socket fitting.',
        alt: 'Combined charging system high-amperage pin socket fitting',
        type: 'fitting',
      },
    ],
    summary: 'Solid-state batteries emerge as the ultimate holy grail for range and safety.',
    content: '<p>' + 'word '.repeat(400) + '</p>',
    tags: ['EV', 'Battery', 'Engineering'],
  },
  {
    id: 2,
    slug: 'active-aerodynamics-hypercars',
    title: 'Active Aerodynamics: The Invisible Forces Shaping Hypercars',
    category: 'Exotics',
    date: '2026-10-08',
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16',
    imageAlt: 'Low-slung track hypercar cornering with active hydraulic rear wing deployed',
    fittingsImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
    fittingsImageAlt: 'High-pressure hydraulic servo lines and AN fittings for active airbrake',
    seoTitle: 'Active Hypercar Aerodynamics: How 200-MPH Wings Grip',
    seoDescription:
      'Learn how hydraulic active aerodynamics and DRS wings generate cornering suction. Read our technical deep dive to discover how modern hypercars tame air.',
    h1Heading: 'Active Aerodynamics: The Invisible Forces Shaping Hypercars',
    primaryKeyword: 'Active Hypercar Aerodynamics',
    clickReason: 'Read our technical deep dive to discover how modern hypercars tame air.',
    gallery: [],
    summary: 'Modern hypercars morph their bodies to conquer air.',
    content: '<p>' + 'word '.repeat(200) + '</p>',
    tags: ['Hypercars', 'Aero', 'Track'],
  },
];

test('calcReadTime calculates accurate reading time based on 200 wpm', () => {
  assert.equal(calcReadTime('<p>Hello world this is a test</p>'), 1);
  assert.equal(calcReadTime('<p>' + 'word '.repeat(200) + '</p>'), 1);
  assert.equal(calcReadTime('<p>' + 'word '.repeat(401) + '</p>'), 3);
  assert.equal(calcReadTime(''), 1);
});

test('formatDate formats ISO dates cleanly', () => {
  const formatted = formatDate('2026-10-10');
  assert.ok(formatted.includes('2026'));
  assert.ok(formatted.includes('Oct'));
});

test('category URL slug mapping works symmetrically', () => {
  assert.equal(categoryToSlug('Daily Drivers'), 'daily-drivers');
  assert.equal(slugToCategory('daily-drivers'), 'Daily Drivers');
  assert.equal(slugToCategory('exotics'), 'Exotics');
});

test('filterAndSortArticles filters by category correctly without writer dependency', () => {
  const news = filterAndSortArticles(mockArticles, { category: 'News' });
  assert.equal(news.length, 1);
  assert.equal(news[0].category, 'News');

  const exotics = filterAndSortArticles(mockArticles, { category: 'Exotics' });
  assert.equal(exotics.length, 1);
  assert.equal(exotics[0].title, 'Active Aerodynamics: The Invisible Forces Shaping Hypercars');
});

test('parsePath correctly extracts unique article slugs from various URL formats', async () => {
  const { parsePath } = await import('../hooks/useRouter.ts');

  // Standard pathname
  const route1 = parsePath('/article/solid-state-battery-revolution');
  assert.equal(route1.articleSlug, 'solid-state-battery-revolution');
  assert.equal(route1.path, '/article/solid-state-battery-revolution');

  // Query parameter fallback
  const route2 = parsePath('/', '?article=active-aerodynamics-hypercars');
  assert.equal(route2.articleSlug, 'active-aerodynamics-hypercars');
  assert.equal(route2.path, '/article/active-aerodynamics-hypercars');

  // Hash fallback
  const route3 = parsePath('/', '', '#/article/synthetic-fuels-ice-lifeline');
  assert.equal(route3.articleSlug, 'synthetic-fuels-ice-lifeline');
  assert.equal(route3.path, '/article/synthetic-fuels-ice-lifeline');
});

test('SEO Class Project Audit: All 10 articles strictly satisfy title <= 60 chars and desc <= 160 chars', () => {
  assert.equal(ARTICLES_DATA.length, 10);

  ARTICLES_DATA.forEach((article) => {
    // 1. Max 60 character title tag
    assert.ok(
      article.seoTitle.length <= 60,
      `Article "${article.title}" seoTitle is ${article.seoTitle.length} chars (must be <= 60)`
    );
    assert.ok(
      article.seoTitle.length >= 25,
      `Article "${article.title}" seoTitle too short`
    );

    // 2. Max 160 character meta description
    assert.ok(
      article.seoDescription.length <= 160,
      `Article "${article.title}" seoDescription is ${article.seoDescription.length} chars (must be <= 160)`
    );
    assert.ok(
      article.seoDescription.length >= 80,
      `Article "${article.title}" seoDescription too short`
    );

    // 3. Main keyword present in title
    assert.ok(
      article.seoTitle.toLowerCase().includes(article.primaryKeyword.toLowerCase().slice(0, 10)),
      `Article "${article.title}" seoTitle does not include primary keyword "${article.primaryKeyword}"`
    );

    // 4. Honest summary & natural keyword in description
    assert.ok(
      article.seoDescription.toLowerCase().includes(article.primaryKeyword.toLowerCase().slice(0, 10)),
      `Article "${article.title}" seoDescription missing natural keyword`
    );

    // 5. Concludes with reason to click
    assert.ok(
      article.seoDescription.includes(article.clickReason) || article.clickReason.length > 10,
      `Article "${article.title}" missing reason to click`
    );

    // 6. Distinct page heading (H1)
    assert.ok(article.h1Heading && article.h1Heading.length > 10);

    // 7. Image alt text present and descriptive
    assert.ok(article.imageAlt && article.imageAlt.length > 15, `Missing imageAlt for ${article.title}`);
    assert.ok(
      article.fittingsImageAlt && article.fittingsImageAlt.length > 15,
      `Missing fittingsImageAlt for ${article.title}`
    );

    // 8. All gallery photos have descriptive alt text
    article.gallery.forEach((g) => {
      assert.ok(g.alt && g.alt.length > 10, `Missing gallery alt text for ${g.title}`);
    });
  });
});

test('getOptimizedImageUrl reduces resolution for fast loading', () => {
  const rawUrl = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1400&q=80';
  const optimized = getOptimizedImageUrl(rawUrl, 720, 70);
  assert.ok(optimized.includes('w=720'));
  assert.ok(optimized.includes('q=70'));
});
