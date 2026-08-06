import { useEffect, useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Package,
  Users,
  Wallet,
  Turtle,
  ShoppingBag,
} from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { products, sales, expenses, customers, TODAY } from './data/seedData';
import {
  getReorderAlerts,
  getSlowMovingProducts,
  getProfitTrend,
  getDebtors,
  getDailyRevenue,
} from './lib/insights';
import { fetchAIInsights } from './lib/aiClient';
import InsightRow from './components/InsightCard';

function formatKES(amount) {
  return `KES ${Math.abs(amount).toLocaleString()}`;
}

function Delta({ value, suffix = 'vs last week' }) {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${positive ? 'text-sales' : 'text-expenses'}`}>
      <Icon size={13} strokeWidth={2.5} />
      {Math.abs(value).toFixed(1)}% {suffix}
    </span>
  );
}

function KpiCard({ icon: Icon, color, label, value, delta, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          <Icon size={19} strokeWidth={2.2} />
        </div>
        {delta !== undefined && <Delta value={delta} />}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-ink tracking-tight">{value}</p>
        <p className="text-sm text-muted mt-0.5">{label}</p>
      </div>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

const PIE_COLORS = ['#5B4FE8', '#E2E1EC'];

function App() {
  const reorderAlerts = getReorderAlerts(products);
  const slowMovers = getSlowMovingProducts(products, sales, TODAY);
  const profitTrend = getProfitTrend(sales, expenses, products, TODAY);
  const debtors = getDebtors(customers);
  const dailyRevenue = getDailyRevenue(sales, products, TODAY, 14);

  const totalOwed = debtors.reduce((sum, c) => sum + c.balanceOwed, 0);
  const profitDropped = profitTrend.change < 0;

  const salesDelta =
    profitTrend.lastWeekRevenue !== 0
      ? ((profitTrend.thisWeekRevenue - profitTrend.lastWeekRevenue) / profitTrend.lastWeekRevenue) * 100
      : 0;
  const expenseDelta =
    profitTrend.lastWeekExpenses !== 0
      ? ((profitTrend.thisWeekExpenses - profitTrend.lastWeekExpenses) / profitTrend.lastWeekExpenses) * 100
      : 0;

  const profitSplitData = [
    { name: 'This week', value: Math.max(profitTrend.thisWeekProfit, 0) },
    { name: 'Remaining', value: Math.max(profitTrend.lastWeekProfit - profitTrend.thisWeekProfit, 1) },
  ];

  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    const metrics = {
      profit: {
        thisWeek: profitTrend.thisWeekProfit,
        lastWeek: profitTrend.lastWeekProfit,
        change: profitTrend.change,
        likelyCause: profitTrend.cause,
      },
      reorders: reorderAlerts.map(r => ({ product: r.product, stock: r.stock, reorderLevel: r.reorderLevel })),
      slowMovers: slowMovers.map(s => ({ product: s.product, unitsSold: s.unitsSold })),
      debtors: debtors.map(d => ({ name: d.name, amountOwed: d.balanceOwed })),
      totalOwed,
    };
    let cancelled = false;
    fetchAIInsights(metrics).then(result => {
      if (!cancelled && result) setAiInsights(result);
      if (!cancelled) setAiLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reorderMessage(item) {
    const aiMatch = aiInsights?.reorderInsights?.find(r => r.product === item.product);
    return aiMatch ? aiMatch.message : `Only ${item.stock} left — reorder threshold is ${item.reorderLevel}.`;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="bg-white border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-sm">
              M
            </div>
            <span className="font-extrabold text-ink text-lg tracking-tight">Mali</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              N
            </div>
            <span className="text-sm text-ink font-medium">Nia's Duka</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Good morning, Nia</h1>
          <p className="text-muted text-sm mt-1">Here's what's happening in your shop today.</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={ShoppingBag}
            color="var(--color-sales)"
            value={formatKES(profitTrend.thisWeekRevenue)}
            label="Sales this week"
            delta={salesDelta}
          />
          <KpiCard
            icon={Package}
            color="var(--color-inventory)"
            value={reorderAlerts.length}
            label="Products need reordering"
            sub={`${products.length} products tracked`}
          />
          <KpiCard
            icon={Users}
            color="var(--color-customers)"
            value={debtors.length}
            label="Customers owe you"
            sub={`${customers.length} customers on record`}
          />
          <KpiCard
            icon={Wallet}
            color="var(--color-expenses)"
            value={formatKES(profitTrend.thisWeekExpenses)}
            label="Expenses this week"
            delta={-expenseDelta}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-ink text-sm">Revenue, last 14 days</h2>
              <span className="text-xs text-muted">Daily KES</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#6B6879' }}
                    axisLine={false}
                    tickLine={false}
                    interval={2}
                  />
                  <Tooltip
                    formatter={value => [`KES ${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #eee', fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex flex-col">
            <h2 className="font-bold text-ink text-sm mb-2">Profit this week</h2>
            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={profitSplitData}
                    dataKey="value"
                    innerRadius={42}
                    outerRadius={60}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {profitSplitData.map((entry, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-lg font-extrabold ${profitDropped ? 'text-expenses' : 'text-sales'}`}>
                  {profitTrend.thisWeekProfit < 0 ? '-' : ''}{formatKES(profitTrend.thisWeekProfit)}
                </span>
                <span className="text-[10px] text-muted">vs {formatKES(profitTrend.lastWeekProfit)} last wk</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <h2 className="font-bold text-ink text-sm">AI Insights</h2>
            {aiLoading ? (
              <span className="text-xs text-muted animate-pulse">thinking…</span>
            ) : (
              <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">
                {reorderAlerts.length + (profitDropped ? 1 : 0) + (debtors.length ? 1 : 0)} to review
              </span>
            )}
          </div>

          <div className="divide-y divide-black/5">
            {profitDropped && (
              <InsightRow
                icon={TrendingDown}
                color="var(--color-expenses)"
                title="Profit dropped this week"
                aiTag={!!aiInsights?.profitInsight}
                description={
                  aiInsights?.profitInsight ||
                  `Down ${formatKES(profitTrend.change)} vs last week ` +
                    `(${formatKES(profitTrend.lastWeekProfit)} → ` +
                    `${profitTrend.thisWeekProfit < 0 ? '-' : ''}${formatKES(profitTrend.thisWeekProfit)}). ` +
                    (profitTrend.cause || '')
                }
              />
            )}

            {reorderAlerts.map(item => (
              <InsightRow
                key={item.id}
                icon={Package}
                color="var(--color-inventory)"
                title={`Reorder ${item.product}`}
                aiTag={!!aiInsights?.reorderInsights?.some(r => r.product === item.product)}
                description={reorderMessage(item)}
              />
            ))}

            {debtors.length > 0 && (
              <InsightRow
                icon={Wallet}
                color="var(--color-customers)"
                title="Customers owe you money"
                aiTag={!!aiInsights?.debtorInsight}
                description={
                  aiInsights?.debtorInsight ||
                  `${debtors.length} customers owe a total of ${formatKES(totalOwed)}. Top: ${debtors[0].name} (${formatKES(debtors[0].balanceOwed)}).`
                }
              />
            )}

            {slowMovers.length > 0 && (
              <InsightRow
                icon={Turtle}
                color="var(--color-primary)"
                title="Slow-moving products"
                aiTag={!!aiInsights?.slowMoverInsight}
                description={
                  aiInsights?.slowMoverInsight ||
                  `${slowMovers.map(s => s.product).join(', ')} barely sold in the last 7 days.`
                }
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
