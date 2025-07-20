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
  const { cart, loading: cartLoading } = useCart();
  // Debug log for checkout cart state
  console.log('Checkout page: cart', cart, 'loading', cartLoading);
  const { isAuthenticated, logout, token, refreshToken } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Authentication check with token verification
  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        toast.error('Please log in to complete your order');
        navigate('/login?redirect=/checkout');
        return;
      }

      try {
        // Verify token is still valid
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        setAuthChecked(true);
      } catch (error) {
        toast.error('Session verification failed');
        logout();
        navigate('/login');
      }
    };

    verifyAuth();
  }, [isAuthenticated, navigate, logout, token]);

  const handleCheckout = async (formData: CheckoutFormData) => {
    if (!authChecked || !token) {
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
      // Validate required fields
      const requiredFields = {
        shipping_address: 'Shipping Address',
        shipping_city: 'City',
        shipping_state: 'State/Province',
        shipping_country: 'Country',
        shipping_zip_code: 'ZIP/Postal Code'
      };

      for (const [field, name] of Object.entries(requiredFields)) {
        if (!formData[field as keyof CheckoutFormData]?.trim()) {
          throw new Error(`${name} is required`);
        }
      }

      // Prepare validated cart items
      const cartItems = Array.isArray(cart.items)
        ? cart.items.map(item => {
            if (!item.product?.id) {
              throw new Error('Invalid product in cart');
            }
            return {
              product_id: item.product.id.toString(),
              quantity: Math.max(1, Math.min(Number(item.quantity), 99)), // Limit quantity to 99
              price: Number(item.product.price) || 0,
              name: item.product.name || '',
              image: Array.isArray(item.product.images) && item.product.images.length > 0 ? item.product.images[0] : ''
            };
          })
        : [];

      // Attempt checkout with token refresh if needed
      const attemptCheckout = async (attempt = 1): Promise<any> => {
        try {
          const response = await createCheckout({
            ...formData,
            payment_method: formData.payment_method || 'flutterwave',
            cart_items: cartItems // <-- pass cart_items explicitly
          }, token);

          if (!response.payment_url) {
            throw new Error('Payment initialization failed');
          }

          return response;
        } catch (error: any) {
          if (error.response?.status === 401 && attempt === 1 && refreshToken) {
            // Try to refresh token and retry
            try {
              await refreshToken();
              return attemptCheckout(2); // Second attempt
            } catch (refreshError) {
              throw new Error('Session expired. Please login again');
            }
          }
          throw error;
        }
      };

      const response = await attemptCheckout();

      // Store minimal order reference
      sessionStorage.setItem('pending_order', JSON.stringify({
        reference: response.reference,
        order_id: response.order_id,
        expires: Date.now() + 3600000 // 1 hour expiration
      }));

      // Redirect to payment
      toast.success('Redirecting to payment gateway...');
      window.location.assign(response.payment_url);

    } catch (error: any) {
      console.error('Checkout Error:', error);
      
      let errorMessage = 'Checkout failed. Please try again.';
      
      if (error.response) {
        let backendMessage = error.response.data?.detail || error.response.data?.message;
        switch (error.response.status) {
          case 401:
            if (!isAuthenticated) {
              errorMessage = 'Session expired. Please login again';
              logout();
              navigate('/login');
            } else {
              errorMessage = backendMessage || 'You are still logged in. Please try again.';
            }
            break;
          case 400:
            errorMessage = backendMessage || 'Invalid checkout data';
            break;
          case 403:
            errorMessage = 'Payment authorization failed';
            break;
          default:
            errorMessage = backendMessage || `Service error (${error.response.status})`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartLoading || !authChecked) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Verifying your session...</h1>
        </div>
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
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
              shipping_country: 'Nigeria'
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