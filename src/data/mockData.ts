
import { Product, Category } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Clothing', slug: 'clothing' },
  { id: '3', name: 'Books', slug: 'books' },
  { id: '4', name: 'Home & Garden', slug: 'home-garden' },
  { id: '5', name: 'Sports', slug: 'sports' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 15,
    featured: true,
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking, GPS, and water resistance.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'electronics',
    stock: 8,
    featured: true,
    rating: 4.2,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'clothing',
    stock: 50,
    featured: false,
    rating: 4.0,
    reviewCount: 45
  },
  {
    id: '4',
    name: 'JavaScript: The Definitive Guide',
    description: 'Comprehensive guide to JavaScript programming for beginners and experts.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop',
    category: 'books',
    stock: 25,
    featured: false,
    rating: 4.8,
    reviewCount: 312
  },
  {
    id: '5',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat perfect for home workouts and studio sessions.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
    category: 'sports',
    stock: 30,
    featured: true,
    rating: 4.3,
    reviewCount: 67
  },
  {
    id: '6',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and auto-shutoff feature.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
    category: 'home-garden',
    stock: 12,
    featured: false,
    rating: 4.1,
    reviewCount: 156
  }
];
