
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id');
    const txRef = searchParams.get('tx_ref');
    const statusParam = searchParams.get('status');

    console.log('Payment callback params:', { transactionId, txRef, statusParam });

    // Simulate payment verification (you should call your backend to verify)
    setTimeout(() => {
      if (statusParam === 'successful' || statusParam === 'completed') {
        setStatus('success');
        setMessage('Your payment was successful! Your order has been confirmed.');
        clearCart();
        toast.success('Payment successful!');
        
        // Clear any pending order reference
        localStorage.removeItem('pending_order_ref');
      } else if (statusParam === 'cancelled') {
        setStatus('failed');
        setMessage('Payment was cancelled. You can try again.');
        toast.error('Payment cancelled');
      } else {
        setStatus('failed');
        setMessage('Payment failed. Please try again or contact support.');
        toast.error('Payment failed');
      }
    }, 2000);
  }, [searchParams, clearCart]);

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleTryAgain = () => {
    navigate('/checkout');
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">Please wait while we verify your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          <CardTitle className={status === 'success' ? 'text-green-700' : 'text-red-700'}>
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          
          <div className="space-y-2">
            {status === 'success' ? (
              <>
                <Button onClick={handleContinueShopping} className="w-full">
                  Continue Shopping
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/dashboard">View Orders</Link>
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleTryAgain} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleContinueShopping} className="w-full">
                  Continue Shopping
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCallback;
