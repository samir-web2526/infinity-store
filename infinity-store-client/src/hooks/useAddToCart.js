import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import { useCart } from "../context/CartContext";
import { addToCart as addToCartApi, getCart } from "../services/cart.api";

export function useAddToCart() {
  const { user } = useAuth();
  const { refetchCartCount } = useCart();
  const navigate = useNavigate();

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await addToCartApi({ productId, quantity });
      toast.success("Added to cart");
      try {
        const cart = await getCart();
        refetchCartCount(cart?.items?.length ?? cart?.cart?.items?.length ?? 0);
      } catch {}
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add to cart");
    }
  };

  return { addToCart };
}
