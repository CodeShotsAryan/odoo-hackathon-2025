
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiMock } from '../services/mockApi';
import { StockItem, ToastType } from '../types';
import { useToast } from '../context/ToastContext';
import StockTable from '../components/stock/StockTable';
import Button from '../components/ui/Button';
import { Search, Plus, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Stock = () => {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const result = await apiMock.stock.getStockList();
      setData(result);
    } catch (error) {
      console.error('Failed to load stock', error);
      addToast('Failed to load stock data', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<StockItem>) => {
    try {
      // Optimistic update
      setData(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      
      await apiMock.stock.updateStock(id, updates);
      addToast('Stock updated successfully', ToastType.SUCCESS);
    } catch (error) {
      // Revert on failure (reload)
      loadStock();
      addToast('Failed to update stock', ToastType.ERROR);
      throw error; // Re-throw for the row component to handle
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Stock</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage warehouse inventory levels.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
             <Link to="/products/new">
               <Button className="py-2 px-4 text-sm">
                 <Plus size={16} className="mr-2" /> New Product
               </Button>
             </Link>
             
             <div className="relative flex-1 md:w-64">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                 <Search size={16} />
               </div>
               <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <StockTable data={filteredData} onUpdate={handleUpdate} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Stock;
