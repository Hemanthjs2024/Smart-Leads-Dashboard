import axiosInstance from './axios.config';
import type { ApiResponse, Lead } from '../types';

interface LeadQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
}

interface ExportParams {
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
}

export const leadApi = {
  getAll: async (params?: LeadQueryParams) => {
    const response = await axiosInstance.get<ApiResponse<Lead[]>>('/leads', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data;
  },

  create: async (data: Partial<Lead>) => {
    const response = await axiosInstance.post<ApiResponse<Lead>>('/leads', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Lead>) => {
    const response = await axiosInstance.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(`/leads/${id}`);
    return response.data;
  },
  
  bulkDelete: async (ids: string[]) => {
    const response = await axiosInstance.post<ApiResponse<null>>('/leads/bulk-delete', { ids });
    return response.data;
  },

  exportCsv: async (params?: ExportParams) => {
    try {
      // Use Axios with responseType blob so the Vite proxy routes the request
      // correctly through /api to the backend on port 5000
      const response = await axiosInstance.get('/leads/export', {
        params,
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv',
        },
      });

      // Create a temporary download link and trigger it
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 500);
    } catch (error: any) {
      // If the blob response is actually a JSON error, parse it out
      if (error?.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          throw new Error(json.message || 'Export failed');
        } catch {
          throw new Error(`Export failed: ${error.response.status}`);
        }
      }
      console.error('Export CSV Error:', error);
      throw error;
    }
  },
};
