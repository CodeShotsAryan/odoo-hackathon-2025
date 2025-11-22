import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { apiMock } from '../../services/mockApi';
import { UserRole, ToastType } from '../../types';

const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      const response = await apiMock.login(formData.username);
      
      // In real app, check password hash here. 
      // Mock API assumes success if user found for this demo.
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.user.role);

      addToast(`Welcome back, ${response.user.username}!`, ToastType.SUCCESS);

      // Redirect based on role
      if (response.user.role === UserRole.ADMIN) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      addToast('Invalid credentials. Try "admin" or "user"', ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400">Sign in to access your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username or Email"
            icon={User}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
          <p>Demo credentials:</p>
          <div className="mt-2 flex gap-4 justify-center">
             <code className="bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded">admin</code>
             <code className="bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded">user</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;