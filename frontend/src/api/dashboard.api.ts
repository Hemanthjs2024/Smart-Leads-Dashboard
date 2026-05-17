import axiosInstance from './axios.config';
import type { ApiResponse, Lead } from '../types';

export interface DashboardStats {
  totalLeads: number;
  statusBreakdown: Record<string, number>;
  sourceBreakdown: Record<string, number>;
  recentLeads: Lead[];
}

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosInstance.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },
};
