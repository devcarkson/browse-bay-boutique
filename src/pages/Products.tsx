
// import React, { useState, useMemo } from 'react';
// import { Search, Filter, Grid, List, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { Slider } from '@/components/ui/slider';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import SimpleProductCard from '@/components/SimpleProductCard';
// import LoadingSpinner from '@/components/LoadingSpinner';
// import ErrorMessage from '@/components/ErrorMessage';
// import { useProducts } from '@/hooks/useProducts';
// import { FilterOptions } from '@/types';
// import { useIsMobile } from '@/hooks/use-mobile';

// const Products = () => {
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [showFilters, setShowFilters] = useState(false);
//   const isMobile = useIsMobile();
//   const [filters, setFilters] = useState<FilterOptions>({
//     searchTerm: '',
//     category: '',
//     minPrice: 0,
//     maxPrice: 500,
//     inStock: false
//   });
//   const [sortBy, setSortBy] = useState<string>('name');

//   // Build API params from filters
//   const apiParams = useMemo(() => {
//     const params: Record<string, any> = {};
    
//     if (filters.searchTerm) {
//       params.search = filters.searchTerm;
//     }
//     if (filters.category) {
//       params.category = filters.category;
//     }
//     if (filters.minPrice) {
//       params.min_price = filters.minPrice;
//     }
//     if (filters.maxPrice) {
//       params.max_price = filters.maxPrice;
//     }
//     if (filters.inStock) {
//       params.in_stock = true;
//     }
    
//     // Add ordering
//     switch (sortBy) {
//       case 'price-low':
//         params.ordering = 'price';
//         break;
//       case 'price-high':
//         params.ordering = '-price';
//         break;
//       case 'rating':
//         params.ordering = '-rating';
//         break;
//       case 'name':
//       default:
//         params.ordering = 'name';
//         break;
//     }
    
//     return params;
//   }, [filters, sortBy]);

//   const { data: productsData, isLoading, error, refetch } = useProducts(apiParams);

//   const products = productsData?.results || [];

//   const handleFilterChange = (key: keyof FilterOptions, value: any) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       searchTerm: '',
//       category: '',
//       minPrice: 0,
//       maxPrice: 500,
//       inStock: false
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full overflow-x-hidden">
//         <div className="container mx-auto px-4 py-8">
//           <LoadingSpinner size="lg" className="py-16" />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full overflow-x-hidden">
//         <div className="container mx-auto px-4 py-8">
//           <ErrorMessage 
//             message="Failed to load products"
//             onRetry={refetch}
//             className="my-8"
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-x-hidden">
//       <div className="container mx-auto px-4 py-4 lg:py-8">
//         <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
//           {/* Mobile Header and Search */}
//           {isMobile && (
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h1 className="text-2xl font-bold">Products</h1>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="flex items-center gap-2"
//                 >
//                   <Filter className="h-4 w-4" />
//                   Filters
//                 </Button>
//               </div>
              
//               {/* Mobile Search - Always visible and before filters */}
//               <div className="relative">
//                 <Input
//                   placeholder="Search products..."
//                   value={filters.searchTerm || ''}
//                   onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
//                   className="pl-10"
//                 />
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               </div>
//             </div>
//           )}

//           {/* Filters Sidebar */}
//           <aside className={`
//             ${isMobile ? 'fixed inset-0 z-50 bg-background p-4' : 'lg:w-64'} 
//             ${isMobile && !showFilters ? 'hidden' : 'block'}
//             ${!isMobile ? 'space-y-6' : ''}
//           `}>
//             {isMobile && (
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold">Filters</h2>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowFilters(false)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             )}

//             <Card className={isMobile ? 'h-full overflow-y-auto' : ''}>
//               <CardHeader className={isMobile ? 'pb-4' : ''}>
//                 <CardTitle className="flex items-center gap-2">
//                   <Filter className="h-4 w-4" />
//                   Filters
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Desktop Search */}
//                 {!isMobile && (
//                   <div>
//                     <Label htmlFor="search">Search</Label>
//                     <div className="relative mt-1">
//                       <Input
//                         id="search"
//                         placeholder="Search products..."
//                         value={filters.searchTerm || ''}
//                         onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
//                         className="pl-10"
//                       />
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     </div>
//                   </div>
//                 )}

//                 {/* Price Range */}
//                 <div>
//                   <Label>Price Range: ₦{filters.minPrice} - ₦{filters.maxPrice}</Label>
//                   <div className="mt-2 space-y-3">
//                     <div>
//                       <Label className="text-sm text-muted-foreground">Min Price</Label>
//                       <Slider
//                         value={[filters.minPrice || 0]}
//                         onValueChange={([value]) => handleFilterChange('minPrice', value)}
//                         max={500}
//                         step={10}
//                         className="w-full"
//                       />
//                     </div>
//                     <div>
//                       <Label className="text-sm text-muted-foreground">Max Price</Label>
//                       <Slider
//                         value={[filters.maxPrice || 500]}
//                         onValueChange={([value]) => handleFilterChange('maxPrice', value)}
//                         max={500}
//                         step={10}
//                         className="w-full"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* In Stock */}
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="inStock"
//                     checked={filters.inStock || false}
//                     onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
//                   />
//                   <Label htmlFor="inStock">In Stock Only</Label>
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   <Button onClick={clearFilters} variant="outline" className="w-full">
//                     Clear Filters
//                   </Button>
//                   {isMobile && (
//                     <Button onClick={() => setShowFilters(false)} className="w-full">
//                       Apply Filters
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </aside>

//           {/* Products Grid */}
//           <main className="flex-1 w-full overflow-hidden">
//             {/* Desktop Header */}
//             {!isMobile && (
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                 <div>
//                   <h1 className="text-3xl font-bold">Products</h1>
//                   <p className="text-muted-foreground">
//                     Showing {products.length} products
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   {/* Sort */}
//                   <Select value={sortBy} onValueChange={setSortBy}>
//                     <SelectTrigger className="w-48">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="name">Name</SelectItem>
//                       <SelectItem value="price-low">Price: Low to High</SelectItem>
//                       <SelectItem value="price-high">Price: High to Low</SelectItem>
//                       <SelectItem value="rating">Rating</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   {/* View Mode */}
//                   <div className="flex border rounded-md">
//                     <Button
//                       variant={viewMode === 'grid' ? 'default' : 'ghost'}
//                       size="sm"
//                       onClick={() => setViewMode('grid')}
//                       className="rounded-r-none"
//                     >
//                       <Grid className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant={viewMode === 'list' ? 'default' : 'ghost'}
//                       size="sm"
//                       onClick={() => setViewMode('list')}
//                       className="rounded-l-none"
//                     >
//                       <List className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Mobile Header */}
//             {isMobile && !showFilters && (
//               <div className="mb-4">
//                 <p className="text-sm text-muted-foreground mb-3">
//                   Showing {products.length} products
//                 </p>
                
//                 <div className="flex items-center justify-between gap-2">
//                   {/* Sort */}
//                   <Select value={sortBy} onValueChange={setSortBy}>
//                     <SelectTrigger className="flex-1">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="name">Name</SelectItem>
//                       <SelectItem value="price-low">Price: Low to High</SelectItem>
//                       <SelectItem value="price-high">Price: High to Low</SelectItem>
//                       <SelectItem value="rating">Rating</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   {/* View Mode */}
//                   <div className="flex border rounded-md">
//                     <Button
//                       variant={viewMode === 'grid' ? 'default' : 'ghost'}
//                       size="sm"
//                       onClick={() => setViewMode('grid')}
//                       className="rounded-r-none"
//                     >
//                       <Grid className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant={viewMode === 'list' ? 'default' : 'ghost'}
//                       size="sm"
//                       onClick={() => setViewMode('list')}
//                       className="rounded-l-none"
//                     >
//                       <List className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Products */}
//             {products.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
//                 <Button onClick={clearFilters} className="mt-4">
//                   Clear Filters
//                 </Button>
//               </div>
//             ) : (
//               <div className={`grid gap-4 lg:gap-6 ${
//                 viewMode === 'grid' 
//                   ? 'grid-cols-2 lg:grid-cols-3'
//                   : 'grid-cols-1'
//               }`}>
//                 {products.map((product) => (
//                   <SimpleProductCard key={product.id} product={product} />
//                 ))}
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;




import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleProductCard from '@/components/SimpleProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useProducts } from '@/hooks/useProducts';
import { FilterOptions } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const Products = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    category: '',
    minPrice: 0,
    maxPrice: 500,
    inStock: false
  });

  const [sortBy, setSortBy] = useState<string>('name');

  const apiParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (filters.searchTerm) params.search = filters.searchTerm;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;
    if (filters.inStock) params.in_stock = true;

    switch (sortBy) {
      case 'price-low':
        params.ordering = 'price';
        break;
      case 'price-high':
        params.ordering = '-price';
        break;
      case 'rating':
        params.ordering = '-rating';
        break;
      default:
        params.ordering = 'name';
        break;
    }
    return params;
  }, [filters, sortBy]);

  const { data: productsData, isLoading, error, refetch } = useProducts(apiParams);

  // Ensure products is always an array
  const products = Array.isArray(productsData)
    ? productsData
    : productsData?.results ?? [];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      minPrice: 0,
      maxPrice: 500,
      inStock: false
    });
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" className="py-16" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage 
            message="Failed to load products"
            onRetry={refetch}
            className="my-8"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* --- Filters Sidebar --- */}
          <aside className={`${
            isMobile ? 'fixed inset-0 z-50 bg-background p-4' : 'lg:w-64'
          } ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
            {isMobile && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Card className={isMobile ? 'h-full overflow-y-auto' : ''}>
              <CardHeader className={isMobile ? 'pb-4' : ''}>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Input
                      id="search"
                      placeholder="Search products..."
                      value={filters.searchTerm || ''}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <Label>Price Range: ₦{filters.minPrice} - ₦{filters.maxPrice}</Label>
                  <div className="mt-2 space-y-3">
                    <Slider
                      value={[filters.minPrice]}
                      onValueChange={([val]) => handleFilterChange('minPrice', val)}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <Slider
                      value={[filters.maxPrice]}
                      onValueChange={([val]) => handleFilterChange('maxPrice', val)}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* In Stock */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={filters.inStock || false}
                    onCheckedChange={(checked) => handleFilterChange('inStock', !!checked)}
                  />
                  <Label htmlFor="inStock">In Stock Only</Label>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    Clear Filters
                  </Button>
                  {isMobile && (
                    <Button onClick={() => setShowFilters(false)} className="w-full">
                      Apply Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* --- Main Content --- */}
          <main className="flex-1 w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Products</h1>
                <p className="text-muted-foreground">Showing {products.length} products</p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found.</p>
                <Button onClick={clearFilters} className="mt-4">Clear Filters</Button>
              </div>
            ) : (
              <div className={`grid gap-4 lg:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <SimpleProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
