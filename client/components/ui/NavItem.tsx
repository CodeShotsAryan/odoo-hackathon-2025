
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface NavItemProps {
  label: string;
  path?: string;
  subItems?: { label: string; path: string }[];
}

const NavItem: React.FC<NavItemProps> = ({ label, path, subItems }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasSubItems = subItems && subItems.length > 0;
  
  // Check if this item or any subitem is active
  const isActive = path 
    ? location.pathname === path 
    : subItems?.some(item => location.pathname.startsWith(item.path));

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay for better UX
  };

  const handleClick = (e: React.MouseEvent) => {
    // Allow click to toggle on desktop
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // Close dropdown on route change or click outside
  useEffect(() => {
    setIsOpen(false);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location.pathname]);

  if (hasSubItems) {
    return (
      <div 
        className="relative h-full flex items-center z-50"
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        ref={dropdownRef}
      >
        <button
          onClick={handleClick}
          className={`
            flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg
            focus:outline-none focus:ring-2 focus:ring-brand-500/50
            ${isActive || isOpen ? 'text-brand-500' : 'text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400'}
          `}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {label}
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl shadow-xl nav-dropdown overflow-hidden"
            role="menu"
          >
            <div className="py-1">
              {subItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  role="menuitem"
                  className={`
                    block px-4 py-2.5 text-sm transition-colors hover:bg-brand-50 dark:hover:bg-brand-500/10
                    ${location.pathname === item.path 
                      ? 'text-brand-600 dark:text-brand-500 font-medium bg-brand-50/50 dark:bg-brand-500/5' 
                      : 'text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={path!}
      className={`
        relative h-full flex items-center px-3 text-sm font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-brand-500/50 rounded-lg
        ${isActive 
          ? 'text-brand-500 nav-link-active' 
          : 'text-gray-600 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400'}
      `}
    >
      {label}
    </Link>
  );
};

export default NavItem;
