
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { Link } from 'react-router-dom';

interface SimpleProductCardProps {
  product: Product;
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
        <CardContent className="p-3 md:p-4">
          <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">{product.name}</h3>
          
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
          
          <div className="text-lg md:text-xl font-bold text-primary">
            ₦{product.price.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SimpleProductCard;
