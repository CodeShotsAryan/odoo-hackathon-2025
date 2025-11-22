
import React from 'react';
import { Warehouse } from '../../types';
import { MapPin, Edit2, Trash2, Box } from 'lucide-react';

interface WarehouseListProps {
  warehouses: Warehouse[];
  onEdit: (wh: Warehouse) => void;
  onDelete: (id: string) => void;
}

const WarehouseList: React.FC<WarehouseListProps> = ({ warehouses, onEdit, onDelete }) => {
  if (warehouses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
        <Box className="w-10 h-10 mb-3 opacity-50" />
        <p>No warehouses found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 animate-slide-up">
      {warehouses.map((wh) => (
        <div 
          key={wh.id}
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-300 group"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{wh.name}</h3>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-bg text-xs font-mono font-medium text-gray-500 rounded">
                  {wh.shortCode}
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span className="line-clamp-2">{wh.address}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
              <button 
                onClick={() => onEdit(wh)}
                className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(wh.id)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WarehouseList;
