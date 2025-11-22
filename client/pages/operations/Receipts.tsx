import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Receipt } from '../../types';
import ViewToggle from '../../components/ui/ViewToggle';
import ReceiptsTable from '../../components/operations/ReceiptsTable';
import ReceiptsKanban from '../../components/operations/ReceiptsKanban';
import Button from '../../components/ui/Button';
import { Search, Plus, ArrowLeft } from 'lucide-react';

const Receipts = () => {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [data, setData] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.operations.getReceipts();

        // Map API response to Receipt type
        const mappedData: Receipt[] = result.map((item: any) => ({
          id: item.id,
          reference: item.reference,
          from: item.from || '',
          to: item.to || '',
          contact: item.contact || '',
          scheduleDate: item.scheduleDate || item.created_at || '',
          status: item.status || 'Pending',
        }));

        setData(mappedData);
      } catch (error) {
        console.error('Failed to load receipts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtering Logic
  const filteredData = data.filter(
    (item) =>
      item.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card text-gray-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Receipts
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Link to="/dashboard" className="hover:text-brand-500">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-brand-500 font-medium">Receipts</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link to="/operations/receipts/new">
              <Button className="py-2 px-4 text-sm">
                <Plus size={16} className="mr-2" /> NEW
              </Button>
            </Link>

            {/* Search Bar */}
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

            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px]">
          {loading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : view === 'list' ? (
            <ReceiptsTable data={filteredData} />
          ) : (
            <ReceiptsKanban data={filteredData} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Receipts;
