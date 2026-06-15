// Prefix internal links with Astro's configured `base` path so they work
// both locally and when served from a GitHub Pages subpath
// (e.g. https://joshmalkinson.github.io/Clothing-Store/).
//
// `import.meta.env.BASE_URL` always ends with a trailing slash
// ('/' when no base is set, '/Clothing-Store/' on Pages).
const BASE_URL = import.meta.env.BASE_URL;

export function withBase(path: string = '/'): string {
  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  if (path === '' || path === '/') return `${base}/`;
  return base + (path.startsWith('/') ? path : `/${path}`);
}
