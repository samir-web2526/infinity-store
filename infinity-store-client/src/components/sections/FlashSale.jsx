"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { getFlashSaleProducts } from "@/services/product.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "./CountdownTimer";
import FlashSaleProductCard from "./FlashSaleProductCard";

function FlashSaleSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

import { Helmet } from "react-helmet-async";
import useSettings from "@/hooks/useSettings";
import usePageTitle from "@/hooks/usePageTitle";

export default function FlashSale({ initialData }) {
  const { siteName } = useSettings();
  usePageTitle("Flash Sale");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["flash-sale"],
    queryFn: getFlashSaleProducts,
    initialData: (initialData?.products?.length > 0) ? initialData : undefined,
  });

  const products = data?.products ?? [];
  const maxStock = data?.maxStock ?? 1;
  const showSkeleton = isLoading || (isFetching && products.length === 0);

  return (
    <section id="flash-sale" className="relative overflow-hidden bg-gradient-to-r from-[#002B1D] via-[#004A32] to-[#002418] text-white py-16 sm:py-24 shadow-2xl border-y border-emerald-500/30">
      <Helmet>
        <title>{siteName ? `Flash Sale | ${siteName}` : "Flash Sale - Online Shopping Mall"}</title>
      </Helmet>
      {/* Decorative ambient lighting */}
      <div className="absolute -top-24 -left-24 size-96 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-start gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                ⚡ Flash Sale
              </h2>
              <Badge className="animate-pulse bg-amber-400 text-slate-950 font-bold text-xs border-0 shadow-md">
                <Zap className="size-3.5 fill-current" data-icon="inline-start" />
                Limited Time Offer
              </Badge>
            </div>
            <p className="max-w-md text-sm text-emerald-100/80 sm:text-base">
              Grab the biggest discounts before the offer ends.
            </p>
          </div>

          <CountdownTimer />
        </motion.div>

        {showSkeleton ? (
          <FlashSaleSkeleton />
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No products on sale right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <FlashSaleProductCard
                key={product._id}
                product={product}
                index={i}
                isFeatured={i === 0}
                maxStock={maxStock}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
