"use client"

import { ShieldCheck } from "lucide-react"
import { FieldLabel, TextInput, FormCard } from "./form-primitives"

interface PricingStockProps {
  costPrice: string
  sellingPrice: string
  stock: string
  minStock: string
  warrantyMonths: string
  isSerialTracked: boolean
  errors: Record<string, string>
  onUpdate: (key: string, value: string) => void
}

export function ProductFormPricing({
  costPrice, sellingPrice, stock, minStock, warrantyMonths,
  isSerialTracked, errors, onUpdate,
}: PricingStockProps) {
  return (
    <FormCard title="Pricing & Stock" marker="/002" className="flex-1">
      <div className="space-y-4">
        <div>
          <FieldLabel label="Cost Price ($)" required error={errors.costPrice} />
          <TextInput value={costPrice} onChange={(v) => onUpdate("costPrice", v)} placeholder="0.00" type="number" error={!!errors.costPrice} />
        </div>
        <div>
          <FieldLabel label="Selling Price ($)" required error={errors.sellingPrice} />
          <TextInput value={sellingPrice} onChange={(v) => onUpdate("sellingPrice", v)} placeholder="0.00" type="number" error={!!errors.sellingPrice} />
        </div>
        <div className="h-px bg-blue-primary/6" />
        <div>
          <FieldLabel label="Stock Quantity" required={!isSerialTracked} error={errors.stock} />
          <TextInput value={stock} onChange={(v) => onUpdate("stock", v)} placeholder="0" type="number" disabled={isSerialTracked} error={!!errors.stock} />
          {isSerialTracked && (
            <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 mt-1">Managed by serial items</p>
          )}
        </div>
        <div>
          <FieldLabel label="Min Stock" required error={errors.minStock} />
          <TextInput value={minStock} onChange={(v) => onUpdate("minStock", v)} placeholder="5" type="number" error={!!errors.minStock} />
        </div>
        <div className="h-px bg-blue-primary/6" />
        <div>
          <FieldLabel label="Warranty (Months)" error={errors.warrantyMonths} />
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} strokeWidth={1.5} className="text-blue-primary/25 shrink-0" />
            <TextInput value={warrantyMonths} onChange={(v) => onUpdate("warrantyMonths", v)} placeholder={isSerialTracked ? "12" : "0"} type="number" error={!!errors.warrantyMonths} />
          </div>
          <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 mt-1">
            {isSerialTracked ? "Applied from date of sale" : "Set 0 for no warranty"}
          </p>
        </div>
      </div>
    </FormCard>
  )
}
