import React from 'react';
import { ReceiptStatus } from '../../types';

interface StatusBadgeProps {
  status: string | ReceiptStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyles = (s: string) => {
    const normalized = s.toUpperCase();
    
    if (normalized === 'LATE') {
      return 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500 border-red-200 dark:border-red-500/20';
    }
    if (normalized === 'READY' || normalized === 'DONE') {
      return 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-500 border-green-200 dark:border-green-500/20';
    }
    if (normalized === 'WAITING') {
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
    // Default/Brand
    return 'bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-500 border-brand-200 dark:border-brand-500/20';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStyles(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;