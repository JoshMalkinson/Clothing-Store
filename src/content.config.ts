import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Product catalogue. Each product is a markdown file in
// `src/content/products/` — the frontmatter is validated against
// the schema below, and the markdown body is the long description.
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    category: z.enum([
      'everyday-movement',
      'on-the-field',
      'cooler-days',
      'rest-recover',
    ]),
    // Price in South African Rand (ZAR), whole rand.
    price: z.number().int().nonnegative(),
    sizes: z.array(z.string()).nonempty(),
    colors: z.array(z.string()).nonempty(),
    summary: z.string(),
    tag: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    // Optional path to a real product photo placed in `public/`.
    image: z.string().optional(),
  }),
});

export const collections = { products };
