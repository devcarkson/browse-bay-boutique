import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { fetchWishlist, removeFromWishlist } from '@/api/wishlist';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWishlist();
      setWishlist(Array.isArray(data) ? data : data.results || []);
    } catch (e: any) {
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await removeFromWishlist(id);
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (e) {
      alert('Failed to remove item');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Wishlist</h1>
      <Card>
        <CardHeader>
          <CardTitle>Wishlist Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : wishlist.length === 0 ? (
            <p className="text-muted-foreground">Your wishlist is empty.</p>
          ) : (
            <ul className="space-y-4">
              {wishlist.map(item => (
                <li key={item.id} className="flex justify-between items-center border rounded-lg p-4">
                  <div>
                    <span className="font-medium">{item.product?.name}</span>
                    <span className="ml-2 text-muted-foreground">₦{item.product?.price}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wishlist; 