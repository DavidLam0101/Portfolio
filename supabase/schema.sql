
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'lntd6534@gmail.com';
$$;

-- Site content (hero, profile card, about, contact) stored as one JSON row ----
create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Projects --------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brief text not null default '',
  long_description text not null default '',
  languages text[] not null default '{}',
  images text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Everyone can read; only the admin can write ---------------------------------
alter table public.site_content enable row level security;
alter table public.projects enable row level security;

drop policy if exists "public read" on public.site_content;
drop policy if exists "admin write" on public.site_content;
create policy "public read" on public.site_content for select using (true);
create policy "admin write" on public.site_content for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read" on public.projects;
drop policy if exists "admin write" on public.projects;
create policy "public read" on public.projects for select using (true);
create policy "admin write" on public.projects for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- File storage for photos, project images and the CV ---------------------------
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "portfolio admin insert" on storage.objects;
drop policy if exists "portfolio admin update" on storage.objects;
drop policy if exists "portfolio admin delete" on storage.objects;
create policy "portfolio admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio admin update" on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());
create policy "portfolio admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());

-- Added later: optional "View project" link on each project card ---------------
alter table public.projects add column if not exists link text not null default '';
