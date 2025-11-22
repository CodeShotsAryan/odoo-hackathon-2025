
import React from 'react';
import { ReceiptDetail } from '../../types';
import { User, Calendar, Truck, Box } from 'lucide-react';

interface ReceiptMetaProps {
  data: ReceiptDetail;
  onChange: (field: keyof ReceiptDetail, value: any) => void;
}

const ReceiptMeta: React.FC<ReceiptMetaProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      
      <div className="space-y-6">
        <div className="relative group">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Receive From</label>
           <div className="relative">
             <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                value={data.receiveFrom}
                onChange={(e) => onChange('receiveFrom', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-gray-200 dark:border-dark-border focus:border-brand-500 outline-none transition-colors text-gray-900 dark:text-white"
             />
           </div>
        </div>

        <div className="relative group">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Responsible</label>
           <div className="relative">
             <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                value={data.responsible}
                onChange={(e) => onChange('responsible', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-gray-200 dark:border-dark-border focus:border-brand-500 outline-none transition-colors text-gray-900 dark:text-white"
             />
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative group">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Schedule Date</label>
           <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="date" 
                value={data.scheduleDate}
                onChange={(e) => onChange('scheduleDate', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-gray-200 dark:border-dark-border focus:border-brand-500 outline-none transition-colors text-gray-900 dark:text-white"
             />
           </div>
        </div>

        <div className="relative group">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Operation Type</label>
           <div className="relative">
             <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <select 
                value={data.operationType}
                onChange={(e) => onChange('operationType', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-gray-200 dark:border-dark-border focus:border-brand-500 outline-none transition-colors text-gray-900 dark:text-white appearance-none"
             >
               <option value="IN">Receipt (IN)</option>
               <option value="RETURN">Customer Return</option>
               <option value="TRANSFER">Internal Transfer</option>
             </select>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptMeta;
