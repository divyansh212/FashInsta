-- Fashinsta schema
-- Run in Supabase SQL editor.
-- Assumes Supabase Auth is enabled (gives us auth.users and auth.uid()).

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- profiles : public user data, 1:1 with auth.users
-- ============================================================
create table if not exists public.profiles (
    id              uuid primary key references auth.users(id) on delete cascade,
    handle          text unique not null check (char_length(handle) between 3 and 30),
    display_name    text,
    bio             text,
    avatar_url      text,
    created_at      timestamptz not null default now()
);

create index if not exists profiles_handle_idx on public.profiles (handle);

-- ============================================================
-- products : catalog of garments available for try-on
-- ============================================================
create table if not exists public.products (
    id              uuid primary key default uuid_generate_v4(),
    name            text not null,
    brand           text,
    category        text not null check (category in
                        ('top','bottom','dress','outerwear','accessory','footwear')),
    price_cents     integer not null check (price_cents >= 0),
    currency        text not null default 'INR',
    image_url       text not null,           -- garment cutout used for VTON
    cover_url       text,                    -- styled marketing image
    description     text,
    tags            text[] not null default '{}',
    in_stock        boolean not null default true,
    created_at      timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_tags_idx on public.products using gin (tags);

-- ============================================================
-- tryons : a generated VTON result owned by a user
-- ============================================================
create table if not exists public.tryons (
    id              uuid primary key default uuid_generate_v4(),
    user_id         uuid not null references auth.users(id) on delete cascade,
    product_id      uuid not null references public.products(id) on delete cascade,
    person_image_url text not null,
    result_image_url text,
    status          text not null default 'pending'
                        check (status in ('pending','processing','done','failed')),
    error_message   text,
    created_at      timestamptz not null default now(),
    finished_at     timestamptz
);

create index if not exists tryons_user_idx on public.tryons (user_id, created_at desc);

-- ============================================================
-- posts : a user-shared look (often references a tryon)
-- ============================================================
create table if not exists public.posts (
    id              uuid primary key default uuid_generate_v4(),
    user_id         uuid not null references auth.users(id) on delete cascade,
    tryon_id        uuid references public.tryons(id) on delete set null,
    image_url       text not null,
    caption         text,
    product_ids     uuid[] not null default '{}',
    created_at      timestamptz not null default now()
);

create index if not exists posts_user_idx on public.posts (user_id, created_at desc);
create index if not exists posts_created_idx on public.posts (created_at desc);

-- ============================================================
-- likes : many-to-many user<->post
-- ============================================================
create table if not exists public.likes (
    user_id         uuid not null references auth.users(id) on delete cascade,
    post_id         uuid not null references public.posts(id) on delete cascade,
    created_at      timestamptz not null default now(),
    primary key (user_id, post_id)
);

create index if not exists likes_post_idx on public.likes (post_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.tryons   enable row level security;
alter table public.posts    enable row level security;
alter table public.likes    enable row level security;

-- profiles : anyone can read, only owner writes
drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles
    for select using (true);

drop policy if exists "profiles_write_self" on public.profiles;
create policy "profiles_write_self" on public.profiles
    for all using (auth.uid() = id) with check (auth.uid() = id);

-- products : public read; writes restricted (use service role from backend)
drop policy if exists "products_read" on public.products;
create policy "products_read" on public.products
    for select using (true);

-- tryons : only the owner sees or writes their own
drop policy if exists "tryons_owner" on public.tryons;
create policy "tryons_owner" on public.tryons
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- posts : public read, owner writes
drop policy if exists "posts_read" on public.posts;
create policy "posts_read" on public.posts
    for select using (true);

drop policy if exists "posts_write_self" on public.posts;
create policy "posts_write_self" on public.posts
    for insert with check (auth.uid() = user_id);

drop policy if exists "posts_update_self" on public.posts;
create policy "posts_update_self" on public.posts
    for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "posts_delete_self" on public.posts;
create policy "posts_delete_self" on public.posts
    for delete using (auth.uid() = user_id);

-- likes : anyone can read, only the liker writes their own row
drop policy if exists "likes_read" on public.likes;
create policy "likes_read" on public.likes
    for select using (true);

drop policy if exists "likes_write_self" on public.likes;
create policy "likes_write_self" on public.likes
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Convenience view : post with author and like count
-- ============================================================
create or replace view public.posts_feed as
select
    p.id,
    p.user_id,
    p.image_url,
    p.caption,
    p.product_ids,
    p.created_at,
    pr.handle,
    pr.display_name,
    pr.avatar_url,
    coalesce((select count(*) from public.likes l where l.post_id = p.id), 0) as like_count
from public.posts p
left join public.profiles pr on pr.id = p.user_id;

-- ============================================================
-- Seed a handful of products for dev
-- ============================================================
insert into public.products (name, brand, category, price_cents, image_url, cover_url, description, tags)
values
    ('Linen Drape Shirt',     'Maison Verte', 'top',       380000, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200', 'Unstructured oversized linen shirt.',         array['linen','oversized','summer']),
    ('Wide-Leg Trouser',      'Maison Verte', 'bottom',    520000, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200', 'High-rise pleated wide-leg.',                  array['wool','tailored']),
    ('Silk Slip Dress',       'Aurelia',      'dress',     740000, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200', 'Bias-cut silk with adjustable straps.',         array['silk','evening']),
    ('Cropped Wool Coat',     'Studio Noir',  'outerwear', 980000, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200', 'Boxy double-faced wool, hand-finished seams.',   array['wool','winter']),
    ('Heavyweight Tee',       'Studio Noir',  'top',       180000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200', '280gsm boxy fit, garment-dyed.',                 array['cotton','basics']),
    ('A-Line Midi Skirt',     'Aurelia',      'bottom',    420000, 'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=800', 'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=1200', 'Bias panels, hidden side zip.',                  array['minimal'])
on conflict do nothing;
