
import React from 'react';
import { ReceiptStatus } from '../../types';
import Button from '../ui/Button';
import { Printer, X, CheckCircle } from 'lucide-react';

interface ReceiptHeaderProps {
  reference: string;
  status: ReceiptStatus;
  onValidate: () => void;
  onCancel: () => void;
  onPrint: () => void;
  canValidate: boolean;
}

const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({ 
  reference, 
  status, 
  onValidate, 
  onCancel, 
  onPrint,
  canValidate 
}) => {
  const stages: ReceiptStatus[] = ['Draft', 'Ready', 'Done'];
  
  const isStageActive = (stage: string) => {
    // Handle special cases or map statuses to indices
    const flow = ['Draft', 'Ready', 'Done'];
    const current = status === 'Waiting' || status === 'Late' ? 'Draft' : status; // Map edge cases to flow
    return flow.indexOf(stage) <= flow.indexOf(current as string);
  };

  const displayStatus = status === 'Waiting' ? 'Draft (Waiting)' : status;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="px-3 py-1 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-500 text-sm font-mono font-semibold rounded">
             NEW
           </div>
           <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Receipt</h1>
        </div>
        
        {/* Status Flow Pills */}
        <div className="flex items-center bg-white dark:bg-dark-card rounded-full border border-gray-200 dark:border-dark-border p-1 shadow-sm overflow-hidden">
           {stages.map((stage, idx) => (
             <div key={stage} className="flex items-center">
                <div 
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300
                    ${status === stage 
                       ? 'bg-brand-500 text-white shadow-md transform scale-105' 
                       : isStageActive(stage)
                         ? 'text-brand-600 dark:text-brand-400'
                         : 'text-gray-400 dark:text-gray-600'
                    }
                  `}
                >
                  {stage}
                </div>
                {idx < stages.length - 1 && (
                  <div className={`h-0.5 w-4 mx-1 ${isStageActive(stage) ? 'bg-brand-200 dark:bg-brand-800' : 'bg-gray-100 dark:bg-dark-border'}`} />
                )}
             </div>
           ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-3 pb-6 border-b border-gray-200 dark:border-dark-border">
         <Button 
           onClick={onValidate} 
           disabled={!canValidate || status === 'Done' || status === 'Cancelled'}
           className={`py-2 px-4 h-10 text-sm ${!canValidate ? 'opacity-50 cursor-not-allowed' : ''}`}
           title={!canValidate ? 'Resolve stock shortages before validating' : ''}
         >
           <CheckCircle size={16} className="mr-2" /> Validate
         </Button>
         <Button 
           variant="secondary" 
           onClick={onPrint}
           className="py-2 px-4 h-10 text-sm"
         >
           <Printer size={16} className="mr-2" /> Print
         </Button>
         <Button 
           variant="ghost" 
           onClick={onCancel}
           disabled={status === 'Done' || status === 'Cancelled'}
           className="py-2 px-4 h-10 text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-500"
         >
           <X size={16} className="mr-2" /> Cancel
         </Button>
      </div>
      
      {/* Reference Title (as per sketch) */}
      <h2 className="text-2xl font-mono font-bold text-brand-600 dark:text-brand-500">{reference}</h2>
    </div>
  );
};

export default ReceiptHeader;
