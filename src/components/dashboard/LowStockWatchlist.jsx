import { getLowStock, initials } from '../../lib/dashboardStats';
import { Card, CardEmpty, Soon } from './ui';

export default function LowStockWatchlist({ products }) {
  const low = getLowStock(products);

  return (
    <Card
      title="Low stock"
      action={
        low.length > 0 ? (
          <span className="text-xs font-semibold bg-expenses/10 text-expenses px-2 py-1 rounded-full">
            {low.length} {low.length === 1 ? 'item' : 'items'}
          </span>
        ) : null
      }
    >
      {low.length === 0 ? (
        <CardEmpty>Everything is above its reorder level.</CardEmpty>
      ) : (
        <ul className="p-4 space-y-3">
          {low.map(p => (
            <li key={p.id} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-expenses/10 text-expenses flex items-center justify-center text-xs font-extrabold shrink-0">
                {initials(p.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink truncate">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.stock} left · Min {p.reorderLevel}
                </p>
              </div>
              <button
                type="button"
                disabled
                className="min-h-11 px-3 rounded-xl border border-black/10 text-xs font-bold text-ink flex items-center gap-1.5 shrink-0 opacity-70"
              >
                Reorder
                <Soon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
