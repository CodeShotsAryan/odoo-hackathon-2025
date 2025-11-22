
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { apiMock } from '../../services/mockApi';
import { Adjustment, ToastType } from '../../types';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import { ArrowLeft, Calendar, User, Box, FileText, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';

const AdjustmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [data, setData] = useState<Adjustment | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadData = async () => {
    if (!id) return;
    try {
      const result = await apiMock.adjustments.getById(id);
      if (!result) throw new Error('Not found');
      setData(result);
    } catch (error) {
      addToast('Adjustment not found', ToastType.ERROR);
      navigate('/operations/adjustments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleApply = async () => {
    if (!data || !window.confirm('Apply this adjustment? Stock will be updated.')) return;
    setProcessing(true);
    try {
      await apiMock.adjustments.apply(data.id);
      addToast('Applied Successfully', ToastType.SUCCESS);
      loadData();
    } catch (err) {
      addToast('Failed to apply', ToastType.ERROR);
    } finally {
      setProcessing(false);
    }
  };

  const handleRevert = async () => {
    if (!data || !window.confirm('Revert this adjustment? A new counter-adjustment will be created.')) return;
    setProcessing(true);
    try {
      await apiMock.adjustments.revert(data.id);
      addToast('Reverted Successfully', ToastType.SUCCESS);
      navigate('/operations/adjustments'); // Go back to list to see new revert entry
    } catch (err) {
      addToast('Failed to revert', ToastType.ERROR);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!data || !window.confirm('Cancel this draft?')) return;
    setProcessing(true);
    try {
      await apiMock.adjustments.cancel(data.id);
      addToast('Cancelled', ToastType.INFO);
      loadData();
    } catch (err) {
      addToast('Failed to cancel', ToastType.ERROR);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Layout showSidebar><div className="p-10 text-center">Loading...</div></Layout>;
  if (!data) return null;

  return (
    <Layout showSidebar>
      <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
         
         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <Link to="/operations/adjustments" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card text-gray-500 transition-colors">
                 <ArrowLeft size={20} />
               </Link>
               <div>
                 <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-mono font-bold text-gray-900 dark:text-white">{data.reference}</h1>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                       data.status === 'Applied' ? 'bg-green-100 text-green-700' :
                       data.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                       'bg-red-100 text-red-600'
                    }`}>
                       {data.status}
                    </span>
                 </div>
                 <p className="text-sm text-gray-500">Created on {new Date(data.createdAt).toLocaleString()}</p>
               </div>
            </div>

            <div className="flex gap-3">
               {data.status === 'Draft' && (
                 <>
                   <Button onClick={handleApply} disabled={processing}>Apply</Button>
                   <Button variant="secondary" onClick={handleCancel} disabled={processing}>Cancel</Button>
                 </>
               )}
               {data.status === 'Applied' && (
                 <Button variant="secondary" onClick={handleRevert} disabled={processing} className="text-red-600 hover:bg-red-50">
                    <RotateCcw size={16} className="mr-2" /> Revert
                 </Button>
               )}
            </div>
         </div>

         {/* Main Card */}
         <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border text-brand-500">
                     <Box size={24} />
                  </div>
                  <div>
                     <div className="font-bold text-lg text-gray-900 dark:text-white">{data.productName}</div>
                     <div className="font-mono text-xs text-gray-500">{data.productCode}</div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Quantity</div>
                  <div className={`text-2xl font-bold ${data.type === 'ADD' ? 'text-green-500' : data.type === 'REMOVE' ? 'text-red-500' : 'text-brand-500'}`}>
                     {data.type === 'ADD' ? '+' : data.type === 'REMOVE' ? '-' : ''}{data.quantity}
                  </div>
               </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Reason</label>
                     <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                        <FileText size={16} className="text-brand-500" /> {data.reason}
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Location</label>
                     <div className="text-gray-900 dark:text-white">{data.warehouseId} / {data.locationId}</div>
                  </div>
                  {data.note && (
                     <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl text-sm text-gray-600 dark:text-gray-300 italic">
                        "{data.note}"
                     </div>
                  )}
               </div>

               <div className="space-y-6 border-l border-gray-100 dark:border-dark-border pl-8">
                  <div className="relative pb-6 border-l-2 border-brand-200 dark:border-brand-900 ml-2 space-y-8">
                     {/* Created Event */}
                     <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-dark-card" />
                        <div className="text-sm font-bold text-gray-900 dark:text-white">Created</div>
                        <div className="text-xs text-gray-500 mb-1">{new Date(data.createdAt).toLocaleString()}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded w-fit">
                           <User size={12} /> {data.createdBy}
                        </div>
                     </div>

                     {/* Applied Event */}
                     {data.status === 'Applied' && (
                        <div className="relative pl-6">
                           <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white dark:border-dark-card" />
                           <div className="text-sm font-bold text-gray-900 dark:text-white">Applied</div>
                           <div className="text-xs text-gray-500 mb-1">{data.appliedAt ? new Date(data.appliedAt).toLocaleString() : '-'}</div>
                           <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded w-fit">
                              <CheckCircle size={12} className="text-green-500" /> {data.appliedBy}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </Layout>
  );
};

export default AdjustmentDetail;
