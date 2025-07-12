
import React, { useEffect, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface FeaturedSliderProps {
  products: Product[];
  title: string;
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ products, title }) => {
  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const autoSlide = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(autoSlide);
  }, [api]);

  return (
    <div className="space-y-6 w-full overflow-hidden">
      <h2 className="text-3xl font-bold text-center">{title}</h2>
      <div className="relative w-full">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
};

export default FeaturedSlider;
