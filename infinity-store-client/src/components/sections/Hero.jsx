import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.15_270/10%),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">

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
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
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
              className="mx-auto mt-6 max-w-lg text-base text-muted-foreground sm:text-lg lg:mx-0 lg:max-w-xl"
            >
              Discover premium products at unbeatable prices with fast delivery,
              secure payment, and an exceptional shopping experience.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="w-full rounded-full px-8 sm:w-auto"
                render={<Link to="/products" />}
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
              className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground lg:justify-start"
            >
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">10k+</span>
                <span>Products</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">50k+</span>
                <span>Happy Customers</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-foreground">99%</span>
                <span>Satisfaction</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="relative flex-1"
          >
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-muted to-muted/50 shadow-2xl lg:max-w-lg">
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
              <div className="absolute -right-6 -top-6 size-32 rounded-full bg-primary/5 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 size-40 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="absolute -bottom-4 -left-4 rounded-2xl border border-border bg-card p-3 shadow-lg sm:-bottom-6 sm:-left-6">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-green-500/10">
                  <svg className="size-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Free Shipping</p>
                  <p className="text-[10px] text-muted-foreground">Orders over $50</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 -top-2 rounded-2xl border border-border bg-card p-3 shadow-lg sm:-right-4 sm:-top-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10">
                  <svg className="size-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Top Rated</p>
                  <p className="text-[10px] text-muted-foreground">4.9/5 Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
