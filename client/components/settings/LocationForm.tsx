
import React, { useState, useEffect } from 'react';
import { Location, Warehouse } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MapPin, Hash, Type, Warehouse as WarehouseIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LocationFormProps {
  initialData: Location | null;
  warehouses: Warehouse[];
  onSave: (data: Omit<Location, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ initialData, warehouses, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    warehouseId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        shortCode: initialData.shortCode,
        warehouseId: initialData.warehouseId
      });
    } else {
      setFormData({ 
        name: '', 
        shortCode: '', 
        warehouseId: warehouses.length > 0 ? warehouses[0].id : '' 
      });
    }
    setError(null);
  }, [initialData, warehouses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.warehouseId) {
      setError('Please select a warehouse');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await onSave(formData);
      if (!initialData) {
         setFormData(prev => ({ ...prev, name: '', shortCode: '' }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (warehouses.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8 text-center shadow-lg">
        <WarehouseIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Warehouses</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You need to create a warehouse before adding locations.</p>
        <Link to="/settings/warehouse">
          <Button className="w-full">Create a Warehouse First</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-lg sticky top-24 animate-fade-in">
      <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-dark-border pb-4">
        {initialData ? 'Edit Location' : 'New Location'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input 
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={Type}
          required
          placeholder="e.g. Shelf A-1"
        />

        <Input 
          label="Short Code"
          value={formData.shortCode}
          onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
          icon={Hash}
          required
          placeholder="e.g. SH-A1"
          maxLength={8}
          error={error && error.includes('Short code') ? error : undefined}
        />

        <div className="relative group">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">Warehouse</label>
           <div className="relative">
             <WarehouseIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
             <select 
               value={formData.warehouseId}
               onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
               className="w-full bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-dark-border focus:border-brand-500 dark:focus:border-brand-500 rounded-xl px-4 py-3 pl-12 outline-none transition-all appearance-none"
               required
             >
               {warehouses.map(w => (
                 <option key={w.id} value={w.id}>{w.name}</option>
               ))}
             </select>
           </div>
        </div>

        {error && !error.includes('Short code') && (
          <div className="text-red-500 text-sm px-2">{error}</div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" isLoading={loading} className="flex-1">
            Save
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;
