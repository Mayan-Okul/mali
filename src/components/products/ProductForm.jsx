import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const EMPTY = { name: '', category: '', costPrice: '', sellPrice: '', stock: '', reorderLevel: '' };

function toForm(p) {
  if (!p) return EMPTY;
  return {
    name: p.name,
    category: p.category || '',
    costPrice: String(p.costPrice),
    sellPrice: String(p.sellPrice),
    stock: String(p.stock),
    reorderLevel: String(p.reorderLevel),
  };
}

function validate(f) {
  const errors = {};
  if (!f.name.trim()) errors.name = 'Enter a product name.';
  if (!f.category.trim()) errors.category = 'Enter or pick a category.';
  for (const [key, label, int] of [
    ['costPrice', 'cost price', false],
    ['sellPrice', 'sell price', false],
    ['stock', 'stock', true],
    ['reorderLevel', 'reorder level', true],
  ]) {
    const v = f[key];
    if (v === '' || Number.isNaN(Number(v))) errors[key] = `Enter the ${label}.`;
    else if (Number(v) < 0) errors[key] = `The ${label} cannot be negative.`;
    else if (int && !Number.isInteger(Number(v))) errors[key] = `The ${label} must be a whole number.`;
  }
  return errors;
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="text-xs text-expenses mt-1">{error}</p>}
    </label>
  );
}

const inputCls =
  'w-full px-3.5 py-2.5 bg-canvas rounded-xl text-sm text-ink border-none focus:ring-2 focus:ring-primary';

export default function ProductForm({ product, categories, saving, serverError, onSubmit, onClose }) {
  const [form, setForm] = useState(() => toForm(product));
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
    const onKey = e => e.key === 'Escape' && !saving && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit({
      name: form.name.trim(),
      category: form.category.trim(),
      cost_price: Number(form.costPrice),
      sell_price: Number(form.sellPrice),
      stock: Number(form.stock),
      reorder_level: Number(form.reorderLevel),
    });
  }

  const lowMargin =
    form.costPrice !== '' && form.sellPrice !== '' && Number(form.sellPrice) < Number(form.costPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={() => !saving && onClose()} />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative bg-white w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-extrabold text-ink font-display tracking-tight">
            {product ? 'Edit product' : 'Add product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="w-10 h-10 -mt-2 -mr-2 flex items-center justify-center rounded-xl text-muted hover:bg-canvas"
          >
            <X size={20} />
          </button>
        </div>

        <Field label="Product name" error={errors.name}>
          <input ref={nameRef} value={form.name} onChange={set('name')} placeholder="e.g. Maize flour 2kg" className={inputCls} />
        </Field>

        <Field label="Category" error={errors.category}>
          <input value={form.category} onChange={set('category')} list="product-categories" placeholder="e.g. Staples" className={inputCls} />
          <datalist id="product-categories">
            {categories.map(c => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Cost price (KES)" error={errors.costPrice}>
            <input type="number" inputMode="decimal" min="0" step="any" value={form.costPrice} onChange={set('costPrice')} className={inputCls} />
          </Field>
          <Field label="Sell price (KES)" error={errors.sellPrice}>
            <input type="number" inputMode="decimal" min="0" step="any" value={form.sellPrice} onChange={set('sellPrice')} className={inputCls} />
          </Field>
        </div>

        {lowMargin && (
          <p className="text-xs text-amber-700 bg-amber-500/10 rounded-xl px-3 py-2">
            Sell price is below cost price. You would lose money on each sale.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Stock on hand" error={errors.stock}>
            <input type="number" inputMode="numeric" min="0" step="1" value={form.stock} onChange={set('stock')} className={inputCls} />
          </Field>
          <Field label="Reorder level" error={errors.reorderLevel}>
            <input type="number" inputMode="numeric" min="0" step="1" value={form.reorderLevel} onChange={set('reorderLevel')} className={inputCls} />
          </Field>
        </div>

        {serverError && <p className="text-sm text-expenses">{serverError}</p>}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="min-h-11 px-4 rounded-xl text-sm font-semibold text-muted hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="min-h-11 px-5 rounded-xl text-sm font-semibold bg-primary text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </div>
  );
}
