"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ProductForm, type ProductFormData } from "../_components/product-form"
import type { CategoryOption } from "../_components/product-types"

function toApiPayload(data: ProductFormData) {
  return {
    sku: data.sku.trim(),
    name: data.name.trim(),
    categoryId: data.categoryId,
    description: data.description.trim() || null,
    costPrice: parseFloat(data.costPrice),
    sellingPrice: parseFloat(data.sellingPrice),
    stock: data.isSerialTracked ? 0 : parseInt(data.stock),
    minStock: parseInt(data.minStock),
    unit: "pcs",
    image: null,
    isActive: data.isActive,
    isSerialTracked: data.isSerialTracked,
    warrantyMonths: parseInt(data.warrantyMonths) || null,
  }
}

export default function AddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true)
      const res = await fetch("/api/categories")
      const json = await res.json()
      setCategories(json.categories ?? [])
      setIsLoading(false)
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (data: ProductFormData) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiPayload(data)),
    })
    router.push("/products")
  }

  const handleSubmitAndNew = async (data: ProductFormData) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiPayload(data)),
    })
    setFormKey((prev) => prev + 1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={24} strokeWidth={1.5} className="text-blue-primary/40 animate-spin" />
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/30">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ProductForm
      key={formKey}
      mode="add"
      categories={categories}
      onSubmit={handleSubmit}
      onSubmitAndNew={handleSubmitAndNew}
    />
  )
}
