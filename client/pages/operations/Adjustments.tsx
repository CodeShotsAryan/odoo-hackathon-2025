import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Adjustment, AdjustmentType, AdjustmentStatus } from '../../types';
import AdjustmentsTable from '../../components/adjustments/AdjustmentsTable';
import Button from '../../components/ui/Button';
import { Search, Plus, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ToastType } from '../../types';

const Adjustments = () => {
  const { addToast } = useToast();
  const [data, setData] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<AdjustmentType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<AdjustmentStatus | 'ALL'>('ALL');

  const fetchData = async () => {
    try {
      const result = await apiService.adjustments.list();
      setData(result);
    } catch (error) {
      console.error('Failed to load adjustments', error);
      addToast('Failed to load adjustments', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleBulkApply = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Apply ${selectedIds.length} selected drafts?`)) return;

    try {
      await apiService.adjustments.bulkApply(selectedIds);
      addToast(`Applied ${selectedIds.length} adjustments`, ToastType.SUCCESS);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      addToast('Failed to apply adjustments', ToastType.ERROR);
    }
  };

  return (
    <Layout showSidebar>
      <div className="space-y-6 pb-20">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card text-gray-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Adjustments</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                 <Link to="/dashboard" className="hover:text-brand-500">Dashboard</Link>
                 <span>/</span>
                 <span className="text-brand-500 font-medium">Adjustments</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
             {selectedIds.length > 0 && (
               <Button onClick={handleBulkApply} className="py-2 px-4 text-sm bg-green-600 hover:bg-green-700">
                 <CheckCircle size={16} className="mr-2" /> Apply Selected ({selectedIds.length})
               </Button>
             )}

             <Link to="/operations/adjustments/new">
               <Button className="py-2 px-4 text-sm">
                 <Plus size={16} className="mr-2" /> New Adjustment
               </Button>
             </Link>
             
             <div className="relative flex-1 sm:w-64 min-w-[200px]">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
           <select 
             className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm outline-none focus:border-brand-500"
             value={typeFilter}
             onChange={(e) => setTypeFilter(e.target.value as any)}
           >
             <option value="ALL">All Types</option>
             <option value="ADD">Add Stock</option>
             <option value="REMOVE">Remove Stock</option>
             <option value="CORRECTION">Correction</option>
           </select>

           <select 
             className="px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm outline-none focus:border-brand-500"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value as any)}
           >
             <option value="ALL">All Status</option>
             <option value="Draft">Draft</option>
             <option value="Applied">Applied</option>
             <option value="Cancelled">Cancelled</option>
           </select>
        </div>

        <div className="min-h-[600px]">
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <AdjustmentsTable 
              data={filteredData} 
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Adjustments;