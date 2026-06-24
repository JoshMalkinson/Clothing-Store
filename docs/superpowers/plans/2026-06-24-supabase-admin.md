# Supabase Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hidden Supabase-backed admin panel and runtime public product catalogue so new products can be published without rebuilding.

**Architecture:** Keep Astro as a static frontend and use Supabase directly from browser-side JavaScript. Shared product types and helpers live in focused library files; public routes render shells that hydrate product data at runtime.

**Tech Stack:** Astro 5, TypeScript, SCSS, browser `fetch`, Supabase Auth REST API, Supabase PostgREST, Supabase Storage API.

---

## Files

- Create: `src/lib/runtime-products.ts` for public/admin product types, categories, formatting, slug helpers, and Supabase request helpers.
- Create: `src/pages/product.astro` for runtime product detail lookup by `?slug=`.
- Create: `src/pages/admin.astro` for hidden login and product upload form.
- Create: `supabase/schema.sql` for table, bucket, RLS policy, and seed instructions.
- Create: `.env.example` for Supabase public configuration.
- Modify: `src/pages/shop/index.astro` to render a client-hydrated live product grid.
- Modify: `src/components/ProductCard.astro` to link to `/product?slug=...` for no-rebuild product detail routing.
- Modify: `.gitignore` to ignore companion scratch files.

## Tasks

### Task 1: Shared Supabase Runtime Library

- [ ] Create `src/lib/runtime-products.ts` with product interfaces, category metadata, `withBase` import, `formatPrice`, `colorHex`, `slugify`, Supabase config detection, `supabaseFetch`, `listProducts`, `getProductBySlug`, `uploadProductImage`, and `createProduct`.
- [ ] Keep requests dependency-free by using browser `fetch` and Supabase REST endpoints.

### Task 2: Live Shop Page

- [ ] Replace the build-time `getCollection('products')` shop data with a static shell.
- [ ] Add a module script that imports `listProducts`, renders product cards into the grid, handles filters, preserves hash filtering, and shows loading/error/empty/setup states.
- [ ] Use `/product?slug=<slug>` links so newly-created products work immediately.

### Task 3: Runtime Product Page

- [ ] Add `src/pages/product.astro` with a static shell.
- [ ] Add a module script that reads `slug` from `location.search`, fetches the product, renders details, and fetches related products from the same category.
- [ ] Show helpful missing-slug, not-found, setup, loading, and fetch-error states.

### Task 4: Admin Page

- [ ] Add `src/pages/admin.astro` with login and product creation screens.
- [ ] Use Supabase email/password token endpoint for sign-in and local session storage.
- [ ] Validate required fields, parse comma-separated sizes/colors, upload an optional image, create the product row, and display success/error feedback.
- [ ] Keep `/admin` hidden from nav.

### Task 5: Supabase Setup Docs

- [ ] Add `supabase/schema.sql` with `products` table, indexes, storage bucket setup, RLS policies, and current catalogue seed rows.
- [ ] Add `.env.example` with `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.

### Task 6: Verification

- [ ] Run `npm.cmd run build`.
- [ ] Confirm static routes build and the no-rebuild routes are emitted.
- [ ] Check `git status --short` and summarize changed files.

