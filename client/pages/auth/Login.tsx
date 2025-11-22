import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import apiService from '../../services/api';
import { ToastType } from '../../types';

const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.auth.login(formData.email, formData.password);
      
      // Store token
      localStorage.setItem('token', response.access_token);
      
      // Parse JWT to get role (basic decode - in production use jwt-decode library)
      const payload = JSON.parse(atob(response.access_token.split('.')[1]));
      const roleId = payload.role_id;
      
      addToast(`Welcome back!`, ToastType.SUCCESS);

      // Redirect based on role (1=admin, 2=stock_manager, 3=warehouse_staff)
      if (roleId === 1) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Invalid credentials';
      addToast(errorMsg, ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Welcome</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to access your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            icon={User}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <div className="relative">
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Link 
              to="/forgot-password" 
              className="absolute right-0 -bottom-6 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Use your registered email and password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;