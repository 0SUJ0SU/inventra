// src/app/(app)/warranty/claims/new/page.tsx
"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Search,
  X,
  User,
  Truck,
  Package,
  CalendarDays,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  Barcode,
  ShieldCheck,
} from "lucide-react";
import {
  SERIALIZED_ITEMS,
  WARRANTY_CLAIMS,
  CLAIM_TYPE_CONFIG,
  type SerializedItem,
  type ClaimType,
  type WarrantyClaim,
  type ClaimStatusChange,
  getWarrantyStatus,
  getWarrantyDaysRemaining,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";

// ————————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————————

interface ClaimFormData {
  serializedItemId: string;
  claimType: ClaimType;
  issueDescription: string;
}

interface FormErrors {
  [key: string]: string;
}

// ————————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————————

const ease = [0.16, 1, 0.3, 1] as const;

const CLAIM_TYPE_ICONS: Record<ClaimType, React.ElementType> = {
  customer_to_store: User,
  store_to_supplier: Truck,
  supplier_to_store: Package,
};

const CLAIM_TYPE_ARROWS: Record<ClaimType, string> = {
  customer_to_store: "Customer \u2192 Store",
  store_to_supplier: "Store \u2192 Supplier",
  supplier_to_store: "Supplier \u2192 Store",
};

// ————————————————————————————————————————————————
// HELPERS
// ————————————————————————————————————————————————

function generateClaimNumber(): string {
  const year = new Date().getFullYear();
  const existing = WARRANTY_CLAIMS.filter((c) =>
    c.claimNumber.startsWith(`WC-${year}`)
  );
  const maxNum = existing.reduce((max, c) => {
    const num = parseInt(c.claimNumber.split("-").pop() ?? "0");
    return num > max ? num : max;
  }, 0);
  return `WC-${year}-${String(maxNum + 1).padStart(4, "0")}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWarrantyLabel(item: SerializedItem): {
  label: string;
  color: string;
  bg: string;
} {
  const status = getWarrantyStatus(item);
  const days = getWarrantyDaysRemaining(item);
  switch (status) {
    case "active":
      return {
        label: `Active (${days}d left)`,
        color: "text-emerald-700",
        bg: "bg-emerald-700/10",
      };
    case "expiring_soon":
      return {
        label: `Expiring (${days}d left)`,
        color: "text-amber-600",
        bg: "bg-amber-600/10",
      };
    case "expired":
      return {
        label: "Expired",
        color: "text-error",
        bg: "bg-error/10",
      };
    case "n/a":
    default:
      return {
        label: "N/A",
        color: "text-blue-primary/40",
        bg: "bg-blue-primary/5",
      };
  }
}

function validateForm(
  data: ClaimFormData,
  selectedItem: SerializedItem | null
): FormErrors {
  const errors: FormErrors = {};

  if (!data.serializedItemId) {
    errors.serializedItemId = "Select a serial number";
  }

  if (!data.claimType) {
    errors.claimType = "Select a claim type";
  }

  // Validate claim type vs serial context
  if (selectedItem && data.claimType) {
    if (
      data.claimType === "customer_to_store" &&
      !selectedItem.customer
    ) {
      errors.claimType = "No customer linked to this serial";
    }
    if (
      data.claimType === "store_to_supplier" &&
      !selectedItem.supplier
    ) {
      errors.claimType = "No supplier linked to this serial";
    }
  }

  if (!data.issueDescription.trim()) {
    errors.issueDescription = "Describe the issue";
  } else if (data.issueDescription.trim().length < 10) {
    errors.issueDescription = "Min 10 characters";
  }

  return errors;
}

// ————————————————————————————————————————————————
// FIELD COMPONENTS (matching ProductForm exactly)
// ————————————————————————————————————————————————

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
    <div
      className={`border border-blue-primary/10 bg-cream-light ${className}`}
    >
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

function InfoRow({
  icon: Icon,
  label,
  value,
  valueColor = "text-blue-primary/70",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon
        size={12}
        strokeWidth={1.5}
        className="text-blue-primary/20 mt-0.5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/30 block leading-none">
          {label}
        </span>
        <span
          className={`font-mono text-[10px] tracking-[0.04em] uppercase block mt-0.5 leading-snug truncate ${valueColor}`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————

export default function NewWarrantyClaimPage() {
  const router = useRouter();

  // — Form state —
  const [form, setForm] = useState<ClaimFormData>({
    serializedItemId: "",
    claimType: "customer_to_store",
    issueDescription: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // — Serial search —
  const [serialSearch, setSerialSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SerializedItem | null>(
    null
  );
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter serials by search
  const searchResults = useMemo(() => {
    if (!serialSearch.trim()) return [];
    const q = serialSearch.toLowerCase().trim();
    return SERIALIZED_ITEMS.filter(
      (item) =>
        item.serialNumber.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        (item.customer && item.customer.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [serialSearch]);

  // — Update helpers —
  const update = useCallback(
    (key: keyof ClaimFormData, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const handleSelectSerial = (item: SerializedItem) => {
    setSelectedItem(item);
    setSerialSearch(item.serialNumber);
    setShowDropdown(false);
    update("serializedItemId", item.id);

    // Auto-select best claim type based on context
    if (item.customer) {
      update("claimType", "customer_to_store");
    } else if (item.supplier) {
      update("claimType", "store_to_supplier");
    }

    // Clear serial error
    setErrors((prev) => {
      const next = { ...prev };
      delete next.serializedItemId;
      return next;
    });
  };

  const handleClearSerial = () => {
    setSelectedItem(null);
    setSerialSearch("");
    update("serializedItemId", "");
  };

  const handleSubmit = () => {
    if (!selectedItem) {
      setErrors((prev) => ({
        ...prev,
        serializedItemId: "Select a serial number",
      }));
      return;
    }

    const errs = validateForm(form, selectedItem);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);

    // Simulate save delay
    setTimeout(() => {
      const claimNumber = generateClaimNumber();
      const now = new Date().toISOString().split("T")[0];

      const newClaim: WarrantyClaim = {
        id: `wc-${Date.now()}`,
        claimNumber,
        serializedItemId: selectedItem.id,
        serialNumber: selectedItem.serialNumber,
        productName: selectedItem.productName,
        claimType: form.claimType,
        status: "pending",
        claimDate: now,
        issueDescription: form.issueDescription.trim(),
        customerId:
          form.claimType === "customer_to_store" && selectedItem.customer
            ? `cust-auto`
            : null,
        customerName:
          form.claimType === "customer_to_store"
            ? selectedItem.customer
            : null,
        supplierId:
          form.claimType !== "customer_to_store" && selectedItem.supplier
            ? `sup-auto`
            : null,
        supplierName:
          form.claimType !== "customer_to_store"
            ? selectedItem.supplier
            : null,
        repairCost: null,
        replacementSerialId: null,
        replacementSerialNumber: null,
        resolution: null,
        attachments: [],
        statusHistory: [
          {
            from: null,
            to: "pending",
            date: now,
            note: "Claim opened by store admin",
          },
        ],
        notes: [],
        createdAt: now,
        updatedAt: now,
      };

      console.log("[Inventra] Warranty claim created:", newClaim);
      setSubmitted(true);
      setIsSubmitting(false);

      // Redirect after brief success flash
      setTimeout(() => {
        router.push("/warranty/claims");
      }, 800);
    }, 500);
  };

  // — Warranty info for selected item —
  const warrantyInfo = selectedItem
    ? getWarrantyLabel(selectedItem)
    : null;
  const warrantyExpired = selectedItem
    ? getWarrantyStatus(selectedItem) === "expired"
    : false;

  // — Existing claims for this serial —
  const existingClaims = selectedItem
    ? WARRANTY_CLAIMS.filter(
        (c) => c.serializedItemId === selectedItem.id
      )
    : [];

  return (
    <div className="space-y-4">
      {/* ━━━ BACK + HEADER ━━━ */}
      <div className="flex flex-col gap-3">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            href="/warranty/claims"
            className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary flex items-center gap-2 transition-colors w-fit"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Back to claims
          </Link>
        </motion.div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <motion.h1
            className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.03, ease }}
          >
            New Warranty Claim
          </motion.h1>
          <motion.span
            className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          >
            [INV.WTY.NEW]
          </motion.span>
        </div>
      </div>

      <div className="h-px bg-blue-primary/10" />

      {/* ━━━ FORM ━━━ */}
      <motion.div
        className="space-y-4"
        initial={{ y: 25 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        {/* Row 1: Claim Type Selection (3 toggle cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(
            Object.entries(CLAIM_TYPE_CONFIG) as [
              ClaimType,
              (typeof CLAIM_TYPE_CONFIG)[ClaimType],
            ][]
          ).map(([key, cfg]) => {
            const Icon = CLAIM_TYPE_ICONS[key];
            const isSelected = form.claimType === key;

            // Disable types that don't match serial context
            const isDisabled =
              selectedItem !== null &&
              ((key === "customer_to_store" && !selectedItem.customer) ||
                (key === "store_to_supplier" && !selectedItem.supplier) ||
                (key === "supplier_to_store" && !selectedItem.supplier));

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (!isDisabled) {
                    update("claimType", key);
                  }
                }}
                disabled={isDisabled}
                className={`border bg-cream-light transition-colors ${
                  isDisabled
                    ? "opacity-30 cursor-not-allowed border-blue-primary/6"
                    : isSelected
                      ? "border-blue-primary/25 bg-blue-primary/8"
                      : "border-blue-primary/10 hover:border-blue-primary/20"
                }`}
              >
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-blue-primary/8">
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
                    {cfg.label}
                  </p>
                </div>
                <div className="p-5 flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "border-blue-primary/30 bg-blue-primary/5"
                        : "border-blue-primary/10"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      className={
                        isSelected
                          ? "text-blue-primary"
                          : "text-blue-primary/30"
                      }
                    />
                  </div>
                  <span
                    className={`font-mono text-[9px] tracking-[0.1em] uppercase text-center ${
                      isSelected
                        ? "text-blue-primary"
                        : "text-blue-primary/40"
                    }`}
                  >
                    {CLAIM_TYPE_ARROWS[key]}
                  </span>
                  <span className="font-mono text-[7px] tracking-[0.08em] uppercase text-blue-primary/20 text-center leading-relaxed">
                    {cfg.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.claimType && (
          <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-error -mt-2">
            {errors.claimType}
          </p>
        )}

        {/* Row 2: Serial Search + Auto-filled Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Left: Serial Search (2/3) */}
          <div className="lg:col-span-2 flex flex-col">
            <FormCard
              title="Serial Number"
              marker="/001"
              className="flex-1 flex flex-col"
            >
              <div className="space-y-4 flex flex-col flex-1">
                {/* Search input */}
                <div>
                  <FieldLabel
                    label="Search Serial Number"
                    required
                    error={errors.serializedItemId}
                  />
                  <div className="relative" ref={searchRef}>
                    {selectedItem ? (
                      /* Selected state */
                      <div className="w-full h-9 px-3 bg-blue-primary/5 border border-blue-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Barcode
                            size={12}
                            strokeWidth={1.5}
                            className="text-blue-primary/40"
                          />
                          <span className="font-mono text-[11px] tracking-[0.05em] uppercase text-blue-primary">
                            {selectedItem.serialNumber}
                          </span>
                          <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/30">
                            {selectedItem.productName}
                          </span>
                        </div>
                        <button
                          onClick={handleClearSerial}
                          className="p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"
                        >
                          <X size={12} strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      /* Search state */
                      <>
                        <Search
                          size={14}
                          strokeWidth={1.5}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
                        />
                        <input
                          type="text"
                          value={serialSearch}
                          onChange={(e) => {
                            setSerialSearch(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          placeholder="TYPE SERIAL #, PRODUCT NAME, OR CUSTOMER..."
                          className={`w-full h-9 pl-9 pr-3 bg-cream-light border font-mono text-[11px] tracking-[0.05em] uppercase text-blue-primary placeholder:text-blue-primary/20 focus:outline-none transition-colors ${
                            errors.serializedItemId
                              ? "border-error/40 focus:border-error/60"
                              : "border-blue-primary/10 focus:border-blue-primary/30"
                          }`}
                        />

                        {/* Dropdown */}
                        {showDropdown && serialSearch.trim().length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-30 mt-px bg-cream-primary border border-blue-primary/10 shadow-sm max-h-64 overflow-y-auto">
                            {searchResults.length === 0 ? (
                              <div className="px-4 py-5 text-center">
                                <Search
                                  size={16}
                                  strokeWidth={1}
                                  className="text-blue-primary/15 mx-auto mb-2"
                                />
                                <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
                                  No serials found
                                </p>
                                <p className="font-mono text-[7px] tracking-[0.08em] uppercase text-blue-primary/20 mt-0.5">
                                  Try a different search term
                                </p>
                              </div>
                            ) : (
                              searchResults.map((item) => {
                                const wInfo = getWarrantyLabel(item);
                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => handleSelectSerial(item)}
                                    className="w-full px-4 py-3 text-left hover:bg-blue-primary/[0.03] transition-colors border-b border-blue-primary/6 last:border-b-0"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Barcode
                                          size={11}
                                          strokeWidth={1.5}
                                          className="text-blue-primary/25"
                                        />
                                        <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary">
                                          {item.serialNumber}
                                        </span>
                                      </div>
                                      <span
                                        className={`font-mono text-[7px] tracking-[0.1em] uppercase px-1.5 py-0.5 ${wInfo.color} ${wInfo.bg}`}
                                      >
                                        {wInfo.label}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5">
                                      <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/40">
                                        {item.productName}
                                      </span>
                                      {item.customer && (
                                        <>
                                          <span className="text-blue-primary/10">
                                            |
                                          </span>
                                          <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/30">
                                            {item.customer}
                                          </span>
                                        </>
                                      )}
                                      <span className="text-blue-primary/10">
                                        |
                                      </span>
                                      <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25">
                                        {item.status.replace("_", " ")}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Auto-filled serial info */}
                {selectedItem && (
                  <motion.div
                    className="space-y-4"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <div className="h-px bg-blue-primary/6" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      <InfoRow
                        icon={Package}
                        label="Product"
                        value={selectedItem.productName}
                      />
                      <InfoRow
                        icon={DollarSign}
                        label="Purchase Cost"
                        value={formatCurrency(selectedItem.purchaseCost)}
                      />
                      <InfoRow
                        icon={CalendarDays}
                        label="Purchase Date"
                        value={formatDate(selectedItem.purchaseDate)}
                      />
                      <InfoRow
                        icon={Truck}
                        label="Supplier"
                        value={selectedItem.supplier}
                      />
                      {selectedItem.customer && (
                        <>
                          <InfoRow
                            icon={User}
                            label="Customer"
                            value={selectedItem.customer}
                          />
                          <InfoRow
                            icon={CalendarDays}
                            label="Sold Date"
                            value={formatDate(selectedItem.soldDate)}
                          />
                        </>
                      )}
                    </div>

                    {/* Warranty warning */}
                    {warrantyExpired && (
                      <div className="p-3 border border-error/15 bg-error/5 flex items-start gap-2">
                        <AlertTriangle
                          size={13}
                          strokeWidth={1.5}
                          className="text-error shrink-0 mt-0.5"
                        />
                        <p className="font-mono text-[9px] tracking-[0.05em] uppercase text-error/70 leading-relaxed">
                          Warranty has expired for this unit. You can still
                          create a claim, but it may not be covered.
                        </p>
                      </div>
                    )}

                    {/* Existing claims notice */}
                    {existingClaims.length > 0 && (
                      <div className="p-3 border border-amber-600/15 bg-amber-600/5 flex items-start gap-2">
                        <Info
                          size={13}
                          strokeWidth={1.5}
                          className="text-amber-600 shrink-0 mt-0.5"
                        />
                        <p className="font-mono text-[9px] tracking-[0.05em] uppercase text-amber-600/70 leading-relaxed">
                          This serial has {existingClaims.length} existing
                          claim{existingClaims.length !== 1 && "s"}:{" "}
                          {existingClaims
                            .map((c) => c.claimNumber)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </FormCard>
          </div>

          {/* Right: Claim Summary (1/3) */}
          <div className="flex flex-col">
            <FormCard
              title="Claim Summary"
              marker="/002"
              className="flex-1"
            >
              <div className="space-y-4">
                {/* Warranty status */}
                <div>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">
                    Warranty Status
                  </span>
                  {selectedItem && warrantyInfo ? (
                    <div
                      className={`h-9 px-3 flex items-center gap-2 border ${warrantyInfo.bg} border-blue-primary/8`}
                    >
                      <ShieldCheck
                        size={13}
                        strokeWidth={1.5}
                        className={warrantyInfo.color}
                      />
                      <span
                        className={`font-mono text-[10px] tracking-[0.08em] uppercase ${warrantyInfo.color}`}
                      >
                        {warrantyInfo.label}
                      </span>
                    </div>
                  ) : (
                    <div className="h-9 px-3 flex items-center border border-blue-primary/8 bg-blue-primary/[0.02]">
                      <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/20">
                        Select a serial first
                      </span>
                    </div>
                  )}
                </div>

                {/* Serial status */}
                <div>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">
                    Serial Status
                  </span>
                  <div className="h-9 px-3 flex items-center border border-blue-primary/8 bg-blue-primary/[0.02]">
                    <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/50">
                      {selectedItem
                        ? selectedItem.status.replace("_", " ")
                        : "\u2014"}
                    </span>
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">
                    Condition
                  </span>
                  <div className="h-9 px-3 flex items-center border border-blue-primary/8 bg-blue-primary/[0.02]">
                    <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/50">
                      {selectedItem ? selectedItem.condition : "\u2014"}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-blue-primary/6" />

                {/* Claim type label */}
                <div>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">
                    Claim Type
                  </span>
                  <div className="h-9 px-3 flex items-center gap-2 border border-blue-primary/8 bg-blue-primary/[0.02]">
                    {(() => {
                      const Icon = CLAIM_TYPE_ICONS[form.claimType];
                      return (
                        <Icon
                          size={12}
                          strokeWidth={1.5}
                          className="text-blue-primary/30"
                        />
                      );
                    })()}
                    <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/50">
                      {CLAIM_TYPE_ARROWS[form.claimType]}
                    </span>
                  </div>
                </div>

                {/* Initial status */}
                <div>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">
                    Initial Status
                  </span>
                  <div className="h-9 px-3 flex items-center gap-2 border border-blue-primary/8 bg-amber-600/5">
                    <Clock
                      size={12}
                      strokeWidth={1.5}
                      className="text-amber-600"
                    />
                    <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-amber-600">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </FormCard>
          </div>
        </div>

        {/* Row 3: Issue Description + Attachments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Issue Description (2/3) */}
          <div className="lg:col-span-2 flex flex-col">
            <FormCard
              title="Issue Details"
              marker="/003"
              className="flex-1 flex flex-col"
            >
              <div className="space-y-4 flex flex-col flex-1">
                <div className="flex flex-col flex-1">
                  <FieldLabel
                    label="Issue Description"
                    required
                    error={errors.issueDescription}
                  />
                  <textarea
                    value={form.issueDescription}
                    onChange={(e) =>
                      update("issueDescription", e.target.value)
                    }
                    placeholder="Describe the issue in detail. What is the problem? When did it start? Has the customer tried any troubleshooting?"
                    rows={6}
                    className={`w-full flex-1 px-3 py-2 bg-cream-light border font-mono text-[11px] tracking-[0.03em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none transition-colors resize-none ${
                      errors.issueDescription
                        ? "border-error/40 focus:border-error/60"
                        : "border-blue-primary/10 focus:border-blue-primary/30"
                    }`}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/20">
                      {form.issueDescription.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </FormCard>
          </div>

          {/* Attachments placeholder (1/3) */}
          <div className="flex flex-col">
            <FormCard
              title="Attachments"
              marker="/004"
              className="flex-1"
            >
              <div className="flex flex-col items-center justify-center gap-3 py-6 border border-dashed border-blue-primary/15 hover:border-blue-primary/25 transition-colors cursor-pointer">
                <Upload
                  size={22}
                  strokeWidth={1}
                  className="text-blue-primary/20"
                />
                <div className="text-center">
                  <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
                    Drag files or click to upload
                  </p>
                  <p className="font-mono text-[7px] tracking-[0.08em] uppercase text-blue-primary/15 mt-1">
                    Photos, documents (coming soon)
                  </p>
                </div>
              </div>
              <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/20 mt-3 text-center">
                Attach photos of damage, receipts, or correspondence
              </p>
            </FormCard>
          </div>
        </div>
      </motion.div>

      {/* ━━━ SUCCESS OVERLAY ━━━ */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-primary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-cream-primary border border-blue-primary/10 p-8 flex flex-col items-center gap-3"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              <CheckCircle2
                size={28}
                strokeWidth={1.5}
                className="text-emerald-600"
              />
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary">
                Claim Created
              </p>
              <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/30">
                Redirecting to claims list...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━ ACTIONS BAR ━━━ */}
      <motion.div
        className="border-t border-blue-primary/10 pt-4 pb-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
        initial={{ y: 15 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease }}
      >
        <button
          type="button"
          onClick={() => router.push("/warranty/claims")}
          className="h-10 px-5 border border-blue-primary/15 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 flex items-center justify-center gap-2 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || submitted}
          className="h-10 px-6 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center justify-center gap-2 hover:bg-blue-dark transition-colors disabled:opacity-60"
        >
          <Save size={13} strokeWidth={1.5} />
          {isSubmitting
            ? "Creating..."
            : submitted
              ? "Created!"
              : "Create Claim"}
        </button>
      </motion.div>

      {/* Bottom marker */}
      <div className="flex items-center justify-between">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.WTY.NEW.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
