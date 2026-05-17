import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  readonly label: string;
  readonly value: string;
  readonly color?: string;
  readonly icon?: React.ReactNode;
}

interface SelectProps {
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  dropdownDirection?: 'up' | 'down';
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  triggerClassName = '',
  icon,
  label,
  error,
  dropdownDirection = 'down',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const currentIcon = selectedOption?.icon || icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3.5 
            bg-white dark:bg-navy-900 border 
            ${error ? 'border-red-500' : 'border-gray-200 dark:border-navy-800'} 
            rounded-2xl text-sm font-semibold text-gray-900 dark:text-white 
            shadow-sm hover:shadow-md transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-accent-blue/5 focus:border-accent-blue
            ${isOpen ? 'ring-4 ring-accent-blue/5 border-accent-blue' : ''}
            ${triggerClassName}
          `}
        >
          <div className="flex items-center gap-3">
            {currentIcon && <span className="text-gray-400 group-hover:text-inherit">{currentIcon}</span>}
            <span className={selectedOption ? 'text-inherit' : 'text-gray-400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown 
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            size={18} 
          />
        </button>

        {isOpen && (
          <div className={`
            absolute z-50 w-full p-1.5
            ${dropdownDirection === 'up' ? 'bottom-full mb-1.5' : 'mt-1.5'}
            bg-white/90 dark:bg-navy-900/95 backdrop-blur-xl
            border border-gray-200 dark:border-navy-800 
            rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200
            max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-0.5
          `}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full flex items-center justify-between px-2.5 py-2.5 text-sm font-semibold
                  rounded-xl transition-all duration-200
                  ${value === option.value 
                    ? 'bg-accent-blue/10 text-accent-blue' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800 hover:text-gray-900 dark:hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <span className="text-gray-400">{option.icon}</span>}
                  <span>{option.label}</span>
                </div>
                {value === option.value && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider pl-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
