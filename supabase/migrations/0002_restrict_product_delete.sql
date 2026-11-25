-- A product with sales must not be deletable (default was ON DELETE CASCADE, which wiped its sales history).
alter table sales drop constraint sales_product_id_fkey;
alter table sales
  add constraint sales_product_id_fkey
  foreign key (product_id) references products(id) on delete restrict;
