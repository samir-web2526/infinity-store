import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { getProductById, updateProduct, deleteProduct } from "@/services/product.api";
import { getCategories } from "@/services/category.api";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/skeleton";

const updateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  category: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0").optional(),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  stock: z.coerce.number().min(0).optional(),
  tags: z.string().optional(),
  brand: z.string().optional(),
  weight: z.coerce.number().optional(),
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  returnPolicy: z.string().optional(),
  minimumOrderQuantity: z.coerce.number().min(1).optional(),
  thumbnail: z.string().optional(),
  images: z.string().optional(),
});

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

export default function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesData ?? [];
  const categorySlugs = getAllCategorySlugs(categories);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(updateSchema),
    values: product
      ? {
          title: product.title ?? "",
          description: product.description ?? "",
          category: product.category ?? "",
          price: product.price ?? 0,
          discountPercentage: product.discountPercentage ?? 0,
          stock: product.stock ?? 0,
          tags: product.tags?.join(", ") ?? "",
          brand: product.brand ?? "",
          weight: product.weight ?? "",
          warrantyInformation: product.warrantyInformation ?? "",
          shippingInformation: product.shippingInformation ?? "",
          returnPolicy: product.returnPolicy ?? "",
          minimumOrderQuantity: product.minimumOrderQuantity ?? 1,
          thumbnail: product.thumbnail ?? "",
          images: product.images?.join(", ") ?? "",
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => updateProduct(id, payload),
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries({ queryKey: ["admin-product", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
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
        toast.error(data?.message || data?.error || "Failed to update product");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/dashboard/products");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete product");
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      discountPercentage: formData.discountPercentage,
      stock: formData.stock,
      brand: formData.brand,
      weight: formData.weight || undefined,
      warrantyInformation: formData.warrantyInformation,
      shippingInformation: formData.shippingInformation,
      returnPolicy: formData.returnPolicy,
      minimumOrderQuantity: formData.minimumOrderQuantity || undefined,
      thumbnail: formData.thumbnail,
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      images: formData.images
        ? formData.images.split(",").map((u) => u.trim()).filter(Boolean)
        : [],
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Helmet>
          <title>Admin Product Details | Infinity Store</title>
        </Helmet>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <Helmet>
          <title>Admin Product Details | Infinity Store</title>
        </Helmet>
        <p className="text-sm text-muted-foreground">Product not found.</p>
        <Button className="mt-4 rounded-lg" onClick={() => navigate("/dashboard/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Admin Product Details | Infinity Store</title>
      </Helmet>
      <Button
        variant="ghost"
        size="sm"
        className="mb-2"
        onClick={() => navigate("/dashboard/products")}
      >
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Back to Products
      </Button>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <img
              src={product.thumbnail || product.images?.[0] || ""}
              alt={product.title}
              className="size-16 shrink-0 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {product.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{product.brand} &middot; {product.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!showDeleteConfirm ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="size-4" data-icon="inline-start" />
                Delete
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <span className="text-sm text-red-700">Delete this product?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(product._id)}
                >
                  {deleteMutation.isPending ? "..." : "Yes"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  No
                </Button>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Edit Product</h2>
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              className="rounded-lg"
            >
              <Save className="size-4" data-icon="inline-start" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
                <Input {...register("title")} placeholder="Product title" className={errors.title ? "border-red-500" : ""} />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Product description"
                  className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Category</label>
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
                <label className="mb-1 block text-sm font-medium text-foreground">Price</label>
                <Input {...register("price")} type="number" step="0.01" placeholder="0.00" className={errors.price ? "border-red-500" : ""} />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Discount %</label>
                <Input {...register("discountPercentage")} type="number" step="0.1" min="0" max="100" placeholder="0" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Stock</label>
                <Input {...register("stock")} type="number" min="0" placeholder="0" className={errors.stock ? "border-red-500" : ""} />
                {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Weight (g)</label>
                <Input {...register("weight")} type="number" step="0.1" placeholder="0" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Min Order Qty</label>
                <Input {...register("minimumOrderQuantity")} type="number" min="1" placeholder="1" />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Tags (comma separated)</label>
                <Input {...register("tags")} placeholder="e.g. wireless, bluetooth" />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Thumbnail URL</label>
                <Input {...register("thumbnail")} placeholder="https://..." />
              </div>

              {product.thumbnail && (
                <div className="sm:col-span-2">
                  <img
                    src={product.thumbnail}
                    alt="Thumbnail preview"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-foreground">Images (comma separated URLs)</label>
                <Input {...register("images")} placeholder="https://..., https://..." />
              </div>

              {product.images?.length > 0 && (
                <div className="flex gap-2 sm:col-span-2">
                  {product.images.slice(0, 4).map((img, i) => (
                    <img key={i} src={img} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ))}
                  {product.images.length > 4 && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                      +{product.images.length - 4}
                    </div>
                  )}
                </div>
              )}

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
          </div>
        </form>
      </motion.div>
    </div>
  );
}
