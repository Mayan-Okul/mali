import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShopData } from '../lib/useShopData';
import { rememberShopName } from '../lib/lastShop';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import KpiCards from '../components/dashboard/KpiCards';
import AiInsights from '../components/dashboard/AiInsights';
import HourlySalesChart from '../components/dashboard/HourlySalesChart';
import DeniLedger from '../components/dashboard/DeniLedger';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import LowStockWatchlist from '../components/dashboard/LowStockWatchlist';
import ProductsPage from './ProductsPage';
import SellPage from './SellPage';
import { Skeleton } from '../components/dashboard/ui';

function LoadingBlocks() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
      <Skeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Skeleton />
        </div>
        <Skeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Skeleton />
        </div>
        <Skeleton />
      </div>
    </div>
  );
}

function DashboardView({ data, error, loading, reload }) {
  const { signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const TAB_PATHS = { dashboard: '/', pos: '/sell', inventory: '/products' };
  const activeTab = Object.keys(TAB_PATHS).find(id => TAB_PATHS[id] === pathname) || null;
  const selectTab = id => navigate(TAB_PATHS[id] || '/');

  const shopName = data?.shopName || 'My Shop';

  // Remember this browser's shop name so the login page can greet it back.
  useEffect(() => {
    if (data?.shopName) rememberShopName(data.shopName);
  }, [data]);

  if (!activeTab) {
    return <Navigate to="/" replace />;
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={selectTab}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        signOut={signOut}
      />

      <div className="lg:pl-[260px]">
        <TopBar shopName={shopName} onMenu={() => setMenuOpen(true)} onNewSale={() => navigate('/sell')} />

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-display tracking-tight">
                  Habari, {shopName} 👋
                </h1>
                <p className="text-sm text-muted mt-1">{today}</p>
              </div>

              {loading ? (
                <LoadingBlocks />
              ) : data === null ? (
                <LoadingBlocks />
              ) : data.products.length === 0 ? (
                <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <ShoppingBag size={22} strokeWidth={2.2} />
                  </div>
                  <h2 className="font-display font-extrabold text-ink mt-4">Your shop is set up</h2>
                  <p className="text-sm text-muted mt-1">
                    Add your first products, sales and expenses to start seeing insights here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <KpiCards
                    products={data.products}
                    customers={data.customers}
                    sales={data.sales}
                  />

                  <AiInsights
                    products={data.products}
                    sales={data.sales}
                    expenses={data.expenses}
                    customers={data.customers}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2">
                      <HourlySalesChart sales={data.sales} products={data.products} />
                    </div>
                    <DeniLedger customers={data.customers} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2">
                      <RecentTransactions
                        sales={data.sales}
                        products={data.products}
                        customers={data.customers}
                      />
                    </div>
                    <LowStockWatchlist products={data.products} />
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'pos' && (
            <SellPage data={data} error={error} loading={loading} onChanged={reload} />
          )}

          {activeTab === 'inventory' && (
            <ProductsPage data={data} error={error} loading={loading} shopId={data?.shopId} onChanged={reload} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, error, reload } = useShopData();
  const loading = !data && !error;

  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-8 max-w-md text-center">
          <p className="font-display font-bold text-ink">Could not load your shop</p>
          <p className="text-sm text-expenses mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return <DashboardView data={data} error={error} loading={loading} reload={reload} />;
}
