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
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Point of Sale', icon: ScanBarcode },
  { label: 'Deni Ledger', icon: BookOpen },
  { label: 'Inventory & Stock', icon: Boxes },
  { label: 'Expenses & P&L', icon: Receipt },
  { label: 'Reports & Tax', icon: FileBarChart },
  { label: 'Settings', icon: Settings },
];

function Nav({ signOut, onNavigate }) {
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
        {NAV.map(({ label, icon: Icon }, i) => {
          const active = i === 0;
          return (
            <button
              key={label}
              type="button"
              disabled={!active}
              onClick={onNavigate}
              className={`w-full min-h-11 flex items-center gap-3 px-3 rounded-xl text-sm font-semibold ${
                active ? 'bg-primary text-white' : 'text-muted opacity-70'
              }`}
            >
              <Icon size={18} strokeWidth={2.2} />
              <span className="flex-1 text-left">{label}</span>
              {!active && <Soon />}
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

export default function Sidebar({ open, onClose, signOut }) {
  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[260px] bg-white border-r border-black/5 z-30">
        <Nav signOut={signOut} />
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
            <Nav signOut={signOut} onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
