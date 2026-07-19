import { useState } from "react";

export function useCart() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  return { cart, addToCart };
}
