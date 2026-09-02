"use client";

import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description:
      "Enjoy fast and free shipping on orders over ৳1,000 across Bangladesh.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description:
      "Your payments are protected with trusted and secure payment methods.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description:
      "Simple and hassle-free return policy for a worry-free shopping experience.",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description:
      "Our customer support team is always available to help you anytime.",
  },
];

export default function WhyChooseUs({ children }) {
  return (
    <section className="relative bg-[#F5ECE0] dark:bg-[#1A130A] py-16 sm:py-24 border-y border-[#E6D7C3] dark:border-[#3A2B14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:mb-12"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 border border-amber-500/20 mb-2">
            🛡️ Our Promise
          </span>
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            Experience secure shopping, fast delivery, and exceptional customer
            service with every order.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
