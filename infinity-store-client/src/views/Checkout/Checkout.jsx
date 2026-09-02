"use client";

import { useRouter } from 'next/navigation';

import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "@/utils/toast";
import { ArrowLeft, Check } from "lucide-react";
import { createGuestOrder, sendOrderInvoice } from "@/services/order.api";
import useCart from "@/hooks/useCart";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBDT } from "@/utils/currency";
import { Helmet } from "react-helmet-async";
import useSettings from "@/hooks/useSettings";
import { getLocalCart, clearLocalCart } from "@/utils/localCart";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(11, "Phone must be at least 11 characters"),
  email: z.string().min(1, "Email address is required").email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  deliveryArea: z.enum(["inside_dhaka", "outside_dhaka"], { required_error: "Please select a delivery area" }),
});

function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
      <div className="lg:col-span-2">
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  );
}

import usePageTitle from "@/hooks/usePageTitle";

export default function Checkout({ children }) {
  const { siteName } = useSettings();
  usePageTitle("Checkout");
  const router = useRouter();
  const { refetchCartCount } = useCart();
  const [placedOrder, setPlacedOrder] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      deliveryArea: "inside_dhaka",
    },
  });

  const { data: cart, isLoading } = useQuery({
    queryKey: ["localCart"],
    queryFn: () => {
      const items = getLocalCart();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items, totalItems, totalPrice };
    },
  });

  const items = cart?.items ?? [];
  const totalItems = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price * (item.quantity ?? 1)),
    0
  );

  const FREE_SHIPPING_THRESHOLD = 1000;
  const SHIPPING_INSIDE_DHAKA = 60;
  const SHIPPING_OUTSIDE_DHAKA = 120;

  const watchedDeliveryArea = useWatch({ name: "deliveryArea", control });
  const isInsideDhaka = watchedDeliveryArea === "inside_dhaka";
  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : (isInsideDhaka ? SHIPPING_INSIDE_DHAKA : SHIPPING_OUTSIDE_DHAKA);
  const total = totalPrice + shipping;

  const orderMutation = useMutation({
    mutationFn: createGuestOrder,
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      clearLocalCart();
      refetchCartCount(0);
      if (data?.insertedId) {
        sendOrderInvoice(data.insertedId).catch(() => { });
      }
      setPlacedOrder(data);
    },
    onError: (err) => {
      const data = err?.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        data.errors.forEach((e) => {
          const field = e.path?.[e.path.length - 1];
          if (field) setError(field, { message: e.message });
        });
        toast.error("Please fix the errors below");
      } else {
        toast.error(data?.message || data?.error || "Failed to place order");
      }
    },
  });

  const onSubmit = (data) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    orderMutation.mutate({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        colorImage: item.colorImage || "",
      })),
      shippingAddress: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
      },
      deliveryArea: data.deliveryArea,
      paymentMethod: "Cash on Delivery",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <Helmet><title>{`Checkout | ${siteName}`}</title></Helmet>
        <div className="mx-auto max-w-5xl">
          <CheckoutSkeleton />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <Helmet><title>{`Checkout | ${siteName}`}</title></Helmet>
        <div className="mx-auto max-w-5xl text-center py-20">
          <p className="text-sm text-muted-foreground">Your cart is empty. Add some products first.</p>
          <Button className="mt-4 rounded-lg" onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-3 py-6 sm:px-6 lg:px-8 overflow-x-hidden w-full max-w-full">
      <Helmet><title>{`Checkout | ${siteName}`}</title></Helmet>
      <div className="mx-auto max-w-5xl w-full">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
          >
            Checkout
          </motion.h1>
          <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.push("/cart")}>
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Back to Cart
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full overflow-hidden">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-5 w-full max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6 lg:col-span-3 w-full min-w-0"
            >
              <div className="rounded-xl border border-border bg-card p-3.5 sm:p-6 shadow-sm overflow-hidden w-full max-w-full">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Shipping Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 w-full">
                  <div className="sm:col-span-2 w-full">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Full Name *
                    </label>
                    <Input
                      {...register("fullName")}
                      placeholder="John Doe"
                      className={errors.fullName ? "border-gray-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-gray-600">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 w-full">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Phone *
                    </label>
                    <Input
                      {...register("phone")}
                      placeholder="+880 1XXXXXXXXX"
                      className={errors.phone ? "border-gray-500" : ""}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-gray-600">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 w-full">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Email (for invoice) *
                    </label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={errors.email ? "border-gray-500" : ""}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-gray-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 w-full">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Address *
                    </label>
                    <Input
                      {...register("address")}
                      placeholder="123 Main Street, Apt 4B"
                      className={errors.address ? "border-gray-500" : ""}
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-gray-600">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 w-full">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      City *
                    </label>
                    <Input
                      {...register("city")}
                      placeholder="Dhaka"
                      className={errors.city ? "border-gray-500" : ""}
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-gray-600">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 w-full">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Delivery Area *
                    </label>
                    <select
                      {...register("deliveryArea")}
                      className="box-border flex h-10 w-full max-w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="inside_dhaka">inside Dhaka - ৳60</option>
                      <option value="outside_dhaka">outside Dhaka - ৳120</option>
                    </select>
                    {errors.deliveryArea && (
                      <p className="mt-1 text-xs text-gray-600">{errors.deliveryArea.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-3.5 sm:p-6 shadow-sm overflow-hidden w-full max-w-full">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Payment Method
                </h2>
                <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-3.5 sm:p-4 w-full">
                  <div className="size-4 shrink-0 rounded-full border-4 border-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground truncate">Pay when you receive</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 w-full min-w-0"
            >
              <div className="sticky top-24 rounded-xl border border-border bg-card p-3.5 sm:p-6 shadow-sm overflow-hidden w-full max-w-full">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Order Summary</h2>

                <div className="mb-4 max-h-60 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="size-10 sm:size-12 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs sm:text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs sm:text-sm font-medium text-foreground">
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="shrink-0 font-medium text-foreground">{formatBDT(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Shipping {isInsideDhaka ? "(Dhaka)" : "(Outside Dhaka)"}</span>
                    {isFreeShipping ? (
                      <span className="text-foreground font-medium">Free</span>
                    ) : (
                      <span className="shrink-0 text-xs font-medium text-foreground">{formatBDT(shipping)}</span>
                    )}
                  </div>
                  {!isFreeShipping && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatBDT(FREE_SHIPPING_THRESHOLD - totalPrice)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-border pt-3">
                    <div className="flex items-baseline justify-between text-base font-bold text-foreground">
                      <span>Total</span>
                      <span className="shrink-0 font-bold">{formatBDT(total)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full rounded-lg"
                  size="lg"
                  disabled={orderMutation.isPending}
                >
                  {orderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {placedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md rounded-3xl bg-background/90 dark:bg-card/90 backdrop-blur-xl border border-white/20 dark:border-white/10 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              {/* Background ambient glow blurs */}
              <div className="absolute -top-16 -left-16 size-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 size-56 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

              {/* Icon Container */}
              <div className="relative flex size-24 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 z-10 mb-4 shadow-inner">
                <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <Check className="size-9" strokeWidth={3} />
                </div>
                
                {/* Decorative floating dots */}
                <div className="absolute -top-2 -left-2 size-3 rounded-full bg-emerald-400 animate-pulse" />
                <div className="absolute -top-1 -right-3 size-2 rounded-full bg-teal-300" />
                <div className="absolute bottom-2 -left-4 size-2.5 rounded-full bg-emerald-300" />
                <div className="absolute -bottom-2 right-2 size-3 rounded-full bg-teal-400" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-2 mb-2">
                Your order has been accepted!
              </h2>
              
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-muted/80 border border-border/60 text-xs font-medium text-muted-foreground mb-8">
                <span>Transaction ID:</span>
                <span className="font-mono font-semibold text-foreground">
                  {placedOrder.insertedId || placedOrder._id}
                </span>
              </div>

              <button
                onClick={() => {
                  setPlacedOrder(null);
                  router.push("/");
                }}
                className="w-full max-w-[280px] rounded-full bg-primary py-3.5 px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 focus:outline-none cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => {
                  const id = placedOrder.insertedId || placedOrder._id;
                  setPlacedOrder(null);
                  router.push(`/orders/${id}`);
                }}
                className="mt-4 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors hover:underline cursor-pointer"
              >
                View Order Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
