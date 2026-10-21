import { formatKES, getRecentSales } from '../../lib/dashboardStats';
import { Card, CardEmpty } from './ui';

export default function RecentTransactions({ sales, products, customers }) {
  const rows = getRecentSales(sales, products, customers);

  return (
    <Card title="Recent transactions">
      {rows.length === 0 ? (
        <CardEmpty>No sales recorded yet.</CardEmpty>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted">
                <th className="text-left font-semibold px-5 py-2.5">Item</th>
                <th className="text-left font-semibold px-2 py-2.5">Customer</th>
                <th className="text-left font-semibold px-2 py-2.5 hidden sm:table-cell">Time</th>
                <th className="text-right font-semibold px-2 py-2.5">Qty</th>
                <th className="text-right font-semibold px-5 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="px-5 py-3 font-medium text-ink max-w-[130px] truncate">{r.item}</td>
                  <td className="px-2 py-3 text-ink/80 max-w-[110px] truncate">
                    {r.customer}
                    {r.onDeni && (
                      <span className="ml-1.5 align-middle text-[10px] font-bold uppercase bg-inventory/10 text-inventory px-1.5 py-0.5 rounded">
                        Deni
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-muted whitespace-nowrap hidden sm:table-cell">{r.time}</td>
                  <td className="px-2 py-3 text-right">{r.qty}</td>
                  <td className="px-5 py-3 text-right font-semibold text-ink whitespace-nowrap">
                    {formatKES(r.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
