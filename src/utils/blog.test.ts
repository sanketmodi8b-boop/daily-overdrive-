import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcReadTime,
  formatDate,
  filterAndSortArticles,
  categoryToSlug,
  slugToCategory,
} from './blog.ts';
import type { Article } from '../types/blog.ts';

const mockArticles: Article[] = [
  {
    id: 1,
    slug: 'solid-state-battery-revolution',
    title: 'The Solid-State Battery Revolution: Erasing Range Anxiety',
    category: 'News',
    date: '2026-10-10',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7',
    fittingsImage: 'https://images.unsplash.com/photo-1558441719-79883502930d',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7',
        title: 'EV Architecture',
        caption: 'High-voltage electric vehicle chassis platform.',
        type: 'car',
      },
      {
        url: 'https://images.unsplash.com/photo-1558441719-79883502930d',
        title: 'Charging Fitting',
        caption: 'Combined Charging System high-amperage pin socket fitting.',
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
    fittingsImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
    gallery: [],
    summary: 'Modern hypercars morph their bodies to conquer air.',
    content: '<p>' + 'word '.repeat(200) + '</p>',
    tags: ['Hypercars', 'Aero', 'Track'],
  },
  {
    id: 3,
    slug: 'synthetic-fuels-ice',
    title: 'Synthetic Fuels: A Lifeline for the Internal Combustion Engine?',
    category: 'News',
    date: '2026-10-05',
    image: 'https://images.unsplash.com/photo-1632230491873-195977507eb2',
    fittingsImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b',
    gallery: [],
    summary: 'Can carbon-neutral e-fuels save the roaring V8 from extinction?',
    content: '<p>' + 'word '.repeat(600) + '</p>',
    tags: ['E-Fuels', 'V8', 'Innovation'],
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
  assert.equal(news.length, 2);
  assert.equal(news[0].category, 'News');

  const exotics = filterAndSortArticles(mockArticles, { category: 'Exotics' });
  assert.equal(exotics.length, 1);
  assert.equal(exotics[0].title, 'Active Aerodynamics: The Invisible Forces Shaping Hypercars');
});
