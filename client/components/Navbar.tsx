
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, User, LogOut, Plus, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCurrentUser } from '../context/CurrentUserContext';
import { UserRole } from '../types';
import NavItem from './ui/NavItem';
import MobileNavSheet from './ui/MobileNavSheet';
import Button from './ui/Button';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser, toggleRole } = useCurrentUser();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/login');
  };

  // Menu items configuration
  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { 
      label: 'Operations', 
      subItems: [
        { label: 'Receipts', path: '/operations/receipts' },
        { label: 'Deliveries', path: '/operations/deliveries' },
        { label: 'Adjustments', path: '/operations/adjustments' } // Placeholder
      ]
    },
    { label: 'Stock', path: '/stock' },
    { label: 'Move History', path: '/moves' }, // Placeholder
    { 
      label: 'Settings', 
      subItems: [
        { label: 'Warehouse', path: '/settings/warehouse' },
        { label: 'Locations', path: '/settings/locations' }
      ]
    }
  ];

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-dark-card/90 backdrop-blur-lg border-b border-gray-200 dark:border-dark-border z-50 transition-colors duration-300"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Left: Logo & Desktop Nav */}
          <div className="flex items-center gap-8 h-full">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25 transition-transform group-hover:scale-105 group-hover:rotate-3">
                <span className="text-white font-display font-bold text-xl">I</span>
              </div>
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                Inventrivia
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 h-full">
              {navItems.map((item) => (
                <NavItem 
                  key={item.label} 
                  label={item.label} 
                  path={item.path} 
                  subItems={item.subItems} 
                />
              ))}
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search (Expandable) */}
            <div className={`flex items-center transition-all duration-300 ${searchExpanded ? 'w-48 sm:w-64' : 'w-10'}`}>
              <div className="relative w-full">
                <button 
                  onClick={() => setSearchExpanded(!searchExpanded)}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:text-brand-500 transition-colors z-10 ${searchExpanded ? 'pointer-events-none' : ''}`}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className={`
                    w-full bg-gray-100 dark:bg-dark-bg border-transparent focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg pl-10 py-1.5 text-sm transition-all duration-300 outline-none
                    ${searchExpanded ? 'opacity-100 visible' : 'opacity-0 invisible w-0 p-0 border-0'}
                  `}
                  onBlur={() => !searchExpanded && setSearchExpanded(false)}
                  autoFocus={searchExpanded}
                />
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-gray-400 transition-colors hidden sm:block"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <button 
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-gray-400 transition-colors relative"
              aria-label="Notifications"
              onClick={() => setNotificationCount(0)}
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span 
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-white dark:border-dark-card animate-pulse" 
                  aria-live="polite"
                />
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full border border-gray-200 dark:border-dark-border hover:border-brand-500/50 hover:shadow-md transition-all group"
              >
                <img 
                  src={user?.avatarUrl || 'https://ui-avatars.com/api/?name=User'} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                />
                <div className="flex flex-col items-start text-xs">
                  <span className="font-medium text-gray-900 dark:text-white max-w-[80px] truncate">
                    {user?.username}
                  </span>
                  <span className="text-brand-500 font-medium uppercase text-[10px] tracking-wide">
                    {user?.role}
                  </span>
                </div>
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl shadow-xl p-1 animate-fade-in overflow-hidden">
                  
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-hover rounded-lg transition-colors">
                    <User size={16} /> Profile
                  </button>
                  
                  <button 
                     onClick={toggleRole} // Dev tool
                     className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <Settings size={16} /> Toggle Role (Dev)
                  </button>

                  {user?.role === UserRole.ADMIN && (
                    <Link 
                      to="/admin/create-user"
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-brand-600 dark:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                    >
                      <Plus size={16} /> Create User
                    </Link>
                  )}

                  <div className="h-px bg-gray-100 dark:bg-dark-border my-1" />

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-hover"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

          </div>
        </div>
      </nav>
      
      {/* Mobile Sheet */}
      <MobileNavSheet isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
};

export default Navbar;
