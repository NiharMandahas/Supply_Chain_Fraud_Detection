import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  id: string;
  item_name: string;
  price: number;
  quantity: number;
  image_address: string;
  seller_name: string;
  category: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: any) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.product_id);
  
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.product_id
            ? { ...item, quantity: item.quantity + (product.quantity ?? 1) }
            : item
        );
      }
  
      return [...currentCart, {
        id: product.product_id,
        item_name: product.item_name,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        quantity: product.quantity ?? 1, // Ensure quantity defaults to 1
        image_address: product.image_address,
        seller_name: product.seller_name,
        category: product.category
      }];
    });
  }, []);
  
  

  const removeFromCart = useCallback((productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(currentCart => {
      if (quantity <= 0) {
        return currentCart.filter(item => item.id !== productId);
      }
      return currentCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}