import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Download,
  Filter,
  Archive,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { leadApi } from '../api/lead.api';
import type { Lead, ApiResponse } from '../types';
import LeadModal from '../components/leads/LeadModal';
import LeadForm from '../components/leads/LeadForm';
import DeleteConfirmModal from '../components/leads/DeleteConfirmModal';
import HasPermission from '../components/common/HasPermission';
import TableSkeleton from '../components/common/TableSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import Select from '../components/common/Select';
import { useDebounce } from '../hooks/useDebounce';
import type { LeadFormValues } from '../utils/validation';

const SORT_OPTIONS = [
  { label: 'Latest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
  { label: 'Name A–Z', value: 'name' },
  { label: 'Name Z–A', value: '-name' },
];

const LIMIT_OPTIONS = [10, 25, 50];

const Leads: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useAuthStore((state) => state.user);

  // Derive filter state from URL query params with hardening
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? '');
  const [source, setSource] = useState(searchParams.get('source') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? '-createdAt');
  const [currentPage, setCurrentPage] = useState(() => {
    const p = Number(searchParams.get('page'));
    return isNaN(p) || p < 1 ? 1 : p;
  });
  const [limit, setLimit] = useState(() => {
    const l = Number(searchParams.get('limit'));
    return isNaN(l) || ![10, 25, 50].includes(l) ? 10 : l;
  });

  const debouncedSearch = useDebounce(search, 500);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<ApiResponse<Lead[]>['pagination'] | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const getCreatorId = (createdBy: any): string => {
    if (!createdBy) return '';
    if (typeof createdBy === 'object') {
      return createdBy.id || createdBy._id || '';
    }
    return String(createdBy);
  };

  const canDeleteLead = (lead: Lead) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    return getCreatorId(lead.createdBy) === currentUser.id;
  };

  const canDeleteAllSelected = () => {
    if (!currentUser || selectedRows.length === 0) return false;
    if (currentUser.role === 'Admin') return true;
    return selectedRows.every(id => {
      const lead = leads.find(l => l.id === id);
      return lead ? getCreatorId(lead.createdBy) === currentUser.id : false;
    });
  };

  // Sync URL query params whenever filter state changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;
    if (source) params.source = source;
    if (sort !== '-createdAt') params.sort = sort;
    if (currentPage > 1) params.page = String(currentPage);
    if (limit !== 10) params.limit = String(limit);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, status, source, sort, currentPage, limit, setSearchParams]);

  // Reset to page 1 when filters/sort/limit change
  useEffect(() => {
    setCurrentPage(1); // eslint-disable-line react-hooks/set-state-in-effect
    setSelectedRows([]);
  }, [debouncedSearch, status, source, sort, limit]);

  useEffect(() => {
    let active = true;
    const loadLeads = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: currentPage,
          limit,
          search: debouncedSearch,
          status,
          source,
          sort,
        };
        const response = await leadApi.getAll(params);
        if (active) {
          setLeads(response.data);
          setPagination(response.pagination ?? null);
        }
      } catch {
        if (active) toast.error('Failed to fetch leads');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadLeads();
    return () => { active = false; };
  }, [currentPage, limit, debouncedSearch, status, source, sort]);

  const handleCreateLead = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      await leadApi.create(data);
      toast.success('Lead created successfully');
      setIsAddModalOpen(false);
      // Re-trigger fetch by just calling the inner logic or letting useEffect handle it
      // For now, we can just force a refresh or expect the component to stay in sync
      const params = { page: currentPage, limit, search: debouncedSearch, status, source, sort };
      const response = await leadApi.getAll(params);
      setLeads(response.data);
      setPagination(response.pagination ?? null);
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLead = async (data: LeadFormValues) => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    try {
      await leadApi.update(selectedLead.id, data);
      toast.success('Lead updated successfully');
      setIsEditModalOpen(false);
      setSelectedLead(null);
      const params = { page: currentPage, limit, search: debouncedSearch, status, source, sort };
      const response = await leadApi.getAll(params);
      setLeads(response.data);
      setPagination(response.pagination ?? null);
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Failed to update lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    setIsSubmitting(true);
    try {
      await leadApi.delete(selectedLead.id);
      toast.success('Lead deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
      const params = { page: currentPage, limit, search: debouncedSearch, status, source, sort };
      const response = await leadApi.getAll(params);
      setLeads(response.data);
      setPagination(response.pagination ?? null);
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    setIsSubmitting(true);
    try {
      await leadApi.bulkDelete(selectedRows);
      toast.success(`Successfully deleted ${selectedRows.length} leads`);
      setIsBulkDeleteModalOpen(false);
      setSelectedRows([]);
      const params = { page: currentPage, limit, search: debouncedSearch, status, source, sort };
      const response = await leadApi.getAll(params);
      setLeads(response.data);
      setPagination(response.pagination ?? null);
    } catch {
      toast.error('Failed to delete leads');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const params = { search: debouncedSearch, status, source, sort };
      await leadApi.exportCsv(params);
      toast.success('CSV exported successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to export CSV';
      toast.error(`Export Error: ${errorMsg}`);
    }
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === leads.length ? [] : leads.map((l) => l.id)
    );
  };

  const totalPages = pagination?.totalPages ?? 1;
  const startRecord = leads.length > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endRecord = Math.min(currentPage * limit, pagination?.total ?? 0);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Leads Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Manage and track your sales pipeline activity.
          </p>
        </div>
        <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
          <button
            onClick={handleExportCsv}
            title="Export filtered leads as CSV"
            className="flex items-center justify-center p-3 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Download size={20} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center px-6 py-3 bg-accent-blue text-white rounded-xl font-bold shadow-lg shadow-accent-blue/20 hover:bg-accent-indigo transition-all whitespace-nowrap"
          >
            <Plus size={20} className="mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (Separate Row) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/30 dark:bg-navy-950/10 p-4 rounded-2xl border border-gray-100/80 dark:border-navy-900/50">
        <div className="flex items-center space-x-3 w-full lg:w-auto flex-wrap gap-y-2">
          {/* Search */}
          <div className="relative w-full sm:w-64 group">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-blue transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-accent-blue/5 focus:border-accent-blue transition-all shadow-sm"
            />
          </div>

          {/* Filter + Sort Group */}
          <div className="flex bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl p-1 shadow-sm items-center w-full sm:w-auto">
            {/* Status filter */}
            <Select
              options={[
                { label: 'All Status', value: '' },
                { label: 'New', value: 'New' },
                { label: 'Contacted', value: 'Contacted' },
                { label: 'Qualified', value: 'Qualified' },
                { label: 'Lost', value: 'Lost' },
              ]}
              value={status}
              onChange={(val) => {
                setStatus(val);
                setCurrentPage(1);
              }}
              className="!gap-0"
              triggerClassName="!border-none !bg-transparent !shadow-none !py-2 !px-4 !rounded-lg hover:!bg-gray-50 dark:hover:!bg-navy-800 !ring-0 whitespace-nowrap"
            />
            <div className="w-[1px] bg-gray-100 dark:bg-navy-800 h-6 mx-1 shrink-0" />
            {/* Source filter */}
            <Select
              options={[
                { label: 'All Sources', value: '' },
                { label: 'Website', value: 'Website' },
                { label: 'Instagram', value: 'Instagram' },
                { label: 'Referral', value: 'Referral' },
              ]}
              value={source}
              onChange={(val) => {
                setSource(val);
                setCurrentPage(1);
              }}
              className="!gap-0"
              triggerClassName="!border-none !bg-transparent !shadow-none !py-2 !px-4 !rounded-lg hover:!bg-gray-50 dark:hover:!bg-navy-800 !ring-0 whitespace-nowrap"
            />
            <div className="w-[1px] bg-gray-100 dark:bg-navy-800 h-6 mx-1 shrink-0" />
            {/* Sort dropdown */}
            <Select
              options={SORT_OPTIONS}
              value={sort}
              onChange={setSort}
              className="!gap-0"
              triggerClassName="!border-none !bg-transparent !shadow-none !py-2 !px-4 !rounded-lg hover:!bg-gray-50 dark:hover:!bg-navy-800 !ring-0 whitespace-nowrap"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: pagination?.total ?? 0 },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-navy-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-800"
          >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              {s.label}
            </p>
            <div className="flex items-end space-x-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {isLoading ? (
                  <span className="inline-block h-7 w-12 bg-gray-100 dark:bg-navy-800 rounded animate-pulse" />
                ) : (
                  s.value
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-navy-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-navy-800">
        {/* Toolbar */}
        <div className="px-8 py-5 border-b border-gray-100 dark:border-navy-800 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRows.length === leads.length && leads.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-gray-300 dark:border-navy-700 text-accent-blue focus:ring-accent-blue bg-white dark:bg-navy-800"
              />
              <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Select All</span>
            </div>
            {selectedRows.length > 0 && canDeleteAllSelected() && (
              <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="h-4 w-[1px] bg-gray-200 dark:bg-navy-800 mx-2" />
                <button className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Archive size={16} className="mr-2" />
                  <span className="hidden sm:inline">Archive</span>
                </button>
                <button
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="flex items-center text-sm font-bold text-rose-500 hover:text-rose-600 ml-4 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  <span className="hidden sm:inline">Delete Selected</span>
                </button>
              </div>
            )}
          </div>
          <div className="text-sm font-bold text-gray-400 hidden sm:flex items-center space-x-1">
            Showing{' '}
            <span className="text-gray-900 dark:text-white mx-1">
              {isLoading ? '…' : `${startRecord}–${endRecord}`}
            </span>{' '}
            of{' '}
            <span className="text-gray-900 dark:text-white ml-1">
              {isLoading ? '…' : pagination?.total ?? 0}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-navy-800/50 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                <th className="px-8 py-4 w-12" />
                <th className="px-8 py-4">Lead Name</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Source</th>
                <th className="px-8 py-4">
                  <button
                    onClick={() =>
                      setSort((prev) =>
                        prev === '-createdAt' ? 'createdAt' : '-createdAt'
                      )
                    }
                    className="flex items-center gap-1 hover:text-accent-blue transition-colors"
                  >
                    Created At
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
              {isLoading ? (
                <TableSkeleton rows={limit} cols={6} />
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-20 text-center"
                  >
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <Filter size={32} className="opacity-30" />
                      <p className="font-bold uppercase tracking-widest text-xs">
                        No leads found matching your criteria.
                      </p>
                      <button
                        onClick={() => {
                          setSearch('');
                          setStatus('');
                          setSource('');
                          setSort('-createdAt');
                        }}
                        className="text-accent-blue text-xs font-bold hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors group ${
                      selectedRows.includes(lead.id)
                        ? 'bg-blue-50/30 dark:bg-blue-900/10'
                        : ''
                    }`}
                  >
                    <td className="px-8 py-5">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(lead.id)}
                        onChange={() => toggleRow(lead.id)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-navy-700 text-accent-blue focus:ring-accent-blue bg-white dark:bg-navy-800"
                      />
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-accent-blue flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {lead.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-accent-blue transition-colors">
                            {lead.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium lowercase">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`status-pill ${
                          lead.status === 'Qualified'
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                            : lead.status === 'Lost'
                            ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'
                            : lead.status === 'Contacted'
                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {lead.source}
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs font-bold text-gray-900 dark:text-white">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                        {new Date(lead.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/leads/${lead.id}`}
                          className="p-2 text-gray-400 hover:text-accent-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        {canDeleteLead(lead) && (
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-navy-800 flex items-center justify-between">
          {/* Rows per page */}
          <div className="hidden sm:flex items-center space-x-3">
            <span className="text-xs font-bold text-gray-400">Rows per page:</span>
            <Select
              options={LIMIT_OPTIONS.map(n => ({ label: String(n), value: String(n) }))}
              value={String(limit)}
              onChange={(val) => {
                setLimit(Number(val));
                setCurrentPage(1);
              }}
              className="!gap-0 w-20"
              triggerClassName="!border-none !bg-transparent !shadow-none !py-1 !px-2 !rounded-lg hover:!bg-gray-50 dark:hover:!bg-navy-800 !ring-0"
              dropdownDirection="up"
            />
          </div>

          {/* Page controls */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 dark:border-navy-800 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex space-x-1 overflow-x-auto max-w-[200px] sm:max-w-none">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 flex-shrink-0 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 dark:border-navy-800 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead"
      >
        <LeadForm
          onSubmit={handleCreateLead}
          onCancel={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </LeadModal>

      {selectedLead && (
        <>
          <LeadModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedLead(null);
            }}
            title="Edit Lead"
          >
            <LeadForm
              initialData={{
                name: selectedLead.name,
                email: selectedLead.email,
                status: selectedLead.status,
                source: selectedLead.source,
              }}
              onSubmit={handleUpdateLead}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedLead(null);
              }}
              isSubmitting={isSubmitting}
            />
          </LeadModal>

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedLead(null);
            }}
            onConfirm={handleDeleteLead}
            isDeleting={isSubmitting}
            leadName={selectedLead.name}
          />
        </>
      )}

      <DeleteConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
        isDeleting={isSubmitting}
        leadName={`${selectedRows.length} selected leads`}
      />
    </div>
  );
};

export default Leads;
