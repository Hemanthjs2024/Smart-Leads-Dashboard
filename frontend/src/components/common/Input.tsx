import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2 ${containerClassName}`}>
        {label && (
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors" 
              size={18} 
            />
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3.5 bg-white dark:bg-navy-900 border rounded-2xl
              text-sm font-semibold text-gray-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none transition-all duration-300
              ${Icon ? 'pl-11' : ''}
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 bg-red-500/[0.02]' 
                : 'border-gray-200 dark:border-navy-800 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/5'
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider pl-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
