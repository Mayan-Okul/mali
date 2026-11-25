-- 0003: price snapshot on sales, non-negative checks, and the record_sale function

-- 1. Snapshot the price and cost at the moment of sale
alter table sales add column unit_price numeric(12,2), add column unit_cost numeric(12,2);

update sales s
set unit_price = p.sell_price, unit_cost = p.cost_price
from products p
where p.id = s.product_id and s.unit_price is null;

alter table sales alter column unit_price set not null, alter column unit_cost set not null;

-- 2. Last line of defence: the database refuses negative values
alter table products
  add constraint products_nonnegative
  check (cost_price >= 0 and sell_price >= 0 and stock >= 0 and reorder_level >= 0);

-- 3. record_sale: one transaction, locks the product row, runs with the caller's RLS
create or replace function public.record_sale(
  p_product_id uuid,
  p_qty integer,
  p_customer_id uuid default null
)
returns table (sale_id uuid, remaining_stock integer)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_product products%rowtype;
  v_sale_id uuid;
begin
  if p_qty is null or p_qty < 1 then
    raise exception 'Quantity must be a whole number of at least 1';
  end if;

  select * into v_product from products where id = p_product_id for update;
  if not found then
    raise exception 'Product not found';
  end if;

  if p_customer_id is not null and not exists (
    select 1 from customers where id = p_customer_id and shop_id = v_product.shop_id
  ) then
    raise exception 'Customer not found';
  end if;

  if v_product.stock < p_qty then
    raise exception 'Not enough stock: only % left', v_product.stock;
  end if;

  update products set stock = stock - p_qty where id = v_product.id;

  insert into sales (shop_id, product_id, customer_id, qty, unit_price, unit_cost)
  values (v_product.shop_id, v_product.id, p_customer_id, p_qty, v_product.sell_price, v_product.cost_price)
  returning id into v_sale_id;

  return query select v_sale_id, v_product.stock - p_qty;
end;
$$;

revoke all on function public.record_sale(uuid, integer, uuid) from public, anon;
grant execute on function public.record_sale(uuid, integer, uuid) to authenticated;
