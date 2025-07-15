import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);
      const { token, user_id, email } = res.data;

      login(token, user_id, email, rememberMe);
      toast.success('Login successful');
      navigate(redirectPath);
    } catch (err: any) {
      toast.error('Login failed: Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-2 border-pink-100">
          <CardHeader className="text-center bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-pink-100">
              Sign in to your SGB account to continue shopping
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-pink-700 font-semibold">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-pink-200 focus:border-pink-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-pink-700 font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-pink-200 focus:border-pink-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-pink-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    id="remember"
                    className="accent-pink-500"
                  />
                  <label htmlFor="remember" className="text-sm text-pink-700">Remember Me</label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="bg-pink-200" />
              <div className="mt-6 text-center">
                <p className="text-sm text-pink-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:underline font-semibold">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
