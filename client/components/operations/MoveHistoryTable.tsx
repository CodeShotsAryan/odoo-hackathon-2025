import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StockMove } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { ArrowRight, User, Box, RefreshCw } from 'lucide-react';

interface MoveHistoryTableProps {
  data: StockMove[];
}

const MoveHistoryTable: React.FC<MoveHistoryTableProps> = ({ data }) => {
  const navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
        <RefreshCw className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
        <p>No movement history found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden animate-slide-up">
      <div className="move-history-scroll">
        <table className="w-full text-left border-collapse table-striping" role="table">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-dark-bg/50 border-b border-gray-200 dark:border-dark-border text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider sticky top-0 z-10 backdrop-blur-sm">
              <th className="px-6 py-4" scope="col">Reference</th>
              <th className="px-6 py-4" scope="col">Date</th>
              <th className="px-6 py-4" scope="col">Contact</th>
              <th className="px-6 py-4" scope="col">From</th>
              <th className="px-6 py-4" scope="col">To</th>
              <th className="px-6 py-4" scope="col">Product & Quantity</th>
              <th className="px-6 py-4" scope="col">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {data.map((move, index) => {
              // Check if previous row has same reference for visual grouping
              const isRepeatedRef = index > 0 && data[index - 1].reference === move.reference;
              
              // Determine row class based on type (now using global styles)
              let rowTypeClass = "";
              if (move.type === 'IN') rowTypeClass = "row-in";
              else if (move.type === 'OUT') rowTypeClass = "row-out";
              else rowTypeClass = "row-transfer";

              return (
                <tr 
                  key={move.id} 
                  onClick={() => navigate(`/operations/move-history/${move.id}`)}
                  className={`table-row ${rowTypeClass} cursor-pointer group transition-colors duration-200 outline-none`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/operations/move-history/${move.id}`)}
                >
                  <td className="px-6 py-4 text-sm cell">
                    {!isRepeatedRef ? (
                      <span className="font-mono font-medium text-brand-600 dark:text-brand-400">{move.reference}</span>
                    ) : (
                      <span className="w-full h-full block opacity-10 pl-4 border-l-2 border-gray-300 dark:border-gray-600"></span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm cell">
                    {!isRepeatedRef && move.date}
                  </td>
                  <td className="px-6 py-4 text-sm cell">
                    {!isRepeatedRef && (
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        {move.contact}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm cell">
                    {move.from}
                  </td>
                  <td className="px-6 py-4 text-sm cell">
                    <div className="flex items-center gap-2">
                      <ArrowRight size={12} className="text-gray-400" />
                      {move.to}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm cell">
                     <div className="flex flex-col">
                       <span className="font-medium flex items-center gap-2">
                          <Box size={14} className="text-gray-400" /> {move.productName}
                       </span>
                       <span className="text-xs opacity-70 ml-6">Qty: {move.quantity}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={move.status} />
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

export default MoveHistoryTable;