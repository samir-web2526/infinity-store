import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { getProducts } from "@/services/product.api";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const { data } = useQuery({
    queryKey: ["hero-products"],
    queryFn: () => getProducts({ limit: 50, featured: true }),
  });

  const { data: allData } = useQuery({
    queryKey: ["hero-stats"],
    queryFn: () => getProducts({ limit: 1000 }),
  });

  const products = (data?.products ?? []).filter((p) => p.thumbnail || p.images?.length);

  const stats = useMemo(() => {
    const allProducts = allData?.products ?? [];
    const totalProducts = allProducts.length;

    let totalReviews = 0;
    let totalRating = 0;
    for (const product of allProducts) {
      for (const review of product.reviews ?? []) {
        totalReviews++;
        totalRating += review.rating ?? 0;
      }
    }

    const avgRating = totalReviews > 0
      ? (totalRating / totalReviews).toFixed(1)
      : "4.9";

    const satisfaction = totalReviews > 0
      ? Math.round((totalRating / totalReviews / 5) * 100)
      : 98;

    return { totalProducts, totalReviews, satisfaction, avgRating };
  }, [allData]);

  const next = useCallback(() => {
    if (products.length <= 1) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prev = useCallback(() => {
    if (products.length <= 1) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next, products.length]);

  const product = products[current];

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.15_270/10%),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-36">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-16">

          <div className="flex-1 text-center lg:text-left">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <Sparkles className="size-3" />
              New Collection 2025
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-6xl"
            >
              Shop Smart,
              <br />
              <span className="bg-gradient-to-r from-primary/80 via-muted-foreground to-foreground bg-clip-text text-transparent">
                Live Better
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-base lg:mx-0 lg:mt-6 lg:max-w-xl lg:text-lg"
            >
              Discover premium products at unbeatable prices with fast delivery,
              secure payment, and an exceptional shopping experience.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:mt-8 lg:justify-start"
            >
              <Button
                size="lg"
                className="w-full rounded-full px-8 sm:w-auto"
                onClick={() => {
                  document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Shop Now
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full px-8 sm:w-auto"
                render={<Link to="/products" />}
              >
                Explore Products
              </Button>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground sm:gap-8 lg:mt-10 lg:justify-start"
            >
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-lg font-semibold text-foreground">
                  {stats.totalProducts > 0 ? `${stats.totalProducts}+` : "10k+"}
                </span>
                <span className="text-xs sm:text-sm">Products</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-lg font-semibold text-foreground">
                  {stats.totalReviews > 0 ? `${stats.totalReviews}+` : "50k+"}
                </span>
                <span className="text-xs sm:text-sm">Happy Customers</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-lg font-semibold text-foreground">
                  {stats.satisfaction}%
                </span>
                <span className="text-xs sm:text-sm">Satisfaction</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm flex-shrink-0 lg:w-auto"
          >
            <div className="relative mx-auto aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-muted to-muted/50 shadow-2xl">
              {products.length > 0 && product ? (
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={product._id + current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={product.thumbnail || product.images?.[0]}
                        alt={product.title}
                        className="size-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
                        <p className="text-xs font-semibold text-white sm:text-sm">{product.title}</p>
                        {product.price != null && (
                          <p className="mt-1 text-base font-bold text-white sm:text-lg">
                            ৳{product.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground/40">
                    <svg
                      className="size-20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Premium Collection</span>
                  </div>
                </div>
              )}

              {products.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </>
              )}

              {products.length > 1 && (
                <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                  {products.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > current ? 1 : -1);
                        setCurrent(i);
                      }}
                      className={`size-2 rounded-full transition-all ${
                        i === current
                          ? "w-5 bg-white"
                          : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="absolute -right-6 -top-6 size-32 rounded-full bg-primary/5 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 size-40 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="absolute -bottom-3 left-2 rounded-2xl border border-border bg-card p-2 shadow-lg sm:-bottom-4 sm:-left-4 sm:p-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-full bg-green-500/10 sm:size-8">
                  <svg className="size-3.5 text-green-600 sm:size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-foreground sm:text-xs">Free Shipping</p>
                  <p className="text-[9px] text-muted-foreground sm:text-[10px]">Orders over ৳6,000</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 -top-2 rounded-2xl border border-border bg-card p-2 shadow-lg sm:-right-3 sm:-top-3 sm:p-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-full bg-amber-500/10 sm:size-8">
                  <svg className="size-3.5 text-amber-500 sm:size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-foreground sm:text-xs">Top Rated</p>
                  <p className="text-[9px] text-muted-foreground sm:text-[10px]">{stats.avgRating}/5 Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
