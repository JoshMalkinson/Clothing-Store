-- Action Bodywear live catalogue setup for Supabase.
-- Run this in the Supabase SQL editor, then set:
-- PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your deploy environment.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  category text not null check (category in ('everyday-movement', 'on-the-field', 'cooler-days', 'rest-recover')),
  price integer not null check (price >= 0),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  summary text not null,
  description text not null,
  tag text,
  featured boolean not null default false,
  sort_order integer not null default 99,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_published_order_idx
  on public.products (published, sort_order, name);

create index if not exists products_category_order_idx
  on public.products (category, sort_order, name);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row
execute function public.set_products_updated_at();

alter table public.products enable row level security;

drop policy if exists "Anyone can read published products" on public.products;
create policy "Anyone can read published products"
on public.products
for select
using (published = true);

drop policy if exists "Authenticated admins can read all products" on public.products;
create policy "Authenticated admins can read all products"
on public.products
for select
to authenticated
using (true);

drop policy if exists "Authenticated admins can create products" on public.products;
create policy "Authenticated admins can create products"
on public.products
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update products" on public.products;
create policy "Authenticated admins can update products"
on public.products
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated admins can delete products" on public.products;
create policy "Authenticated admins can delete products"
on public.products
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Anyone can read product images" on storage.objects;
create policy "Anyone can read product images"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Authenticated admins can upload product images" on storage.objects;
create policy "Authenticated admins can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated admins can update product images" on storage.objects;
create policy "Authenticated admins can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

insert into public.products
  (slug, name, category, price, sizes, colors, summary, description, tag, featured, sort_order, published)
values
  ('everyday-tee', 'Everyday Tee', 'everyday-movement', 249, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Sage','Chalk','Slate'], 'A breathable everyday tee that moves from classroom to playground.', 'A soft, breathable everyday tee built for constant motion. Lightweight cotton-blend jersey keeps things cool, while a relaxed cut and reinforced shoulder seams stand up to daily wear - wash after wash after wash.', 'Bestseller', true, 1, true),
  ('everyday-leggings', 'Everyday Leggings', 'everyday-movement', 399, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Ink','Storm','Sage'], 'Four-way stretch leggings with a stay-put, no-dig waistband.', 'Everyday leggings with genuine four-way stretch and a soft, no-dig waistband that stays put through every sprint and stretch. Squat-proof, breathable, and quick to bounce back into shape.', null, false, 2, true),
  ('pull-on-hoodie', 'Pull-On Hoodie', 'everyday-movement', 599, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Mist','Slate','Forest'], 'A brushed-back hoodie that is soft inside and tough outside.', 'The hoodie they will reach for first. Brushed-back fleece keeps it soft against the skin, while a dense outer knit and bar-tacked pockets shrug off scrapes, slides, and the school bag.', null, false, 3, true),
  ('soft-joggers', 'Soft Joggers', 'everyday-movement', 499, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Storm','Sand','Ink'], 'Tapered everyday joggers with a comfy elasticated waist.', 'Tapered joggers with a soft elasticated waist and ribbed cuffs that keep their shape. Light enough for warm afternoons, roomy enough to move - an easy yes on a busy morning.', null, false, 4, true),
  ('field-training-shorts', 'Field Training Shorts', 'on-the-field', 299, array['6-7y','8-9y','10-11y','12-13y','14-15y'], array['Ink','Forest','Storm'], 'Lightweight training shorts that breathe and dry fast.', 'Built for the whistle. A featherweight, sweat-wicking weave dries fast between drills, while the bonded hem and inner brief stay comfortable through every direction change.', 'Bestseller', true, 5, true),
  ('match-jersey', 'Match Jersey', 'on-the-field', 399, array['6-7y','8-9y','10-11y','12-13y','14-15y'], array['Fern','Sky','Chalk'], 'A breathable match-day jersey with mesh ventilation.', 'Match-day ready. Engineered mesh panels open up airflow where it is needed most, and a lightly textured knit keeps the jersey looking sharp from warm-up to final whistle.', 'New', false, 6, true),
  ('base-layer-top', 'Base Layer Top', 'on-the-field', 349, array['6-7y','8-9y','10-11y','12-13y','14-15y'], array['Slate','Ink'], 'A close-fit base layer that wicks sweat and moves freely.', 'A second-skin base layer that wicks moisture and keeps muscles warm without weighing anyone down. Flatlock seams sit flat against the skin so there is nothing to rub or distract.', null, false, 7, true),
  ('performance-tee', 'Performance Tee', 'on-the-field', 279, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Sky','Sage','Chalk'], 'A quick-dry training tee with a cooling, breathable knit.', 'A go-anywhere training tee in a quick-dry knit that keeps its cool when the pace picks up. Lightweight, odour-resistant, and relaxed enough to layer over a base on chillier mornings.', null, false, 8, true),
  ('track-pants', 'Track Pants', 'on-the-field', 529, array['6-7y','8-9y','10-11y','12-13y','14-15y'], array['Ink','Storm'], 'Warm-up track pants with zip ankles for easy on-off.', 'Warm-up to wind-down track pants with a smooth, wind-resistant face and zip ankles that pull on over boots. An articulated knee keeps them moving as fast as their wearer.', null, false, 9, true),
  ('crew-sweat', 'Crew Sweat', 'cooler-days', 549, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Sage','Sand','Slate'], 'A cosy brushed-fleece crew for cooler mornings.', 'A cosy, brushed-fleece crew that takes the bite out of an early start. Ribbed cuffs and hem hold their shape, and a mid-weight loopback keeps the warmth in without the bulk.', 'Bestseller', true, 10, true),
  ('zip-up-jacket', 'Zip-Up Jacket', 'cooler-days', 699, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Forest','Ink','Storm'], 'A light layering jacket with a full zip and zip pockets.', 'The in-between layer that does it all. A full-length zip makes for easy on-off, secure zip pockets keep small things safe, and a soft brushed interior makes it the first thing they grab on a cool day.', 'New', false, 11, true),
  ('thermal-leggings', 'Thermal Leggings', 'cooler-days', 449, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Ink','Storm'], 'Brushed thermal leggings for warmth without the bulk.', 'Brushed on the inside for quiet warmth, these thermal leggings layer invisibly under a kit or stand on their own. The stretch waistband stays put while they run the cold morning off.', null, false, 12, true),
  ('fleece-joggers', 'Fleece Joggers', 'cooler-days', 579, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Sand','Slate','Forest'], 'Plush fleece joggers that keep the warmth in on cold days.', 'Plush, mid-weight fleece joggers with a soft inner loop and a tapered leg that stays out of the way. Deep pockets and a drawcord waist make them the easy winter default.', null, false, 13, true),
  ('lounge-set', 'Lounge Set', 'rest-recover', 649, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Mist','Sand','Sage'], 'A soft two-piece lounge set for the calm after the game.', 'A soft two-piece set for the slow afternoon after a big one. Washed-soft fabric, relaxed lines, and a gentle waistband make it the easy choice for downtime, homework, and everything in between.', 'Bestseller', true, 14, true),
  ('sleep-tee', 'Sleep Tee', 'rest-recover', 249, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Sky','Blossom','Chalk'], 'A breathable sleep tee in washed-soft organic cotton.', 'A breathable sleep tee cut a little longer and roomier for a proper rest. Washed-soft organic cotton gets better with every wash and stays gentle on the calmest skin.', null, false, 15, true),
  ('recovery-socks', 'Recovery Socks (3-pack)', 'rest-recover', 129, array['S','M','L'], array['Sage','Storm','Chalk'], 'A cushioned three-pack with arch support for tired feet.', 'A three-pack of cushioned socks with light arch support and a seam-free toe - the small comfort that makes the walk back to the car a little easier. Breathable, durable, and built to survive the wash.', null, false, 16, true),
  ('relaxed-shorts', 'Relaxed Shorts', 'rest-recover', 299, array['4-5y','6-7y','8-9y','10-11y','12-13y','14-15y'], array['Sand','Storm'], 'Easy pull-on shorts in soft jersey for downtime.', 'Easy pull-on shorts in a soft, washed jersey for warm-weather downtime. A comfy covered waistband and a relaxed leg make them the natural choice once the boots come off.', null, false, 17, true)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  sizes = excluded.sizes,
  colors = excluded.colors,
  summary = excluded.summary,
  description = excluded.description,
  tag = excluded.tag,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  published = excluded.published;
