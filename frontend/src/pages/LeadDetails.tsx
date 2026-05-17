import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare,
  Clock,
  ExternalLink,
  Target
} from 'lucide-react';
import { leadApi } from '../api/lead.api';
import type { Lead } from '../types';
import { toast } from 'react-hot-toast';
import LeadModal from '../components/leads/LeadModal';
import LeadForm from '../components/leads/LeadForm';
import DeleteConfirmModal from '../components/leads/DeleteConfirmModal';
import HasPermission from '../components/common/HasPermission';
import type { LeadFormValues } from '../utils/validation';
import { useAuthStore } from '../store/useAuthStore';

const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const fetchLead = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await leadApi.getById(id);
      setLead(response.data);
    } catch {
      toast.error('Lead not found');
      navigate('/leads');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchLead(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchLead]);

  const handleUpdateLead = async (data: LeadFormValues) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await leadApi.update(id, data);
      toast.success('Lead updated successfully');
      setIsEditModalOpen(false);
      fetchLead();
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e.response?.data?.message || 'Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await leadApi.delete(id);
      toast.success('Lead deleted successfully');
      navigate('/leads');
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCreatorId = (createdBy: any): string => {
    if (!createdBy) return '';
    if (typeof createdBy === 'object') {
      return createdBy.id || createdBy._id || '';
    }
    return String(createdBy);
  };

  const canDelete = currentUser && lead && (
    currentUser.role === 'Admin' ||
    getCreatorId(lead.createdBy) === currentUser.id
  );

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 h-[500px] bg-white rounded-3xl"></div>
           <div className="lg:col-span-2 h-[500px] bg-white rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <>
      <div className="space-y-8 pb-12">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            to="/leads" 
            className="group flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-accent-blue transition-all"
          >
            <div className="p-1.5 rounded-lg bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 mr-3 group-hover:border-accent-blue transition-colors shadow-sm">
               <ArrowLeft size={16} />
            </div>
            Back to Leads
          </Link>
          <div className="flex items-center space-x-3">
             <button 
               onClick={() => setIsEditModalOpen(true)}
               className="px-4 py-2 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
             >
               Edit
             </button>
             {canDelete && (
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all shadow-sm"
                >
                  Delete
                </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column - Profile Card */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-navy-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                 {/* Background Glow */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/20 rounded-full blur-3xl"></div>
                 
                 <div className="p-10 flex flex-col items-center text-center relative z-10">
                    <div className="relative group">
                       <div className="h-40 w-40 rounded-[2.5rem] bg-accent-blue p-1 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                          <div className="h-full w-full rounded-[2.2rem] bg-navy-800 flex items-center justify-center text-white font-bold text-5xl -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                             {lead.name.charAt(0)}
                          </div>
                       </div>
                       <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-full border-4 border-navy-900 shadow-xl">
                          <Target size={16} className="text-white" />
                       </div>
                    </div>

                    <h1 className="mt-8 text-3xl font-extrabold text-white tracking-tight">{lead.name}</h1>

                    <div className="w-full space-y-6 mt-12 text-left">
                     <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center space-x-3">
                           <div className="p-2 bg-navy-800 rounded-xl text-gray-500 group-hover:text-accent-blue transition-colors">
                              <Mail size={16} />
                           </div>
                           <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">{lead.email}</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-all" />
                     </div>
                  </div>

                    <button className="w-full mt-12 py-4 bg-accent-blue hover:bg-accent-indigo text-white font-bold rounded-2xl shadow-lg shadow-accent-blue/20 transition-all flex items-center justify-center">
                       <MessageSquare size={18} className="mr-2" />
                       Send Message
                    </button>
                 </div>
              </div>
           </div>

           {/* Right Column - Timeline & Details */}
           <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { label: 'Status', value: lead.status, icon: Target, color: 'text-emerald-600' },
                   { label: 'Created', value: new Date(lead.createdAt).toLocaleDateString(), icon: Clock, color: 'text-amber-600' },
                 ].map(s => (
                   <div key={s.label} className="bg-white dark:bg-navy-900 p-6 rounded-3xl border border-gray-100 dark:border-navy-800 shadow-sm group hover:shadow-md transition-all">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{s.label}</p>
                      <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                   </div>
                 ))}
              </div>

              {/* Timeline Section */}
              <div className="bg-white dark:bg-navy-900 rounded-[2.5rem] border border-gray-100 dark:border-navy-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                 <div className="px-6 sm:px-10 py-8 border-b border-gray-50 dark:border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                       <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight underline decoration-accent-blue decoration-4 underline-offset-8">Activity History</h2>
                    </div>
                 </div>

                 <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-gray-50 dark:bg-navy-800 rounded-full text-gray-400 mb-4">
                       <MessageSquare size={32} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">No Activity Recorded</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-[250px]">
                       This lead was created on {new Date(lead.createdAt).toLocaleDateString()}. No further actions have been logged.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      {/* Modals */}
      <LeadModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Lead"
      >
        <LeadForm 
          initialData={{
            name: lead.name,
            email: lead.email,
            status: lead.status,
            source: lead.source,
          }}
          onSubmit={handleUpdateLead} 
          onCancel={() => setIsEditModalOpen(false)} 
          isSubmitting={isSubmitting} 
        />
      </LeadModal>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteLead}
        isDeleting={isSubmitting}
        leadName={lead.name}
      />
    </>
  );
};

export default LeadDetails;
