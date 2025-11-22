
import React, { useState, useEffect } from 'react';
import { apiMock } from '../../services/mockApi';
import { Product } from '../../types';
import { Search, Plus } from 'lucide-react';

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (query.length > 0) {
        const data = await apiMock.operations.searchProducts(query);
        setResults(data);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };
    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (p: Product) => {
    onSelect(p);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text"
          placeholder="Add a product..."
          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-bg border border-dashed border-gray-300 dark:border-gray-600 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
        />
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden z-20">
          {results.map(p => (
            <button
              key={p.id}
              className="w-full text-left px-4 py-3 hover:bg-brand-50 dark:hover:bg-brand-900/20 flex justify-between items-center group transition-colors"
              onClick={() => handleSelect(p)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-white text-sm">[{p.code}] {p.name}</span>
                <span className="text-xs text-gray-500">Available: {p.stock}</span>
              </div>
              <Plus size={16} className="text-gray-400 group-hover:text-brand-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
