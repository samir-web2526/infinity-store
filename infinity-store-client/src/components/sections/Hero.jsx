"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Zap,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/services/banner.api";
import { getFlashSaleProducts } from "@/services/product.api";
import { formatBDT } from "@/utils/currency";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const heroStyles = `
  .hero-swiper .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 1;
    transition: all 0.3s;
  }
  .hero-swiper .swiper-pagination-bullet-active {
    background: #fff;
    width: 22px;
    border-radius: 4px;
  }
`;

const QUICK_TAGS = [
  { label: "All Products", icon: Flame, href: "/products" },
  { label: "Flash Sale", icon: Zap, href: "/flash-sale", badge: "Limited" },
  { label: "New Arrivals", icon: Sparkles, href: "/#new-arrivals" },
  { label: "Best Selling", icon: Flame, href: "/#best-selling", badge: "Hot" },
  { label: "Free Shipping", icon: Truck, href: "/delivery-rules" },
];

export default function Hero({ initialData }) {
  const { data, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
    initialData,
  });

  const { data: flashData } = useQuery({
    queryKey: ["flash-sale"],
    queryFn: getFlashSaleProducts,
  });

  const banners = (data ?? []).filter(
    (b) => b.isActive && (b.image || b.images?.length > 0)
  );

  const flashProducts = flashData?.products ?? [];
  const topFlashProduct = flashProducts.length > 0 ? flashProducts[0] : null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  if (isLoading) {
    return (
      <section id="hero" className="relative overflow-hidden py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-80 items-center justify-center sm:h-96">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative overflow-hidden pt-4 pb-6">
      <style>{heroStyles}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Banner Slider & Integrated Search (75% / 8 columns) */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-3">
            
            {/* Banner Swiper Container */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-900/10 dark:border-emerald-800/20 shadow-md bg-card group">
              {banners.length > 0 ? (
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  speed={800}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  navigation={{
                    prevEl: ".hero-prev",
                    nextEl: ".hero-next",
                  }}
                  loop={banners.length > 1}
                  className="hero-swiper w-full h-auto aspect-[2.4/1] sm:aspect-[2.8/1] md:aspect-[3/1] lg:aspect-[2.7/1]"
                >
                  {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                      <Link href="/products" className="block size-full">
                        <div className="relative size-full">
                          <img
                            src={banner.image || banner.images?.[0]}
                            alt={banner.title || "Promotional Banner"}
                            className="size-full object-cover object-center"
                          />
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                  {banners.length > 1 && (
                    <>
                      <button className="hero-prev absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all hover:bg-black/70 sm:left-4 sm:size-11 cursor-pointer">
                        <ChevronLeft className="size-5" />
                      </button>
                      <button className="hero-next absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all hover:bg-black/70 sm:right-4 sm:size-11 cursor-pointer">
                        <ChevronRight className="size-5" />
                      </button>
                    </>
                  )}
                </Swiper>
              ) : (
                <div className="flex h-56 items-center justify-center bg-muted">
                  <p className="text-sm text-muted-foreground">Welcome to our store</p>
                </div>
              )}
            </div>

            {/* Quick Category Pills Bar */}
            <div className="rounded-2xl bg-card border border-emerald-100 dark:border-emerald-900/30 p-2.5 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
                <span className="shrink-0 font-bold text-muted-foreground text-[11px] uppercase tracking-wider pl-1">
                  Explore:
                </span>
                {QUICK_TAGS.map((tag, idx) => {
                  const Icon = tag.icon;
                  return (
                    <Link
                      key={idx}
                      href={tag.href}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-muted/80 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border/60 px-3 py-1 text-xs font-semibold text-foreground transition-all cursor-pointer"
                    >
                      <Icon className="size-3.5 text-primary" />
                      <span>{tag.label}</span>
                      {tag.badge && (
                        <span className="rounded-full bg-primary/20 text-primary px-1.5 py-0.2 text-[10px] font-bold">
                          {tag.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Side Promo Image Banners (25% / 4 columns) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-between">
            
            {/* Card 1: Free Express Delivery Image Banner */}
            <Link
              href="/delivery-rules"
              className="relative flex-1 overflow-hidden rounded-2xl shadow-md border border-emerald-900/20 group aspect-[1.8/1] sm:aspect-[2.2/1] lg:aspect-auto min-h-[140px]"
            >
              <img
                src="/images/promo_delivery.jpg"
                alt="Free Express Delivery On Orders Over ৳1,000"
                className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 p-3.5 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                    🚚 Free Delivery
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 group-hover:underline">
                    Policy <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                    Free Express Delivery
                  </h4>
                  <p className="text-[11px] font-bold text-emerald-300 mt-0.5">
                    On orders over ৳1,000
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Today's Flash Deal Banner / Mini Slider for Flash Sale Products */}
            {flashProducts.length > 0 ? (
              <div className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF6F0] via-[#FFF0E6] to-[#FFF6F0] dark:from-[#23120A] dark:via-[#1A0A04] dark:to-[#23120A] p-3.5 shadow-md border border-orange-200/80 dark:border-orange-900/40 flex flex-col justify-between group min-h-[145px]">
                <div className="flex items-center justify-between mb-1.5 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 text-slate-950 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-xs animate-pulse">
                    <Zap className="size-3 fill-current" /> Flash Deals ({flashProducts.length})
                  </span>
                  <Link
                    href="/flash-sale"
                    className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    View All →
                  </Link>
                </div>

                <Swiper
                  modules={[Autoplay]}
                  autoplay={{ delay: 3200, disableOnInteraction: false }}
                  loop={flashProducts.length > 1}
                  className="w-full"
                >
                  {flashProducts.map((prod) => (
                    <SwiperSlide key={prod._id}>
                      <Link
                        href={`/product/${prod._id}`}
                        className="flex items-center gap-3 my-1 group/prod cursor-pointer"
                      >
                        <div className="size-16 shrink-0 rounded-xl border border-orange-200/60 dark:border-orange-900/30 overflow-hidden bg-white">
                          <img
                            src={prod.images?.[0] || prod.image}
                            alt={prod.title || prod.name}
                            className="size-full object-cover group-hover/prod:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-foreground truncate group-hover/prod:text-primary transition-colors">
                              {prod.title || prod.name}
                            </h4>
                            {prod.discountPercentage > 0 && (
                              <span className="shrink-0 rounded-full bg-red-600 text-white px-1.5 py-0.2 text-[9px] font-extrabold">
                                -{prod.discountPercentage}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-sm font-extrabold text-red-600 dark:text-red-400">
                              {formatBDT(
                                prod.discountPercentage > 0
                                  ? prod.price * (1 - prod.discountPercentage / 100)
                                  : prod.price
                              )}
                            </span>
                            {prod.discountPercentage > 0 && (
                              <span className="text-[10px] text-muted-foreground line-through">
                                {formatBDT(prod.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="flex items-center justify-between pt-1.5 border-t border-orange-200/50 dark:border-orange-900/30 text-[10px] font-semibold text-muted-foreground">
                  <span>Limited Stock Offer</span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold">Auto Sliding 🔥</span>
                </div>
              </div>
            ) : (
              <Link
                href="/flash-sale"
                className="relative flex-1 overflow-hidden rounded-2xl shadow-md border border-amber-900/20 group aspect-[1.8/1] sm:aspect-[2.2/1] lg:aspect-auto min-h-[140px]"
              >
                <img
                  src="/images/promo_flash.jpg"
                  alt="Today's Flash Sale 50% Off"
                  className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-4 flex flex-col justify-end text-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-400 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-xs">
                      ⚡ 50% OFF
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 group-hover:underline">
                      Shop Now <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
