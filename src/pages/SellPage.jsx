import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Minus, Plus, Search } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Soon } from '../components/dashboard/ui';

const kes = n => `KES ${Number(n).toLocaleString()}`;

export default function SellPage({ data, error, loading, onChanged }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [qty, setQty] = useState('1');
  const [saving, setSaving] = useState(false);
  const [saleError, setSaleError] = useState('');
  const [done, setDone] = useState(null);

  if (loading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-8 bg-black/5 rounded-xl w-1/4" />
        <div className="h-64 bg-black/5 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>Failed to load products: {error}</p>
      </div>
    );
  }

  const products = data?.products || [];
  const selected = products.find(p => p.id === selectedId) || null;
  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  const qtyNum = Number(qty);
  const qtyOk = selected && qty !== '' && Number.isInteger(qtyNum) && qtyNum >= 1 && qtyNum <= selected.stock;
  const total = qtyOk ? qtyNum * selected.sellPrice : 0;

  let qtyHint = '';
  if (selected && !qtyOk) {
    qtyHint =
      Number.isInteger(qtyNum) && qtyNum > selected.stock
        ? `Only ${selected.stock} in stock.`
        : 'Enter a whole number of 1 or more.';
  }

  function pick(product) {
    setSelectedId(product.id);
    setQty('1');
    setSaleError('');
    setDone(null);
    if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function step(delta) {
    const next = Math.min(selected.stock, Math.max(1, (Number.isInteger(qtyNum) ? qtyNum : 1) + delta));
    setQty(String(next));
  }

  async function sell() {
    if (!qtyOk || saving) return;
    setSaving(true);
    setSaleError('');
    const { data: rows, error: rpcError } = await supabase.rpc('record_sale', {
      p_product_id: selected.id,
      p_qty: qtyNum,
    });
    setSaving(false);

    if (rpcError) {
      console.error(rpcError);
      const known = rpcError.code === 'P0001';
      setSaleError(known ? rpcError.message : 'Could not record the sale. Check your connection and try again.');
      if (known) onChanged?.();
      return;
    }

    const left = rows?.[0]?.remaining_stock ?? selected.stock - qtyNum;
    setDone({ name: selected.name, qty: qtyNum, total, left, low: left <= selected.reorderLevel });
    setSelectedId(null);
    setQty('1');
    setQuery('');
    onChanged?.();
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink font-display tracking-tight">New Sale</h1>
        <p className="text-sm text-muted">Pick a product, set the quantity and record the sale.</p>
      </div>

      {done && (
        <div className="rounded-2xl bg-emerald-500/10 text-emerald-800 px-4 py-3 space-y-1">
          <p className="flex items-start gap-2 text-sm font-semibold">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            Sold {done.qty} × {done.name} · {kes(done.total)} · {done.left} left
          </p>
          {done.low && (
            <p className="flex items-start gap-2 text-xs font-semibold text-amber-700 pl-0.5">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              {done.left === 0 ? `${done.name} is now out of stock.` : `${done.name} is running low. Time to reorder.`}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <section className="order-2 lg:order-1 lg:col-span-3 bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-canvas rounded-xl text-sm text-ink border-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {products.length === 0 ? (
            <p className="text-sm text-muted text-center py-10">
              No products yet. Add some in Inventory &amp; Stock first.
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted text-center py-10">No products match "{query}".</p>
          ) : (
            <div className="max-h-[28rem] overflow-y-auto space-y-2 pr-1">
              {filtered.map(p => {
                const out = p.stock <= 0;
                const low = !out && p.stock <= p.reorderLevel;
                const active = selected?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={out}
                    onClick={() => pick(p)}
                    className={`w-full text-left flex items-center justify-between gap-3 px-4 py-3 min-h-14 rounded-xl border transition-colors ${
                      active ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-black/5 bg-white hover:bg-canvas'
                    } ${out ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                      <p className="text-xs text-muted truncate">{p.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-ink font-mono">{kes(p.sellPrice)}</p>
                      <p className={`text-xs ${out ? 'text-expenses' : low ? 'text-amber-700' : 'text-muted'}`}>
                        {out ? 'Out of stock' : `${p.stock} in stock`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="order-1 lg:order-2 lg:col-span-2 lg:sticky lg:top-24 bg-white rounded-2xl border border-black/5 shadow-sm p-5 space-y-4">
          {!selected ? (
            <p className="text-sm text-muted">Select a product from the list to start a sale.</p>
          ) : (
            <>
              <div>
                <p className="text-lg font-extrabold text-ink font-display tracking-tight">{selected.name}</p>
                <p className="text-sm text-muted font-mono">
                  {kes(selected.sellPrice)} each · {selected.stock} in stock
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-ink">Quantity</span>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Decrease quantity"
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-canvas text-ink hover:bg-black/5"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                    aria-label="Quantity"
                    className="w-20 h-11 text-center bg-canvas rounded-xl text-sm font-bold text-ink font-mono border-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Increase quantity"
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-canvas text-ink hover:bg-black/5"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {qtyHint && <p className="text-xs text-expenses mt-1">{qtyHint}</p>}
              </div>

              <div>
                <span className="flex items-center gap-2 text-xs font-semibold text-ink">
                  Customer <Soon />
                </span>
                <select disabled className="mt-1 w-full px-3.5 py-2.5 bg-canvas rounded-xl text-sm text-muted border-none opacity-70">
                  <option>Walk-in (no customer)</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-black/5 pt-4">
                <span className="text-sm text-muted">Total</span>
                <span className="text-2xl font-extrabold text-ink font-mono">{kes(total)}</span>
              </div>

              {saleError && <p className="text-sm text-expenses">{saleError}</p>}

              <button
                type="button"
                onClick={sell}
                disabled={!qtyOk || saving}
                className="w-full min-h-12 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Recording…' : `Sell ${qtyOk ? qtyNum : ''} × ${selected.name}`}
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
