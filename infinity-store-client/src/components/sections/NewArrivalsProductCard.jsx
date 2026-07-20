import { Link } from "react-router";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/useAddToCart";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function isNew(dateStr, days = 7) {
  if (!dateStr) return false;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
}

function StockBar({ stock, maxStock }) {
  if (stock === 0) return null;
  const ref = maxStock || 100;
  const percentage = Math.min((stock / ref) * 100, 100);
  const isLow = percentage <= 25;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-[11px] ${stock <= 5 ? "font-medium text-red-500" : "text-muted-foreground"}`}>
          {stock <= 5 ? `${stock} left` : `${stock} in stock`}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLow ? "bg-red-500" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function NewArrivalsProductCard({ product, index }) {
  const { addToCart } = useAddToCart();
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;
  const recent = isNew(product.meta?.createdAt);
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        }),
      }}
    >
      <Link to={`/products/${product._id}`} className="group block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.thumbnail || product.images?.[0] || ""}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
              {recent && (
                <Badge className="bg-emerald-500 text-white text-[11px] font-semibold">
                  NEW
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="destructive" className="text-[11px] font-semibold">
                  -{Math.round(product.discountPercentage)}%
                </Badge>
              )}
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute right-3 top-3 z-10">
                <Badge variant="secondary" className="text-[11px] font-semibold">
                  Only {product.stock} left
                </Badge>
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <Badge variant="destructive" className="text-xs font-semibold">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            {product.brand && (
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {product.brand}
              </p>
            )}

            <h3 className="line-clamp-2 text-sm font-semibold text-foreground sm:text-base">
              {product.title}
            </h3>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3.5 ${
                      i < Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.rating?.toFixed(1)})
              </span>
            </div>

            <div className="mt-auto flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                ${hasDiscount ? discountedPrice : product.price?.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price?.toFixed(2)}
                </span>
              )}
            </div>

            {product.meta?.createdAt && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                Added {formatDate(product.meta.createdAt)}
              </div>
            )}

            <StockBar stock={product.stock} maxStock={100} />
          </div>

          <div className="p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-lg"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                addToCart(product._id);
              }}
            >
              <ShoppingCart className="size-4" data-icon="inline-start" />
              {isOutOfStock ? "Unavailable" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
