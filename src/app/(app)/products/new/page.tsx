// src/app/(app)/products/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ProductForm, type ProductFormData } from "@/components/app/products/product-form";

export default function AddProductPage() {
  const router = useRouter();

  const handleSubmit = (data: ProductFormData) => {
    // Demo: just log and redirect
    console.log("[Inventra] Product created:", data);
    router.push("/products");
  };

  const handleSubmitAndNew = (data: ProductFormData) => {
    console.log("[Inventra] Product created:", data);
    // Reload the page to reset form
    window.location.href = "/products/new";
  };

  return (
    <ProductForm
      mode="add"
      onSubmit={handleSubmit}
      onSubmitAndNew={handleSubmitAndNew}
    />
  );
}
