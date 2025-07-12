
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, MessageCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import FeaturedSlider from '@/components/FeaturedSlider';
import RatingStars from '@/components/RatingStars';
import Footer from '@/components/Footer';
import { products } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const product = products.find(p => p.id === id);
  const similarProducts = products.filter(p => 
    p.category === product?.category && p.id !== product?.id
  ).slice(0, 8);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "✨ Added to cart!",
      description: (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">₦{product.price.toLocaleString()} x {quantity}</p>
          </div>
        </div>
      ),
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
      toast({
        title: "Shared successfully! 💫",
        description: "Product shared with your friends!"
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied! 📋",
        description: "Product link copied to clipboard"
      });
    }
  };

  const handleAddToWishlist = () => {
    toast({
      title: "💕 Added to wishlist!",
      description: `${product.name} has been added to your wishlist.`
    });
  };

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast({
        title: "Please rate the product",
        description: "Your rating helps other customers make better decisions.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Review submitted! ⭐",
      description: "Thank you for your feedback!"
    });
    
    setShowReviewForm(false);
    setUserRating(0);
    setReview('');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="w-full">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 break-words">{product.name}</h1>
              
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <RatingStars rating={product.rating} readonly />
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <span className="text-2xl lg:text-3xl font-bold text-primary">
                  ₦{product.price.toLocaleString()}
                </span>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-medium">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={handleAddToWishlist}>
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span>PROD-{product.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <Button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Write Review
            </Button>
          </div>

          {showReviewForm && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="font-medium mb-2 block">Your Rating</label>
                  <RatingStars 
                    rating={userRating} 
                    onRatingChange={setUserRating}
                    size="lg"
                  />
                </div>
                <div>
                  <label className="font-medium mb-2 block">Your Review</label>
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSubmitReview}>Submit Review</Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <FeaturedSlider products={similarProducts} title="Similar Products" />
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
