import { useState, useEffect } from "react";
import { getOrders } from "../services/order.api";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getOrders()
      .then((res) => {
        if (mounted) setOrders(res?.data || []);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { orders, loading };
}
