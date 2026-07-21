import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Eye, Pencil, X, Package } from "lucide-react";
import { Link } from "react-router";
import { getProducts, createProduct } from "@/services/product.api";
import { formatBDT } from "@/utils/currency";
import { getCategories } from "@/services/category.api";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  discountPercentage: z.coerce.number().min(0).max(100).optional().default(0),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  brand: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  warrantyInformation: z.string().optional().default(""),
  shippingInformation: z.string().optional().default(""),
  returnPolicy: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  images: z.string().optional().default(""),
});

function ProductSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}

function getAllCategorySlugs(categories) {
  const slugs = [];
  for (const parent of categories) {
    for (const child of parent.children ?? []) {
      for (const s of child.categories ?? []) {
        slugs.push(s);
      }
    }
  }
  return [...new Set(slugs)];
}

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts({ limit: 1000 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesData ?? [];
  const categorySlugs = getAllCategorySlugs(categories);

  const products = data?.products ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      discountPercentage: 0,
      stock: 0,
      brand: "",
      tags: "",
      warrantyInformation: "",
      shippingInformation: "",
      returnPolicy: "",
      thumbnail: "",
      images: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setShowForm(false);
      reset();
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
        toast.error(data?.message || data?.error || "Failed to create product");
      }
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      images: formData.images ? formData.images.split(",").map((u) => u.trim()).filter(Boolean) : [],
      thumbnail: formData.thumbnail || (formData.images ? formData.images.split(",")[0]?.trim() : ""),
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Products ({products.length})</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="size-4" data-icon="inline-start" />
          Add Product
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
              >
                <X className="size-4" />
              </button>

              <h2 className="mb-6 text-lg font-semibold text-foreground">Add New Product</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground">Title *</label>
                    <Input {...register("title")} placeholder="Product title" className={errors.title ? "border-red-500" : ""} />
                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground">Description *</label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      placeholder="Product description"
                      className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Category *</label>
                    <select
                      {...register("category")}
                      className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring ${errors.category ? "border-red-500" : ""}`}
                    >
                      <option value="">Select category</option>
                      {categorySlugs.map((slug) => (
                        <option key={slug} value={slug}>{slug}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Brand</label>
                    <Input {...register("brand")} placeholder="Brand name" />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Price *</label>
                    <Input {...register("price")} type="number" step="0.01" placeholder="0.00" className={errors.price ? "border-red-500" : ""} />
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Discount %</label>
                    <Input {...register("discountPercentage")} type="number" step="0.1" min="0" max="100" placeholder="0" />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Stock *</label>
                    <Input {...register("stock")} type="number" min="0" placeholder="0" className={errors.stock ? "border-red-500" : ""} />
                    {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground">Tags (comma separated)</label>
                    <Input {...register("tags")} placeholder="e.g. wireless, bluetooth, headphones" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground">Thumbnail URL</label>
                    <Input {...register("thumbnail")} placeholder="https://..." />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground">Images (comma separated URLs)</label>
                    <Input {...register("images")} placeholder="https://..., https://..." />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Warranty</label>
                    <Input {...register("warrantyInformation")} placeholder="e.g. 1 year warranty" />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">Shipping</label>
                    <Input {...register("shippingInformation")} placeholder="e.g. Free shipping" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-foreground">Return Policy</label>
                    <Input {...register("returnPolicy")} placeholder="e.g. 30 day returns" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={createMutation.isPending} className="rounded-lg">
                    {createMutation.isPending ? "Creating..." : "Create Product"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card shadow-sm"
      >
        {isLoading ? (
          <div className="p-5"><ProductSkeleton /></div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">No products yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Discount</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail || product.images?.[0] || ""}
                          alt={product.title}
                          className="size-10 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{product.title}</p>
                          {product.brand && <p className="truncate text-[11px] text-muted-foreground">{product.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary" className="text-[11px]">{product.category}</Badge>
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{formatBDT(product.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${product.stock <= 10 ? "text-red-600" : "text-foreground"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {product.discountPercentage > 0 ? (
                        <Badge variant="destructive" className="text-[11px]">-{product.discountPercentage}%</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/dashboard/products/${product._id}`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
