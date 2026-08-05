import { products, sales, expenses, customers, TODAY } from './data/seedData';
import {
  getReorderAlerts,
  getSlowMovingProducts,
  getProfitTrend,
  getDebtors,
} from './lib/insights';
import InsightCard from './components/InsightCard';

function formatKES(amount) {
  return `KES ${Math.abs(amount).toLocaleString()}`;
}

function SectionCard({ title, accent, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${accent}`} />
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="text-slate-600 text-sm flex flex-col gap-2">{children}</div>
    </div>
  );
}

function App() {
  const reorderAlerts = getReorderAlerts(products);
  const slowMovers = getSlowMovingProducts(products, sales, TODAY);
  const profitTrend = getProfitTrend(sales, expenses, products, TODAY);
  const debtors = getDebtors(customers);

  const totalOwed = debtors.reduce((sum, c) => sum + c.balanceOwed, 0);
  const profitDropped = profitTrend.change < 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="font-semibold text-slate-800 text-lg">Mali</span>
          </div>
          <span className="text-xs text-slate-400">Mama Nia's Duka · Demo</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning 👋</h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's what's happening in your shop today.
          </p>
        </div>

        {/* AI Insights */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-semibold text-emerald-800">AI Insights</h2>
            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
              {reorderAlerts.length + (profitDropped ? 1 : 0) + (debtors.length ? 1 : 0)} things to know
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profitDropped && (
              <InsightCard
                icon="📉"
                severity="critical"
                title="Profit dropped this week"
                description={
                  `Down ${formatKES(profitTrend.change)} vs last week ` +
                  `(${formatKES(profitTrend.lastWeekProfit)} → ` +
                  `${profitTrend.thisWeekProfit < 0 ? '-' : ''}${formatKES(profitTrend.thisWeekProfit)}). ` +
                  (profitTrend.cause || '')
                }
              />
            )}

            {reorderAlerts.map(item => (
              <InsightCard
                key={item.id}
                icon="📦"
                severity={item.severity === 'critical' ? 'critical' : 'warning'}
                title={`Reorder ${item.product}`}
                description={`Only ${item.stock} left in stock (reorder at ${item.reorderLevel}).`}
              />
            ))}

            {debtors.length > 0 && (
              <InsightCard
                icon="💸"
                severity="warning"
                title="Customers owe you money"
                description={`${debtors.length} customers owe a total of ${formatKES(totalOwed)}. Top: ${debtors[0].name} (${formatKES(debtors[0].balanceOwed)}).`}
              />
            )}

            {slowMovers.length > 0 && (
              <InsightCard
                icon="🐢"
                severity="info"
                title="Slow-moving products"
                description={`${slowMovers.map(s => s.product).join(', ')} barely sold in the last 7 days.`}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SectionCard title="Sales" accent="bg-emerald-500">
            <p>This week: <span className="font-semibold text-slate-800">{formatKES(profitTrend.thisWeekRevenue)}</span></p>
            <p>Last week: <span className="font-semibold text-slate-800">{formatKES(profitTrend.lastWeekRevenue)}</span></p>
          </SectionCard>

          <SectionCard title="Inventory" accent="bg-amber-500">
            <p>{products.length} products tracked</p>
            <p className="text-amber-600 font-medium">{reorderAlerts.length} need reordering</p>
          </SectionCard>

          <SectionCard title="Customers" accent="bg-sky-500">
            <p>{customers.length} customers on record</p>
            <p className="text-rose-600 font-medium">{debtors.length} owe money</p>
          </SectionCard>

          <SectionCard title="Expenses" accent="bg-rose-500">
            <p>This week: <span className="font-semibold text-slate-800">{formatKES(profitTrend.thisWeekExpenses)}</span></p>
            <p>Last week: <span className="font-semibold text-slate-800">{formatKES(profitTrend.lastWeekExpenses)}</span></p>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

export default App;
