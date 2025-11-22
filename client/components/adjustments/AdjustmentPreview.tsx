
import React from 'react';
import { Product } from '../../types';
import { ArrowRight, Box, AlertTriangle } from 'lucide-react';

interface AdjustmentPreviewProps {
  product: Product | null;
  type: 'ADD' | 'REMOVE' | 'CORRECTION';
  quantity: number;
}

const AdjustmentPreview: React.FC<AdjustmentPreviewProps> = ({ product, type, quantity }) => {
  if (!product) {
    return (
      <div className="bg-gray-50 dark:bg-dark-card/50 rounded-2xl border border-dashed border-gray-200 dark:border-dark-border h-64 flex items-center justify-center text-gray-400 text-sm p-6 text-center">
        Select a product to see stock impact
      </div>
    );
  }

  let newStock = product.stock;
  if (type === 'ADD') newStock += quantity;
  if (type === 'REMOVE') newStock -= quantity;
  if (type === 'CORRECTION') newStock = quantity;

  const isNegative = newStock < 0;

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-sm animate-fade-in sticky top-24">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-6">
        Projected Stock Impact
      </h3>

      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-lg">
          <Box size={24} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{product.name}</h4>
          <p className="text-xs text-gray-500 font-mono">Code: {product.code}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Current</div>
          <div className="text-2xl font-mono font-bold text-gray-700 dark:text-gray-300">{product.stock}</div>
        </div>
        
        <ArrowRight className="text-gray-300" />

        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Projected</div>
          <div className={`text-2xl font-mono font-bold ${isNegative ? 'text-red-500' : 'text-brand-500'}`}>
            {newStock}
          </div>
        </div>
      </div>

      {isNegative && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex items-start gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold block mb-1">Warning: Negative Stock</span>
            This adjustment will result in negative inventory levels. It will be marked as "Pending" for review.
          </div>
        </div>
      )}
    </div>
  );
};

export default AdjustmentPreview;
