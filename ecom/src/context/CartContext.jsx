import { createContext, useContext } from 'react';
import { useCart as useCartHook } from '../hooks/useCart';

const CartContext = createContext();

export function CartProvider({ children }) {
  const cart = useCartHook();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export const useCartContext = () => useContext(CartContext);
