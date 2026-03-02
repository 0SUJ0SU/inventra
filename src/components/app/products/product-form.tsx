// src/components/app/products/product-form.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Plus,
  ImageIcon,
  Barcode,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { CATEGORIES, type Product } from "@/lib/demo-data";

// ————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————

export interface ProductFormData {
  sku: string;
  name: string;
  categoryId: string;
  description: string;
  costPrice: string;
  sellingPrice: string;
  stock: string;
  minStock: string;
  isSerialTracked: boolean;
  warrantyMonths: string;
  isActive: boolean;
}

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  onSubmitAndNew?: (data: ProductFormData) => void;
}

interface FormErrors {
  [key: string]: string;
}

// ————————————————————————————————————————————
// VALIDATION
// ————————————————————————————————————————————

function validateForm(data: ProductFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.sku.trim()) {
    errors.sku = "SKU is required";
  } else if (data.sku.trim().length < 3) {
    errors.sku = "Min 3 characters";
  }

  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Min 2 characters";
  }

  if (!data.categoryId) {
    errors.categoryId = "Required";
  }

  const cost = parseFloat(data.costPrice);
  if (isNaN(cost) || cost < 0) {
    errors.costPrice = "Invalid";
  }

  const sell = parseFloat(data.sellingPrice);
  if (isNaN(sell) || sell <= 0) {
    errors.sellingPrice = "Invalid";
  }

  if (!data.isSerialTracked) {
    const stock = parseInt(data.stock);
    if (isNaN(stock) || stock < 0) {
      errors.stock = "Invalid";
    }
  }

  const min = parseInt(data.minStock);
  if (isNaN(min) || min < 0) {
    errors.minStock = "Invalid";
  }

  if (data.isSerialTracked) {
    const warranty = parseInt(data.warrantyMonths);
    if (isNaN(warranty) || warranty < 0) {
      errors.warrantyMonths = "Invalid";
    }
  }

  return errors;
}

// ————————————————————————————————————————————
// SKU GENERATOR
// ————————————————————————————————————————————

function generateSku(name: string, categoryId: string): string {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const catCode = cat ? cat.name.slice(0, 3).toUpperCase() : "GEN";
  const nameWords = name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const nameCode =
    nameWords.length >= 2
      ? nameWords[0].slice(0, 3) + "-" + nameWords[1].slice(0, 3)
      : nameWords[0]?.slice(0, 6) ?? "PROD";
  const rand = Math.floor(Math.random() * 90 + 10);
  return `${catCode}-${nameCode}-${rand}`.toUpperCase();
}

// ————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————

const ease = [0.16, 1, 0.3, 1] as const;

// ————————————————————————————————————————————
// FIELD COMPONENTS
// ————————————————————————————————————————————

function FieldLabel({
  label,
  required = false,
  error,
}: {
  label: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {error && (
        <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-error">
          {error}
        </span>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full h-9 px-3 bg-cream-light border font-mono text-[11px] tracking-[0.05em] uppercase text-blue-primary placeholder:text-blue-primary/20 focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        error
          ? "border-error/40 focus:border-error/60"
          : "border-blue-primary/10 focus:border-blue-primary/30"
      }`}
    />
  );
}

// ————————————————————————————————————————————
// CARD WRAPPER
// ————————————————————————————————————————————

function FormCard({
  title,
  marker,
  children,
  className = "",
}: {
  title: string;
  marker?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-blue-primary/10 bg-cream-light ${className}`}>
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-blue-primary/8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
          {title}
        </p>
        {marker && (
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
            {marker}
          </span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">{children}</div>
    </div>
  );
}

// ————————————————————————————————————————————
// FORM COMPONENT
// ————————————————————————————————————————————

export function ProductForm({
  mode,
  initialData,
  onSubmit,
  onSubmitAndNew,
}: ProductFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ProductFormData>(() => {
    if (initialData) {
      return {
        sku: initialData.sku,
        name: initialData.name,
        categoryId: initialData.categoryId,
        description: initialData.description,
        costPrice: String(initialData.costPrice),
        sellingPrice: String(initialData.sellingPrice),
        stock: String(initialData.stock),
        minStock: String(initialData.minStock),
        isSerialTracked: initialData.isSerialTracked,
        warrantyMonths: String(initialData.warrantyMonths),
        isActive: initialData.isActive,
      };
    }
    return {
      sku: "",
      name: "",
      categoryId: "",
      description: "",
      costPrice: "",
      sellingPrice: "",
      stock: "0",
      minStock: "5",
      isSerialTracked: false,
      warrantyMonths: "12",
      isActive: true,
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSerialWarning, setShowSerialWarning] = useState(false);

  const update = useCallback(
    (key: keyof ProductFormData, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const handleAutoSku = () => {
    if (form.name.trim()) {
      update("sku", generateSku(form.name, form.categoryId));
    }
  };

  const handleSerialToggle = (checked: boolean) => {
    if (
      mode === "edit" &&
      checked &&
      initialData &&
      initialData.stock > 0 &&
      !initialData.isSerialTracked
    ) {
      setShowSerialWarning(true);
    }
    update("isSerialTracked", checked);
    if (checked) {
      update("stock", "0");
    }
  };

  const handleSubmit = (andNew = false) => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      if (andNew && onSubmitAndNew) {
        onSubmitAndNew(form);
      } else {
        onSubmit(form);
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-4">
      {/* ━━━ BACK + HEADER ━━━ */}
      <div className="flex flex-col gap-3">
        <motion.button
          onClick={() => router.push("/products")}
          className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary flex items-center gap-2 transition-colors w-fit"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Back to products
        </motion.button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <motion.h1
            className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.03, ease }}
          >
            {mode === "add" ? "Add Product" : "Edit Product"}
          </motion.h1>
          <motion.span
            className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          >
            {mode === "add" ? "[INV.PROD.NEW]" : "[INV.PROD.EDIT]"}
          </motion.span>
        </div>
      </div>

      <div className="h-px bg-blue-primary/10" />

      {/* ━━━ FORM CONTENT ━━━ */}
      <motion.div
        className="space-y-4"
        initial={{ y: 25 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        {/* Row 1: Image + Status + Serial (horizontal strip) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Image */}
          <FormCard title="Product Image">
            <div className="h-28 border border-dashed border-blue-primary/15 flex items-center justify-center gap-3 cursor-pointer hover:border-blue-primary/30 transition-colors">
              <ImageIcon size={20} strokeWidth={1} className="text-blue-primary/20" />
              <div>
                <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
                  Click to upload
                </p>
                <p className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/15 mt-0.5">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>
          </FormCard>

          {/* Status */}
          <FormCard title="Status">
            <button
              type="button"
              onClick={() => update("isActive", !form.isActive)}
              className={`w-full h-28 border font-mono text-[10px] tracking-[0.12em] uppercase flex flex-col items-center justify-center gap-2 transition-colors ${
                form.isActive
                  ? "bg-blue-primary/8 border-blue-primary/20 text-blue-primary"
                  : "bg-transparent border-blue-primary/10 text-blue-primary/30"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  form.isActive ? "bg-emerald-500" : "bg-blue-primary/20"
                }`}
              />
              {form.isActive ? "Active" : "Inactive"}
              <span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/20">
                Click to toggle
              </span>
            </button>
          </FormCard>

          {/* Serial Tracking */}
          <FormCard title="Serial Tracking">
            <button
              type="button"
              onClick={() => handleSerialToggle(!form.isSerialTracked)}
              className={`w-full h-28 border font-mono text-[10px] tracking-[0.12em] uppercase flex flex-col items-center justify-center gap-2 transition-colors ${
                form.isSerialTracked
                  ? "bg-blue-primary/8 border-blue-primary/20 text-blue-primary"
                  : "bg-transparent border-blue-primary/10 text-blue-primary/30"
              }`}
            >
              <Barcode size={18} strokeWidth={1.5} />
              {form.isSerialTracked ? "Serial Tracked" : "Not Tracked"}
              <span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/20">
                Click to toggle
              </span>
            </button>
          </FormCard>
        </div>

        {/* Serial warning */}
        {mode === "edit" && form.isSerialTracked && !(initialData?.isSerialTracked) && initialData?.stock && initialData.stock > 0 && (
          <div className="p-3 border border-warning/20 bg-warning/5 flex items-start gap-2">
            <AlertTriangle
              size={13}
              strokeWidth={1.5}
              className="text-warning shrink-0"
            />
            <p className="font-mono text-[9px] tracking-[0.05em] uppercase text-warning/80 leading-relaxed">
              Enabling serial tracking on a product with existing stock requires
              assigning serial numbers to current units.
            </p>
          </div>
        )}

        {/* Row 2: Main form grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Left: Basic Info (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <FormCard title="Basic Information" marker="/001" className="flex-1 flex flex-col">
              <div className="space-y-4 flex flex-col flex-1">
                {/* Product Name */}
                <div>
                  <FieldLabel label="Product Name" required error={errors.name} />
                  <TextInput
                    value={form.name}
                    onChange={(v) => update("name", v)}
                    placeholder="e.g. iPhone 15 Pro 256GB"
                    error={!!errors.name}
                  />
                </div>

                {/* SKU + Auto */}
                <div>
                  <FieldLabel label="SKU" required error={errors.sku} />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <TextInput
                        value={form.sku}
                        onChange={(v) => update("sku", v)}
                        placeholder="e.g. IP15P-256-BK"
                        error={!!errors.sku}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoSku}
                      className="h-9 px-3 border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 flex items-center gap-1.5 font-mono text-[8px] tracking-[0.1em] uppercase transition-colors shrink-0"
                    >
                      <RefreshCw size={11} strokeWidth={1.5} />
                      Auto
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <FieldLabel label="Category" required error={errors.categoryId} />
                  <select
                    value={form.categoryId}
                    onChange={(e) => update("categoryId", e.target.value)}
                    className={`w-full h-9 px-3 bg-cream-light border font-mono text-[11px] tracking-[0.05em] uppercase text-blue-primary focus:outline-none transition-colors cursor-pointer appearance-none ${
                      errors.categoryId
                        ? "border-error/40 focus:border-error/60"
                        : "border-blue-primary/10 focus:border-blue-primary/30"
                    }`}
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="flex flex-col flex-1">
                  <FieldLabel label="Description" />
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Product description..."
                    className="w-full flex-1 px-3 py-2 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.03em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none focus:border-blue-primary/30 transition-colors resize-none"
                  />
                </div>
              </div>
            </FormCard>
          </div>

          {/* Right: Pricing & Stock (1 col) */}
          <div className="flex flex-col">
            <FormCard title="Pricing & Stock" marker="/002" className="flex-1">
              <div className="space-y-4">
                <div>
                  <FieldLabel label="Cost Price ($)" required error={errors.costPrice} />
                  <TextInput
                    value={form.costPrice}
                    onChange={(v) => update("costPrice", v)}
                    placeholder="0.00"
                    type="number"
                    error={!!errors.costPrice}
                  />
                </div>
                <div>
                  <FieldLabel label="Selling Price ($)" required error={errors.sellingPrice} />
                  <TextInput
                    value={form.sellingPrice}
                    onChange={(v) => update("sellingPrice", v)}
                    placeholder="0.00"
                    type="number"
                    error={!!errors.sellingPrice}
                  />
                </div>
                <div className="h-px bg-blue-primary/6" />
                <div>
                  <FieldLabel
                    label="Stock Quantity"
                    required={!form.isSerialTracked}
                    error={errors.stock}
                  />
                  <TextInput
                    value={form.stock}
                    onChange={(v) => update("stock", v)}
                    placeholder="0"
                    type="number"
                    disabled={form.isSerialTracked}
                    error={!!errors.stock}
                  />
                  {form.isSerialTracked && (
                    <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 mt-1">
                      Managed by serial items
                    </p>
                  )}
                </div>
                <div>
                  <FieldLabel label="Min Stock" required error={errors.minStock} />
                  <TextInput
                    value={form.minStock}
                    onChange={(v) => update("minStock", v)}
                    placeholder="5"
                    type="number"
                    error={!!errors.minStock}
                  />
                </div>
                {/* Warranty inside pricing card */}
                <div className="h-px bg-blue-primary/6" />
                <div>
                  <FieldLabel
                    label="Warranty (Months)"
                    error={errors.warrantyMonths}
                  />
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={14}
                      strokeWidth={1.5}
                      className="text-blue-primary/25 shrink-0"
                    />
                    <TextInput
                      value={form.warrantyMonths}
                      onChange={(v) => update("warrantyMonths", v)}
                      placeholder={form.isSerialTracked ? "12" : "0"}
                      type="number"
                      error={!!errors.warrantyMonths}
                    />
                  </div>
                  <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 mt-1">
                    {form.isSerialTracked
                      ? "Applied from date of sale"
                      : "Set 0 for no warranty"}
                  </p>
                </div>
              </div>
            </FormCard>
          </div>
        </div>
      </motion.div>

      {/* ━━━ ACTIONS BAR ━━━ */}
      <motion.div
        className="border-t border-blue-primary/10 pt-4 pb-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
        initial={{ y: 15 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease }}
      >
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="h-10 px-5 border border-blue-primary/15 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 flex items-center justify-center gap-2 transition-colors"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2">
          {mode === "add" && onSubmitAndNew && (
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="h-10 px-5 border border-blue-primary/15 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/60 hover:text-blue-primary hover:border-blue-primary/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            >
              <Plus size={13} strokeWidth={1.5} />
              Save & Add Another
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="h-10 px-6 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center justify-center gap-2 hover:bg-blue-dark transition-colors disabled:opacity-60"
          >
            <Save size={13} strokeWidth={1.5} />
            {isSubmitting
              ? "Saving..."
              : mode === "add"
                ? "Save Product"
                : "Update Product"}
          </button>
        </div>
      </motion.div>

      {/* Bottom marker */}
      <div className="flex items-center justify-between">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          {mode === "add" ? "[INV.PROD.NEW.END]" : "[INV.PROD.EDIT.END]"}
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
