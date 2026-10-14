-- EventPass database schema for Supabase.
-- Run this in the Supabase SQL Editor for a new project.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  username text not null check (username ~ '^[A-Za-z0-9_]{3,}$'),
  email text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username));

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  location text not null check (char_length(trim(location)) > 0),
  event_date timestamptz not null,
  price numeric(10, 2) not null check (price >= 0),
  available_tickets integer not null check (available_tickets >= 0),
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id uuid not null references public.events (id),
  ticket_code text not null unique,
  quantity integer not null check (quantity > 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  status text not null default 'CONFIRMED' check (status = 'CONFIRMED'),
  purchased_at timestamptz not null default now()
);

create index if not exists tickets_user_purchased_at_idx
  on public.tickets (user_id, purchased_at desc);

create table if not exists public.demo_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  reward_amount numeric(10, 2) not null default 5000.00
    check (reward_amount = 5000.00),
  reward_type text not null default 'DEMO_REWARD'
    check (reward_type = 'DEMO_REWARD'),
  status text not null default 'DEMO' check (status = 'DEMO'),
  created_at timestamptz not null default now()
);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, username, email)
  values (
    new.id,
    trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    trim(coalesce(new.raw_user_meta_data ->> 'username', '')),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create or replace function public.reserve_event_ticket()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_price numeric(10, 2);
begin
  update public.events as e
  set available_tickets = e.available_tickets - new.quantity
  where e.id = new.event_id
    and e.available_tickets >= new.quantity
  returning e.price into event_price;

  if not found then
    raise exception 'Not enough tickets available for this event'
      using errcode = '23514';
  end if;

  new.total_price := event_price * new.quantity;
  new.status := 'CONFIRMED';
  return new;
end;
$$;

drop trigger if exists reserve_event_ticket_before_insert on public.tickets;
create trigger reserve_event_ticket_before_insert
  before insert on public.tickets
  for each row execute function public.reserve_event_ticket();

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.tickets enable row level security;
alter table public.demo_rewards enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Anyone can read events" on public.events;
create policy "Anyone can read events"
  on public.events for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can read their own tickets" on public.tickets;
create policy "Users can read their own tickets"
  on public.tickets for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can purchase tickets for themselves" on public.tickets;
create policy "Users can purchase tickets for themselves"
  on public.tickets for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own demo reward" on public.demo_rewards;
create policy "Users can read their own demo reward"
  on public.demo_rewards for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can claim their own demo reward" on public.demo_rewards;
create policy "Users can claim their own demo reward"
  on public.demo_rewards for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.profiles, public.events, public.tickets, public.demo_rewards
  from anon, authenticated;

grant select on public.events to anon, authenticated;
grant select on public.profiles, public.tickets, public.demo_rewards
  to authenticated;
grant insert on public.tickets, public.demo_rewards to authenticated;

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;
revoke all on function public.reserve_event_ticket() from public, anon, authenticated;
