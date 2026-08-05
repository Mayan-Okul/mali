// Mama Nia's Duka — seed data for Mali demo
// Dates are relative to "today" so the story stays fresh regardless of when it's demoed

const DAY = 24 * 60 * 60 * 1000;
export const TODAY = new Date();

function daysAgo(n) {
  return new Date(TODAY.getTime() - n * DAY);
}

export const products = [
  { id: 'p1', name: 'Cooking Oil 1L', category: 'Groceries', costPrice: 220, sellPrice: 260, stock: 6, reorderLevel: 10 },
  { id: 'p2', name: 'Maize Flour 2kg', category: 'Groceries', costPrice: 150, sellPrice: 180, stock: 4, reorderLevel: 12 },
  { id: 'p3', name: 'Sugar 1kg', category: 'Groceries', costPrice: 120, sellPrice: 150, stock: 25, reorderLevel: 10 },
  { id: 'p4', name: 'Bar Soap', category: 'Household', costPrice: 40, sellPrice: 60, stock: 30, reorderLevel: 15 },
  { id: 'p5', name: 'Rice 2kg', category: 'Groceries', costPrice: 210, sellPrice: 250, stock: 18, reorderLevel: 10 },
  { id: 'p6', name: 'Cooking Gas Refill 6kg', category: 'Household', costPrice: 900, sellPrice: 1100, stock: 3, reorderLevel: 5 },
  { id: 'p7', name: 'Toothpaste 100ml', category: 'Household', costPrice: 90, sellPrice: 130, stock: 22, reorderLevel: 10 },
  { id: 'p8', name: 'Assorted Biscuits', category: 'Snacks', costPrice: 25, sellPrice: 40, stock: 40, reorderLevel: 20 },
  { id: 'p9', name: 'Bottled Water 500ml', category: 'Drinks', costPrice: 20, sellPrice: 35, stock: 60, reorderLevel: 30 },
  { id: 'p10', name: 'Shoe Polish', category: 'Household', costPrice: 60, sellPrice: 90, stock: 9, reorderLevel: 5 },
];

export const customers = [
  { id: 'c1', name: 'Achieng Otieno', phone: '0712 345 671', balanceOwed: 850 },
  { id: 'c2', name: 'Baraka Mwangi', phone: '0723 456 782', balanceOwed: 0 },
  { id: 'c3', name: 'Cynthia Wafula', phone: '0734 567 893', balanceOwed: 1200 },
  { id: 'c4', name: 'David Ochieng', phone: '0745 678 904', balanceOwed: 300 },
  { id: 'c5', name: 'Esther Nyambura', phone: '0756 789 015', balanceOwed: 0 },
];

// Sales for the last 14 days — engineered so week-over-week shows a clear profit drop,
// and p1 (Cooking Oil) / p5 (Rice) are clearly slow movers vs the rest
function genSales() {
  const sales = [];
  let id = 1;

  // Week 2 (8-14 days ago) — stronger week
  for (let d = 14; d >= 8; d--) {
    const date = daysAgo(d);
    const dayTx = [
      { productId: 'p3', qty: 5 }, { productId: 'p4', qty: 3 }, { productId: 'p8', qty: 8 },
      { productId: 'p9', qty: 10 }, { productId: 'p7', qty: 2 }, { productId: 'p5', qty: 2 },
      { productId: 'p6', qty: 1 }, { productId: 'p2', qty: 3 }, { productId: 'p1', qty: 2 },
    ];
    dayTx.forEach(tx => {
      sales.push({ id: `s${id++}`, date, productId: tx.productId, qty: tx.qty, customerId: null });
    });
  }

  // Week 1 (0-7 days ago) — weaker week: fewer transactions, oil & rice barely move
  for (let d = 7; d >= 0; d--) {
    const date = daysAgo(d);
    const dayTx = [
      { productId: 'p3', qty: 3 }, { productId: 'p4', qty: 2 }, { productId: 'p8', qty: 4 },
      { productId: 'p9', qty: 5 }, { productId: 'p7', qty: 1 },
    ];
    dayTx.forEach(tx => {
      sales.push({ id: `s${id++}`, date, productId: tx.productId, qty: tx.qty, customerId: null });
    });
  }

  // A few credit sales tied to customers with balances owed
  sales.push({ id: `s${id++}`, date: daysAgo(3), productId: 'p6', qty: 1, customerId: 'c1' });
  sales.push({ id: `s${id++}`, date: daysAgo(5), productId: 'p2', qty: 4, customerId: 'c3' });
  sales.push({ id: `s${id++}`, date: daysAgo(1), productId: 'p5', qty: 1, customerId: 'c4' });

  return sales;
}

export const sales = genSales();

// Expenses for the last 14 days — week 1 has a restocking spike to help explain the profit drop
export const expenses = [
  { id: 'e1', date: daysAgo(12), category: 'Restocking', amount: 3000, note: 'Groceries wholesale run' },
  { id: 'e2', date: daysAgo(10), category: 'Rent', amount: 3000, note: 'Shop rent' },
  { id: 'e3', date: daysAgo(9), category: 'Utilities', amount: 500, note: 'Electricity' },
  { id: 'e4', date: daysAgo(6), category: 'Restocking', amount: 6000, note: 'Emergency gas + oil restock' },
  { id: 'e5', date: daysAgo(4), category: 'Transport', amount: 1200, note: 'Delivery from supplier' },
  { id: 'e6', date: daysAgo(2), category: 'Wages', amount: 3000, note: 'Assistant weekly pay' },
  { id: 'e7', date: daysAgo(1), category: 'Restocking', amount: 1500, note: 'Top-up stock' },
];
