
import React, { useState } from 'react';
import { DeliveryLine, Product } from '../../types';
import { AlertTriangle, Trash2 } from 'lucide-react';
import ProductSelector from './ProductSelector';

interface DeliveryLinesTableProps {
  lines: DeliveryLine[];
  onUpdateLine: (id: string, qty: number) => void;
  onAddLine: (product: Product) => void;
  onRemoveLine: (id: string) => void;
}

const DeliveryLinesTable: React.FC<DeliveryLinesTableProps> = ({ lines, onUpdateLine, onAddLine, onRemoveLine }) => {
  // Local state for adding new line qty
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const [newQty, setNewQty] = useState(1);

  const handleAdd = () => {
    if (newProduct) {
      onAddLine({ ...newProduct, stock: newProduct.stock }); // Hack to pass product structure
      setNewProduct(null);
      setNewQty(1);
    }
  };

  const totalRequested = lines.reduce((acc, line) => acc + line.qty, 0);

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-dark-border">
        <h4 className="font-display font-bold text-gray-900 dark:text-white">Products</h4>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-dark-bg/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3 w-32 text-center">Quantity</th>
              <th className="px-6 py-3 w-32 text-center">Available</th>
              <th className="px-6 py-3 w-40">Status</th>
              <th className="px-6 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {lines.map((line) => {
              const isShortage = line.qty > line.availableStock;
              return (
                <tr 
                  key={line.id} 
                  className={`group transition-colors ${isShortage ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-dark-bg/30'}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">[{line.code}] {line.name}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <input 
                       type="number" 
                       min="1"
                       value={line.qty}
                       onChange={(e) => onUpdateLine(line.id, parseInt(e.target.value) || 0)}
                       className="w-20 text-center bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg py-1 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                     />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-medium ${isShortage ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                      {line.availableStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isShortage ? (
                      <div className="flex items-center text-red-600 dark:text-red-400 text-xs font-medium animate-pulse">
                        <AlertTriangle size={14} className="mr-1" /> Not enough stock
                      </div>
                    ) : (
                      <span className="text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onRemoveLine(line.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {/* Add New Line Row */}
            <tr className="bg-gray-50/30 dark:bg-dark-bg/20">
              <td className="px-6 py-4">
                 {newProduct ? (
                   <div className="flex items-center justify-between bg-brand-50 dark:bg-brand-900/10 px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-800">
                     <span className="text-sm font-medium text-brand-700 dark:text-brand-300">[{newProduct.code}] {newProduct.name}</span>
                     <button onClick={() => setNewProduct(null)} className="text-brand-500 hover:text-brand-700"><XIcon size={14} /></button>
                   </div>
                 ) : (
                   <ProductSelector onSelect={setNewProduct} />
                 )}
              </td>
              <td className="px-6 py-4 text-center">
                {newProduct && (
                  <input 
                     type="number" 
                     min="1"
                     value={newQty}
                     onChange={(e) => setNewQty(parseInt(e.target.value))}
                     className="w-20 text-center bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-600 rounded-lg py-1 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {newProduct && <span className="text-sm text-gray-500">{newProduct.stock}</span>}
              </td>
              <td className="px-6 py-4">
                 {newProduct && newQty > newProduct.stock && (
                    <span className="text-xs text-red-500 flex items-center"><AlertTriangle size={12} className="mr-1"/> Shortage</span>
                 )}
              </td>
              <td className="px-6 py-4 text-right">
                 {newProduct && (
                   <button onClick={handleAdd} className="text-sm font-medium text-brand-500 hover:text-brand-600">Add</button>
                 )}
              </td>
            </tr>
          </tbody>
          
          <tfoot className="bg-gray-50 dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border">
             <tr>
               <td className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Total</td>
               <td className="px-6 py-3 text-center font-bold text-gray-900 dark:text-white">{totalRequested}</td>
               <td colSpan={3}></td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const XIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default DeliveryLinesTable;
