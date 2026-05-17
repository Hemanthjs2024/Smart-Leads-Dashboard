import React from 'react';
import { X } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/40 dark:bg-navy-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-navy-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200 mx-4">
        <div className="px-6 sm:px-10 pt-10 pb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 sm:px-10 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
