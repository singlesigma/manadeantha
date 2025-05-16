import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  searchable?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && searchable && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="flex flex-col gap-1.5" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div 
          className={`px-3 py-2 rounded-md border shadow-sm flex items-center justify-between cursor-pointer ${
            error 
              ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500' 
              : 'border-gray-300 focus-within:ring-blue-500 focus-within:border-blue-500'
          } ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
          onClick={handleInputClick}
        >
          {searchable && isOpen ? (
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none outline-none bg-transparent w-full"
              placeholder="Search..."
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          <ChevronDown 
            size={18} 
            className={`ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-800'
                    }`}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500">No options found</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Dropdown;