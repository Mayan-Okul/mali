import { useState } from 'react';
import { Boxes, AlertTriangle, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import ProductForm from '../components/products/ProductForm';
import DeleteDialog from '../components/products/DeleteDialog';

export default function ProductsPage({ data, error, loading, shopId, onChanged }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formProduct, setFormProduct] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
  const categoryList = [...new Set(products.map(p => p.category).filter(Boolean))];
  const categories = ['All', ...categoryList];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  function openForm(product) {
    setSaveError('');
    setFormProduct(product);
  }

  function closeForm() {
    setFormProduct(undefined);
    setSaveError('');
  }

  async function saveProduct(values) {
    if (!shopId) {
      setSaveError('Your shop is still loading. Try again in a moment.');
      return;
    }
    setSaving(true);
    setSaveError('');
    const query = formProduct
      ? supabase.from('products').update(values).eq('id', formProduct.id).select()
      : supabase.from('products').insert({ shop_id: shopId, ...values }).select();
    const { data: saved, error: saveErr } = await query;
    setSaving(false);
    if (saveErr || !saved?.length) {
      console.error(saveErr || 'No row was saved');
      setSaveError('Could not save the product. Check your connection and try again.');
      return;
    }
    setFormProduct(undefined);
    onChanged?.();
  }

  function askDelete(product) {
    setDeleteError('');
    setDeleting(product);
  }

  async function deleteProduct() {
    setDeleteBusy(true);
    setDeleteError('');
    const { data: removed, error: delErr } = await supabase
      .from('products')
      .delete()
      .eq('id', deleting.id)
      .select();
    setDeleteBusy(false);
    if (delErr) {
      console.error(delErr);
      setDeleteError(
        delErr.code === '23503'
          ? `${deleting.name} has sales history, so it can't be deleted. Set its stock to 0 instead.`
          : 'Could not delete the product. Check your connection and try again.'
      );
      return;
    }
    if (!removed?.length) {
      setDeleteError('Could not delete the product.');
      return;
    }
    setDeleting(null);
    onChanged?.();
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink font-display tracking-tight">Inventory & Stock</h1>
          <p className="text-sm text-muted">Manage your shop catalog, prices, and low-stock alerts.</p>
        </div>
        <button
          type="button"
          onClick={() => openForm(null)}
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-canvas rounded-xl text-sm text-ink border-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-ink text-white'
                  : 'bg-canvas text-muted hover:bg-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-canvas rounded-full flex items-center justify-center mx-auto text-muted">
              <Boxes size={24} />
            </div>
            <p className="text-sm font-semibold text-ink">
              {products.length === 0 ? 'No products yet' : 'No products found'}
            </p>
            <p className="text-xs text-muted">
              {products.length === 0
                ? 'Click "Add Product" to add your first item.'
                : 'Try adjusting your search or category filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 text-xs font-semibold text-muted bg-canvas/50">
                  <th className="py-3.5 px-6">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Cost Price</th>
                  <th className="py-3.5 px-4 text-right">Sell Price</th>
                  <th className="py-3.5 px-4 text-right">Stock</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {filteredProducts.map(product => {
                  const isLowStock = product.stock <= product.reorderLevel;
                  return (
                    <tr key={product.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-ink">{product.name}</td>
                      <td className="py-4 px-4 text-muted">{product.category}</td>
                      <td className="py-4 px-4 text-right text-muted font-mono">
                        KES {product.costPrice.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-ink font-mono">
                        KES {product.sellPrice.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-ink">
                        {product.stock}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700">
                            <AlertTriangle size={12} />
                            {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openForm(product)}
                          aria-label={`Edit ${product.name}`}
                          className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-xl text-xs font-semibold text-ink hover:bg-canvas"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => askDelete(product)}
                          aria-label={`Delete ${product.name}`}
                          className="inline-flex items-center gap-1.5 min-h-9 px-3 rounded-xl text-xs font-semibold text-expenses hover:bg-expenses/10"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formProduct !== undefined && (
        <ProductForm
          key={formProduct?.id || 'new'}
          product={formProduct}
          categories={categoryList}
          saving={saving}
          serverError={saveError}
          onSubmit={saveProduct}
          onClose={closeForm}
        />
      )}

      {deleting && (
        <DeleteDialog
          product={deleting}
          busy={deleteBusy}
          error={deleteError}
          onConfirm={deleteProduct}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
