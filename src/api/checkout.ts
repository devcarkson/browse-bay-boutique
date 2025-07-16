
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
  status: string;
}

export const createCheckout = async (data: CheckoutData): Promise<CheckoutResponse> => {
  try {
    console.log('Creating checkout with data:', JSON.stringify(data, null, 2));
    
    // Ensure we have cart items
    if (!data.cart_items || data.cart_items.length === 0) {
      throw new Error('Cart is empty. Please add items before checkout.');
    }

    // Validate required fields
    const requiredFields = ['shipping_address', 'shipping_city', 'shipping_state', 'shipping_country', 'shipping_zip_code'];
    for (const field of requiredFields) {
      if (!data[field as keyof CheckoutData]) {
        throw new Error(`${field.replace('_', ' ')} is required`);
      }
    }
    
    const response = await apiClient.post('/orders/checkout/', data);
    
    console.log('Checkout API response:', response.data);
    
    // Handle different response formats
    if (response.data && typeof response.data === 'object') {
      const responseData = response.data;
      
      // Check if we have a payment URL
      if (responseData.payment_url || responseData.link) {
        return {
          payment_url: responseData.payment_url || responseData.link,
          order_id: responseData.order_id || responseData.id,
          reference: responseData.reference || responseData.tx_ref,
          status: responseData.status || 'pending'
        };
      }
      
      // If response contains error
      if (responseData.error || responseData.message) {
        throw new Error(responseData.error || responseData.message);
      }
    }
    
    throw new Error('Invalid response from payment gateway');
    
  } catch (error: any) {
    console.error('Checkout API error:', error);
    console.error('Error response:', error.response);
    
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Handle HTML error responses (Django error pages)
      if (typeof errorData === 'string' && errorData.includes('<!DOCTYPE html>')) {
        if (errorData.includes('RelatedObjectDoesNotExist')) {
          throw new Error('User session expired. Please login again.');
        } else if (errorData.includes('User has no cart')) {
          throw new Error('Cart is empty. Please add items to your cart.');
        } else {
          throw new Error('Server error occurred. Please try again.');
        }
      }
      
      // Handle JSON error responses
      if (typeof errorData === 'object') {
        const errorMessage = errorData.detail || 
                           errorData.message || 
                           errorData.error ||
                           'Checkout failed';
        throw new Error(errorMessage);
      }
      
      // Handle string responses
      if (typeof errorData === 'string') {
        throw new Error(errorData);
      }
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timeout. Please check your connection and try again.');
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw new Error(error.message || 'An unexpected error occurred');
  }
};
