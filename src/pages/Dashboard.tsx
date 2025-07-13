
import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, Package, CreditCard, MapPin, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const Dashboard = () => {
  const { cart } = useCart();

  const stats = [
    { label: 'Total Orders', value: '12', icon: Package },
    { label: 'Items in Cart', value: cart.items.length.toString(), icon: ShoppingBag },
    { label: 'Wishlist Items', value: '8', icon: Heart },
    { label: 'Total Spent', value: '₦245,000', icon: CreditCard },
  ];

  const recentOrders = [
    { id: '001', date: '2024-01-15', status: 'Delivered', total: '₦25,500', items: 3 },
    { id: '002', date: '2024-01-10', status: 'Shipped', total: '₦18,200', items: 2 },
    { id: '003', date: '2024-01-05', status: 'Processing', total: '₦32,800', items: 4 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Processing': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-2">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-2">
                        <span className="font-medium">Order #{order.id}</span>
                        <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.date} • {order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.total}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full" variant="outline">
                <Link to="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Shop Products
                </Link>
              </Button>
              
              <Button asChild className="w-full" variant="outline">
                <Link to="/cart" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  View Cart ({cart.items.length})
                </Link>
              </Button>
              
              <Button asChild className="w-full" variant="outline">
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              
              <Button asChild className="w-full" variant="outline">
                <Link to="/addresses" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Manage Addresses
                </Link>
              </Button>
              
              <Button asChild className="w-full" variant="outline">
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Order Shipped</p>
                  <p className="text-muted-foreground">Your order #002 has been shipped</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Sale Alert</p>
                  <p className="text-muted-foreground">New items added to Electronics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
