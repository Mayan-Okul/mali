import { useEffect, useState } from 'react';
import { Package, TrendingDown, Turtle, Wallet } from 'lucide-react';
import { fetchAIInsights } from '../../lib/aiClient';
import { getDebtors, getProfitTrend, getReorderAlerts, getSlowMovingProducts } from '../../lib/insights';
import { formatKES } from '../../lib/dashboardStats';
import InsightRow from '../InsightCard';
import { Card, CardEmpty } from './ui';

export default function AiInsights({ products, sales, expenses, customers }) {
  const reorderAlerts = getReorderAlerts(products);
  const slowMovers = getSlowMovingProducts(products, sales, new Date());
  const trend = getProfitTrend(sales, expenses, products, new Date());
  const debtors = getDebtors(customers);
  const totalOwed = debtors.reduce((sum, c) => sum + c.balanceOwed, 0);

  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    const t = getProfitTrend(sales, expenses, products, new Date());
    const metrics = {
      profit: {
        thisWeek: t.thisWeekProfit,
        lastWeek: t.lastWeekProfit,
        change: t.change,
        likelyCause: t.cause,
      },
      reorders: getReorderAlerts(products).map(r => ({
        product: r.product,
        stock: r.stock,
        reorderLevel: r.reorderLevel,
      })),
      slowMovers: getSlowMovingProducts(products, sales, new Date()).map(s => ({
        product: s.product,
        unitsSold: s.unitsSold,
      })),
      debtors: getDebtors(customers).map(d => ({ name: d.name, amountOwed: d.balanceOwed })),
      totalOwed: getDebtors(customers).reduce((sum, c) => sum + c.balanceOwed, 0),
    };
    let cancelled = false;
    fetchAIInsights(metrics).then(result => {
      if (cancelled) return;
      if (result) setAiInsights(result);
      setAiLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [products, sales, expenses, customers]);

  const rows = [];
  if (trend.change < 0) {
    rows.push({
      key: 'profit',
      icon: TrendingDown,
      tone: 'bg-expenses/10 text-expenses',
      title: 'Profit dropped this week',
      aiTag: !!aiInsights?.profitInsight,
      description:
        aiInsights?.profitInsight ||
        `Down ${formatKES(Math.abs(trend.change))} vs last week (${formatKES(
          trend.lastWeekProfit
        )} → ${formatKES(trend.thisWeekProfit)}). ${trend.cause || ''}`.trim(),
    });
  }
  reorderAlerts.forEach(item => {
    const aiMatch = aiInsights?.reorderInsights?.find(r => r.product === item.product);
    rows.push({
      key: `reorder-${item.id}`,
      icon: Package,
      tone: 'bg-inventory/10 text-inventory',
      title: `Reorder ${item.product}`,
      aiTag: !!aiMatch,
      description:
        aiMatch?.message ||
        `Only ${item.stock} left — reorder threshold is ${item.reorderLevel}.`,
    });
  });
  if (debtors.length > 0) {
    rows.push({
      key: 'debtors',
      icon: Wallet,
      tone: 'bg-customers/10 text-customers',
      title: 'Customers owe you money',
      aiTag: !!aiInsights?.debtorInsight,
      description:
        aiInsights?.debtorInsight ||
        `${debtors.length} customers owe a total of ${formatKES(totalOwed)}. Top: ${
          debtors[0].name
        } (${formatKES(debtors[0].balanceOwed)}).`,
    });
  }
  if (slowMovers.length > 0) {
    rows.push({
      key: 'slow-movers',
      icon: Turtle,
      tone: 'bg-primary/10 text-primary',
      title: 'Slow-moving products',
      aiTag: !!aiInsights?.slowMoverInsight,
      description:
        aiInsights?.slowMoverInsight ||
        `${slowMovers.map(s => s.product).join(', ')} barely sold in the last 7 days.`,
    });
  }

  return (
    <Card
      title="AI Insights"
      action={
        aiLoading ? (
          <span className="text-xs text-muted animate-pulse">thinking…</span>
        ) : rows.length > 0 ? (
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
            {rows.length} to review
          </span>
        ) : null
      }
    >
      {rows.length === 0 ? (
        <CardEmpty>
          {aiLoading ? 'Thinking about your shop…' : 'No insights right now — everything looks healthy.'}
        </CardEmpty>
      ) : (
        <div className="divide-y divide-black/5">
          {rows.map(r => (
            <InsightRow
              key={r.key}
              icon={r.icon}
              tone={r.tone}
              title={r.title}
              description={r.description}
              aiTag={r.aiTag}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
