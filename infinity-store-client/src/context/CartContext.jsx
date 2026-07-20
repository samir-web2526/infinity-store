import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refetchCartCount = useCallback((count) => {
    setCartCount(count);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, refetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
