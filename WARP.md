# WARP.md

This file gives Warp (warp.dev) the context it needs to work productively in this repository.

## Project

A single-page marketing / advertising site for a **kids and teenagers activewear** brand.

Visual direction: light and airy, mostly-white backgrounds, soft sage-green graphics,
refined editorial typography, and generous "executive" spacing. The tone implies care,
comfort, and durability.

> **Brand:** Action Bodywear. The name is centralised in `src/site.config.ts` (`brand`),
> and the logo is `src/components/Logo.astro` (an "AB" gradient badge evoking the official
> blue→green logo). Source artwork: `brand/action-bodywear-tag.pdf`.

> **Tone guard-rail:** do **not** state or imply the company is "locally made", small, or
> hand-made. Keep copy focused on craft, comfort, fit, and longevity.

## Tech stack

- **Astro 5** — static site, ships minimal/no JavaScript.
- **SCSS** — compiled by Astro via the `sass` package.
- **TypeScript** — used for the content/config file.

## Commands

> This machine runs **PowerShell with script execution disabled**, so `npm` (which resolves
> to `npm.ps1`) is blocked. Call npm through **`npm.cmd`** instead.

```pwsh
npm.cmd install        # install dependencies
npm.cmd run dev        # dev server at http://localhost:4321
npm.cmd run build      # production build -> dist/
npm.cmd run preview    # preview the production build
```

## Structure

- `src/site.config.ts` — **all editable copy** (brand, nav, hero, collections, approach,
  testimonials, CTA, footer). Start here for content/wording changes.
- `src/styles/_palette.scss` — **colour palette, single source of truth**. Polish colours here.
- `src/styles/_typography.scss` — font families + weights.
- `src/styles/global.scss` — maps the palette/tokens to CSS custom properties and defines base
  styles. Imported once in the layout.
- `src/layouts/Base.astro` — HTML shell, Google Fonts, SEO meta.
- `src/components/*.astro` — page sections: `Nav`, `Hero`, `ValueProps`, `Collections`,
  `Story`, `Testimonials`, `CTA`, `Footer`.
- `src/pages/index.astro` — composes the homepage from the section components.
- `public/` — static assets. Drop real hero / product / lifestyle photos here (the image
  panels are currently styled placeholders).

## Conventions

- **Colour comes from `_palette.scss`**, surfaced as `--color-*` CSS variables in `global.scss`.
  Reference colours in components with `var(--color-...)`, never hard-coded hex.
- Spacing, radius, shadow, and font tokens are also CSS variables defined in `global.scss` `:root`.
- Keep page copy in `src/site.config.ts` rather than hard-coding strings inside components.
- Section anchors used by the nav: `#top`, `#collections`, `#approach`, `#reviews`, `#contact`.
- Fonts: **Fraunces** (display/headings) + **Inter** (body/UI), loaded in `Base.astro`.
