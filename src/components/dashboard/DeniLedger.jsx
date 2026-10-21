import { MessageCircle } from 'lucide-react';
import { formatKES, getDeniSummary, whatsappLink } from '../../lib/dashboardStats';
import { Card, CardEmpty, Soon } from './ui';

export default function DeniLedger({ customers }) {
  const { debtors, total, count } = getDeniSummary(customers);

  return (
    <Card
      title="Deni Ledger"
      action={
        count > 0 ? (
          <span className="text-xs font-semibold bg-inventory/10 text-inventory px-2 py-1 rounded-full whitespace-nowrap">
            {formatKES(total)} owed
          </span>
        ) : null
      }
    >
      {count === 0 ? (
        <CardEmpty>Nobody owes you money right now.</CardEmpty>
      ) : (
        <ul className="p-4 space-y-3">
          {debtors.map(c => {
            const wa = whatsappLink(c.phone);
            return (
              <li key={c.id} className="border-l-4 border-inventory rounded-r-xl bg-canvas/60 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{c.name}</p>
                    <p className="text-xs text-muted truncate">{c.phone || 'No phone on record'}</p>
                  </div>
                  <p className="text-sm font-extrabold text-ink shrink-0">{formatKES(c.balanceOwed)}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={wa || undefined}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Message ${c.name} on WhatsApp`}
                    className={`min-h-11 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-bold ${
                      wa
                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                        : 'bg-canvas text-muted opacity-60 pointer-events-none'
                    }`}
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    disabled
                    className="min-h-11 inline-flex items-center gap-1.5 px-3 rounded-xl border border-black/10 text-xs font-bold text-ink opacity-70"
                  >
                    Record Pay
                    <Soon />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
