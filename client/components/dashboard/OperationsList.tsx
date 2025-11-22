import React from 'react';
import { Operation } from '../../types';
import { Calendar, MapPin, User as UserIcon } from 'lucide-react';

interface OperationsListProps {
  operations: Operation[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    LATE: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500 border-red-200 dark:border-red-500/20',
    WAITING: 'bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-500 border-brand-200 dark:border-brand-500/20',
    OPERATIONS: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    DONE: 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-500 border-green-200 dark:border-green-500/20',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.OPERATIONS}`}>
      {status}
    </span>
  );
};

const OperationsList: React.FC<OperationsListProps> = ({ operations }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 dark:border-dark-border flex justify-between items-center">
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">Upcoming Operations</h3>
        <button className="text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors">View All</button>
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-1">
        {operations.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">No operations scheduled.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-dark-bg/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-medium">
                <th className="px-6 py-3 rounded-tl-lg">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {operations.map((op) => (
                <tr key={op.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/30 transition-colors group">
                  <td className="px-6 py-4">
                    <StatusBadge status={op.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <Calendar size={14} className="text-gray-400" />
                      {op.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{op.productName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                        <span className="font-semibold text-brand-500">{op.quantity} units</span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <MapPin size={12} /> {op.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {op.assignedTo ? (
                      <div className="flex items-center gap-2" title={op.assignedTo.name}>
                        <img 
                          src={op.assignedTo.avatarUrl} 
                          alt={op.assignedTo.name} 
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-dark-border"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-bg flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 text-gray-400">
                        <UserIcon size={14} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OperationsList;