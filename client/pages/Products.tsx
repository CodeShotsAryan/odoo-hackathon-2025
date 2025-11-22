import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, Search } from 'lucide-react';
import apiService from '../services/api';
import { useToast } from '../context/ToastContext';
import { ToastType } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Products = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    uom: '',
    barcode: '',
    min_stock_level: 10,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.products.list();
      setProducts(data);
    } catch (error) {
      addToast('Failed to load products', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingProduct) {
        await apiService.products.update(editingProduct.id, formData);
        addToast('Product updated successfully', ToastType.SUCCESS);
      } else {
        await apiService.products.create(formData);
        addToast('Product created successfully', ToastType.SUCCESS);
      }
      
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        category: '',
        uom: '',
        barcode: '',
        min_stock_level: 10,
      });
      loadProducts();
    } catch (error) {
      addToast('Operation failed', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      uom: product.uom,
      barcode: product.barcode,
      min_stock_level: product.min_stock_level,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await apiService.products.delete(id);
      addToast('Product deleted successfully', ToastType.SUCCESS);
      loadProducts();
    } catch (error) {
      addToast('Failed to delete product', ToastType.ERROR);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      category: '',
      uom: '',
      barcode: '',
      min_stock_level: 10,
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Products</h1>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          <Plus size={18} className="mr-2" /> Add Product
        </Button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-lg mb-6 animate-slide-up">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingProduct ? 'Edit Product' : 'New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Widget A"
              />
              
              <Input
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                placeholder="e.g. WGT-001"
              />
              
              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="e.g. Electronics"
              />
              
              <Input
                label="Unit of Measure"
                value={formData.uom}
                onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                required
                placeholder="e.g. PCS, KG, L"
              />
              
              <Input
                label="Barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                required
                placeholder="e.g. 123456789012"
              />
              
              <Input
                label="Min Stock Level"
                type="number"
                value={formData.min_stock_level}
                onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt(e.target.value) || 0 })}
                required
                min="0"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" isLoading={loading} className="flex-1">
                {editingProduct ? 'Update' : 'Create'} Product
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={loading} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-dark-bg/50 border-b border-gray-200 dark:border-dark-border text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">UOM</th>
                  <th className="px-6 py-4">Barcode</th>
                  <th className="px-6 py-4">Min Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id}
                    className="group hover:bg-brand-50/30 dark:hover:bg-brand-500/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200 font-mono">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {product.uom}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200 font-mono">
                      {product.barcode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {product.min_stock_level}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;