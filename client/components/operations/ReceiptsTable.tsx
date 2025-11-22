
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface ReceiptsTableProps {
  data: Receipt[];
}

const ReceiptsTable: React.FC<ReceiptsTableProps> = ({ data }) => {
  const navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
        <p>No receipts found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden animate-slide-up">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-dark-bg/50 border-b border-gray-200 dark:border-dark-border text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">To</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Schedule Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {data.map((receipt) => (
              <tr 
                key={receipt.id} 
                onClick={() => navigate(`/operations/receipts/${receipt.id}`)}
                className="group hover:bg-brand-50/30 dark:hover:bg-brand-500/5 transition-colors duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 font-mono text-sm font-medium text-brand-600 dark:text-brand-400">
                  {receipt.reference}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                  {receipt.from}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <ArrowRight size={12} className="text-gray-400" />
                    {receipt.to}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    {receipt.contact}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                   <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {receipt.scheduleDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={receipt.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptsTable;
