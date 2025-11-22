
import React from 'react';
import Input from '../ui/Input';
import { MapPin, User, Calendar, Truck } from 'lucide-react';
import { DeliveryDetail } from '../../types';

interface DeliveryMetaProps {
  data: DeliveryDetail;
  onChange: (field: keyof DeliveryDetail, value: any) => void;
}

const DeliveryMeta: React.FC<DeliveryMetaProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      
      <div className="space-y-4">
        <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-4">{data.reference}</h3>
        
        <div className="relative group">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Delivery Address</label>
           <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                value={data.address}
                onChange={(e) => onChange('address', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-gray-200 dark:border-dark-border focus:border-brand-500 outline-none transition-colors text-gray-900 dark:text-white"
             />
           </div>
        </div>

        <div className="relative group pt-2">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Responsible</label>
           <div className="relative">
             <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <select 
                value={data.responsible}
                onChange={(e) => onChange('responsible', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-gray-200 dark:border-dark-border focus:border-brand-500 outline-none transition-colors text-gray-900 dark:text-white appearance-none"
             >
               <option value="John Doe">John Doe</option>
               <option value="Alice Smith">Alice Smith</option>
               <option value="Bob Jones">Bob Jones</option>
             </select>
           </div>
        </div>
      </div>

      <div className="space-y-4 lg:pt-12">
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

        <div className="relative group pt-2">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Operation Type</label>
           <div className="relative">
             <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <select 
                value={data.operationType}
                onChange={(e) => onChange('operationType', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-gray-200 dark:border-dark-border focus:border-brand-500 outline-none transition-colors text-gray-900 dark:text-white appearance-none"
             >
               <option value="OUT">Delivery Order (OUT)</option>
               <option value="RETURN">Return (IN)</option>
               <option value="TRANSFER">Internal Transfer</option>
             </select>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMeta;
