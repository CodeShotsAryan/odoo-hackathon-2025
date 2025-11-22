
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { apiMock } from '../../services/mockApi';
import { Product, Warehouse, Location, AdjustmentType, ToastType } from '../../types';
import { useToast } from '../../context/ToastContext';
import AdjustmentPreview from '../../components/adjustments/AdjustmentPreview';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft, Box, Warehouse as WarehouseIcon, MapPin, FileText, CheckCircle } from 'lucide-react';

const AdjustmentForm = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // Form State
  const [type, setType] = useState<AdjustmentType>('ADD');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('Count Correction');
  const [warehouseId, setWarehouseId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [note, setNote] = useState('');

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, whData, locData] = await Promise.all([
          apiMock.products.getList(),
          apiMock.warehouse.getAll(),
          apiMock.locations.getAll()
        ]);
        setProducts(prodData);
        setWarehouses(whData);
        setLocations(locData);
        
        // Set defaults
        if (whData.length > 0) setWarehouseId(whData[0].id);
      } catch (err) {
        addToast('Failed to load form data', ToastType.ERROR);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Update selected product object when ID changes
  useEffect(() => {
    const prod = products.find(p => p.id === productId) || null;
    setSelectedProduct(prod);
  }, [productId, products]);

  // Filter locations by warehouse
  const filteredLocations = locations.filter(l => l.warehouseId === warehouseId);

  // Auto-select first location when warehouse changes
  useEffect(() => {
    if (filteredLocations.length > 0) {
      setLocationId(filteredLocations[0].id);
    } else {
      setLocationId('');
    }
  }, [warehouseId, locations]);

  const handleSubmit = async (status: 'Draft' | 'Applied') => {
    if (!productId || !warehouseId || !locationId || quantity <= 0) {
      addToast('Please fill all required fields correctly', ToastType.ERROR);
      return;
    }

    setSubmitting(true);
    try {
      // Create Payload
      const payload: any = {
        warehouseId,
        locationId,
        productId,
        productCode: selectedProduct?.code || '',
        productName: selectedProduct?.name || '',
        currentStock: selectedProduct?.stock || 0,
        type,
        quantity,
        reason,
        note,
        date: new Date().toISOString(),
        status: 'Draft' // Initially draft
      };

      // Create
      const newAdj = await apiMock.adjustments.create(payload);
      
      // If Apply requested
      if (status === 'Applied') {
        await apiMock.adjustments.apply(newAdj.id);
        addToast('Adjustment Applied Successfully', ToastType.SUCCESS);
      } else {
        addToast('Draft Saved', ToastType.SUCCESS);
      }

      navigate('/operations/adjustments');
    } catch (err: any) {
      addToast(err.message || 'Operation failed', ToastType.ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout showSidebar><div className="p-10 text-center">Loading...</div></Layout>;

  return (
    <Layout showSidebar>
      <div className="max-w-6xl mx-auto pb-20">
        
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Link to="/operations/adjustments" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">New Adjustment</h1>
            <p className="text-gray-500 dark:text-gray-400">Manually adjust stock levels.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Form */}
          <div className="lg:col-span-2 space-y-6 animate-slide-up">
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm">
              
              {/* Type Selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                 {['ADD', 'REMOVE', 'CORRECTION'].map((t) => (
                   <button
                     key={t}
                     onClick={() => setType(t as any)}
                     className={`py-3 rounded-xl text-sm font-bold transition-all ${
                       type === t 
                        ? t === 'ADD' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : t === 'REMOVE' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                        : 'bg-gray-100 dark:bg-dark-bg text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-hover'
                     }`}
                   >
                     {t}
                   </button>
                 ))}
              </div>

              {/* Location & Product */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Warehouse</label>
                  <div className="relative">
                    <WarehouseIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={warehouseId}
                      onChange={(e) => setWarehouseId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl outline-none focus:border-brand-500"
                    >
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl outline-none focus:border-brand-500"
                    >
                      {filteredLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-500 mb-1">Product</label>
                 <div className="relative">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl outline-none focus:border-brand-500"
                    >
                      <option value="">Select Product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>[{p.code}] {p.name}</option>)}
                    </select>
                 </div>
              </div>

              {/* Qty & Reason */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <Input 
                   label="Quantity" 
                   type="number" 
                   min="1"
                   value={quantity} 
                   onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                   required
                 />
                 
                 <div className="relative group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Reason</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl outline-none focus:border-brand-500"
                    >
                      <option>Count Correction</option>
                      <option>Damaged</option>
                      <option>Spoiled</option>
                      <option>Found in Warehouse</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="relative">
                 <label className="block text-sm font-medium text-gray-500 mb-1">Note (Optional)</label>
                 <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl outline-none focus:border-brand-500 min-h-[100px]"
                    placeholder="Add details..."
                 />
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
                 <Button 
                   type="button" 
                   onClick={() => handleSubmit('Applied')} 
                   disabled={submitting}
                   className="flex-1"
                 >
                   <CheckCircle size={18} className="mr-2" /> Apply Adjustment
                 </Button>
                 <Button 
                   type="button" 
                   variant="secondary" 
                   onClick={() => handleSubmit('Draft')} 
                   disabled={submitting}
                   className="flex-1"
                 >
                   Save Draft
                 </Button>
              </div>
            </div>
          </div>

          {/* Right Preview */}
          <div className="lg:col-span-1">
             <AdjustmentPreview 
               product={selectedProduct} 
               type={type} 
               quantity={quantity} 
             />
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AdjustmentForm;
