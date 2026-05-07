create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  image text not null,
  tag text not null,
  price integer not null check (price >= 0),
  compare_at_price integer,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'homepage',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null default '',
  customer_email text not null,
  phone text not null default '',
  address text not null default '',
  payment_method text not null default 'upi',
  payment_status text not null default 'payment_pending',
  total_amount integer not null default 0 check (total_amount >= 0),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists customer_name text not null default '';
alter table public.orders add column if not exists phone text not null default '';
alter table public.orders add column if not exists address text not null default '';
alter table public.orders add column if not exists payment_method text not null default 'upi';
alter table public.orders add column if not exists payment_status text not null default 'payment_pending';
alter table public.orders add column if not exists total_amount integer not null default 0 check (total_amount >= 0);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_price integer not null default 0 check (unit_price >= 0),
  created_at timestamptz not null default now()
);

alter table public.order_items add column if not exists unit_price integer not null default 0 check (unit_price >= 0);

create or replace function public.create_order_with_stock(
  p_customer_name text,
  p_customer_email text,
  p_phone text,
  p_address text,
  p_payment_method text,
  p_total_amount integer,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product_id text;
  v_quantity integer;
  v_unit_price integer;
  v_stock integer;
  v_product_name text;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty.';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := v_item->>'productId';
    v_quantity := coalesce((v_item->>'quantity')::integer, 0);

    if v_product_id is null or v_quantity <= 0 then
      raise exception 'Order items are invalid.';
    end if;

    select stock, name
      into v_stock, v_product_name
      from public.products
      where id = v_product_id and active = true
      for update;

    if not found then
      raise exception 'Product is not available.';
    end if;

    if v_stock <= 0 then
      raise exception '% is sold out.', v_product_name;
    end if;

    if v_stock < v_quantity then
      raise exception 'Only % left for %.', v_stock, v_product_name;
    end if;
  end loop;

  insert into public.orders (
    customer_name,
    customer_email,
    phone,
    address,
    payment_method,
    payment_status,
    total_amount,
    status
  )
  values (
    p_customer_name,
    p_customer_email,
    p_phone,
    p_address,
    p_payment_method,
    case when p_payment_method = 'cod' then 'cod_pending' else 'payment_pending' end,
    p_total_amount,
    'pending'
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := v_item->>'productId';
    v_quantity := (v_item->>'quantity')::integer;
    v_unit_price := coalesce((v_item->>'unitPrice')::integer, 0);

    insert into public.order_items (order_id, product_id, quantity, unit_price)
    values (v_order_id, v_product_id, v_quantity, v_unit_price);

    update public.products
      set stock = stock - v_quantity
      where id = v_product_id;
  end loop;

  return v_order_id;
end;
$$;

insert into public.products (id, name, slug, description, image, tag, price, compare_at_price, stock, featured, sort_order)
values
  (
    'classic-crunch',
    'Classic Crunch',
    'classic-crunch',
    'Roasted peanut depth with a satisfying crunch, made for toast, oats, and post-workout spoons.',
    '/images/product-equilibrium.png',
    '25g Protein',
    499,
    599,
    18,
    true,
    1
  ),
  (
    'cocoa-strength',
    'Cocoa Strength',
    'cocoa-strength',
    'A rich cocoa blend for clean energy, dessert-like cravings, and recovery meals that still feel premium.',
    '/images/product-serenity.png',
    'No Palm Oil',
    549,
    649,
    11,
    true,
    2
  ),
  (
    'honey-fit',
    'Honey Fit',
    'honey-fit',
    'Naturally sweet, freshly crafted, and built for smoothies, pancakes, fruit bowls, and gym meal prep.',
    '/images/product-vitality.png',
    'Limited Edition',
    529,
    null,
    7,
    true,
    3
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  image = excluded.image,
  tag = excluded.tag,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  featured = excluded.featured,
  sort_order = excluded.sort_order;
