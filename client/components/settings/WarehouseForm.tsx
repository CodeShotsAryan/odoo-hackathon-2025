
import React, { useState, useEffect } from 'react';
import { Warehouse } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MapPin, Hash, Type } from 'lucide-react';

interface WarehouseFormProps {
  initialData: Warehouse | null;
  onSave: (data: Omit<Warehouse, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', shortCode: '', address: '' });
    }
    setError(null);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSave(formData);
      // Form cleared by parent if needed, or we reset here if it was a create action
      if (!initialData) {
         setFormData({ name: '', shortCode: '', address: '' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-lg sticky top-24 animate-fade-in">
      <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-dark-border pb-4">
        {initialData ? 'Edit Warehouse' : 'New Warehouse'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input 
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={Type}
          required
          placeholder="e.g. Central Depot"
        />

        <Input 
          label="Short Code"
          value={formData.shortCode}
          onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
          icon={Hash}
          required
          placeholder="e.g. WH/NY"
          maxLength={8}
          error={error && error.includes('Short code') ? error : undefined}
        />

        <div className="relative">
           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">Address</label>
           <div className="relative">
             <MapPin className="absolute left-4 top-3 text-gray-400" size={20} />
             <textarea 
               value={formData.address}
               onChange={(e) => setFormData({ ...formData, address: e.target.value })}
               className="w-full bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-dark-border focus:border-brand-500 dark:focus:border-brand-500 rounded-xl px-4 py-3 pl-12 outline-none transition-all min-h-[100px]"
               placeholder="Enter full address..."
               required
             />
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

export default WarehouseForm;
