import React from 'react';
import { LayoutList, Kanban } from 'lucide-react';

interface ViewToggleProps {
  view: 'list' | 'kanban';
  onChange: (view: 'list' | 'kanban') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  return (
    <div className="flex items-center bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-1 shadow-sm">
      <button
        onClick={() => onChange('list')}
        className={`p-2 rounded-md transition-all duration-200 ${
          view === 'list'
            ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-500 shadow-sm'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="List View"
      >
        <LayoutList size={20} />
      </button>
      <button
        onClick={() => onChange('kanban')}
        className={`p-2 rounded-md transition-all duration-200 ${
          view === 'kanban'
            ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-500 shadow-sm'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Kanban View"
      >
        <Kanban size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;