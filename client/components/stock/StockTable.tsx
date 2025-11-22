
import React, { useState } from 'react';
import { StockItem } from '../../types';
import StockRow from './StockRow';
import { ArrowUpDown, Package } from 'lucide-react';

interface StockTableProps {
  data: StockItem[];
  onUpdate: (id: string, updates: Partial<StockItem>) => Promise<void>;
}

type SortField = 'name' | 'cost' | 'onHand' | 'freeToUse';
type SortDirection = 'asc' | 'desc';

const StockTable: React.FC<StockTableProps> = ({ data, onUpdate }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortHeader = ({ field, label }: { field: SortField, label: string }) => (
    <th 
      className="px-6 py-4 cursor-pointer hover:text-brand-500 transition-colors group select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown size={14} className={`text-gray-400 group-hover:text-brand-500 transition-colors ${sortField === field ? 'text-brand-500' : ''}`} />
      </div>
    </th>
  );

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
        <p>No stock items found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden animate-slide-up">
      <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/90 dark:bg-dark-bg/90 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 dark:border-dark-border">
            <tr className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <SortHeader field="name" label="Product" />
              <SortHeader field="cost" label="Per Unit Cost" />
              <SortHeader field="onHand" label="On Hand" />
              <SortHeader field="freeToUse" label="Free to Use" />
              <th className="px-6 py-4 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {sortedData.map((item) => (
              <StockRow key={item.id} item={item} onSave={onUpdate} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
