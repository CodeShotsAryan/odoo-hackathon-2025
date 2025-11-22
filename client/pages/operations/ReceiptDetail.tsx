import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { ReceiptDetail as IReceiptDetail, Product } from '../../types';
import ReceiptHeader from '../../components/operations/ReceiptHeader';
import ReceiptMeta from '../../components/operations/ReceiptMeta';
import ReceiptLinesTable from '../../components/operations/ReceiptLinesTable';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ToastType } from '../../types';

const ReceiptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [receipt, setReceipt] = useState<IReceiptDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!id) return;
      try {
        const data = await apiService.operations.getReceiptById(parseInt(id));
        setReceipt(data);
      } catch (error) {
        console.error(error);
        addToast("Could not load receipt details", ToastType.ERROR);
        navigate('/operations/receipts');
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [id, navigate, addToast]);

  const hasShortages = receipt?.lines.some(line => line.qty > line.availableStock) || false;

  const handleValidate = async () => {
    if (hasShortages) {
      addToast("Cannot validate: insufficient stock.", ToastType.ERROR);
      return;
    }
    try {
       await apiService.operations.validateReceipt(receipt!.id);
       setReceipt(prev => {
         if (!prev) return null;
         const nextStatus = prev.status === 'Draft' ? 'Ready' : 'Done';
         return { ...prev, status: nextStatus };
       });
       addToast("Receipt validated successfully!", ToastType.SUCCESS);
    } catch (err) {
       addToast("Validation failed", ToastType.ERROR);
    }
  };

  const handleCancel = async () => {
     if(window.confirm("Are you sure you want to cancel this receipt?")) {
        await apiService.operations.cancelReceipt(receipt!.id);
        setReceipt(prev => prev ? ({ ...prev, status: 'Cancelled' }) : null);
        addToast("Receipt cancelled", ToastType.INFO);
     }
  };

  const handlePrint = () => {
    window.print();
  };

  const updateMeta = (field: keyof IReceiptDetail, value: any) => {
    setReceipt(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const updateLine = (lineId: string, newQty: number) => {
    setReceipt(prev => {
       if (!prev) return null;
       const newLines = prev.lines.map(line => 
         line.id === lineId ? { ...line, qty: newQty } : line
       );
       return { ...prev, lines: newLines };
    });
  };

  const removeLine = (lineId: string) => {
    setReceipt(prev => {
      if (!prev) return null;
      return { ...prev, lines: prev.lines.filter(l => l.id !== lineId) };
    });
  };

  const addLine = (product: Product) => {
    setReceipt(prev => {
      if (!prev) return null;
      const newLine = {
        id: `new-${Date.now()}`,
        productId: product.id,
        code: product.code,
        name: product.name,
        qty: 1,
        availableStock: product.stock
      };
      return { ...prev, lines: [...prev.lines, newLine] };
    });
  };

  if (loading) {
    return (
      <Layout showSidebar>
         <div className="flex items-center justify-center h-screen">
           <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
         </div>
      </Layout>
    );
  }

  if (!receipt) return null;

  return (
    <Layout showSidebar>
      <div className="max-w-5xl mx-auto animate-fade-in pb-20">
        
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
           <Link to="/operations/receipts" className="flex items-center hover:text-brand-500 transition-colors">
             <ArrowLeft size={16} className="mr-1" /> Receipts
           </Link>
           <span>/</span>
           <span className="font-medium text-gray-900 dark:text-white">{receipt.reference}</span>
        </div>

        <ReceiptHeader 
           reference={receipt.reference} 
           status={receipt.status} 
           onValidate={handleValidate}
           onCancel={handleCancel}
           onPrint={handlePrint}
           canValidate={!hasShortages}
        />

        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8 shadow-lg">
           <ReceiptMeta data={receipt} onChange={updateMeta} />
           <div className="h-px bg-gray-100 dark:bg-dark-border my-8" />
           <ReceiptLinesTable 
              lines={receipt.lines} 
              onUpdateLine={updateLine}
              onAddLine={addLine}
              onRemoveLine={removeLine}
           />
        </div>

      </div>
    </Layout>
  );
};

export default ReceiptDetail;