import { TrendingDown, TrendingUp } from 'lucide-react';

export function Soon({ onDark = false }) {
  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
        onDark ? 'bg-white/25 text-white' : 'bg-ink/5 text-muted'
      }`}
    >
      Soon
    </span>
  );
}

export function Card({ title, action, children }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/5">
        <h2 className="font-display font-bold text-sm text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function CardEmpty({ children }) {
  return <p className="px-5 py-8 text-sm text-muted text-center">{children}</p>;
}

export function Delta({ value, suffix }) {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        positive ? 'text-sales' : 'text-expenses'
      }`}
    >
      <Icon size={13} strokeWidth={2.5} />
      {Math.abs(value).toFixed(1)}% {suffix}
    </span>
  );
}

export function Skeleton() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5 animate-pulse flex flex-col gap-3">
      <div className="h-3 w-1/3 bg-canvas rounded" />
      <div className="h-7 w-1/2 bg-canvas rounded" />
      <div className="h-3 w-2/3 bg-canvas rounded" />
    </div>
  );
}
