import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Delivery } from '../../types';
import ViewToggle from '../../components/ui/ViewToggle';
import DeliveriesTable from '../../components/operations/DeliveriesTable';
import DeliveriesKanban from '../../components/operations/DeliveriesKanban';
import Button from '../../components/ui/Button';
import { Search, Plus, ArrowLeft } from 'lucide-react';

const Deliveries = () => {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [data, setData] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.operations.getDeliveries();
        setData(result);
      } catch (error) {
        console.error('Failed to load deliveries', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contact.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card text-gray-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Delivery</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                 <Link to="/dashboard" className="hover:text-brand-500">Dashboard</Link>
                 <span>/</span>
                 <span className="text-brand-500 font-medium">Deliveries</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
             <Link to="/operations/deliveries/new">
               <Button className="py-2 px-4 text-sm">
                 <Plus size={16} className="mr-2" /> NEW
               </Button>
             </Link>
             
             <div className="relative flex-1 md:w-64">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                 <Search size={16} />
               </div>
               <input 
                  type="text" 
                  placeholder="Search ref, contact..." 
                  className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>

             <div className="flex gap-1 bg-white dark:bg-dark-card p-1 rounded-lg border border-gray-200 dark:border-dark-border">
                {['Ready', 'Waiting', 'Late'].map(status => (
                   <button
                     key={status}
                     onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                     className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                       statusFilter === status 
                        ? 'bg-brand-500 text-white' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg'
                     }`}
                   >
                     {status}
                   </button>
                ))}
             </div>

             <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <div className="min-h-[600px]">
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {view === 'list' ? (
                <DeliveriesTable data={filteredData} />
              ) : (
                <DeliveriesKanban data={filteredData} />
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Deliveries;