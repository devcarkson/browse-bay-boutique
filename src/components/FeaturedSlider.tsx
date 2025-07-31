
// import React, { useEffect, useRef } from 'react';
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
// import ProductCard from './ProductCard';
// import { Product } from '@/types/product.types';

// interface FeaturedSliderProps {
//   products: Product[];
//   title: string;
// }

// const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ products, title }) => {
//   const [api, setApi] = React.useState<CarouselApi>();

//   useEffect(() => {
//     if (!api) return;

//     const autoSlide = setInterval(() => {
//       api.scrollNext();
//     }, 4000);

//     return () => clearInterval(autoSlide);
//   }, [api]);

//   return (
//     <div className="space-y-6 w-full overflow-hidden">
//       <h2 className="text-3xl font-bold text-center">{title}</h2>
//       <div className="relative w-full">
//         <Carousel
//           setApi={setApi}
//           opts={{
//             align: "start",
//             loop: true,
//           }}
//           className="w-full"
//         >
//           <CarouselContent className="-ml-2 md:-ml-4">
//             {products.map((product) => (
//               <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
//                 <ProductCard product={product} isSliderCard={true} />
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <CarouselPrevious className="hidden md:flex" />
//           <CarouselNext className="hidden md:flex" />
//         </Carousel>
//       </div>
//     </div>
//   );
// };

// export default FeaturedSlider;


import React from 'react';
import { Product } from '@/types/product.types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import SimpleProductCard from '@/components/SimpleProductCard';

interface FeaturedSliderProps {
  products?: Product[];
  isLoading?: boolean;
  error?: Error | null;
  title?: string;
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ 
  products = [],
  isLoading = false,
  error = null,
  title = "Featured Products"
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading featured products...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>Error loading featured products: {error.message}</p>
      </div>
    );
  }

  // Show empty state
  if (!Array.isArray(products)) {  // Fixed: Added missing parenthesis
    console.error('Products is not an array:', products);
    return (
      <div className="flex justify-center items-center h-64">
        <p>No featured products available</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No featured products available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-3xl font-bold text-center">{title}</h2>
      <Carousel className="w-full max-w-7xl mx-auto">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <SimpleProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default FeaturedSlider;