import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchButton = ({ onSearch, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Auto-focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setQuery('');
    if (onSearch) onSearch('');
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className={`relative flex items-center justify-end ${className}`}>
      <div
        className={`flex items-center overflow-hidden bg-[#1f2028] border border-[#2e303a] rounded-lg transition-all duration-300 ease-in-out shadow-sm ${isExpanded ? 'w-64 border-purple-500/50 ring-2 ring-purple-500/20' : 'w-[42px] hover:border-purple-500/50 hover:bg-[#2e303a]'
          }`}
      >
        <button
          onClick={isExpanded ? undefined : handleExpand}
          type="button"
          className={`p-2.5 flex-shrink-0 text-gray-400 transition-colors focus:outline-none ${!isExpanded ? 'hover:text-purple-400 w-full cursor-pointer' : 'cursor-default'}`}
          aria-label="Search"
          disabled={isExpanded}
        >
          <Search size={20} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className={`bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ease-in-out ${isExpanded ? 'w-full opacity-100 pr-2' : 'w-0 opacity-0 pr-0'
            }`}
          disabled={!isExpanded}
        />

        {isExpanded && (
          <button
            onClick={handleCollapse}
            type="button"
            className="p-2.5 flex-shrink-0 text-gray-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchButton;
