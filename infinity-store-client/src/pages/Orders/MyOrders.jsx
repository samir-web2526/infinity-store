import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Package, Truck, X } from "lucide-react";
import { getOrders, cancelOrder } from "@/services/order.api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-4 w-48" />
          <Skeleton className="mt-2 h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyOrders() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    },
  });

  const orders = data?.orders ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">My Orders</h1>
          <OrderSkeleton />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center gap-4 py-20">
            <Package className="size-16 text-muted-foreground/30" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">No orders yet</h1>
            <p className="text-sm text-muted-foreground">Start shopping to see your orders here.</p>
            <Button asChild className="mt-4 rounded-lg">
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
          My Orders ({orders.length})
        </h1>

        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-800"}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(order.createdAt)} &middot; {order.totalItems} items
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/orders/${order._id}`} className="flex items-center gap-1.5 whitespace-nowrap">
                      <Truck className="size-4" />
                      Track Order
                    </Link>
                  </Button>
                  {order.orderStatus === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={cancelMutation.isPending}
                      onClick={() => cancelMutation.mutate(order._id)}
                    >
                      <X className="size-4" data-icon="inline-start" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Items Preview */}
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {order.items?.slice(0, 4).map((item) => (
                  <img
                    key={item.productId}
                    src={item.thumbnail}
                    alt={item.title}
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                ))}
                {order.items?.length > 4 && (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">
                  {order.shippingAddress?.city}
                </span>
                <span className="text-sm font-bold text-foreground">
                  ${order.totalPrice?.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
