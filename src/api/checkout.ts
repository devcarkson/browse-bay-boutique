
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
    
    // Add longer timeout for checkout requests
    const response = await apiClient.post('/orders/checkout/', data, {
      timeout: 30000, // 30 seconds timeout
    });
    
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
    
    // Handle network errors first
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Request timeout. The server is taking too long to respond. Please try again.');
      }
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Network connection error. Please check your internet connection and try again.');
      }
      
      if (error.message.includes('CORS')) {
        throw new Error('Server configuration error. Please contact support.');
      }
      
      throw new Error('Unable to connect to payment server. Please try again later.');
    }
    
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
    
    throw new Error(error.message || 'An unexpected error occurred');
  }
};
