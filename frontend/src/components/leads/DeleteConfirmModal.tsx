import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import LeadModal from './LeadModal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  leadName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  leadName,
}) => {
  return (
    <LeadModal isOpen={isOpen} onClose={onClose} title="Delete Lead">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
           <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-full text-rose-600">
              <AlertTriangle size={40} />
           </div>
           <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Are you absolutely sure?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                 You are about to permanently delete <span className="font-bold text-gray-900 dark:text-white underline decoration-rose-500/30 underline-offset-4">{leadName}</span>. This action is irreversible.
              </p>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 border border-gray-100 dark:border-navy-800 rounded-2xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 transition-all order-2 sm:order-1"
          >
            Cancel, Keep Lead
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center px-6 py-3.5 bg-rose-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all disabled:opacity-50 order-1 sm:order-2"
          >
            {isDeleting ? (
              <span className="flex items-center italic">
                 Deleting...
              </span>
            ) : (
              <span className="flex items-center">
                 <Trash2 size={16} className="mr-2" />
                 Confirm Delete
              </span>
            )}
          </button>
        </div>
      </div>
    </LeadModal>
  );
};

export default DeleteConfirmModal;
