const DAY = 24 * 60 * 60 * 1000;

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7);

export function formatKES(amount) {
  const n = Math.round(amount);
  return n < 0 ? `-KES ${Math.abs(n).toLocaleString()}` : `KES ${n.toLocaleString()}`;
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function byId(list) {
  return Object.fromEntries(list.map(item => [item.id, item]));
}

function dayTotals(sales, products, date) {
  const pmap = byId(products);
  return sales.reduce(
    (acc, s) => {
      if (!isSameDay(s.date, date)) return acc;
      const p = pmap[s.productId];
      if (!p) return acc;
      acc.revenue += p.sellPrice * s.qty;
      acc.cost += p.costPrice * s.qty;
      return acc;
    },
    { revenue: 0, cost: 0 }
  );
}

export function getGrossSales(sales, products, now = new Date()) {
  const today = dayTotals(sales, products, now).revenue;
  const yesterday = dayTotals(sales, products, new Date(now.getTime() - DAY)).revenue;
  const count = sales.filter(s => isSameDay(s.date, now)).length;
  return {
    today,
    yesterday,
    count,
    deltaPct: yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : null,
  };
}

export function getProfitToday(sales, products, now = new Date()) {
  const { revenue, cost } = dayTotals(sales, products, now);
  const profit = revenue - cost;
  return { revenue, cost, profit, marginPct: revenue > 0 ? (profit / revenue) * 100 : null };
}

export function getDeniSummary(customers) {
  const debtors = customers
    .filter(c => c.balanceOwed > 0)
    .sort((a, b) => b.balanceOwed - a.balanceOwed);
  return {
    debtors,
    total: debtors.reduce((sum, c) => sum + c.balanceOwed, 0),
    count: debtors.length,
  };
}

export function getLowStock(products) {
  return products
    .filter(p => p.stock <= p.reorderLevel)
    .sort((a, b) => a.stock - b.stock);
}

function hourLabel(h) {
  return `${h % 12 === 0 ? 12 : h % 12}${h >= 12 ? 'p' : 'a'}`;
}

export function getHourlySales(sales, products, day) {
  const pmap = byId(products);
  const buckets = HOURS.map(h => ({ hour: h, label: hourLabel(h), revenue: 0 }));
  sales.forEach(s => {
    if (!isSameDay(s.date, day)) return;
    const p = pmap[s.productId];
    if (!p) return;
    const bucket = buckets[s.date.getHours() - 7];
    if (bucket) bucket.revenue += p.sellPrice * s.qty;
  });
  return buckets;
}

export function relativeTime(date, now = new Date()) {
  const mins = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function getRecentSales(sales, products, customers, now = new Date(), limit = 5) {
  const pmap = byId(products);
  const cmap = byId(customers);
  return [...sales]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(s => {
      const p = pmap[s.productId];
      if (!p) return null;
      const c = s.customerId ? cmap[s.customerId] : null;
      return {
        id: s.id,
        item: p.name,
        customer: c ? c.name : s.customerId ? '—' : 'Walk-in',
        onDeni: !!s.customerId,
        time: relativeTime(s.date, now),
        qty: s.qty,
        total: p.sellPrice * s.qty,
      };
    })
    .filter(Boolean)
    .slice(0, limit);
}

export function whatsappLink(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits.startsWith('0') ? `254${digits.slice(1)}` : digits}`;
}

export function initials(name) {
  const parts = (name || '').trim().split(/\s+/);
  if (parts.length === 1) return (parts[0] || '?').slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
