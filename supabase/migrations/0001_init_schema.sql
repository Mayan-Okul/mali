-- Mali: initial schema
-- Run this in Supabase SQL Editor, or place in supabase/migrations/ if using the CLI.

-- 1. Shops -------------------------------------------------------------
create table shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Shop',
  created_at timestamptz not null default now()
);

alter table shops enable row level security;

create policy "Owners can access their own shop"
on shops for all
using (owner_id = auth.uid());

-- Auto-create a shop when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.shops (owner_id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'shop_name', 'My Shop'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Products ------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,
  category text,
  cost_price numeric(12,2) not null default 0,
  sell_price numeric(12,2) not null default 0,
  stock integer not null default 0,
  reorder_level integer not null default 0,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Users can only access their own shop's products"
on products for all
using (shop_id in (select id from shops where owner_id = auth.uid()));

-- 3. Customers -------------------------------------------------------------
create table customers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,
  phone text,
  balance_owed numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

alter table customers enable row level security;

create policy "Users can only access their own shop's customers"
on customers for all
using (shop_id in (select id from shops where owner_id = auth.uid()));

-- 4. Sales -------------------------------------------------------------
create table sales (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  qty integer not null check (qty > 0),
  sold_at timestamptz not null default now()
);

alter table sales enable row level security;

create policy "Users can only access their own shop's sales"
on sales for all
using (shop_id in (select id from shops where owner_id = auth.uid()));

-- 5. Expenses -------------------------------------------------------------
create table expenses (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  category text not null,
  amount numeric(12,2) not null,
  note text,
  spent_at timestamptz not null default now()
);

alter table expenses enable row level security;

create policy "Users can only access their own shop's expenses"
on expenses for all
using (shop_id in (select id from shops where owner_id = auth.uid()));

-- Helpful indexes for the insight queries (reorder, trends, debtors)
create index idx_products_shop on products(shop_id);
create index idx_customers_shop on customers(shop_id);
create index idx_sales_shop_date on sales(shop_id, sold_at);
create index idx_expenses_shop_date on expenses(shop_id, spent_at);
