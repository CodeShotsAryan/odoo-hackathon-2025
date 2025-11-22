import React from 'react';
import { ArrowDownRight, ArrowUpRight, Clock, AlertTriangle, Package } from 'lucide-react';
import { DashboardSummary } from '../../types';

interface HeroCardProps {
  type: 'receipt' | 'delivery';
  stats: { late: number; waiting: number; total: number };
  count: number;
  onClick: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ type, stats, count, onClick }) => {
  const isReceipt = type === 'receipt';
  const title = isReceipt ? 'Receipt' : 'Delivery';
  const actionText = isReceipt ? 'to receive' : 'to Deliver';
  const Icon = isReceipt ? ArrowDownRight : ArrowUpRight;
  
  return (
    <div 
      className="relative group overflow-hidden bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 transition-all duration-300 hover:border-brand-500/30 dark:hover:border-brand-500/30 glow-orange-hover"
      style={{ minHeight: '180px' }}
    >
      {/* Background Decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-brand-500/10`} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isReceipt ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">{title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-display font-bold text-gray-900 dark:text-white">{stats.total}</span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total Ops</span>
              </div>
            </div>
          </div>
          
          {/* Right side stats summary */}
          <div className="text-right space-y-1">
            {stats.late > 0 && (
              <div className="flex items-center justify-end gap-2 text-red-500 text-sm font-medium">
                <span>{stats.late} Late</span>
                <AlertTriangle size={14} />
              </div>
            )}
            <div className="flex items-center justify-end gap-2 text-brand-500 text-sm font-medium">
              <span>{stats.waiting} Waiting</span>
              <Clock size={14} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={onClick}
            className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-dark-bg hover:bg-brand-500 dark:hover:bg-brand-500 text-gray-900 dark:text-white hover:text-white rounded-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-brand-500/20 border border-transparent hover:border-brand-600"
          >
            <span className="font-display font-bold text-xl">
              {count} <span className="font-normal text-base opacity-80 ml-1">{actionText}</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Icon size={16} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;