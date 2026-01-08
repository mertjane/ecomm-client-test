import { apiClient } from './axios';
import type { User } from '../redux/slices/authSlice';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    customer: User;
    token: string;
    wpToken?: string;
  };
}

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    // Store token if remember me is checked
    if (data.data.token && credentials.rememberMe) {
      localStorage.setItem('auth_token', data.data.token);
    } else if (data.data.token) {
      sessionStorage.setItem('auth_token', data.data.token);
    }

    return data;
  },

  /**
   * Signup new user (register)
   */
  signup: async (signupData: SignupData): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/register', {
      email: signupData.email,
      password: signupData.password,
      first_name: signupData.first_name,
      last_name: signupData.last_name,
    });

    // Store token in session (always use session for new signups, user can choose remember me on login)
    if (data.data.token) {
      sessionStorage.setItem('auth_token', data.data.token);
    }

    return data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

      if (!token) {
        return null;
      }

      const { data } = await apiClient.get<{ success: boolean; data: { customer: User } }>('/api/auth/me');
      return data.data.customer;
    } catch (error) {
      // Clear invalid tokens
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      return null;
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post<{ success: boolean; message: string }>(
      '/api/auth/forgot-password',
      { email }
    );
    return data;
  },
};
