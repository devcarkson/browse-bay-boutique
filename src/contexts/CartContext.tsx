
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, addCartItem, removeCartItem, updateCartItem, clearCart as clearCartApi } from '../api/cart';
import { Product } from '../types/product.types';

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: Cart };

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id.toString() === product.id.toString());
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id.toString() === product.id.toString()
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { items: newItems, total };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id.toString() !== action.payload.productId);
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { items: newItems, total };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }
      
      const newItems = state.items.map(item =>
        item.product.id.toString() === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      return { items: newItems, total };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    
    case 'SET_CART': {
      return action.payload;
    }
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage for unauthenticated users
  const getInitialCart = (): Cart => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error('Error parsing saved cart:', e);
        }
      }
    }
    return { items: [], total: 0 };
  };

  const [cart, dispatch] = useReducer(cartReducer, getInitialCart());
  const { isAuthenticated } = useAuth();

  // Save cart to localStorage for unauthenticated users
  React.useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Saved cart to localStorage:', cart);
    }
  }, [cart, isAuthenticated]);

  // Fetch backend cart on login
  React.useEffect(() => {
    const syncCart = async () => {
      console.log('syncCart called, isAuthenticated:', isAuthenticated);
      if (isAuthenticated) {
        try {
          console.log('Fetching cart from backend...');
          const backendCart = await fetchCart();
          console.log('Raw backend cart response:', backendCart);
          // Map backend cart to frontend Cart type
          const mappedCart = {
            items: backendCart.items || [],
            total: backendCart.subtotal || 0,
          };
          console.log('Mapped cart data:', mappedCart);
          dispatch({ type: 'SET_CART', payload: mappedCart });
          // Clear localStorage when user is authenticated
          localStorage.removeItem('cart');
        } catch (e) {
          console.error('Error syncing cart:', e);
          // Optionally handle error
        }
      } else {
        console.log('User not authenticated, skipping cart sync');
      }
    };
    syncCart();
  }, [isAuthenticated]);

  const addToCart = async (product: Product, quantity = 1) => {
    console.log('addToCart called with:', { product, quantity });
    console.log('Current cart state before add:', cart);
    
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    
    if (isAuthenticated) {
      try {
        console.log('User authenticated, calling backend addCartItem...');
        const res = await addCartItem(Number(product.id), quantity);
        console.log('addCartItem response:', res);
        
        console.log('Fetching updated cart from backend...');
        const backendCart = await fetchCart();
        console.log('fetchCart after add:', backendCart);
        
        const mappedCart = {
          items: backendCart.items || [],
          total: backendCart.subtotal || 0,
        };
        console.log('Mapped cart after add:', mappedCart);
        dispatch({ type: 'SET_CART', payload: mappedCart });
      } catch (e) {
        console.error('addCartItem error:', e);
      }
    } else {
      console.log('User not authenticated, only updating local cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
    if (isAuthenticated) {
      try {
        const item = cart.items.find(i => i.product.id.toString() === productId);
        if (item && item.id) {
          await removeCartItem(String(item.id));
          // Sync cart after backend change
          const backendCart = await fetchCart();
          const mappedCart = {
            items: backendCart.items || [],
            total: backendCart.subtotal || 0,
          };
          dispatch({ type: 'SET_CART', payload: mappedCart });
        }
      } catch (e) {
        console.error('removeFromCart error:', e);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    console.log('updateQuantity called:', { productId, quantity });
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    
    if (isAuthenticated) {
      try {
        const item = cart.items.find(i => i.product.id.toString() === productId);
        if (item && item.id) {
          console.log('Updating quantity in backend for item:', item);
          await updateCartItem(String(item.id), quantity);
          // Sync cart after backend change
          const backendCart = await fetchCart();
          const mappedCart = {
            items: backendCart.items || [],
            total: backendCart.subtotal || 0,
          };
          dispatch({ type: 'SET_CART', payload: mappedCart });
        }
      } catch (e) {
        console.error('updateQuantity error:', e);
      }
    } else {
      console.log('User not authenticated, only updating local cart');
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    if (isAuthenticated) {
      try {
        await clearCartApi();
      } catch (e) {
        console.error('clearCart error:', e);
      }
    } else {
      // Clear localStorage for unauthenticated users
      localStorage.removeItem('cart');
    }
  };

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
