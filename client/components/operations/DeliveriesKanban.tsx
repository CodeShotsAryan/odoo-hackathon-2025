import React from 'react';
import { Delivery } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface DeliveriesKanbanProps {
  data: Delivery[];
}

const KanbanColumn = ({ title, items, colorClass }: { title: string, items: Delivery[], colorClass: string }) => (
  <div className="flex-1 min-w-[300px] flex flex-col gap-4 animate-fade-in">
    <div className={`flex items-center justify-between pb-3 border-b-2 ${colorClass}`}>
      <h3 className="font-display font-bold text-gray-700 dark:text-gray-200">{title}</h3>
      <span className="bg-gray-100 dark:bg-dark-bg text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
        {items.length}
      </span>
    </div>

    <div className="flex flex-col gap-3 h-full overflow-y-auto pb-10 custom-scrollbar">
      {items.map((item) => (
        <div 
          key={item.id}
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-[0_8px_30px_rgba(255,122,26,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,122,26,0.25)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-slide-up"
        >
          <div className="flex justify-between items-start mb-3">
             <span className="font-mono text-xs font-medium text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded">
              {item.reference}
            </span>
            <StatusBadge status={item.status} className="!px-2 !py-0.5 !text-[10px]" />
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 font-medium mb-1">
               {item.from} <ArrowRight size={12} className="text-gray-400" /> {item.to}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <User size={12} /> {item.contact}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-dark-border flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
               <Calendar size={12} /> {item.scheduleDate}
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="h-24 border-2 border-dashed border-gray-200 dark:border-dark-border rounded-xl flex items-center justify-center text-gray-400 text-sm">
          No Items
        </div>
      )}
    </div>
  </div>
);

const DeliveriesKanban: React.FC<DeliveriesKanbanProps> = ({ data }) => {
  const readyItems = data.filter(i => i.status === 'Ready');
  const lateItems = data.filter(i => i.status === 'Late');
  const waitingItems = data.filter(i => i.status === 'Waiting');

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-240px)]">
      <KanbanColumn 
        title="Ready" 
        items={readyItems} 
        colorClass="border-green-500 text-green-500" 
      />
      <KanbanColumn 
        title="Late" 
        items={lateItems} 
        colorClass="border-red-500 text-red-500" 
      />
      <KanbanColumn 
        title="Waiting" 
        items={waitingItems} 
        colorClass="border-gray-400 text-gray-400" 
      />
    </div>
  );
};

export default DeliveriesKanban;