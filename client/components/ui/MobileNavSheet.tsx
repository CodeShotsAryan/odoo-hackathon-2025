
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Search, Sun, Moon, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCurrentUser } from '../../context/CurrentUserContext';
import Button from './Button';

interface MobileNavSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavSheet: React.FC<MobileNavSheetProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useCurrentUser();
  const location = useLocation();

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    window.location.href = '/#/login'; // Force reload/redirect
  };

  const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClose}
        className={`
          block px-4 py-3 rounded-xl text-base font-medium transition-all
          ${isActive 
            ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'}
        `}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-dark-card border-l border-gray-200 dark:border-dark-border shadow-2xl animate-slide-in-right flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
          <span className="text-xl font-display font-bold text-gray-900 dark:text-white">Menu</span>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {/* Search Mobile */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl outline-none focus:border-brand-500 transition-all"
            />
          </div>

          {/* Navigation Groups */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Main</div>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">Operations</div>
            <NavLink to="/operations/receipts">Receipts</NavLink>
            <NavLink to="/operations/deliveries">Deliveries</NavLink>
            <NavLink to="/operations/adjustments">Adjustments</NavLink>
          </div>

          <div className="space-y-1">
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">Inventory</div>
             <NavLink to="/stock">Stock</NavLink>
             <NavLink to="/moves">Move History</NavLink>
          </div>

          <div className="space-y-1">
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">Settings</div>
             <NavLink to="/settings/warehouse">Warehouse</NavLink>
             <NavLink to="/settings/locations">Locations</NavLink>
          </div>
        </div>

        {/* Footer / User Controls */}
        <div className="p-5 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg/50">
          <div className="flex items-center gap-3 mb-4">
             <img 
               src={user?.avatarUrl || 'https://ui-avatars.com/api/?name=User'} 
               alt="User" 
               className="w-10 h-10 rounded-full border border-gray-200 dark:border-dark-border" 
             />
             <div className="flex-1 min-w-0">
               <div className="font-medium text-gray-900 dark:text-white truncate">{user?.username}</div>
               <div className="text-xs text-gray-500 truncate">{user?.email}</div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={toggleTheme}
               className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-brand-500 transition-colors"
             >
               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
               <span className="text-sm font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
             </button>
             
             <Button variant="secondary" onClick={handleLogout} className="!p-3 flex items-center justify-center gap-2">
               <LogOut size={18} />
               <span className="text-sm">Log Out</span>
             </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileNavSheet;
