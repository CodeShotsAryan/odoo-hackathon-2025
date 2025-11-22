import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../../services/api';
import { DeliveryDetail as IDeliveryDetail, Product } from '../../types';
import DeliveryHeader from '../../components/operations/DeliveryHeader';
import DeliveryMeta from '../../components/operations/DeliveryMeta';
import DeliveryLinesTable from '../../components/operations/DeliveryLinesTable';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ToastType } from '../../types';

const DeliveryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [delivery, setDelivery] = useState<IDeliveryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDelivery = async () => {
      if (!id) return;
      try {
        const data = await apiService.operations.getDeliveryById(parseInt(id));
        setDelivery({ ...data, lines: data.lines || [] });
      } catch (error) {
        console.error(error);
        addToast("Could not load delivery details", ToastType.ERROR);
        navigate('/operations/deliveries');
      } finally {
        setLoading(false);
      }
    };
    fetchDelivery();
  }, [id, navigate, addToast]);

  const hasShortages = (delivery?.lines || []).some(line => line.qty > line.availableStock);

  const handleValidate = async () => {
    if (hasShortages) {
      addToast("Cannot validate: insufficient stock.", ToastType.ERROR);
      return;
    }
    try {
      await apiService.operations.validateDelivery(delivery!.id);
      setDelivery(prev => prev ? ({ ...prev, status: 'Ready' }) : null);
      addToast("Delivery validated successfully!", ToastType.SUCCESS);
    } catch (err) {
      addToast("Validation failed", ToastType.ERROR);
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this delivery?")) {
      await apiService.operations.cancelDelivery(delivery!.id);
      setDelivery(prev => prev ? ({ ...prev, status: 'Cancelled' }) : null);
      addToast("Delivery cancelled", ToastType.INFO);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const updateMeta = (field: keyof IDeliveryDetail, value: any) => {
    setDelivery(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const updateLine = (lineId: string, newQty: number) => {
    setDelivery(prev => {
      if (!prev) return null;
      const newLines = prev.lines.map(line =>
        line.id === lineId ? { ...line, qty: newQty } : line
      );
      return { ...prev, lines: newLines };
    });
  };

  const removeLine = (lineId: string) => {
    setDelivery(prev => {
      if (!prev) return null;
      return { ...prev, lines: prev.lines.filter(l => l.id !== lineId) };
    });
  };

  const addLine = (product: Product) => {
    setDelivery(prev => {
      if (!prev) return null;
      const newLine = {
        id: `new-${Date.now()}`,
        productId: product.id,
        code:  product.code || '',
        name: product.name,
        qty: 1,
        location: 'WH/Stock1',
        availableStock: product.stock || 0
      };
      return { ...prev, lines: [...prev.lines, newLine] };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!delivery) return null;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/operations/deliveries" className="flex items-center hover:text-brand-500 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Deliveries
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900 dark:text-white">{delivery.reference}</span>
      </div>

      <DeliveryHeader
        reference={delivery.reference}
        status={delivery.status}
        onValidate={handleValidate}
        onCancel={handleCancel}
        onPrint={handlePrint}
        canValidate={!hasShortages}
      />

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8 shadow-lg">
        <DeliveryMeta data={delivery} onChange={updateMeta} />
        <div className="h-px bg-gray-100 dark:bg-dark-border my-8" />
        <DeliveryLinesTable
          lines={delivery.lines || []}
          onUpdateLine={updateLine}
          onAddLine={addLine}
          onRemoveLine={removeLine}
        />
      </div>
    </div>
  );
};

export default DeliveryDetail;