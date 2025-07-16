
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckout, CheckoutData } from '@/api/checkout';
import { toast } from 'sonner';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';

interface CheckoutFormData {
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code: string;
  payment_method: string;
}

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { token, userId, email } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (formData: CheckoutFormData) => {
    console.log('Starting checkout process with form data:', formData);
    
    // Validate authentication
    if (!token || !userId || !email) {
      console.log('User not authenticated, redirecting to login');
      toast.error("Please log in to complete your order");
      navigate(`/login?redirect=/checkout`);
      return;
    }

    // Validate cart
    if (!cart || !cart.items || cart.items.length === 0) {
      console.log('Cart is empty');
      toast.error("Your cart is empty. Please add items before checkout.");
      navigate('/products');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Cart items:', cart.items);
      
      // Prepare cart items for the backend with proper structure
      const cartItems = cart.items.map((item, index) => {
        console.log(`Cart item ${index}:`, item);
        return {
          product_id: String(item.product.id),
          quantity: Number(item.quantity),
          price: Number(item.product.price)
        };
      });

      console.log('Prepared cart items:', cartItems);

      // Prepare checkout data
      const checkoutData: CheckoutData = {
        shipping_address: formData.shipping_address.trim(),
        shipping_city: formData.shipping_city.trim(),
        shipping_state: formData.shipping_state,
        shipping_country: formData.shipping_country,
        shipping_zip_code: formData.shipping_zip_code.trim(),
        payment_method: formData.payment_method || 'flutterwave',
        cart_items: cartItems
      };
      
      console.log('Final checkout data:', JSON.stringify(checkoutData, null, 2));
      
      // Create checkout
      const response = await createCheckout(checkoutData);
      
      console.log('Checkout response:', response);
      
      if (!response.payment_url) {
        throw new Error('No payment URL received from server');
      }
      
      // Store order reference for verification
      if (response.reference) {
        localStorage.setItem('pending_order_ref', response.reference);
        localStorage.setItem('pending_order_id', response.order_id);
      }
      
      console.log('Redirecting to payment URL:', response.payment_url);
      
      // Show success message
      toast.success('Redirecting to payment gateway...');
      
      // Small delay to show the toast
      setTimeout(() => {
        // Redirect to Flutterwave payment page
        window.location.href = response.payment_url;
      }, 1000);
      
    } catch (error: any) {
      console.error('Checkout failed with error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
      let errorMessage = 'Checkout failed. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show empty cart message
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add items before proceeding to checkout.
          </p>
          <Button asChild>
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mt-4">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
        </div>
        
        <div>
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
