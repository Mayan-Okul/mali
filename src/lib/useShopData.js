import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export function useShopData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [sh, p, c, s, e] = await Promise.all([
        supabase.from('shops').select('name').limit(1),
        supabase.from('products').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('sales').select('*'),
        supabase.from('expenses').select('*'),
      ]);
      const err = sh.error || p.error || c.error || s.error || e.error;
      if (cancelled) return;
      if (err) return setError(err.message);
      setData({
        shopName: sh.data?.[0]?.name || 'My Shop',
        products: p.data.map(r => ({ id: r.id, name: r.name, category: r.category, costPrice: Number(r.cost_price), sellPrice: Number(r.sell_price), stock: r.stock, reorderLevel: r.reorder_level })),
        customers: c.data.map(r => ({ id: r.id, name: r.name, phone: r.phone, balanceOwed: Number(r.balance_owed) })),
        sales: s.data.map(r => ({ id: r.id, date: new Date(r.sold_at), productId: r.product_id, qty: r.qty, customerId: r.customer_id })),
        expenses: e.data.map(r => ({ id: r.id, date: new Date(r.spent_at), category: r.category, amount: Number(r.amount), note: r.note })),
      });
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { data, error };
}