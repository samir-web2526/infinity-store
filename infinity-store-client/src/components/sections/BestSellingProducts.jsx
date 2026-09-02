"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getBestSellingProducts } from "@/services/product.api";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./ProductCard";

function BestSellingSkeleton() {
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
            <Skeleton className="h-3 w-16" />
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

export default function BestSellingProducts({ initialData }) {
  const { siteName } = useSettings();
  usePageTitle("Best Selling Products");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["best-selling-products"],
    queryFn: getBestSellingProducts,
    initialData: (initialData?.products?.length > 0) ? initialData : undefined,
  });

  const bestSellingProducts = data?.products ?? [];
  const showSkeleton = isLoading || (isFetching && bestSellingProducts.length === 0);

  return (
    <section id="best-selling" className="relative bg-gradient-to-b from-[#EEF2F7] via-[#DFE6F2] to-[#EEF2F7] dark:from-[#0E131F] dark:via-[#141C2E] dark:to-[#0E131F] py-16 sm:py-24 border-y border-slate-300/70 dark:border-indigo-900/40 shadow-inner">
      <Helmet>
        <title>{siteName ? `Best Selling Products | ${siteName}` : "Best Selling Products - Online Shopping Mall"}</title>
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:mb-12"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 border border-indigo-500/20 mb-2">
            🔥 Customer Favorites
          </span>
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Best Selling Products
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            Our most popular products loved by customers.
          </p>
        </motion.div>

        {showSkeleton ? (
          <BestSellingSkeleton />
        ) : bestSellingProducts.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellingProducts.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                badge={null}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
