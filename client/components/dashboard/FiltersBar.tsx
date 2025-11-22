import React from 'react';
import { Filter, Calendar, User } from 'lucide-react';

interface FiltersBarProps {
  onFilterChange: (filters: any) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ onFilterChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Calendar size={14} />
        </div>
        <select 
          className="pl-9 pr-8 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer hover:border-brand-500/50 transition-colors"
          onChange={(e) => onFilterChange({ date: e.target.value })}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Filter size={14} />
        </div>
        <select 
          className="pl-9 pr-8 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer hover:border-brand-500/50 transition-colors"
          onChange={(e) => onFilterChange({ product: e.target.value })}
        >
          <option value="all">All Products</option>
          <option value="sensors">Sensors</option>
          <option value="pumps">Pumps</option>
        </select>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <User size={14} />
        </div>
        <select 
          className="pl-9 pr-8 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer hover:border-brand-500/50 transition-colors"
          onChange={(e) => onFilterChange({ profile: e.target.value })}
        >
          <option value="all">All Profiles</option>
          <option value="me">Assigned to Me</option>
        </select>
      </div>
    </div>
  );
};

export default FiltersBar;