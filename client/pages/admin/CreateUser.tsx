import React, { useState } from 'react';
import { UserRole, ToastType } from '../../types';
import { apiMock } from '../../services/mockApi';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Mail, User, Shield } from 'lucide-react';

const CreateUser = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: UserRole.USER
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiMock.adminCreateUser(formData);
      addToast(`User ${formData.username} created successfully! Email sent.`, ToastType.SUCCESS);
      setFormData({ username: '', email: '', role: UserRole.USER }); // Reset
    } catch (error) {
      addToast('Failed to create user.', ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Create New User</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">They will receive a generated password via email.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          icon={User}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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

        <div className="mb-5">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 ml-1">Role</label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setFormData({...formData, role: UserRole.USER})}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.role === UserRole.USER ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-gray-200 dark:border-dark-border text-gray-500'}`}
                >
                    <User size={18} /> User
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({...formData, role: UserRole.ADMIN})}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.role === UserRole.ADMIN ? 'border-brand-500 bg-brand-500/10 text-brand-500' : 'border-gray-200 dark:border-dark-border text-gray-500'}`}
                >
                    <Shield size={18} /> Admin
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