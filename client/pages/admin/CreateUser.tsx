import React, { useState } from 'react';
import { ToastType } from '../../types';
import apiService from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Mail, User, Shield } from 'lucide-react';

interface CreateUserProps {
  onSuccess?: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onSuccess }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: 2, // Default to stock_manager
    temp_password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiService.admin.createUser(formData);
      addToast(`User ${formData.name} created successfully!`, ToastType.SUCCESS);
      
      // Reset form
      setFormData({ name: '', email: '', role_id: 2, temp_password: '' });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Failed to create user';
      addToast(errorMsg, ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Temporary Password"
          type="password"
          value={formData.temp_password}
          onChange={(e) => setFormData({ ...formData, temp_password: e.target.value })}
          required
          placeholder="Min 8 characters"
        />

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ml-1">Role</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData({...formData, role_id: 1})}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                formData.role_id === 1 
                  ? 'border-brand-500 bg-brand-500/10 text-brand-500' 
                  : 'border-gray-200 dark:border-dark-border text-gray-500'
              }`}
            >
              <Shield size={18} /> Admin
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({...formData, role_id: 2})}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                formData.role_id === 2 
                  ? 'border-brand-500 bg-brand-500/10 text-brand-500' 
                  : 'border-gray-200 dark:border-dark-border text-gray-500'
              }`}
            >
              <User size={18} /> Manager
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({...formData, role_id: 3})}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                formData.role_id === 3 
                  ? 'border-brand-500 bg-brand-500/10 text-brand-500' 
                  : 'border-gray-200 dark:border-dark-border text-gray-500'
              }`}
            >
              <User size={18} /> Staff
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;