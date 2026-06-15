# Fernly — Activewear marketing site

A fast, polished single-page advertising site for a kids & teenagers activewear brand.
Built with **Astro** + **SCSS**. Light, airy, mostly-white design with soft sage-green
accents and refined typography.

> `Fernly` is a placeholder brand name — change it (and the copy) in `src/site.config.ts`.

## Quickstart

This machine's PowerShell blocks `npm.ps1`, so use **`npm.cmd`**:

```pwsh
npm.cmd install
npm.cmd run dev      # http://localhost:4321
```

To build for production:

```pwsh
npm.cmd run build    # outputs static files to dist/
npm.cmd run preview  # preview the built site
```

## Where things live

| Area | File |
| --- | --- |
| Editable copy / brand name | `src/site.config.ts` |
| Colour palette (polish here) | `src/styles/_palette.scss` |
| Fonts | `src/styles/_typography.scss` + `src/layouts/Base.astro` |
| Design tokens / base styles | `src/styles/global.scss` |
| Page sections | `src/components/*.astro` |
| Page composition | `src/pages/index.astro` |
| Images / static assets | `public/` |

## Customising

- **Colours:** edit `src/styles/_palette.scss`. Values flow into the site through the
  `--color-*` CSS variables in `src/styles/global.scss`.
- **Copy & brand:** edit `src/site.config.ts`.
- **Photos:** the image areas are styled placeholders — drop real photos into `public/`
  and swap them into `Hero.astro` / `Story.astro` / `Collections.astro`.
- **Fonts:** change the families in `_typography.scss` and the Google Fonts `<link>` in
  `Base.astro`.
