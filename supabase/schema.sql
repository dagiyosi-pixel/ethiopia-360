-- ETHIOPIA//360 database bootstrap
--
-- This schema was reconstructed from the application queries, row mappers,
-- domain types, and server actions. It is intended for Supabase's SQL editor.
-- It has NOT been applied to the configured project. Review the assumptions
-- listed at the end of this file before applying it to any non-empty database.

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_am text not null default '',
  kind text not null default 'region' check (kind in ('region', 'city-administration')),
  capital text not null default '',
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  zoom integer not null default 7 check (zoom between 2 and 18),
  summary text not null default '',
  description text not null default '',
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  image_url text,
  image_source text,
  image_subject text,
  image_alt text,
  landscape text not null default '',
  languages text[] not null default '{}',
  area_km2 numeric,
  population_approx bigint,
  elevation_m integer,
  highlights text[] not null default '{}',
  -- Retained for the current Region mapper. cities.region_id is canonical.
  cities text[] not null default '{}',
  geo_key text,
  geo_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_am text not null default '',
  region_id uuid not null references public.regions(id) on delete restrict,
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  zoom integer not null default 13 check (zoom between 2 and 18),
  summary text not null default '',
  description text not null default '',
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  image_url text,
  image_source text,
  image_subject text,
  image_alt text,
  elevation_m integer,
  known_for text[] not null default '{}',
  landmarks text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9._]{3,30}$'),
  display_name text not null,
  bio text not null default '' check (char_length(bio) <= 400),
  location text not null default '' check (char_length(location) <= 80),
  avatar_url text,
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  region_id uuid references public.regions(id) on delete set null,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  is_public boolean not null default true,
  show_saved boolean not null default false,
  verified boolean not null default false,
  followers integer not null default 0 check (followers >= 0),
  following integer not null default 0 check (following >= 0),
  contributions integer not null default 0 check (contributions >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_am text,
  category text not null check (category in ('nature', 'heritage', 'urban', 'religious', 'market', 'landmark')),
  region_id uuid not null references public.regions(id) on delete restrict,
  city_id uuid references public.cities(id) on delete set null,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  summary text not null default '',
  description text[] not null default '{}',
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  image_url text,
  image_source text,
  image_subject text,
  image_alt text,
  contributor_id uuid references public.profiles(id) on delete set null,
  tags text[] not null default '{}',
  likes integer not null default 0 check (likes >= 0),
  comments integer not null default 0 check (comments >= 0),
  saves integer not null default 0 check (saves >= 0),
  views integer not null default 0 check (views >= 0),
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'pending', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint places_lat_lng_pair check ((lat is null) = (lng is null))
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_am text,
  excerpt text not null default '',
  body text[] not null default '{}',
  author_id uuid references public.profiles(id) on delete set null,
  region_id uuid references public.regions(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  category text not null default 'stories' check (category in ('places', 'stories', 'photos', 'videos', 'history', 'culture', 'architecture', 'food', 'events')),
  tags text[] not null default '{}',
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  image_url text,
  image_source text,
  image_subject text,
  image_alt text,
  read_minutes integer not null default 1 check (read_minutes > 0),
  likes integer not null default 0 check (likes >= 0),
  comments integer not null default 0 check (comments >= 0),
  saves integer not null default 0 check (saves >= 0),
  views integer not null default 0 check (views >= 0),
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'pending', 'hidden', 'removed')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stories_lat_lng_pair check ((lat is null) = (lng is null))
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type text not null check (type in ('photo', 'video')),
  title text not null,
  caption text not null default '',
  author_id uuid references public.profiles(id) on delete set null,
  region_id uuid references public.regions(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  place_id uuid references public.places(id) on delete set null,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  category text not null default 'photos' check (category in ('places', 'stories', 'photos', 'videos', 'history', 'culture', 'architecture', 'food', 'events')),
  tags text[] not null default '{}',
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  asset_url text,
  poster_url text,
  image_source text,
  image_subject text,
  image_alt text,
  duration_sec integer check (duration_sec is null or duration_sec >= 0),
  orientation text not null default 'landscape' check (orientation in ('portrait', 'landscape', 'square')),
  likes integer not null default 0 check (likes >= 0),
  comments integer not null default 0 check (comments >= 0),
  saves integer not null default 0 check (saves >= 0),
  views integer not null default 0 check (views >= 0),
  status text not null default 'published' check (status in ('draft', 'published', 'pending', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_lat_lng_pair check ((lat is null) = (lng is null))
);

create table if not exists public.historical_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  period text not null default '',
  sort_year integer not null default 0,
  kind text not null default 'event' check (kind in ('event', 'figure', 'place', 'relic', 'era')),
  title text not null,
  summary text not null default '',
  detail text[] not null default '{}',
  location text not null default '',
  region_id uuid references public.regions(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  author_id uuid references public.profiles(id) on delete set null,
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  image_url text,
  image_source text,
  image_subject text,
  image_alt text,
  tags text[] not null default '{}',
  source_note text not null default '',
  status text not null default 'published' check (status in ('draft', 'published', 'pending', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint historical_entries_lat_lng_pair check ((lat is null) = (lng is null))
);

create table if not exists public.culture_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default 'Traditions' check (category in ('Languages', 'Food', 'Coffee', 'Music', 'Clothing', 'Festivals', 'Traditions', 'Art', 'Literature')),
  name text not null,
  name_am text,
  summary text not null default '',
  description text[] not null default '{}',
  region_id uuid references public.regions(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  author_id uuid references public.profiles(id) on delete set null,
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  image_url text,
  image_source text,
  image_subject text,
  image_alt text,
  tags text[] not null default '{}',
  source_note text not null default '',
  status text not null default 'published' check (status in ('draft', 'published', 'pending', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint culture_topics_lat_lng_pair check ((lat is null) = (lng is null))
);

create table if not exists public.architecture_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'historic' check (category in ('historic', 'traditional', 'religious', 'urban', 'contemporary')),
  era text not null default '',
  region_id uuid not null references public.regions(id) on delete restrict,
  city_id uuid references public.cities(id) on delete set null,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  summary text not null default '',
  description text[] not null default '{}',
  artwork jsonb not null default '{"palette":"basalt","seed":1}'::jsonb,
  image_url text,
  image_source text,
  image_subject text,
  image_alt text,
  author_id uuid references public.profiles(id) on delete set null,
  tags text[] not null default '{}',
  likes integer not null default 0 check (likes >= 0),
  views integer not null default 0 check (views >= 0),
  featured boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published', 'pending', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint architecture_entries_lat_lng_pair check ((lat is null) = (lng is null))
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'place', 'story', 'photo', 'video')),
  target_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create table if not exists public.saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'place', 'story', 'photo', 'video')),
  target_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'place', 'story', 'photo', 'video')),
  target_id text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 2000),
  parent_id uuid references public.comments(id) on delete set null,
  likes integer not null default 0 check (likes >= 0),
  status text not null default 'published' check (status in ('published', 'pending', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'comment', 'profile')),
  target_id text not null,
  reason text not null check (reason in ('spam', 'harassment', 'inappropriate', 'misinformation', 'copyright', 'other')),
  detail text not null default '' check (char_length(detail) <= 1000),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.account_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('deletion')),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  detail text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cities_region_id_idx on public.cities(region_id);
create index if not exists profiles_region_id_idx on public.profiles(region_id);
create index if not exists places_region_city_idx on public.places(region_id, city_id);
create index if not exists places_status_created_idx on public.places(status, created_at desc);
create index if not exists stories_region_city_idx on public.stories(region_id, city_id);
create index if not exists stories_status_published_idx on public.stories(status, published_at desc);
create index if not exists media_region_city_place_idx on public.media(region_id, city_id, place_id);
create index if not exists media_status_created_idx on public.media(status, created_at desc);
create index if not exists history_region_city_idx on public.historical_entries(region_id, city_id);
create index if not exists culture_region_city_idx on public.culture_topics(region_id, city_id);
create index if not exists architecture_region_city_idx on public.architecture_entries(region_id, city_id);
create index if not exists likes_target_idx on public.likes(target_type, target_id);
create index if not exists saves_target_idx on public.saves(target_type, target_id);
create index if not exists follows_following_idx on public.follows(following_id);
create index if not exists comments_target_created_idx on public.comments(target_type, target_id, created_at desc);
create index if not exists reports_status_created_idx on public.reports(status, created_at desc);
create index if not exists account_requests_status_created_idx on public.account_requests(status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'regions', 'cities', 'profiles', 'places', 'stories', 'media',
    'historical_entries', 'culture_topics', 'architecture_entries',
    'comments', 'reports', 'account_requests'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name
    );
  end loop;
end;
$$;

-- Create a profile for every new Supabase Auth user. This also supports email
-- confirmation, where signup has no authenticated session for a client insert.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  candidate_username text;
  candidate_name text;
begin
  candidate_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data ->> 'username', split_part(coalesce(new.email, ''), '@', 1), 'member'),
    '[^a-zA-Z0-9._]', '', 'g'
  ));
  if char_length(candidate_username) < 3 then
    candidate_username := 'member_' || left(replace(new.id::text, '-', ''), 8);
  end if;
  candidate_username := left(candidate_username, 30);

  candidate_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1))), '');
  if candidate_name is null then candidate_name := 'Member'; end if;

  insert into public.profiles (id, username, display_name)
  values (new.id, candidate_username, left(candidate_name, 60));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- The app calls this after changing a likes/saves relation. It is a narrowly
-- allowlisted SECURITY DEFINER function because users must not receive general
-- UPDATE rights on content counter columns. It only adjusts a counter when the
-- calling user owns the corresponding relation row.
create or replace function public.adjust_counter(
  p_table text,
  p_id text,
  p_column text,
  p_delta integer
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  relation_table text;
  target_type_ok boolean;
  changed_rows integer;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_table not in ('media', 'places', 'stories') then raise exception 'Unsupported counter table'; end if;
  if p_column not in ('likes', 'saves') then raise exception 'Unsupported counter column'; end if;
  if p_delta not in (-1, 1) then raise exception 'Counter delta must be -1 or 1'; end if;
  relation_table := p_column;

  if p_table = 'media' then
    select exists (
      select 1 from public.likes l
      where l.user_id = auth.uid() and l.target_id = p_id and l.target_type in ('post', 'photo', 'video')
    ) into target_type_ok;
  elsif p_table = 'places' then
    select exists (
      select 1 from public.likes l
      where l.user_id = auth.uid() and l.target_id = p_id and l.target_type = 'place'
    ) into target_type_ok;
  else
    select exists (
      select 1 from public.likes l
      where l.user_id = auth.uid() and l.target_id = p_id and l.target_type = 'story'
    ) into target_type_ok;
  end if;

  if relation_table = 'saves' then
    if p_table = 'media' then
      select exists (select 1 from public.saves s where s.user_id = auth.uid() and s.target_id = p_id and s.target_type in ('post', 'photo', 'video')) into target_type_ok;
    elsif p_table = 'places' then
      select exists (select 1 from public.saves s where s.user_id = auth.uid() and s.target_id = p_id and s.target_type = 'place') into target_type_ok;
    else
      select exists (select 1 from public.saves s where s.user_id = auth.uid() and s.target_id = p_id and s.target_type = 'story') into target_type_ok;
    end if;
  end if;

  if not target_type_ok then raise exception 'Matching user relation not found'; end if;

  execute format(
    'update public.%I set %I = greatest(0, coalesce(%I, 0) + $1) where id::text = $2 or slug = $2',
    p_table, p_column, p_column
  ) using p_delta, p_id;
  get diagnostics changed_rows = row_count;
  if changed_rows = 0 then raise exception 'Content record not found'; end if;
end;
$$;

revoke all on function public.adjust_counter(text, text, text, integer) from public, anon;
grant execute on function public.adjust_counter(text, text, text, integer) to authenticated;

alter table public.regions enable row level security;
alter table public.cities enable row level security;
alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.stories enable row level security;
alter table public.media enable row level security;
alter table public.historical_entries enable row level security;
alter table public.culture_topics enable row level security;
alter table public.architecture_entries enable row level security;
alter table public.likes enable row level security;
alter table public.saves enable row level security;
alter table public.follows enable row level security;
alter table public.comments enable row level security;
alter table public.reports enable row level security;
alter table public.account_requests enable row level security;

create policy regions_public_read on public.regions for select to anon, authenticated using (true);
create policy cities_public_read on public.cities for select to anon, authenticated using (true);

create policy profiles_public_or_self_read on public.profiles for select to anon, authenticated
  using (is_public or id = auth.uid());
create policy profiles_self_insert on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy profiles_self_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy places_published_or_owner_read on public.places for select to anon, authenticated
  using (status = 'published' or contributor_id = auth.uid());
create policy places_owner_insert on public.places for insert to authenticated
  with check (contributor_id = auth.uid());
create policy places_owner_delete on public.places for delete to authenticated
  using (contributor_id = auth.uid());

create policy stories_published_or_owner_read on public.stories for select to anon, authenticated
  using (status = 'published' or author_id = auth.uid());
create policy stories_owner_insert on public.stories for insert to authenticated
  with check (author_id = auth.uid());

create policy media_published_or_owner_read on public.media for select to anon, authenticated
  using (status = 'published' or author_id = auth.uid());
create policy media_owner_insert on public.media for insert to authenticated
  with check (author_id = auth.uid());

create policy history_published_or_owner_read on public.historical_entries for select to anon, authenticated
  using (status = 'published' or author_id = auth.uid());
create policy history_owner_insert on public.historical_entries for insert to authenticated
  with check (author_id = auth.uid() and status = 'pending');

create policy culture_published_or_owner_read on public.culture_topics for select to anon, authenticated
  using (status = 'published' or author_id = auth.uid());
create policy culture_owner_insert on public.culture_topics for insert to authenticated
  with check (author_id = auth.uid() and status = 'pending');

create policy architecture_published_or_owner_read on public.architecture_entries for select to anon, authenticated
  using (status = 'published' or author_id = auth.uid());
create policy architecture_owner_insert on public.architecture_entries for insert to authenticated
  with check (author_id = auth.uid() and status = 'pending');

create policy likes_self_read on public.likes for select to authenticated using (user_id = auth.uid());
create policy likes_self_insert on public.likes for insert to authenticated with check (user_id = auth.uid());
create policy likes_self_delete on public.likes for delete to authenticated using (user_id = auth.uid());
create policy saves_self_read on public.saves for select to authenticated using (user_id = auth.uid());
create policy saves_self_insert on public.saves for insert to authenticated with check (user_id = auth.uid());
create policy saves_self_delete on public.saves for delete to authenticated using (user_id = auth.uid());

create policy follows_participant_read on public.follows for select to authenticated
  using (follower_id = auth.uid() or following_id = auth.uid());
create policy follows_self_insert on public.follows for insert to authenticated with check (follower_id = auth.uid());
create policy follows_self_delete on public.follows for delete to authenticated using (follower_id = auth.uid());

create policy comments_published_or_owner_read on public.comments for select to anon, authenticated
  using (status = 'published' or author_id = auth.uid());
create policy comments_self_insert on public.comments for insert to authenticated with check (author_id = auth.uid());
create policy reports_self_read on public.reports for select to authenticated using (reporter_id = auth.uid());
create policy reports_self_insert on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy account_requests_self_read on public.account_requests for select to authenticated using (user_id = auth.uid());
create policy account_requests_self_insert on public.account_requests for insert to authenticated with check (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.regions, public.cities to anon, authenticated;
grant select on public.places, public.stories, public.media, public.historical_entries,
  public.culture_topics, public.architecture_entries to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert on public.profiles to authenticated;
grant update (username, display_name, bio, location, avatar_url, is_public, show_saved, region_id, updated_at)
  on public.profiles to authenticated;
grant insert, delete on public.places to authenticated;
grant insert on public.stories, public.media, public.historical_entries,
  public.culture_topics, public.architecture_entries to authenticated;
grant select, insert, delete on public.likes, public.saves to authenticated;
grant select, insert, delete on public.follows to authenticated;
grant select, insert on public.comments, public.reports, public.account_requests to authenticated;

-- Existing code calls getPublicUrl(), so this bucket is public for reads.
-- Upload, avatar upsert, and rollback cleanup remain restricted to each user's
-- own {user-id}/... or avatars/{user-id}/... path.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 209715200,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  name = excluded.name,
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists media_user_upload_own_path on storage.objects;
create policy media_user_upload_own_path on storage.objects for insert to authenticated
  with check (
    bucket_id = 'media' and (
      (storage.foldername(name))[1] = auth.uid()::text
      or ((storage.foldername(name))[1] = 'avatars' and (storage.foldername(name))[2] = auth.uid()::text)
    )
  );

drop policy if exists media_user_update_own_path on storage.objects;
create policy media_user_update_own_path on storage.objects for update to authenticated
  using (
    bucket_id = 'media' and (
      (storage.foldername(name))[1] = auth.uid()::text
      or ((storage.foldername(name))[1] = 'avatars' and (storage.foldername(name))[2] = auth.uid()::text)
    )
  ) with check (
    bucket_id = 'media' and (
      (storage.foldername(name))[1] = auth.uid()::text
      or ((storage.foldername(name))[1] = 'avatars' and (storage.foldername(name))[2] = auth.uid()::text)
    )
  );

drop policy if exists media_user_delete_own_path on storage.objects;
create policy media_user_delete_own_path on storage.objects for delete to authenticated
  using (
    bucket_id = 'media' and (
      (storage.foldername(name))[1] = auth.uid()::text
      or ((storage.foldername(name))[1] = 'avatars' and (storage.foldername(name))[2] = auth.uid()::text)
    )
  );

-- Assumptions requiring review before applying:
-- 1. The app's default PostgREST schema is public.
-- 2. Media is intentionally public because the app renders getPublicUrl() URLs.
-- 3. User-submitted history/culture/architecture entries are pending moderation;
--    the current UI has no moderator publishing screen.
-- 4. Events use the existing stories table with category='events'; there is no
--    event table or event-specific schedule/location model in the app.
-- 5. Polymorphic target_id values are text because current actions accept an
--    opaque string and do not consistently specify UUID versus slug.
-- 6. No curated seed records are inserted here; src/data remains the canonical
--    seed source and the query layer must continue to use it when DB tables are
--    empty. Existing auth.users rows are not backfilled by the trigger above.
-- 7. Public report moderation and account-request review screens are not part
--    of the current app; users can submit and read their own records only.
