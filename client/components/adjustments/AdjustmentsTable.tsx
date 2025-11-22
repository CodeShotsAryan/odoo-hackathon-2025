
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Adjustment } from '../../types';
import { ArrowRight, Calendar, User, Box, AlertTriangle } from 'lucide-react';
import styles from '../../pages/operations/adjustments.module.css'; // We'll use this pattern as requested or standard css

// Helper for CSS classes if module isn't resolving perfectly in all envs
const getRowClass = (type: string) => {
  if (type === 'ADD') return 'bg-green-50/50 dark:bg-green-900/10 border-l-4 border-green-500/30';
  if (type === 'REMOVE') return 'bg-red-50/50 dark:bg-red-900/10 border-l-4 border-red-500/30';
  return 'bg-brand-50/30 dark:bg-brand-900/10 border-l-4 border-brand-500/30';
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Draft': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    case 'Applied': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Cancelled': return 'bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 line-through opacity-70';
    default: return '';
  }
};

interface AdjustmentsTableProps {
  data: Adjustment[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

const AdjustmentsTable: React.FC<AdjustmentsTableProps> = ({ data, selectedIds, onToggleSelect }) => {
  const navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
        <p>No adjustments found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden animate-slide-up">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-dark-bg/50 border-b border-gray-200 dark:border-dark-border text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <th className="px-4 py-4 w-12 text-center">
                {/* Header checkbox logic could go here */}
              </th>
              <th className="px-4 py-4">Reference</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Product</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {data.map((adj) => {
              const isDraft = adj.status === 'Draft';
              const rowClass = getRowClass(adj.type);
              
              return (
                <tr 
                  key={adj.id} 
                  className={`hover:opacity-90 transition-colors duration-200 cursor-pointer group ${rowClass}`}
                  onClick={(e) => {
                    // Navigate unless clicking checkbox
                    if ((e.target as HTMLElement).tagName !== 'INPUT') {
                       navigate(`/operations/adjustments/${adj.id}`);
                    }
                  }}
                >
                  <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    {isDraft && (
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(adj.id)}
                        onChange={() => onToggleSelect(adj.id)}
                        className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm font-mono font-medium text-gray-900 dark:text-white">
                    {adj.reference}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                     <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-gray-400" />
                       {new Date(adj.date).toLocaleDateString()}
                     </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-900 dark:text-white flex items-center gap-1">
                         <Box size={14} className="text-gray-400"/> {adj.productName}
                      </span>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        Qty: <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{adj.quantity}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                     <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        adj.type === 'ADD' ? 'bg-green-100 text-green-700' : 
                        adj.type === 'REMOVE' ? 'bg-red-100 text-red-700' : 
                        'bg-brand-100 text-brand-700'
                     }`}>
                       {adj.type}
                     </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(adj.status)}`}>
                      {adj.status}
                    </span>
                    {adj.warning && <AlertTriangle size={14} className="inline-block ml-2 text-amber-500" />}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <User size={14} /> {adj.createdBy}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdjustmentsTable;
