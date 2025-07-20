export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  stock: number;
  rating: number;
  review_count: number;
  created_at: string;
  images: string[]; // Array of URL strings from backend
  category: Category;
}

export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}