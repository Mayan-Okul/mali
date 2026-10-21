import { Package, ShoppingBag, TrendingUp, Wallet } from 'lucide-react';
import {
  formatKES,
  getDeniSummary,
  getGrossSales,
  getLowStock,
  getProfitToday,
} from '../../lib/dashboardStats';
import { Delta } from './ui';

function Kpi({ label, value, sub, delta, icon: Icon, tone }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted max-w-[70%]">
          {label}
        </p>
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
          <Icon size={17} strokeWidth={2.2} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-ink font-display tracking-tight">{value}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        {delta}
        <span className="text-xs text-muted">{sub}</span>
      </div>
    </div>
  );
}

export default function KpiCards({ products, customers, sales }) {
  const gross = getGrossSales(sales, products);
  const deni = getDeniSummary(customers);
  const profit = getProfitToday(sales, products);
  const low = getLowStock(products);
  const lowNames = low.slice(0, 2).map(p => p.name).join(' · ');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Kpi
        label="Today's gross sales"
        value={formatKES(gross.today)}
        sub={gross.count > 0 ? `${gross.count} sales today` : 'No sales yet today'}
        delta={
          gross.deltaPct !== null ? (
            <Delta value={gross.deltaPct} suffix="vs yesterday" />
          ) : null
        }
        icon={ShoppingBag}
        tone="bg-sales/10 text-sales"
      />
      <Kpi
        label="Total Deni balance"
        value={formatKES(deni.total)}
        sub={
          deni.count > 0
            ? `${deni.count} ${deni.count === 1 ? 'customer owes' : 'customers owe'}`
            : 'Nobody owes you'
        }
        icon={Wallet}
        tone="bg-inventory/10 text-inventory"
      />
      <Kpi
        label="Estimated net profit today"
        value={formatKES(profit.profit)}
        sub={
          profit.marginPct !== null
            ? `${profit.marginPct.toFixed(1)}% margin`
            : 'No sales yet today'
        }
        icon={TrendingUp}
        tone="bg-primary/10 text-primary"
      />
      <Kpi
        label="Low stock"
        value={`${low.length} ${low.length === 1 ? 'item' : 'items'}`}
        sub={lowNames || 'All above reorder level'}
        icon={Package}
        tone="bg-expenses/10 text-expenses"
      />
    </div>
  );
}
