import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { getCart, updateCartItem, removeCartItem } from "@/services/cart.api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-border p-4">
          <Skeleton className="size-24 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refetchCartCount } = useCart();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const items = cart?.items ?? [];

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => updateCartItem(id, { quantity }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      refetchCartCount(res?.items?.length ?? res?.cart?.items?.length ?? items.length);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      refetchCartCount(res?.items?.length ?? res?.cart?.items?.length ?? Math.max(0, items.length - 1));
    },
  });

  const totalItems = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.subtotal ?? item.price * (item.quantity ?? 1)), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">Cart</h1>
          <CartSkeleton />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center gap-4 py-20">
            <ShoppingBag className="size-16 text-muted-foreground/30" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Your cart is empty</h1>
            <p className="text-sm text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild className="mt-4 rounded-lg">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>
          <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Continue Shopping
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <Link
                  to={`/products/${item.productId}`}
                  className="size-24 shrink-0 overflow-hidden rounded-lg bg-muted"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      to={`/products/${item.productId}`}
                      className="text-sm font-semibold text-foreground hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        className="flex size-7 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
                        disabled={item.quantity <= 1 || updateMutation.isPending}
                        onClick={() =>
                          updateMutation.mutate({
                            id: item.productId,
                            quantity: item.quantity - 1,
                          })
                        }
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        className="flex size-7 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
                        disabled={item.quantity >= item.stock || updateMutation.isPending}
                        onClick={() =>
                          updateMutation.mutate({
                            id: item.productId,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">
                        ${(item.subtotal ?? item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        disabled={removeMutation.isPending}
                        onClick={() => removeMutation.mutate(item.productId)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-base font-bold text-foreground">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button
                className="mt-6 w-full rounded-lg"
                size="lg"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
