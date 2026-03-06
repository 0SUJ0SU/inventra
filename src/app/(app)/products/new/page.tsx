"use client";

import { useRouter } from "next/navigation";
import { ProductForm, type ProductFormData } from "@/components/app/products/product-form";

export default function AddProductPage() {
  const router = useRouter();

  const handleSubmit = (_data: ProductFormData) => {
    router.push("/products");
  };

  const handleSubmitAndNew = (_data: ProductFormData) => {
    router.push("/products/new");
  };

  return (
    <ProductForm
      mode="add"
      onSubmit={handleSubmit}
      onSubmitAndNew={handleSubmitAndNew}
    />
  );
}
