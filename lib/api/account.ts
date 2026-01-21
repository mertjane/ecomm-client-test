import { apiClient } from './axios';

export interface Address {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface OrderLineItem {
  id: number;
  name: string;
  quantity: number;
  total: string;
  product_id: number;
  variation_id?: number;
}

export interface Order {
  id: number;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  currency_symbol: string;
  payment_method_title: string;
  billing: Address;
  shipping: Address;
  line_items: OrderLineItem[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const accountApi = {
  /**
   * Get customer orders
   */
  getOrders: async (page = 1, perPage = 10): Promise<Order[]> => {
    const { data } = await apiClient.get<ApiResponse<Order[]>>(
      `/api/account/orders?page=${page}&per_page=${perPage}`
    );
    return data.data;
  },

  /**
   * Get single order
   */
  getOrder: async (orderId: number): Promise<Order> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(
      `/api/account/orders/${orderId}`
    );
    return data.data;
  },

  /**
   * Update billing address
   */
  updateAddress: async (type: 'billing' | 'shipping', addressData: Partial<Address>): Promise<void> => {
    await apiClient.put(`/api/account/address/${type}`, addressData);
  },

  /**
   * Update profile
   */
  updateProfile: async (profileData: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }): Promise<void> => {
    await apiClient.put('/api/account/profile', profileData);
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/api/account/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};
