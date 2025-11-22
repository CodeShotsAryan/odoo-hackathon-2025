
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import apiService from '../../services/api';
import { Location, Warehouse, ToastType } from '../../types';
import { useToast } from '../../context/ToastContext';
import LocationList from '../../components/settings/LocationList';
import LocationForm from '../../components/settings/LocationForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Plus, MapPin } from 'lucide-react';


const LocationsPage = () => {
  const { addToast } = useToast();
  const [locations, setLocations] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [locData, whData] = await Promise.all([
        apiService.locations.getAll(),
        apiService.warehouse.getAll()
      ]);
      setLocations(locData);
      setWarehouses(whData);
    } catch (err) {
      addToast('Failed to load data', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (selectedLocation) {
        await apiService.locations.update(selectedLocation.id, data);
        addToast('Location updated successfully', ToastType.SUCCESS);
      } else {
        await apiService.locations.create(data);
        addToast('Location created successfully', ToastType.SUCCESS);
      }
      fetchData();
      setSelectedLocation(null);
    } catch (error: any) {
      throw error;
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await apiService.locations.delete(itemToDelete);
      addToast('Location deleted', ToastType.SUCCESS);
      fetchData();
      if (selectedLocation?.id === itemToDelete) {
        setSelectedLocation(null);
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
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl">
              <MapPin size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Locations</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage internal locations and shelves.</p>
            </div>
          </div>
          
          <Button onClick={() => setSelectedLocation(null)} className="shadow-lg shadow-brand-500/20">
            <Plus size={20} className="mr-2" /> New Location
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 xl:col-span-8">
            {loading ? (
              <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <LocationList 
                locations={locations} 
                onEdit={setSelectedLocation}
                onDelete={confirmDelete}
              />
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <LocationForm 
              initialData={selectedLocation} 
              warehouses={warehouses}
              onSave={handleSave}
              onCancel={() => setSelectedLocation(null)}
            />
          </div>

        </div>
      </div>

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
          Are you sure you want to delete this location? This action cannot be undone.
        </p>
      </Modal>

    </Layout>
  );
};


export default LocationsPage;