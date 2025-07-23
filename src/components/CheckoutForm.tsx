import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, Loader } from 'lucide-react';

interface CheckoutFormData {
  first_name: string;
  last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  shipping_zip_code: string;
  payment_method: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
  defaultValues?: Partial<CheckoutFormData>;
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
  'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSubmit, 
  isLoading,
  defaultValues 
}) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors } 
  } = useForm<CheckoutFormData>({
    defaultValues: {
      payment_method: 'flutterwave',
      shipping_country: 'Nigeria',
      ...defaultValues // Spread any additional default values passed as props
    }
  });

  const watchedState = watch('shipping_state');
  const watchedCountry = watch('shipping_country');
  const watchedPaymentMethod = watch('payment_method');

  const handleStateChange = (value: string) => {
    setValue('shipping_state', value, { shouldValidate: true });
  };

  const handleCountryChange = (value: string) => {
    setValue('shipping_country', value, { shouldValidate: true });
    if (value !== 'Nigeria') {
      setValue('shipping_state', '');
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setValue('payment_method', value, { shouldValidate: true });
  };

  const handleFormSubmit = (data: CheckoutFormData) => {
    if (!data.shipping_state) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              {...register('first_name', { required: 'First name is required' })}
              placeholder="Enter your first name"
              disabled={isLoading}
            />
            {errors.first_name && (
              <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              {...register('last_name', { required: 'Last name is required' })}
              placeholder="Enter your last name"
              disabled={isLoading}
            />
            {errors.last_name && (
              <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <Label htmlFor="shipping_address">Street Address *</Label>
            <Input
              id="shipping_address"
              {...register('shipping_address', { 
                required: 'Street address is required',
                minLength: { value: 10, message: 'Address must be at least 10 characters' }
              })}
              placeholder="Enter your complete street address"
              disabled={isLoading}
            />
            {errors.shipping_address && (
              <p className="text-sm text-red-500 mt-1">{errors.shipping_address.message}</p>
            )}
          </div>

          {/* City and ZIP Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_city">City *</Label>
              <Input
                id="shipping_city"
                {...register('shipping_city', { 
                  required: 'City is required',
                  minLength: { value: 2, message: 'City name must be at least 2 characters' }
                })}
                placeholder="Enter city name"
                disabled={isLoading}
              />
              {errors.shipping_city && (
                <p className="text-sm text-red-500 mt-1">{errors.shipping_city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shipping_zip_code">ZIP/Postal Code *</Label>
              <Input
                id="shipping_zip_code"
                {...register('shipping_zip_code', { 
                  required: 'ZIP/Postal code is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Please enter a valid 6-digit postal code'
                  }
                })}
                placeholder="123456"
                disabled={isLoading}
              />
              {errors.shipping_zip_code && (
                <p className="text-sm text-red-500 mt-1">{errors.shipping_zip_code.message}</p>
              )}
            </div>
          </div>

          {/* Country and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_country">Country *</Label>
              <Select 
                value={watchedCountry} 
                onValueChange={handleCountryChange} 
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="shipping_state">State/Region *</Label>
              <Select 
                value={watchedState} 
                onValueChange={handleStateChange} 
                disabled={isLoading || !watchedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder={watchedCountry ? "Select State" : "Select Country First"} />
                </SelectTrigger>
                <SelectContent>
                  {watchedCountry === 'Nigeria' ? (
                    nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Other">Other</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {!watchedState && (
                <p className="text-sm text-red-500 mt-1">Please select a state</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-4">
            <Label>Payment Method *</Label>
            <div className="mt-2 space-y-2">
              <div 
                className={`p-3 border rounded-lg cursor-pointer ${
                  watchedPaymentMethod === 'flutterwave' ? 'bg-primary/10 border-primary' : 'bg-muted/50'
                }`}
                onClick={() => handlePaymentMethodChange('flutterwave')}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="flutterwave"
                    value="flutterwave"
                    {...register('payment_method')}
                    checked={watchedPaymentMethod === 'flutterwave'}
                    className="hidden"
                  />
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    watchedPaymentMethod === 'flutterwave' ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {watchedPaymentMethod === 'flutterwave' && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <label htmlFor="flutterwave" className="font-medium cursor-pointer">
                    Pay with Flutterwave
                  </label>
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-6">
                  Secure payment via Flutterwave (Cards, Bank Transfer, USSD)
                </p>
              </div>

              {/* Add other payment methods if needed */}
              {/* <div 
                className={`p-3 border rounded-lg cursor-pointer mt-2 ${
                  watchedPaymentMethod === 'paystack' ? 'bg-primary/10 border-primary' : 'bg-muted/50'
                }`}
                onClick={() => handlePaymentMethodChange('paystack')}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="paystack"
                    value="paystack"
                    {...register('payment_method')}
                    checked={watchedPaymentMethod === 'paystack'}
                    className="hidden"
                  />
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    watchedPaymentMethod === 'paystack' ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {watchedPaymentMethod === 'paystack' && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <label htmlFor="paystack" className="font-medium cursor-pointer">
                    Pay with Paystack
                  </label>
                </div>
              </div> */}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isLoading || !watchedState}
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;