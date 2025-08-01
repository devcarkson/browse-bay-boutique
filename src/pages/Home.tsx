
import React from 'react';
import { Button } from '@/components/ui/button';
import FeaturedSlider from '@/components/FeaturedSlider';
import SimpleProductCard from '@/components/SimpleProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import { useFeaturedProducts, useNewArrivalProducts, useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { products as mockProducts } from '@/data/mockData';

const Home = () => {
  const { data: featuredProducts, isLoading: isLoadingFeatured, error: errorFeatured, refetch: refetchFeatured } = useFeaturedProducts();
  const { data: newArrivals, isLoading: isLoadingNew, error: errorNew, refetch: refetchNew } = useNewArrivalProducts();
  const { data: allProducts = [] } = useProducts({});

  // Fallback to mock data when API fails
  const mockFeaturedProducts = mockProducts.filter(p => p.is_featured);
  const mockNewArrivals = mockProducts.filter(p => p.is_new_arrival);
  
  const finalFeaturedProducts = featuredProducts && featuredProducts.length > 0 
    ? featuredProducts 
    : (errorFeatured ? mockFeaturedProducts : []);

  const finalNewArrivals = newArrivals && newArrivals.length > 0 
    ? newArrivals 
    : (errorNew ? mockNewArrivals : []);

  const displayProducts = Array.isArray(allProducts)
    ? allProducts.slice(0, 6)
    : allProducts?.results?.slice(0, 6) || mockProducts.slice(0, 6);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-10 w-full">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">SGB</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/products">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>



      {/* Featured Products Slider */}
      <section className="py-2 w-full">
        <div className="container mx-auto px-4">
          {isLoadingFeatured ? (
            <LoadingSpinner />
          ) : finalFeaturedProducts.length > 0 ? (
            <>
              <FeaturedSlider 
                products={finalFeaturedProducts} 
                title="Featured Products" 
                isLoading={false}
                error={null}
              />
              {errorFeatured && (
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    Showing sample products (API unavailable)
                  </p>
                  {import.meta.env.DEV && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                        Debug Info
                      </summary>
                      <div className="text-xs text-left bg-muted p-2 rounded mt-1">
                        <p><strong>Error:</strong> {errorFeatured.message}</p>
                        <p><strong>Status:</strong> {(errorFeatured as any).response?.status}</p>
                        <p><strong>API URL:</strong> {import.meta.env.VITE_API_BASE_URL}</p>
                      </div>
                    </details>
                  )}
                </div>
              )}
            </>
          ) : (
            <ErrorMessage message="Failed to load featured products" onRetry={refetchFeatured} />
          )}
        </div>
      </section>

      {/* New Arrivals Slider */}
      <section className="py-2 bg-muted/30 w-full">
        <div className="container mx-auto px-4">
          {isLoadingNew ? (
            <LoadingSpinner />
          ) : finalNewArrivals.length > 0 ? (
            <>
              <FeaturedSlider 
                products={finalNewArrivals} 
                title="New Arrivals" 
                isLoading={false}
                error={null}
              />
              {errorNew && (
                <div className="text-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    Showing sample products (API unavailable)
                  </p>
                </div>
              )}
            </>
          ) : (
            <ErrorMessage message="Failed to load new arrivals" onRetry={refetchNew} />
          )}
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop Our Products</h2>
            <p className="text-muted-foreground mb-8">
              Browse through our carefully selected collection of quality products
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            {displayProducts.map((product: any) => (
              <SimpleProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background w-full">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over ₦30,000. Fast and reliable delivery nationwide.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-muted-foreground">
                Your data is protected with industry-standard security measures.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our customer support team is here to help you anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
