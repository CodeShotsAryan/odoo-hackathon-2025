import React from 'react';
import { DashboardSummary } from '../../types';

interface SmallChartsProps {
  data: DashboardSummary;
}

export const ValidityChart = ({ data }: { data: DashboardSummary['validityData'] }) => {
  const total = data.valid + data.invalid + data.resources;
  const validPct = (data.valid / total) * 100;
  const invalidPct = (data.invalid / total) * 100;
  const resPct = (data.resources / total) * 100;

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-dark-border">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">Stock Validity</h4>
      <div className="flex h-4 rounded-full overflow-hidden">
        <div style={{ width: `${validPct}%` }} className="bg-green-500" title="Valid" />
        <div style={{ width: `${invalidPct}%` }} className="bg-brand-500" title="Invalid" />
        <div style={{ width: `${resPct}%` }} className="bg-gray-300 dark:bg-gray-600" title="Resources" />
      </div>
      <div className="flex justify-between mt-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-900 dark:text-white">Customer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500" />
          <span className="text-gray-900 dark:text-white">Product</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="text-gray-900 dark:text-white">Web</span>
        </div>
      </div>
    </div>
  );
};

export const ActivityChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  
  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-dark-border">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">Activity Timeline</h4>
      <div className="flex items-end justify-between h-24 gap-2">
        {data.map((val, idx) => {
          const height = (val / max) * 100;
          return (
            <div 
              key={idx} 
              className="w-full bg-brand-500/20 dark:bg-brand-500/20 rounded-t-sm hover:bg-brand-500 transition-colors duration-200 relative group"
              style={{ height: `${height}%` }}
            >
               <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-card text-white text-xs py-1 px-2 rounded border border-dark-border whitespace-nowrap pointer-events-none transition-opacity z-10">
                 {val} ops
               </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-center text-xs text-gray-400">Last 12 Days</div>
    </div>
  );
};