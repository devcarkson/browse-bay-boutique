import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckout } from '@/api/checkout';
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
  const { cart } = useCart();
  const { isAuthenticated, logout } = useAuth(); // Added logout function
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to complete your order');
      navigate('/login?redirect=/checkout');
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated, navigate]);

  const handleCheckout = async (formData: CheckoutFormData) => {
    if (!authChecked) {
      toast.error('Authentication check in progress');
      return;
    }

    if (!cart?.items?.length) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    setIsLoading(true);

    try {
      // Verify token exists before proceeding
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Your session has expired. Please login again');
      }

      // Validate required fields
      const requiredFields = {
        shipping_address: 'Shipping Address',
        shipping_city: 'City',
        shipping_state: 'State',
        shipping_country: 'Country',
        shipping_zip_code: 'ZIP Code'
      };

      for (const [field, name] of Object.entries(requiredFields)) {
        if (!formData[field as keyof CheckoutFormData]?.trim()) {
          throw new Error(`${name} is required`);
        }
      }

      // Prepare cart items with validation
      const cartItems = cart.items.map(item => {
        if (!item.product?.id) {
          throw new Error('Invalid product in cart');
        }
        return {
          product_id: item.product.id.toString(),
          quantity: Math.max(1, Number(item.quantity)),
          price: Number(item.product.price) || 0
        };
      });

      // Call checkout API
      const response = await createCheckout({
        ...formData,
        payment_method: formData.payment_method || 'flutterwave',
        cart_items: cartItems
      });

      if (!response.payment_url) {
        throw new Error('Payment initialization failed');
      }

      // Store order reference with expiration
      localStorage.setItem('pending_order', JSON.stringify({
        reference: response.reference,
        order_id: response.order_id,
        expires: Date.now() + 3600000 // 1 hour
      }));

      // Redirect to payment
      toast.success('Redirecting to payment gateway...');
      setTimeout(() => {
        window.location.assign(response.payment_url);
      }, 1000);

    } catch (error: any) {
      console.error('Checkout Error:', error);
      
      let errorMessage = 'Checkout failed';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Session expired. Please login again';
            logout(); // Clear auth state
            navigate('/login');
            break;
          case 404:
            errorMessage = 'Checkout service not available';
            break;
          case 400:
            errorMessage = error.response.data?.detail || 'Invalid checkout data';
            break;
          default:
            errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Verifying your session...</h1>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild className="mt-4">
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
          <CheckoutForm 
            onSubmit={handleCheckout} 
            isLoading={isLoading}
            defaultValues={{
              payment_method: 'flutterwave',
              shipping_country: 'Nigeria' // Added default country
            }}
          />
        </div>
        <div>
          <OrderSummary cart={cart} />
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Secure Payment</h3>
            <p className="text-sm text-muted-foreground">
              Your transaction is encrypted and secure. We don't store your payment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;