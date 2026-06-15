import type { CollectionEntry } from 'astro:content';

export type CategorySlug =
  | 'everyday-movement'
  | 'on-the-field'
  | 'cooler-days'
  | 'rest-recover';

export interface Category {
  slug: CategorySlug;
  label: string;
  blurb: string;
}

// Single source of truth for product categories (used by the shop,
// the homepage collections grid, and product pages).
export const categories: Category[] = [
  {
    slug: 'everyday-movement',
    label: 'Everyday Movement',
    blurb: 'Soft layering staples for school days and the rush in between.',
  },
  {
    slug: 'on-the-field',
    label: 'On the Field',
    blurb: 'Performance pieces that breathe, stretch, and dry fast.',
  },
  {
    slug: 'cooler-days',
    label: 'Cooler Days',
    blurb: 'Warm, lightweight layers for early starts and late finishes.',
  },
  {
    slug: 'rest-recover',
    label: 'Rest & Recover',
    blurb: 'Relaxed essentials for the calm after the game.',
  },
];

const labelBySlug = new Map(categories.map((c) => [c.slug, c.label]));

export function categoryLabel(slug: string): string {
  return labelBySlug.get(slug as CategorySlug) ?? slug;
}

// Prices are stored as whole Rand; format as South African currency.
const zarFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return zarFormatter.format(value);
}

// Named colour swatches -> hex, for the little colour dots on cards.
// Product colours can be more playful than the brand chrome.
const swatchHex: Record<string, string> = {
  Sage: '#aed3b5',
  Fern: '#5f9d6c',
  Forest: '#386043',
  Mist: '#e6f1e8',
  Chalk: '#f3f5f2',
  Slate: '#4c544d',
  Storm: '#69716a',
  Ink: '#181d19',
  Sand: '#efe9dc',
  Clay: '#c98b6b',
  Sky: '#bcd6e6',
  Blossom: '#e9c9d4',
  Sunbeam: '#ecd9a3',
  Coral: '#e8a99b',
};

export function colorHex(name: string): string {
  return swatchHex[name] ?? '#c9d3cc';
}

export function sortProducts(
  a: CollectionEntry<'products'>,
  b: CollectionEntry<'products'>,
): number {
  return a.data.order - b.data.order || a.data.name.localeCompare(b.data.name);
}
