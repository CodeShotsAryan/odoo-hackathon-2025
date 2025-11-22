import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import apiService from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ToastType } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ReceiptForm = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    reference: `REC-${Date.now()}`,
    from: '',
    to: '',
    contact: '',
    scheduleDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [locs, prods] = await Promise.all([
          apiService.locations.getAll(),
          apiService.products.list(),
        ]);
        setLocations(locs);
        setProducts(prods);
      } catch (error) {
        addToast('Failed to load data', ToastType.ERROR);
      }
    };
    loadData();
  }, []);

  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (product && !selectedProducts.find(sp => sp.productId === product.id)) {
      setSelectedProducts([...selectedProducts, {
        productId: product.id,
        name: product.name,
        qty: 1
      }]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(sp => sp.productId !== productId));
  };

  const handleUpdateQty = (productId: number, qty: number) => {
    setSelectedProducts(selectedProducts.map(sp =>
      sp.productId === productId ? { ...sp, qty: Math.max(1, qty) } : sp
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      addToast('Add at least one product', ToastType.ERROR);
      return;
    }

    setLoading(true);
    try {
      for (const item of selectedProducts) {
        await apiService.operations.receipt({
          reference: formData.reference,
          product_id: item.productId,
          qty: item.qty,
          location_dest_id: parseInt(formData.to),
        });
      }
      
      addToast('Receipt created successfully!', ToastType.SUCCESS);
      navigate('/operations/receipts');
    } catch (error) {
      addToast('Failed to create receipt', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/operations/receipts" className="flex items-center hover:text-brand-500 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Receipts
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900 dark:text-white">New Receipt</span>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8 shadow-lg">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
          Create New Receipt
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Reference"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              required
            />
            
            <Input
              label="From (Vendor)"
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">
                To (Location)
              </label>
              <select
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className="w-full bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-dark-border focus:border-brand-500 dark:focus:border-brand-500 rounded-xl px-4 py-3 outline-none transition-all"
                required
              >
                <option value="">Select location</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />

            <Input
              label="Schedule Date"
              type="date"
              value={formData.scheduleDate}
              onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
              required
            />
          </div>

          <div className="border-t border-gray-200 dark:border-dark-border pt-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Products</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">
                Add Product
              </label>
              <select
                onChange={(e) => {
                  handleAddProduct(e.target.value);
                  e.target.value = '';
                }}
                className="w-full bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-dark-border focus:border-brand-500 dark:focus:border-brand-500 rounded-xl px-4 py-3 outline-none transition-all"
              >
                <option value="">Select a product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>

            {selectedProducts.length > 0 && (
              <div className="space-y-3">
                {selectedProducts.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleUpdateQty(item.productId, parseInt(e.target.value) || 1)}
                      className="w-24 px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(item.productId)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={loading} className="flex-1">
              Create Receipt
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/operations/receipts')}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiptForm;