
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

const Checkout = () => {
  const { cart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async (formData: CheckoutData) => {
    if (!token) {
      toast.error("You need to log in to place an order");
      navigate(`/login?redirect=/checkout`);
      return;
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting checkout process...');
      
      const response = await createCheckout(formData);
      
      console.log('Checkout successful, redirecting to:', response.payment_url);
      
      // Store order reference for potential verification
      if (response.reference) {
        localStorage.setItem('pending_order_ref', response.reference);
      }
      
      // Redirect to Flutterwave payment page
      window.location.href = response.payment_url;
      
    } catch (error: any) {
      console.error('Checkout failed:', error);
      toast.error(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
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
