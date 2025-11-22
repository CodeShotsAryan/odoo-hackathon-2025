
import React from 'react';
import { StockMove } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { Calendar, ArrowRight, Box, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MoveHistoryKanbanProps {
  data: StockMove[];
}

const KanbanColumn = ({ title, items, colorClass }: { title: string, items: StockMove[], colorClass: string }) => {
  const navigate = useNavigate();
  
  return (
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
            onClick={() => navigate(`/operations/move-history/${item.id}`)}
            className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-lg hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-slide-up"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/operations/move-history/${item.id}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`font-mono text-xs font-medium px-2 py-1 rounded ${item.type === 'IN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : item.type === 'OUT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                {item.reference}
              </span>
              <StatusBadge status={item.status} className="!px-2 !py-0.5 !text-[10px]" />
            </div>

            <div className="mb-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100 font-medium">
                 <span className="truncate max-w-[100px]">{item.from}</span>
                 <ArrowRight size={12} className="text-gray-400 shrink-0" />
                 <span className="truncate max-w-[100px]">{item.to}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <User size={12} /> {item.contact}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-dark-border flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                 <Box size={14} className="text-gray-400" /> {item.productName}
                 <span className="ml-auto text-brand-500">x{item.quantity}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                 <div className="flex items-center gap-1">
                   <Calendar size={12} /> {item.date}
                 </div>
                 <span className="uppercase text-[10px] tracking-wider font-semibold opacity-70">{item.type}</span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="h-24 border-2 border-dashed border-gray-200 dark:border-dark-border rounded-xl flex items-center justify-center text-gray-400 text-sm">
            No Moves
          </div>
        )}
      </div>
    </div>
  );
};

const MoveHistoryKanban: React.FC<MoveHistoryKanbanProps> = ({ data }) => {
  const readyItems = data.filter(i => i.status === 'Ready' || i.status === 'Done');
  const waitingItems = data.filter(i => i.status === 'Waiting');
  const lateItems = data.filter(i => i.status === 'Late');

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-240px)]">
      <KanbanColumn 
        title="Ready / Done" 
        items={readyItems} 
        colorClass="border-green-500 text-green-500" 
      />
      <KanbanColumn 
        title="Waiting" 
        items={waitingItems} 
        colorClass="border-gray-400 text-gray-400" 
      />
      <KanbanColumn 
        title="Late" 
        items={lateItems} 
        colorClass="border-red-500 text-red-500" 
      />
    </div>
  );
};

export default MoveHistoryKanban;
