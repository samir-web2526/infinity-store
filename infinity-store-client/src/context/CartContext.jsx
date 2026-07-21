import { useState, useCallback } from "react";
import { CartContext } from "./cartContextValue";

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
