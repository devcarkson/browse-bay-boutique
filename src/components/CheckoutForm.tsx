
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface CheckoutFormData {
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
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      payment_method: 'flutterwave',
      shipping_country: 'Nigeria',
    }
  });

  const watchedState = watch('shipping_state');
  const watchedCountry = watch('shipping_country');

  const handleStateChange = (value: string) => {
    setValue('shipping_state', value);
  };

  const handleCountryChange = (value: string) => {
    setValue('shipping_country', value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="shipping_address">Address *</Label>
            <Input
              id="shipping_address"
              {...register('shipping_address', { required: 'Address is required' })}
              placeholder="Enter your full address"
            />
            {errors.shipping_address && (
              <p className="text-sm text-red-500 mt-1">{errors.shipping_address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_city">City *</Label>
              <Input
                id="shipping_city"
                {...register('shipping_city', { required: 'City is required' })}
                placeholder="City"
              />
              {errors.shipping_city && (
                <p className="text-sm text-red-500 mt-1">{errors.shipping_city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shipping_state">State *</Label>
              <Select value={watchedState} onValueChange={handleStateChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                  <SelectItem value="Abuja">Abuja (FCT)</SelectItem>
                  <SelectItem value="Kano">Kano</SelectItem>
                  <SelectItem value="Rivers">Rivers</SelectItem>
                  <SelectItem value="Oyo">Oyo</SelectItem>
                  <SelectItem value="Kaduna">Kaduna</SelectItem>
                  <SelectItem value="Ogun">Ogun</SelectItem>
                  <SelectItem value="Imo">Imo</SelectItem>
                  <SelectItem value="Plateau">Plateau</SelectItem>
                  <SelectItem value="Akwa Ibom">Akwa Ibom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_country">Country *</Label>
              <Select value={watchedCountry} onValueChange={handleCountryChange} required>
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
              <Label htmlFor="shipping_zip_code">ZIP Code *</Label>
              <Input
                id="shipping_zip_code"
                {...register('shipping_zip_code', { required: 'ZIP code is required' })}
                placeholder="ZIP Code"
              />
              {errors.shipping_zip_code && (
                <p className="text-sm text-red-500 mt-1">{errors.shipping_zip_code.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Pay with Flutterwave'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
