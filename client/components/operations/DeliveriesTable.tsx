
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Delivery } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { Calendar, User, ArrowRight, Box } from 'lucide-react';

interface DeliveriesTableProps {
  data: Delivery[];
}

const DeliveriesTable: React.FC<DeliveriesTableProps> = ({ data }) => {
  const navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
        <Box className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
        <p>No delivery orders found.</p>
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
              <th className="px-6 py-4">From (Loc)</th>
              <th className="px-6 py-4">To (Dest)</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Schedule Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {data.map((delivery) => (
              <tr 
                key={delivery.id} 
                onClick={() => navigate(`/operations/deliveries/${delivery.id}`)}
                className="group hover:bg-brand-50/30 dark:hover:bg-brand-500/5 transition-colors duration-200 cursor-pointer"
              >
                <td className="px-6 py-4 font-mono text-sm font-medium text-brand-600 dark:text-brand-400">
                  {delivery.reference}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                  {delivery.from}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <ArrowRight size={12} className="text-gray-400" />
                    {delivery.to}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    {delivery.contact}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                   <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    {delivery.scheduleDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={delivery.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveriesTable;
