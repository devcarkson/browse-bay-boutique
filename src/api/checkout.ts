// src/api/checkout.ts
import apiClient from './client';

interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CheckoutData {
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code: string;
  payment_method: string;
  cart_items: CartItem[];
}

export interface CheckoutResponse {
  order: any;
  payment_url: string;
  reference: string;
  order_id: string | number;
}

export const createCheckout = async (data: CheckoutData): Promise<CheckoutResponse> => {
  // Get token using the same logic as apiClient
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('Please login to complete checkout');
  }

  try {
    // Manually add Authorization header
    const response = await apiClient.post('/orders/checkout/', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data?.payment_url) {
      throw new Error('Payment URL missing in response');
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      throw new Error('Session expired. Please login again');
    }
    throw error;
  }
};