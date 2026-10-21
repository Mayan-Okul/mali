import { HandCoins, Menu, Plus } from 'lucide-react';
import { Soon } from './ui';

export default function TopBar({ shopName, onMenu }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-black/5">
      <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="lg:hidden w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-ink hover:bg-canvas"
        >
          <Menu size={20} />
        </button>

        <p className="text-sm font-bold text-ink font-display tracking-tight truncate min-w-0">
          {shopName}
        </p>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            disabled
            aria-label="New Sale"
            className="min-h-11 px-3 sm:px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-1.5 opacity-70"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">New Sale</span>
            <Soon onDark />
          </button>
          <button
            type="button"
            disabled
            aria-label="Record Deni"
            className="min-h-11 px-3 sm:px-4 rounded-xl border border-black/10 text-sm font-semibold text-ink flex items-center gap-1.5 opacity-70"
          >
            <HandCoins size={16} strokeWidth={2.2} />
            <span className="hidden sm:inline">Record Deni</span>
            <Soon />
          </button>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
            {(shopName || '?').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
