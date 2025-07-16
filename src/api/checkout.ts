
import apiClient from './client';

export interface CheckoutData {
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code: string;
  payment_method: string;
  cart_items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

export interface CheckoutResponse {
  payment_url: string;
  order_id: string;
  reference: string;
}

export const createCheckout = async (data: CheckoutData): Promise<CheckoutResponse> => {
  try {
    console.log('Creating checkout with data:', data);
    
    const response = await apiClient.post('/orders/checkout/', data);
    
    console.log('Checkout response:', response.data);
    
    if (!response.data.payment_url) {
      throw new Error('No payment URL received from server');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Checkout API error:', error);
    
    if (error.response?.data) {
      const errorMessage = typeof error.response.data === 'string' 
        ? error.response.data 
        : error.response.data.message || error.response.data.error || 'Checkout failed';
      throw new Error(errorMessage);
    }
    
    throw new Error(error.message || 'Network error occurred');
  }
};
