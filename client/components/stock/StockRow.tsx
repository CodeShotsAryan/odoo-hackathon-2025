
import React, { useState } from 'react';
import { StockItem } from '../../types';
import { Edit2, Check, X, AlertCircle } from 'lucide-react';

interface StockRowProps {
  item: StockItem;
  onSave: (id: string, updates: Partial<StockItem>) => Promise<void>;
}

const StockRow: React.FC<StockRowProps> = ({ item, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState({
    onHand: item.onHand,
    freeToUse: item.freeToUse
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (values.onHand < 0 || values.freeToUse < 0) {
      setError('Values cannot be negative');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onSave(item.id, values);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValues({ onHand: item.onHand, freeToUse: item.freeToUse });
    setIsEditing(false);
    setError(null);
  };

  return (
    <tr className={`
      group transition-all duration-200 border-b border-gray-100 dark:border-dark-border
      ${isEditing ? 'bg-brand-50/50 dark:bg-brand-900/10 shadow-[0_0_15px_rgba(255,122,26,0.1)]' : 'hover:bg-gray-50 dark:hover:bg-dark-bg/50'}
    `}>
      {/* Product Name */}
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
        <div className="text-xs text-gray-400">ID: {item.id}</div>
      </td>

      {/* Cost */}
      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
        {item.cost.toLocaleString()} Rs
      </td>

      {/* On Hand */}
      <td className="px-6 py-4">
        {isEditing ? (
          <input
            type="number"
            value={values.onHand}
            onChange={(e) => setValues({ ...values, onHand: parseInt(e.target.value) || 0 })}
            className="w-24 px-2 py-1 text-center bg-white dark:bg-dark-bg border border-brand-300 dark:border-brand-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          />
        ) : (
          <span className="text-gray-900 dark:text-white font-medium">{item.onHand}</span>
        )}
      </td>

      {/* Free to Use */}
      <td className="px-6 py-4">
        {isEditing ? (
          <div className="relative">
            <input
              type="number"
              value={values.freeToUse}
              onChange={(e) => setValues({ ...values, freeToUse: parseInt(e.target.value) || 0 })}
              className="w-24 px-2 py-1 text-center bg-white dark:bg-dark-bg border border-brand-300 dark:border-brand-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            />
            {error && (
              <div className="absolute top-full left-0 mt-1 flex items-center text-xs text-red-500 whitespace-nowrap animate-fade-in z-10">
                <AlertCircle size={12} className="mr-1" /> {error}
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">{item.freeToUse}</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        {isEditing ? (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Edit Stock"
          >
            <Edit2 size={16} />
          </button>
        )}
      </td>
    </tr>
  );
};

export default StockRow;
