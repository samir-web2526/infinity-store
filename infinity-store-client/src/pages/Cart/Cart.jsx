import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, AlertTriangle } from "lucide-react";
import { getCart, updateCartItem, removeCartItem } from "@/services/cart.api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBDT } from "@/utils/currency";

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

function getItemStatus(item) {
  const qty = item.quantity ?? 1;
  const stock = item.stock ?? 0;
  if (stock === 0 || qty > stock) {
    return { ok: false, message: stock === 0 ? "Out of stock" : `Only ${stock} available` };
  }
  return { ok: true, message: "" };
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
  const FREE_SHIPPING_THRESHOLD = 100;
  const SHIPPING_INSIDE_DHAKA = 1;
  const SHIPPING_OUTSIDE_DHAKA = 2;

  const itemStatuses = items.map((item) => ({ item, ...getItemStatus(item) }));
  const hasStockIssues = itemStatuses.some((s) => !s.ok);
  const stockIssueCount = itemStatuses.filter((s) => !s.ok).length;

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

        {hasStockIssues && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
            <AlertTriangle className="size-5 shrink-0" />
            <p>
              {stockIssueCount} item{stockIssueCount > 1 ? "s have" : " has"} stock issues. Please adjust quantities before checkout.
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {itemStatuses.map(({ item, ok, message }, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex gap-4 rounded-xl border bg-card p-4 shadow-sm ${
                  !ok ? "border-amber-300 dark:border-amber-700" : "border-border"
                }`}
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

                  {!ok && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="size-3" />
                      <span>{message}</span>
                    </div>
                  )}

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
                      <span className="ml-1 text-xs text-muted-foreground">
                        / {item.stock} available
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">
                        {formatBDT(item.subtotal ?? item.price * item.quantity)}
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
                  <span>{formatBDT(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    <span>{formatBDT(SHIPPING_INSIDE_DHAKA)} - {formatBDT(SHIPPING_OUTSIDE_DHAKA)}</span>
                  )}
                </div>
                {totalPrice < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatBDT(FREE_SHIPPING_THRESHOLD - totalPrice)} more for free shipping. Final cost depends on your location.
                  </p>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-base font-bold text-foreground">
                    <span>Total</span>
                    <span>{formatBDT(totalPrice)} + shipping</span>
                  </div>
                </div>
              </div>
              <Button
                className="mt-6 w-full rounded-lg"
                size="lg"
                disabled={hasStockIssues}
                onClick={() => navigate("/checkout")}
              >
                {hasStockIssues ? "Fix Stock Issues to Checkout" : "Proceed to Checkout"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
