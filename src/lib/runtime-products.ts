import { withBase } from './url';

export type CategorySlug =
  | 'everyday-movement'
  | 'on-the-field'
  | 'cooler-days'
  | 'rest-recover';

export interface RuntimeCategory {
  slug: CategorySlug;
  label: string;
  blurb: string;
}

export interface RuntimeProduct {
  id?: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  sizes: string[];
  colors: string[];
  summary: string;
  description: string;
  tag?: string | null;
  featured: boolean;
  sort_order: number;
  image_url?: string | null;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user?: {
    email?: string;
  };
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}

export const runtimeCategories: RuntimeCategory[] = [
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

const labelBySlug = new Map(runtimeCategories.map((c) => [c.slug, c.label]));

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

const zarFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
});

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function categoryLabel(slug: string): string {
  return labelBySlug.get(slug as CategorySlug) ?? slug;
}

export function colorHex(name: string): string {
  return swatchHex[name] ?? '#c9d3cc';
}

export function formatPrice(value: number): string {
  return zarFormatter.format(value);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function productUrl(slug: string): string {
  return withBase(`/product?slug=${encodeURIComponent(slug)}`);
}

export function assertSupabaseConfig(): void {
  if (!hasSupabaseConfig()) {
    throw new Error('Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.');
  }
}

async function supabaseFetch<T>(
  path: string,
  options: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  assertSupabaseConfig();

  const headers = new Headers(options.headers);
  headers.set('apikey', supabaseAnonKey);
  headers.set('Authorization', `Bearer ${options.accessToken ?? supabaseAnonKey}`);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function signInWithPassword(email: string, password: string): Promise<SupabaseSession> {
  return supabaseFetch<SupabaseSession>('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function listProducts(options: { featuredOnly?: boolean } = {}): Promise<RuntimeProduct[]> {
  const filters = ['select=*', 'published=eq.true'];
  if (options.featuredOnly) filters.push('featured=eq.true');
  filters.push('order=sort_order.asc', 'order=name.asc');

  return supabaseFetch<RuntimeProduct[]>(`/rest/v1/products?${filters.join('&')}`);
}

export async function listAdminProducts(accessToken: string): Promise<RuntimeProduct[]> {
  return supabaseFetch<RuntimeProduct[]>(
    '/rest/v1/products?select=*&order=sort_order.asc&order=name.asc',
    { accessToken },
  );
}

export async function getProductBySlug(slug: string): Promise<RuntimeProduct | null> {
  const rows = await supabaseFetch<RuntimeProduct[]>(
    `/rest/v1/products?select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`,
  );
  return rows[0] ?? null;
}

export async function listRelatedProducts(product: RuntimeProduct, limit = 3): Promise<RuntimeProduct[]> {
  const rows = await supabaseFetch<RuntimeProduct[]>(
    `/rest/v1/products?select=*&category=eq.${product.category}&published=eq.true&slug=neq.${encodeURIComponent(product.slug)}&order=sort_order.asc&limit=${limit}`,
  );
  return rows;
}

export async function uploadProductImage(file: File, slug: string, accessToken: string): Promise<string> {
  assertSupabaseConfig();

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${slug}-${Date.now()}.${extension}`;
  const headers = new Headers({
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': file.type || 'application/octet-stream',
    'x-upsert': 'true',
  });

  const response = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${path}`, {
    method: 'POST',
    headers,
    body: file,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Image upload failed with ${response.status}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/product-images/${encodeURIComponent(path)}`;
}

export async function createProduct(
  product: Omit<RuntimeProduct, 'id' | 'created_at' | 'updated_at'>,
  accessToken: string,
): Promise<RuntimeProduct> {
  const rows = await supabaseFetch<RuntimeProduct[]>('/rest/v1/products', {
    method: 'POST',
    accessToken,
    headers: {
      Prefer: 'return=representation',
    },
    body: JSON.stringify(product),
  });

  return rows[0];
}

export async function updateProduct(
  slug: string,
  product: Omit<RuntimeProduct, 'id' | 'created_at' | 'updated_at'>,
  accessToken: string,
): Promise<RuntimeProduct> {
  const rows = await supabaseFetch<RuntimeProduct[]>(
    `/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: 'PATCH',
      accessToken,
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify(product),
    },
  );

  return rows[0];
}

export async function deleteProduct(slug: string, accessToken: string): Promise<void> {
  await supabaseFetch<void>(`/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    accessToken,
    headers: {
      Prefer: 'return=minimal',
    },
  });
}

export async function createContactMessage(message: ContactMessage): Promise<void> {
  await supabaseFetch<void>('/rest/v1/contact_messages', {
    method: 'POST',
    headers: {
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: message.name,
      email: message.email,
      phone: message.phone || null,
      message: message.message,
      source: message.source ?? 'homepage',
    }),
  });
}
