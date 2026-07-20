import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  Smartphone,
  Sparkles,
  Gem,
  Shirt,
  Home,
  Car,
  Dumbbell,
  ShoppingBasket,
  Laptop,
} from "lucide-react";

const ICON_MAP = {
  electronics: { icon: Laptop, color: "bg-blue-100 text-blue-600" },
  beauty: { icon: Sparkles, color: "bg-pink-100 text-pink-600" },
  accessories: { icon: Gem, color: "bg-yellow-100 text-yellow-600" },
  fashion: { icon: Shirt, color: "bg-indigo-100 text-indigo-600" },
  home: { icon: Home, color: "bg-orange-100 text-orange-600" },
  vehicles: { icon: Car, color: "bg-slate-100 text-slate-600" },
  sports: { icon: Dumbbell, color: "bg-lime-100 text-lime-600" },
  groceries: { icon: ShoppingBasket, color: "bg-green-100 text-green-600" },
};

const DEFAULT_STYLE = { icon: Smartphone, color: "bg-gray-100 text-gray-600" };

export default function CategoryCard({ category, index }) {
  const { icon: Icon, color } = ICON_MAP[category.slug] ?? DEFAULT_STYLE;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        }),
      }}
    >
      <Link
        to={`/products?category=${encodeURIComponent(category.slug)}`}
        className="group flex flex-col items-center gap-3"
      >
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-border bg-card transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md sm:h-32 sm:w-32">
          <div className={`flex h-16 w-16 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20 ${color}`}>
            <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.5} />
          </div>
        </div>
        <span className="text-center text-sm font-medium text-foreground">
          {category.name}
        </span>
      </Link>
    </motion.div>
  );
}
