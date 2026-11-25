import { useEffect } from 'react';

export default function DeleteDialog({ product, busy, error, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && !busy && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-ink/40" onClick={() => !busy && onCancel()} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 space-y-3">
        <h2 className="text-lg font-extrabold text-ink font-display tracking-tight">Delete {product.name}?</h2>
        <p className="text-sm text-muted">This cannot be undone.</p>
        {error && <p className="text-sm text-expenses">{error}</p>}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="min-h-11 px-4 rounded-xl text-sm font-semibold text-muted hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="min-h-11 px-5 rounded-xl text-sm font-semibold bg-expenses text-white hover:opacity-90 disabled:opacity-60"
          >
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
