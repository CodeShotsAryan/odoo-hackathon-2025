
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { apiMock } from '../../services/mockApi';
import { Warehouse, ToastType } from '../../types';
import { useToast } from '../../context/ToastContext';
import WarehouseList from '../../components/settings/WarehouseList';
import WarehouseForm from '../../components/settings/WarehouseForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Plus, Warehouse as WarehouseIcon } from 'lucide-react';

const WarehousePage = () => {
  const { addToast } = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchWarehouses = async () => {
    try {
      const data = await apiMock.warehouse.getAll();
      setWarehouses(data);
    } catch (err) {
      addToast('Failed to load warehouses', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSave = async (data: Omit<Warehouse, 'id'>) => {
    try {
      if (selectedWarehouse) {
        // Update
        await apiMock.warehouse.update(selectedWarehouse.id, data);
        addToast('Warehouse updated successfully', ToastType.SUCCESS);
      } else {
        // Create
        await apiMock.warehouse.create(data);
        addToast('Warehouse created successfully', ToastType.SUCCESS);
      }
      fetchWarehouses(); // Refresh list
      setSelectedWarehouse(null); // Reset form to "New" mode
    } catch (error: any) {
      throw error; // Let form handle error display
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await apiMock.warehouse.delete(itemToDelete);
      addToast('Warehouse deleted', ToastType.SUCCESS);
      fetchWarehouses();
      if (selectedWarehouse?.id === itemToDelete) {
        setSelectedWarehouse(null);
      }
    } catch (err) {
      addToast('Failed to delete', ToastType.ERROR);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <Layout showSidebar>
      <div className="space-y-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl">
              <WarehouseIcon size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Warehouse</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your physical storage locations.</p>
            </div>
          </div>
          
          <Button onClick={() => setSelectedWarehouse(null)} className="shadow-lg shadow-brand-500/20">
            <Plus size={20} className="mr-2" /> New Warehouse
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            {loading ? (
              <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <WarehouseList 
                warehouses={warehouses} 
                onEdit={setSelectedWarehouse}
                onDelete={confirmDelete}
              />
            )}
          </div>

          {/* Form Column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <WarehouseForm 
              initialData={selectedWarehouse} 
              onSave={handleSave}
              onCancel={() => setSelectedWarehouse(null)}
            />
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-red-500/20" onClick={handleDelete}>Delete</Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this warehouse? This action cannot be undone.
        </p>
      </Modal>

    </Layout>
  );
};

export default WarehousePage;
