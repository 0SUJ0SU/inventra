// src/app/(app)/sales/pos/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  ArrowLeftRight,
  Check,
  Printer,
  RotateCcw,
  Tag,
  ChevronRight,
  AlertCircle,
  Package,
  Barcode,
} from "lucide-react";
import {
  PRODUCTS,
  CATEGORIES,
  SERIALIZED_ITEMS,
  type Product,
  type SerializedItem,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface CartItem {
  product: Product;
  qty: number;
  selectedSerials: SerializedItem[];
}

type PaymentMethod = "cash" | "card" | "transfer";
type DiscountType = "percent" | "fixed";

interface CompletedSale {
  saleNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1] as const;
const TAX_RATE = 0.08;

const PAYMENT_METHODS: {
  key: PaymentMethod;
  label: string;
  Icon: React.ElementType;
}[] = [
  { key: "cash", label: "Cash", Icon: Banknote },
  { key: "card", label: "Card", Icon: CreditCard },
  { key: "transfer", label: "Transfer", Icon: ArrowLeftRight },
];

function generateSaleNumber(): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `SL-${new Date().getFullYear()}-${n}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERIAL PICKER MODAL
// ─────────────────────────────────────────────────────────────────────────────

function SerialPickerModal({
  product,
  alreadySelected,
  onConfirm,
  onClose,
}: {
  product: Product;
  alreadySelected: SerializedItem[];
  onConfirm: (serials: SerializedItem[]) => void;
  onClose: () => void;
}) {
  const available = useMemo(
    () =>
      SERIALIZED_ITEMS.filter(
        (s) => s.productId === product.id && s.status === "in_stock"
      ),
    [product.id]
  );

  const [selected, setSelected] = useState<Set<string>>(
    new Set(alreadySelected.map((s) => s.id))
  );
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return available;
    const q = search.toLowerCase();
    return available.filter((s) => s.serialNumber.toLowerCase().includes(q));
  }, [available, search]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canConfirm = selected.size >= 1;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-blue-primary/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-lg bg-cream-primary border border-blue-primary/15 shadow-xl mx-4"
        initial={{ y: 16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 8, scale: 0.99 }}
        transition={{ duration: 0.22, ease }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-primary/10">
          <div>
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">
              Select Serial Numbers
            </p>
            <p className="font-sans text-[15px] font-bold text-blue-primary mt-0.5 leading-none">
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Progress + search */}
        <div className="px-6 pt-4 pb-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
              {selected.size} of {available.length} selected
            </span>
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {available.length} available
            </span>
          </div>
          <div className="relative">
            <Search
              size={13}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH SERIAL NUMBER..."
              className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors"
            />
          </div>
        </div>

        {/* Serial list */}
        <div className="px-6 max-h-60 overflow-y-auto pb-4 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
                No serials available
              </p>
            </div>
          ) : (
            filtered.map((s) => {
              const isSelected = selected.has(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={`w-full flex items-center justify-between px-3 h-10 border transition-colors ${
                    isSelected
                      ? "border-blue-primary bg-blue-primary/5"
                      : "border-blue-primary/10 hover:border-blue-primary/25 hover:bg-blue-primary/[0.02]"
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary">
                    {s.serialNumber}
                  </span>
                  <div
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-blue-primary border-blue-primary"
                        : "border-blue-primary/20"
                    }`}
                  >
                    {isSelected && (
                      <Check
                        size={9}
                        strokeWidth={2.5}
                        className="text-cream-primary"
                      />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-blue-primary/10 bg-cream-light">
          <button
            onClick={onClose}
            className="h-9 px-5 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const items = SERIALIZED_ITEMS.filter((s) => selected.has(s.id));
              onConfirm(items);
            }}
            disabled={!canConfirm}
            className="h-9 px-5 bg-blue-primary text-cream-primary font-mono text-[9px] tracking-[0.12em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-dark transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT MODAL
// ─────────────────────────────────────────────────────────────────────────────

function PaymentModal({
  subtotal,
  discount,
  tax,
  total,
  onComplete,
  onClose,
}: {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  onComplete: (
    method: PaymentMethod,
    amountPaid: number,
    change: number
  ) => void;
  onClose: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [amountStr, setAmountStr] = useState("");
  const amountPaid = parseFloat(amountStr) || 0;
  const change = Math.max(0, amountPaid - total);
  const canComplete = method !== "cash" || amountPaid >= total;
  const hasBreakdown = discount > 0 || tax > 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-blue-primary/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-md bg-cream-primary border border-blue-primary/15 shadow-xl mx-4"
        initial={{ y: 16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 8, scale: 0.99 }}
        transition={{ duration: 0.22, ease }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-primary/10">
          <div>
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">
              Process Payment
            </p>
            <p className="font-sans text-[15px] font-bold text-blue-primary mt-0.5 leading-none">
              Checkout
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Order summary */}
        <div className="px-6 py-4 border-b border-blue-primary/10">
          {hasBreakdown && (
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                  Subtotal
                </span>
                <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/50">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                    Discount
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/50">
                    -{formatCurrency(discount)}
                  </span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                    Tax (8%)
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/50">
                    +{formatCurrency(tax)}
                  </span>
                </div>
              )}
              <div className="h-px bg-blue-primary/8 mt-2" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary font-semibold">
              Total Due
            </span>
            <span className="font-mono text-[24px] font-bold text-blue-primary leading-none">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Payment method */}
        <div className="px-6 pt-4 pb-3">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 mb-2">
            Payment Method
          </p>
          <div className="grid grid-cols-3 gap-px bg-blue-primary/10 border border-blue-primary/10">
            {PAYMENT_METHODS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setMethod(key)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 transition-colors ${
                  method === key
                    ? "bg-blue-primary text-cream-primary"
                    : "bg-cream-light text-blue-primary/50 hover:bg-blue-primary/[0.03] hover:text-blue-primary"
                }`}
              >
                <Icon size={15} strokeWidth={1.5} />
                <span className="font-mono text-[8px] tracking-[0.12em] uppercase">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cash input */}
        {method === "cash" && (
          <div className="px-6 pb-4 space-y-2">
            <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">
              Amount Received
            </p>
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="w-full h-10 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[15px] tracking-[0.04em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none focus:border-blue-primary/30 transition-colors"
            />
            {amountPaid >= total && amountPaid > 0 && (
              <div className="flex items-center justify-between px-3 h-9 bg-blue-primary/5 border border-blue-primary/10">
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50">
                  Change
                </span>
                <span className="font-mono text-[13px] font-semibold text-blue-primary">
                  {formatCurrency(change)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-blue-primary/10 bg-cream-light">
          <button
            onClick={onClose}
            className="h-9 px-5 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onComplete(method, method === "cash" ? amountPaid : total, change)
            }
            disabled={!canComplete}
            className="h-9 px-6 bg-blue-primary text-cream-primary font-mono text-[9px] tracking-[0.12em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-dark transition-colors flex items-center gap-2"
          >
            <Check size={13} strokeWidth={2} />
            Complete Sale
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECEIPT MODAL
// ─────────────────────────────────────────────────────────────────────────────

function ReceiptModal({
  sale,
  onNewSale,
}: {
  sale: CompletedSale;
  onNewSale: () => void;
}) {
  const PAYMENT_LABELS: Record<PaymentMethod, string> = {
    cash: "Cash",
    card: "Card",
    transfer: "Bank Transfer",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-blue-primary/20 backdrop-blur-[2px]" />
      <motion.div
        className="relative w-full max-w-sm bg-cream-primary border border-blue-primary/15 shadow-xl mx-4 max-h-[90vh] flex flex-col"
        initial={{ y: 16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-primary/10 text-center shrink-0">
          <div className="flex items-center justify-center mb-2">
            <div className="w-6 h-6 bg-blue-primary flex items-center justify-center">
              <Check size={13} strokeWidth={2.5} className="text-cream-primary" />
            </div>
          </div>
          <p className="font-sans text-[17px] font-bold text-blue-primary leading-none">
            Inventra Store
          </p>
          <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 mt-1.5">
            {sale.saleNumber}
          </p>
          <p className="font-mono text-[9px] tracking-[0.06em] uppercase text-blue-primary/30 mt-0.5">
            {sale.date}
          </p>
        </div>

        {/* Items */}
        <div className="overflow-y-auto flex-1 divide-y divide-blue-primary/6">
          {sale.items.map((item) => (
            <div key={item.product.id} className="px-6 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate">
                    {item.product.name}
                  </p>
                  {item.selectedSerials.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {item.selectedSerials.map((s) => (
                        <p
                          key={s.id}
                          className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/30"
                        >
                          ↳ {s.serialNumber}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-[9px] tracking-[0.04em] text-blue-primary/50">
                    {item.qty} × {formatCurrency(item.product.sellingPrice)}
                  </p>
                  <p className="font-mono text-[11px] font-semibold text-blue-primary">
                    {formatCurrency(item.qty * item.product.sellingPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-3 border-t border-blue-primary/10 space-y-1.5 shrink-0">
          {(sale.discount > 0 || sale.tax > 0) && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                  Subtotal
                </span>
                <span className="font-mono text-[9px] text-blue-primary/50">
                  {formatCurrency(sale.subtotal)}
                </span>
              </div>
              {sale.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                    Discount
                  </span>
                  <span className="font-mono text-[9px] text-blue-primary/50">
                    -{formatCurrency(sale.discount)}
                  </span>
                </div>
              )}
              {sale.tax > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                    Tax
                  </span>
                  <span className="font-mono text-[9px] text-blue-primary/50">
                    +{formatCurrency(sale.tax)}
                  </span>
                </div>
              )}
              <div className="h-px bg-blue-primary/8" />
            </>
          )}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary font-semibold">
              Total
            </span>
            <span className="font-mono text-[15px] font-bold text-blue-primary">
              {formatCurrency(sale.total)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
              {PAYMENT_LABELS[sale.paymentMethod]}
            </span>
            <span className="font-mono text-[9px] text-blue-primary/50">
              {formatCurrency(sale.amountPaid)}
            </span>
          </div>
          {sale.change > 0 && (
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                Change
              </span>
              <span className="font-mono text-[9px] text-blue-primary/50">
                {formatCurrency(sale.change)}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-blue-primary/10 bg-cream-light flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="h-9 px-4 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:border-blue-primary/30 hover:text-blue-primary transition-colors flex items-center gap-2 shrink-0"
          >
            <Printer size={13} strokeWidth={1.5} />
            Print
          </button>
          <button
            onClick={onNewSale}
            className="h-9 flex-1 bg-blue-primary text-cream-primary font-mono text-[9px] tracking-[0.12em] uppercase hover:bg-blue-dark transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={13} strokeWidth={1.5} />
            New Sale
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function POSPage() {
  // ── Product browser ──
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // ── Cart ──
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [taxEnabled, setTaxEnabled] = useState(false);

  // ── Modals ──
  const [serialPickerFor, setSerialPickerFor] = useState<{
    product: Product;
  } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [completedSale, setCompletedSale] = useState<CompletedSale | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Filtered products ──
  const filteredProducts = useMemo(() => {
    let data = PRODUCTS.filter((p) => p.isActive);
    if (activeCategory !== "all")
      data = data.filter((p) => p.categoryId === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }
    return data;
  }, [search, activeCategory]);

  // ── Calculations ──
  const subtotal = useMemo(
    () =>
      cart.reduce((acc, item) => acc + item.qty * item.product.sellingPrice, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    const val = parseFloat(discountValue) || 0;
    if (discountType === "percent")
      return Math.min(subtotal, (subtotal * val) / 100);
    return Math.min(subtotal, val);
  }, [subtotal, discountValue, discountType]);

  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxEnabled ? taxableAmount * TAX_RATE : 0;
  const total = taxableAmount + taxAmount;
  const cartItemCount = cart.reduce((acc, i) => acc + i.qty, 0);

  // ── Stock helpers ──
  const getAvailableSerialCount = (productId: string) =>
    SERIALIZED_ITEMS.filter(
      (s) => s.productId === productId && s.status === "in_stock"
    ).length;

  const getStockDisplay = (product: Product) => {
    if (product.isSerialTracked) {
      const n = getAvailableSerialCount(product.id);
      return { count: n, label: `${n} avail` };
    }
    return { count: product.stock, label: `${product.stock} in stock` };
  };

  // ── Add to cart ──
  const addToCart = (product: Product) => {
    if (product.isSerialTracked) {
      const available = getAvailableSerialCount(product.id);
      if (available === 0) return;
      setSerialPickerFor({ product });
    } else {
      if (product.stock <= 0) return;
      setCart((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          if (existing.qty >= product.stock) return prev;
          return prev.map((i) =>
            i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
          );
        }
        return [...prev, { product, qty: 1, selectedSerials: [] }];
      });
    }
  };

  // ── Qty increase ──
  const increaseQty = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;
    if (item.product.isSerialTracked) {
      const available = getAvailableSerialCount(productId);
      if (item.qty >= available) return;
      setSerialPickerFor({ product: item.product });
    } else {
      if (item.qty >= item.product.stock) return;
      setCart((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, qty: i.qty + 1 } : i
        )
      );
    }
  };

  // ── Qty decrease ──
  const decreaseQty = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;
    if (item.qty === 1) {
      removeFromCart(productId);
      return;
    }
    if (item.product.isSerialTracked) {
      setSerialPickerFor({ product: item.product });
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, qty: i.qty - 1 } : i
        )
      );
    }
  };

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== productId));

  const clearCart = () => {
    setCart([]);
    setDiscountValue("");
    setTaxEnabled(false);
  };

  // ── Serial confirm ──
  const handleSerialConfirm = (serials: SerializedItem[]) => {
    if (!serialPickerFor) return;
    const { product } = serialPickerFor;
    const qty = serials.length;
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, qty, selectedSerials: serials }
            : i
        );
      }
      return [...prev, { product, qty, selectedSerials: serials }];
    });
    setSerialPickerFor(null);
  };

  // ── Complete sale ──
  const handleCompleteSale = (
    method: PaymentMethod,
    amountPaid: number,
    change: number
  ) => {
    setCompletedSale({
      saleNumber: generateSaleNumber(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paymentMethod: method,
      amountPaid,
      change,
    });
    setShowPayment(false);
  };

  const handleNewSale = () => {
    clearCart();
    setCompletedSale(null);
  };

  const cartHasMissingSerials = cart.some(
    (i) => i.product.isSerialTracked && i.selectedSerials.length !== i.qty
  );

  const allCategories = [{ id: "all", name: "All" }, ...CATEGORIES];

  // ── RENDER ──────────────────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-57px)] -m-6 flex overflow-hidden">

      {/* ── LEFT PANEL: Product Browser ─────────────────────────────────── */}
      <div className="flex flex-col w-[60%] border-r border-blue-primary/10 overflow-hidden">

        {/* Panel header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-blue-primary/10 shrink-0">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">
            Product Browser
          </span>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
            [INV.POS]
          </span>
        </div>

        {/* Search + category tabs */}
        <div className="px-4 pt-3 shrink-0">
          <div className="relative mb-3">
            <Search
              size={13}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
            />
            <input
              type="text"
              placeholder="SEARCH PRODUCT OR SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-9 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-primary/30 hover:text-blue-primary transition-colors"
              >
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="flex items-center border-b border-blue-primary/10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 h-8 font-mono text-[9px] tracking-[0.12em] uppercase whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  activeCategory === cat.id
                    ? "border-blue-primary text-blue-primary"
                    : "border-transparent text-blue-primary/35 hover:text-blue-primary/60"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Package size={28} strokeWidth={1} className="text-blue-primary/15" />
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/25">
                No products found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const { count, label } = getStockDisplay(product);
                const cartItem = cart.find((i) => i.product.id === product.id);
                const outOfStock = count <= 0;

                return (
                  <button
                    key={product.id}
                    onClick={() => !outOfStock && addToCart(product)}
                    disabled={outOfStock}
                    className={`relative text-left p-3 border h-[108px] flex flex-col justify-between transition-all duration-150 ${
                      outOfStock
                        ? "border-blue-primary/6 opacity-35 cursor-not-allowed"
                        : cartItem
                        ? "border-blue-primary/30 bg-blue-primary/[0.03] hover:border-blue-primary/50"
                        : "border-blue-primary/10 bg-cream-light hover:border-blue-primary/22 hover:bg-blue-primary/[0.015]"
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between h-5">
                      {product.isSerialTracked ? (
                        <span className="flex items-center gap-1 font-mono text-[7px] tracking-[0.1em] uppercase px-1.5 py-0.5 bg-blue-primary/8 text-blue-primary/45">
                          <Barcode size={8} strokeWidth={1.5} />
                          S/N
                        </span>
                      ) : (
                        <span />
                      )}
                      {cartItem && (
                        <span className="w-5 h-5 bg-blue-primary text-cream-primary font-mono text-[9px] font-bold flex items-center justify-center leading-none">
                          {cartItem.qty}
                        </span>
                      )}
                    </div>

                    {/* Name + SKU */}
                    <div>
                      <p className="font-sans text-[11px] font-semibold text-blue-primary leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/30 mt-0.5">
                        {product.sku}
                      </p>
                    </div>

                    {/* Price + stock */}
                    <div className="flex items-end justify-between">
                      <span className="font-mono text-[12px] font-semibold text-blue-primary leading-none">
                        {formatCurrency(product.sellingPrice)}
                      </span>
                      <span
                        className={`font-mono text-[8px] tracking-[0.06em] uppercase leading-none ${
                          count <= 3 && count > 0
                            ? "text-warning/60"
                            : "text-blue-primary/30"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL: Cart ────────────────────────────────────────────── */}
      <div className="flex flex-col w-[40%] overflow-hidden">

        {/* Panel header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-blue-primary/10 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart size={13} strokeWidth={1.5} className="text-blue-primary/40" />
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">
              Cart
            </span>
            {cartItemCount > 0 && (
              <span className="font-mono text-[8px] tracking-[0.08em] bg-blue-primary text-cream-primary px-1.5 py-0.5 leading-none">
                {cartItemCount}
              </span>
            )}
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/30 hover:text-blue-primary transition-colors flex items-center gap-1"
            >
              <X size={11} strokeWidth={1.5} />
              Clear
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <ShoppingCart size={28} strokeWidth={1} className="text-blue-primary/10" />
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/20">
                Cart is empty
              </p>
              <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/15">
                Click a product to add
              </p>
            </div>
          ) : (
            <div className="divide-y divide-blue-primary/6">
              {cart.map((item) => (
                <div key={item.product.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary leading-none truncate">
                        {item.product.name}
                      </p>
                      <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/30 mt-0.5">
                        {item.product.sku}
                      </p>
                      {item.selectedSerials.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.selectedSerials.map((s) => (
                            <p
                              key={s.id}
                              className="font-mono text-[7.5px] tracking-[0.06em] uppercase text-blue-primary/30"
                            >
                              ↳ {s.serialNumber}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Line total + remove */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-blue-primary">
                          {formatCurrency(item.qty * item.product.sellingPrice)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-0.5 text-blue-primary/20 hover:text-error transition-colors"
                        >
                          <Trash2 size={11} strokeWidth={1.5} />
                        </button>
                      </div>
                      {/* Qty controls */}
                      <div className="flex items-center">
                        <button
                          onClick={() => decreaseQty(item.product.id)}
                          className="w-7 h-7 border border-blue-primary/10 flex items-center justify-center text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/25 transition-colors"
                        >
                          <Minus size={10} strokeWidth={2} />
                        </button>
                        <span className="w-8 h-7 border-t border-b border-blue-primary/10 flex items-center justify-center font-mono text-[10px] font-semibold text-blue-primary">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => increaseQty(item.product.id)}
                          className="w-7 h-7 border border-blue-primary/10 flex items-center justify-center text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/25 transition-colors"
                        >
                          <Plus size={10} strokeWidth={2} />
                        </button>
                      </div>
                      {/* Unit price */}
                      <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25">
                        @ {formatCurrency(item.product.sellingPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom: discount / tax / totals / checkout ── */}
        {cart.length > 0 && (
          <div className="border-t border-blue-primary/10 shrink-0">

            {/* Discount */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-blue-primary/6">
              <Tag size={11} strokeWidth={1.5} className="text-blue-primary/30 shrink-0" />
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 shrink-0">
                Discount
              </span>
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <button
                  onClick={() =>
                    setDiscountType((t) => (t === "percent" ? "fixed" : "percent"))
                  }
                  className="h-7 w-7 border border-blue-primary/10 font-mono text-[9px] font-semibold text-blue-primary/50 hover:border-blue-primary/25 hover:text-blue-primary transition-colors shrink-0 flex items-center justify-center"
                >
                  {discountType === "percent" ? "%" : "$"}
                </button>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="0"
                  className="flex-1 h-7 px-2 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.04em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none focus:border-blue-primary/25 transition-colors min-w-0"
                />
              </div>
              {discountAmount > 0 && (
                <span className="font-mono text-[9px] tracking-[0.04em] text-blue-primary/45 shrink-0">
                  -{formatCurrency(discountAmount)}
                </span>
              )}
            </div>

            {/* Tax toggle */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-blue-primary/6">
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                Tax (8%)
              </span>
              <button
                onClick={() => setTaxEnabled((v) => !v)}
                className={`relative w-9 h-[18px] border transition-colors ${
                  taxEnabled
                    ? "bg-blue-primary border-blue-primary"
                    : "bg-transparent border-blue-primary/20"
                }`}
              >
                <span
                  className={`absolute top-0.5 bottom-0.5 aspect-square transition-all duration-200 ${
                    taxEnabled ? "right-0.5 bg-cream-primary" : "left-0.5 bg-blue-primary/30"
                  }`}
                />
              </button>
            </div>

            {/* Totals breakdown */}
            <div className="px-4 py-2.5 space-y-1.5 border-b border-blue-primary/6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                  Subtotal
                </span>
                <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/50">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                    Discount
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/50">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
              {taxEnabled && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40">
                    Tax
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/50">
                    +{formatCurrency(taxAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Grand total */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-primary/8">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary font-semibold">
                Total
              </span>
              <span className="font-mono text-[22px] font-bold text-blue-primary leading-none">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Checkout */}
            <div className="p-4">
              {cartHasMissingSerials && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 border border-warning/20 bg-warning/[0.06]">
                  <AlertCircle size={11} strokeWidth={1.5} className="text-warning shrink-0" />
                  <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-warning/80">
                    Select serial numbers to continue
                  </span>
                </div>
              )}
              <button
                onClick={() => setShowPayment(true)}
                disabled={cart.length === 0 || cartHasMissingSerials}
                className="w-full h-11 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.15em] uppercase hover:bg-blue-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ChevronRight size={14} strokeWidth={1.5} />
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ──────────────────────────────────────────────────────── */}
      {mounted && (
        <AnimatePresence>
          {serialPickerFor && (
            <SerialPickerModal
              key="serial-picker"
              product={serialPickerFor.product}
              alreadySelected={
                cart.find((i) => i.product.id === serialPickerFor.product.id)
                  ?.selectedSerials ?? []
              }
              onConfirm={handleSerialConfirm}
              onClose={() => setSerialPickerFor(null)}
            />
          )}
          {showPayment && (
            <PaymentModal
              key="payment"
              subtotal={subtotal}
              discount={discountAmount}
              tax={taxAmount}
              total={total}
              onComplete={handleCompleteSale}
              onClose={() => setShowPayment(false)}
            />
          )}
          {completedSale && (
            <ReceiptModal
              key="receipt"
              sale={completedSale}
              onNewSale={handleNewSale}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}