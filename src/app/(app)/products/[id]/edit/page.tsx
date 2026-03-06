"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PRODUCTS } from "@/lib/demo-data";
import { ProductForm, type ProductFormData } from "@/components/app/products/product-form";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const product = PRODUCTS.find((product) => product.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/40">
          Product not found
        </p>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/60 hover:text-blue-primary flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Back to products
        </button>
      </div>
    );
  }

  const handleSubmit = (_data: ProductFormData) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <ProductForm
      mode="edit"
      initialData={product}
      onSubmit={handleSubmit}
    />
  );
}
