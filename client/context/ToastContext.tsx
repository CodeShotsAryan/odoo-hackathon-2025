import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = ToastType.INFO) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 min-w-[300px] p-4 rounded-xl shadow-2xl border border-opacity-20 backdrop-blur-md animate-slide-up
              ${toast.type === ToastType.SUCCESS ? 'bg-green-500/10 border-green-500 text-green-500' : ''}
              ${toast.type === ToastType.ERROR ? 'bg-red-500/10 border-red-500 text-red-500' : ''}
              ${toast.type === ToastType.INFO ? 'bg-brand-500/10 border-brand-500 text-brand-500' : ''}
            `}
          >
            {toast.type === ToastType.SUCCESS && <CheckCircle size={20} />}
            {toast.type === ToastType.ERROR && <AlertCircle size={20} />}
            {toast.type === ToastType.INFO && <Info size={20} />}
            
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">{toast.message}</span>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};