import { useState, useEffect } from "react";
import { getProducts } from "../services/product.api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getProducts()
      .then((res) => {
        if (mounted) setProducts(res?.data || []);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { products, loading };
}
