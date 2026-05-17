import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../../constants';

interface LeadFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  source: string;
  setSource: (val: string) => void;
  onClear: () => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
  onClear,
}) => {
  const hasActiveFilters = search || status || source;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search leads by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-40">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">All Statuses</option>
              {LEAD_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          <div className="relative flex-1 md:w-40">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">All Sources</option>
              {LEAD_SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors whitespace-nowrap"
        >
          <X size={16} className="mr-1" />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default LeadFilters;
