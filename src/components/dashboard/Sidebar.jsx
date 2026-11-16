import {
  BookOpen,
  Boxes,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Receipt,
  ScanBarcode,
  Settings,
  X,
} from 'lucide-react';
import { Soon } from './ui';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'Point of Sale', icon: ScanBarcode },
  { id: 'deni', label: 'Deni Ledger', icon: BookOpen },
  { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
  { id: 'expenses', label: 'Expenses & P&L', icon: Receipt },
  { id: 'reports', label: 'Reports & Tax', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function Nav({ activeTab, onSelectTab, signOut, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-sm">
          M
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-ink text-sm font-display tracking-tight">Mali</p>
          <p className="text-[10px] text-muted">Business OS</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          // Enabled tabs: Dashboard ('dashboard') and Inventory & Stock ('inventory')
          const isEnabled = id === 'dashboard' || id === 'inventory';

          return (
            <button
              key={id}
              type="button"
              disabled={!isEnabled}
              onClick={() => {
                onSelectTab(id);
                if (onNavigate) onNavigate();
              }}
              className={`w-full min-h-11 flex items-center gap-3 px-3 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary text-white shadow-sm'
                  : isEnabled
                  ? 'text-ink hover:bg-canvas'
                  : 'text-muted opacity-50 cursor-not-allowed'
              }`}
            >
              <Icon size={18} strokeWidth={2.2} />
              <span className="flex-1 text-left">{label}</span>
              {!isEnabled && <Soon />}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-black/5">
        <button
          type="button"
          onClick={signOut}
          className="w-full min-h-11 flex items-center gap-3 px-3 rounded-xl text-sm font-semibold text-muted hover:bg-canvas hover:text-ink"
        >
          <LogOut size={18} strokeWidth={2.2} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ activeTab, onSelectTab, open, onClose, signOut }) {
  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[260px] bg-white border-r border-black/5 z-30">
        <Nav activeTab={activeTab} onSelectTab={onSelectTab} signOut={signOut} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-[260px] max-w-[85vw] bg-white shadow-xl">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center rounded-xl text-muted hover:bg-canvas"
            >
              <X size={20} />
            </button>
            <Nav activeTab={activeTab} onSelectTab={onSelectTab} signOut={signOut} onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
