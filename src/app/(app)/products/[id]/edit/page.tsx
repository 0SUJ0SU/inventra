"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { ProductForm, type ProductFormData } from "../../_components/product-form"
import type { CategoryOption, ProductListItem } from "../../_components/product-types"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = String(params.id)

  const [product, setProduct] = useState<ProductListItem | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const [productRes, categoriesRes] = await Promise.all([
        fetch(`/api/products/${productId}`),
        fetch("/api/categories"),
      ])
      if (!productRes.ok) { setNotFound(true); setIsLoading(false); return }
      const productJson = await productRes.json()
      const categoriesJson = await categoriesRes.json()
      setProduct(productJson.product)
      setCategories(categoriesJson.categories ?? [])
      setIsLoading(false)
    }
    fetchData()
  }, [productId])

  const handleSubmit = async (data: ProductFormData) => {
    await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
    })
    router.push(`/products/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={24} strokeWidth={1.5} className="text-blue-primary/40 animate-spin" />
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/30">Loading product...</p>
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/40">Product not found</p>
        <button onClick={() => router.push("/products")} className="mt-4 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/60 hover:text-blue-primary flex items-center gap-2 transition-colors">
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to products
        </button>
      </div>
    )
  }

  return <ProductForm mode="edit" categories={categories} initialData={product} onSubmit={handleSubmit} />
}
