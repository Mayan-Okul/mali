// Rule-based "AI insight" engine for the Mali demo.
// Each function returns a structured insight; App renders them as cards.

const DAY = 24 * 60 * 60 * 1000;

function withinLastNDays(date, n, today) {
  return today.getTime() - date.getTime() <= n * DAY;
}

export function getReorderAlerts(products) {
  return products
    .filter(p => p.stock <= p.reorderLevel)
    .map(p => ({
      id: p.id,
      product: p.name,
      stock: p.stock,
      reorderLevel: p.reorderLevel,
      severity: p.stock <= p.reorderLevel * 0.5 ? 'critical' : 'warning',
    }))
    .sort((a, b) => a.stock - b.stock);
}

export function getSlowMovingProducts(products, sales, today, windowDays = 7) {
  const qtyByProduct = {};
  sales.forEach(s => {
    if (withinLastNDays(s.date, windowDays, today)) {
      qtyByProduct[s.productId] = (qtyByProduct[s.productId] || 0) + s.qty;
    }
  });

  return products
    .map(p => ({
      id: p.id,
      product: p.name,
      unitsSold: qtyByProduct[p.id] || 0,
    }))
    .sort((a, b) => a.unitsSold - b.unitsSold)
    .slice(0, 3);
}

export function getProfitTrend(sales, expenses, products, today) {
  const productMap = Object.fromEntries(products.map(p => [p.id, p]));

  function revenueAndCost(list) {
    return list.reduce(
      (acc, s) => {
        const p = productMap[s.productId];
        if (!p) return acc;
        acc.revenue += p.sellPrice * s.qty;
        acc.cost += p.costPrice * s.qty;
        return acc;
      },
      { revenue: 0, cost: 0 }
    );
  }

  const thisWeekSales = sales.filter(s => withinLastNDays(s.date, 7, today));
  const lastWeekSales = sales.filter(
    s => !withinLastNDays(s.date, 7, today) && withinLastNDays(s.date, 14, today)
  );

  const thisWeekExpenses = expenses
    .filter(e => withinLastNDays(e.date, 7, today))
    .reduce((sum, e) => sum + e.amount, 0);
  const lastWeekExpenses = expenses
    .filter(e => !withinLastNDays(e.date, 7, today) && withinLastNDays(e.date, 14, today))
    .reduce((sum, e) => sum + e.amount, 0);

  const thisWeek = revenueAndCost(thisWeekSales);
  const lastWeek = revenueAndCost(lastWeekSales);

  const thisWeekProfit = thisWeek.revenue - thisWeek.cost - thisWeekExpenses;
  const lastWeekProfit = lastWeek.revenue - lastWeek.cost - lastWeekExpenses;

  const change = thisWeekProfit - lastWeekProfit;
  const percentChange = lastWeekProfit !== 0 ? (change / Math.abs(lastWeekProfit)) * 100 : 0;

  // Simple "likely cause" heuristic
  let cause = null;
  if (change < 0) {
    const expenseIncrease = thisWeekExpenses - lastWeekExpenses;
    const revenueDrop = lastWeek.revenue - thisWeek.revenue;
    if (expenseIncrease > 0 && expenseIncrease >= revenueDrop) {
      cause = `Expenses rose by KES ${expenseIncrease.toLocaleString()} this week, mainly restocking.`;
    } else if (revenueDrop > 0) {
      cause = `Sales revenue dropped by KES ${revenueDrop.toLocaleString()} compared to last week.`;
    }
  }

  return {
    thisWeekProfit,
    lastWeekProfit,
    change,
    percentChange,
    cause,
    thisWeekRevenue: thisWeek.revenue,
    lastWeekRevenue: lastWeek.revenue,
    thisWeekExpenses,
    lastWeekExpenses,
  };
}

export function getDebtors(customers) {
  return customers
    .filter(c => c.balanceOwed > 0)
    .sort((a, b) => b.balanceOwed - a.balanceOwed);
}
