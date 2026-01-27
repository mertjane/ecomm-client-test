import { apiClient } from './axios';
import { getCartToken } from './cart';
import type { ShippingMethod, ShippingZone } from '@/lib/redux/slices/checkoutSlice';

export interface ShippingRatesResponse {
  success: boolean;
  message: string;
  data: {
    zone: ShippingZone | null;
    methods: ShippingMethod[];
    message?: string;
  };
}

export interface ShippingCountriesResponse {
  success: boolean;
  message: string;
  data: {
    countries: Array<{
      code: string;
      name: string;
    }>;
  };
}

export interface CalculateShippingPayload {
  country: string;
  postcode?: string;
  state?: string;
  city?: string;
}

/**
 * Get headers with cart token
 */
const getCartHeaders = () => {
  const token = getCartToken();
  return token ? { 'X-Cart-Token': token } : {};
};

/**
 * Calculate shipping rates for given address
 */
export const calculateShippingRates = async (
  payload: CalculateShippingPayload
): Promise<ShippingRatesResponse> => {
  const response = await apiClient.post<ShippingRatesResponse>(
    '/api/shipping/calculate',
    payload,
    {
      headers: getCartHeaders(),
    }
  );
  return response.data;
};

/**
 * Get available shipping countries
 */
export const getShippingCountries = async (): Promise<ShippingCountriesResponse> => {
  const response = await apiClient.get<ShippingCountriesResponse>('/api/shipping/countries');
  return response.data;
};
