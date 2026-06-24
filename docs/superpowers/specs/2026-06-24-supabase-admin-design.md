# Supabase Admin Design

## Goal

Add a hidden, password-protected product admin panel that can publish new products without rebuilding the static Astro site.

## Architecture

The site remains an Astro static frontend deployable to GitHub Pages. Supabase becomes the live backend: Postgres stores product records, Storage stores product images, Auth protects the admin page, and Row Level Security controls reads and writes.

Public product listing and product detail screens fetch product data at runtime from Supabase using the public anon key. This allows new products to appear immediately after being created in the admin panel. Existing Markdown products remain in the repo as source/backup content and can be seeded into Supabase with a generated SQL script.

## Routes

- `/admin`: hidden admin panel, not linked from the navigation.
- `/shop`: public shop grid with live products and category filtering.
- `/product?slug=<slug>`: runtime product detail page for live Supabase products.
- `/products/[slug]`: existing static product pages can remain for now, but product cards should point at the runtime `/product` URL so new products work without rebuilds.

## Product Model

Products use the same business fields as the current Markdown catalogue:

- `slug`
- `name`
- `category`
- `price`
- `sizes`
- `colors`
- `summary`
- `description`
- `tag`
- `featured`
- `sort_order`
- `image_url`
- `published`

Categories remain the current four values:

- `everyday-movement`
- `on-the-field`
- `cooler-days`
- `rest-recover`

## Admin Behavior

The admin page signs in with Supabase email/password auth. After sign-in, it shows a product creation form. Image upload is optional; when provided, the file uploads to the `product-images` Supabase Storage bucket and the product record stores the public image URL.

The form validates required fields in the browser before submitting. It generates a slug from the product name unless the admin edits the slug manually. Successful creation resets the form and shows a confirmation message. Failures show a concise error message.

## Public Behavior

The shop page hydrates an empty product grid from Supabase in the browser. If Supabase is not configured, the page shows a setup message rather than breaking. If fetching fails, the page shows an error state.

Product detail pages use `/product?slug=<slug>` and fetch one published product by slug. Related products are fetched from the same category.

## Security

The frontend only uses Supabase URL and anon key values exposed through `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`. Write security must be enforced in Supabase with Row Level Security policies, not by hiding UI alone.

Anonymous users can read published products. Authenticated users can create, update, and delete products. The initial implementation assumes the Supabase project only grants credentials to trusted admins.

## Deployment

Add `.env.example` documenting the required public Supabase variables. Add SQL documentation for table, bucket, RLS policies, and optional seed data. No server process is required for the deployed site.

