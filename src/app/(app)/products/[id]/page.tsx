"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  Power,
  Trash2,
  Barcode,
  ShieldCheck,
  Package,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";

const ease = [0.16, 1, 0.3, 1] as const;

function InfoRow({
  label,
  content,
  mono = false,
}: {
  label: string;
  content: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-blue-primary/6 last:border-b-0">
      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 shrink-0">
        {label}
      </span>
      <span
        className={`text-right ${
          mono
            ? "font-mono text-[11px] tracking-[0.05em] uppercase"
            : "font-mono text-[11px] tracking-[0.03em]"
        } text-blue-primary`}
      >
        {content}
      </span>
    </div>
  );
}

function StatCard({
  label,
  metric,
  sub,
  color = "text-blue-primary",
}: {
  label: string;
  metric: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="border border-blue-primary/10 bg-cream-light p-4">
      <div className="border-t-2 border-blue-primary pt-2.5">
        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">
          {label}
        </p>
        <p className={`font-mono text-2xl font-bold tracking-tight mt-1 ${color}`}>
          {metric}
        </p>
        {sub && (
          <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function CardHeader({
  title,
  marker,
}: {
  title: string;
  marker?: string;
}) {
  return (
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
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const product = PRODUCTS.find((product) => product.id === id);
  const category = product
    ? CATEGORIES.find((cat) => cat.id === product.categoryId)
    : null;

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

  const stockStatus =
    product.stock === 0
      ? "out"
      : product.stock <= product.minStock
        ? "low"
        : "healthy";

  const stockColor =
    stockStatus === "out"
      ? "text-error"
      : stockStatus === "low"
        ? "text-warning"
        : "text-blue-primary";

  const stockBarColor =
    stockStatus === "out"
      ? "bg-error"
      : stockStatus === "low"
        ? "bg-warning"
        : "bg-emerald-500";

  const marginPercent =
    product.sellingPrice > 0
      ? Math.round(
          ((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100
        )
      : 0;

  return (
    <div className="space-y-4">
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
          <div>
            <motion.div
              className="flex items-center gap-3 mb-1.5"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40">
                {product.sku}
              </span>
              <span
                className={`font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 ${
                  product.isActive
                    ? "bg-blue-primary/8 text-blue-primary"
                    : "bg-blue-primary/4 text-blue-primary/30"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
              {product.isSerialTracked && (
                <span className="flex items-center gap-1 font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/35">
                  <Barcode size={10} strokeWidth={1.5} />
                  Serial
                </span>
              )}
            </motion.div>
            <motion.h1
              className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-blue-primary leading-none"
              initial={{ x: -30 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.03, ease }}
            >
              {product.name}
            </motion.h1>
          </div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease }}
          >
            <button
              onClick={() => router.push(`/products/${product.id}/edit`)}
              className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"
            >
              <Pencil size={12} strokeWidth={1.5} />
              Edit
            </button>
            <button
              onClick={() => alert("Not available in demo mode")}
              className="h-9 px-3 border border-blue-primary/15 text-blue-primary/50 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
            >
              <Power size={12} strokeWidth={1.5} />
              {product.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => alert("Not available in demo mode")}
              className="h-9 px-3 border border-blue-primary/15 text-error/50 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-error/30 hover:text-error transition-colors"
            >
              <Trash2 size={12} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="h-px bg-blue-primary/10" />

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        <StatCard
          label="Current Stock"
          metric={product.stock}
          sub={`Min: ${product.minStock}`}
          color={stockColor}
        />
        <StatCard
          label="Selling Price"
          metric={formatCurrency(product.sellingPrice)}
          sub={`Cost: ${formatCurrency(product.costPrice)}`}
        />
        <StatCard
          label="Margin"
          metric={`${marginPercent}%`}
          sub={`${formatCurrency(product.sellingPrice - product.costPrice)} per unit`}
        />
        <StatCard
          label="Stock Value"
          metric={formatCurrency(product.stock * product.costPrice)}
          sub={`${product.stock} units × ${formatCurrency(product.costPrice)}`}
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        <div className="border border-blue-primary/10 bg-cream-light">
          <CardHeader title="Stock Status" />
          <div className="p-5 flex items-center gap-3">
            {stockStatus === "healthy" ? (
              <Package size={18} strokeWidth={1.5} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle
                size={18}
                strokeWidth={1.5}
                className={stockStatus === "low" ? "text-warning shrink-0" : "text-error shrink-0"}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-mono text-[11px] tracking-[0.08em] uppercase font-semibold ${stockColor}`}>
                {stockStatus === "healthy"
                  ? "In Stock"
                  : stockStatus === "low"
                    ? "Low Stock"
                    : "Out of Stock"}
              </p>
              <div className="h-1.5 bg-blue-primary/8 w-full mt-2">
                <div
                  className={`h-full transition-all ${stockBarColor}`}
                  style={{
                    width: `${Math.min(100, (product.stock / Math.max(product.minStock * 2, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-blue-primary/10 bg-cream-light">
          <CardHeader title="Serial Tracking" />
          <div className="p-5 flex items-center gap-3">
            <Barcode size={18} strokeWidth={1.5} className="text-blue-primary/30 shrink-0" />
            <div>
              <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary font-semibold">
                {product.isSerialTracked ? "Serial Tracked" : "Not Tracked"}
              </p>
              <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 mt-0.5">
                {product.isSerialTracked
                  ? "Each unit has unique serial"
                  : "Bulk quantity tracking"}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-blue-primary/10 bg-cream-light">
          <CardHeader title="Warranty" />
          <div className="p-5 flex items-center gap-3">
            <ShieldCheck size={18} strokeWidth={1.5} className="text-blue-primary/30 shrink-0" />
            <div>
              <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary font-semibold">
                {product.warrantyMonths > 0
                  ? `${product.warrantyMonths} Month Warranty`
                  : "No Warranty"}
              </p>
              <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 mt-0.5">
                {product.warrantyMonths > 0
                  ? "From date of sale"
                  : "Not applicable"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"
        initial={{ y: 25 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <div className="lg:col-span-2 flex flex-col">
          <div className="border border-blue-primary/10 bg-cream-light flex-1">
            <CardHeader title="Product Details" marker="/001" />
            <div className="px-5 py-2">
              <InfoRow label="Product Name" content={product.name} mono />
              <InfoRow label="SKU" content={product.sku} mono />
              <InfoRow label="Category" content={category?.name ?? "—"} mono />
              <InfoRow
                label="Description"
                content={
                  <span className="max-w-xs text-blue-primary/70 normal-case">
                    {product.description}
                  </span>
                }
              />
              <InfoRow label="Created" content={product.createdAt} mono />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border border-blue-primary/10 bg-cream-light flex-1">
            <CardHeader title="Pricing & Stock" marker="/002" />
            <div className="px-5 py-2">
              <InfoRow
                label="Selling Price"
                content={formatCurrency(product.sellingPrice)}
                mono
              />
              <InfoRow
                label="Cost Price"
                content={formatCurrency(product.costPrice)}
                mono
              />
              <InfoRow label="Margin" content={`${marginPercent}%`} mono />
              <InfoRow
                label="Current Stock"
                content={
                  <span className={stockColor}>{product.stock}</span>
                }
                mono
              />
              <InfoRow label="Min Stock" content={product.minStock} mono />
              <InfoRow label="Unit" content="PCS" mono />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease }}
      >
        <div className="border border-blue-primary/10 bg-cream-light">
          <CardHeader title="Recent Transactions" marker="/003" />
          <div className="px-5 py-6 flex items-center justify-center gap-2">
            <Clock size={14} strokeWidth={1} className="text-blue-primary/15" />
            <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/25">
              Transaction history coming soon
            </p>
          </div>
        </div>

        {product.isSerialTracked ? (
          <div className="border border-blue-primary/10 bg-cream-light">
            <CardHeader title="Serial Numbers" marker="/004" />
            <div className="px-5 py-6 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Barcode size={14} strokeWidth={1} className="text-blue-primary/15" />
                <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/25">
                  Serial inventory coming soon
                </p>
              </div>
              <button className="mt-1 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary border-b border-blue-primary/15 hover:border-blue-primary/40 pb-0.5 transition-colors">
                View All Serials
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-blue-primary/10 bg-cream-light">
            <CardHeader title="Tracking Info" marker="/004" />
            <div className="px-5 py-6 flex items-center justify-center gap-2">
              <Package size={14} strokeWidth={1} className="text-blue-primary/15" />
              <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/25">
                Bulk quantity — no serial tracking
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex items-center justify-between">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.PROD.DETAIL]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
