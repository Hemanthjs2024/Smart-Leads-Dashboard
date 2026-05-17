import axiosInstance from './axios.config';
import type { ApiResponse, User } from '../types';
import type { LoginFormValues, RegisterFormValues } from '../utils/validation';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  login: async (data: LoginFormValues) => {
    const response = await axiosInstance.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterFormValues) => {
    const response = await axiosInstance.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/change-password', data);
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<null>>(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};
