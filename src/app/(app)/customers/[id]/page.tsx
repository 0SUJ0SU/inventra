"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Users,
  TrendingUp,
  Package,
  ShieldAlert,
} from "lucide-react";
import {
  SERIALIZED_ITEMS,
  WARRANTY_CLAIMS,
  type SerializedItem,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

type SortKey = "serial" | "product" | "soldDate" | "soldPrice";
type SortDir = "asc" | "desc";

const ease = [0.16, 1, 0.3, 1] as const;

const CUSTOMER_CONTACTS: Record<string, { email: string; phone: string }> = {
  "tech-haven":   { email: "orders@techhaven.com",   phone: "+1 (415) 882-3310" },
  "circuit-hub":  { email: "procurement@circuithub.io", phone: "+1 (312) 774-9901" },
  "digital-edge": { email: "buying@digitaledge.co",  phone: "+1 (213) 559-0044" },
  "gadget-zone":  { email: "stock@gadgetzone.net",   phone: "+1 (646) 338-7721" },
  "nex-mobile":   { email: "supply@nexmobile.com",   phone: "+1 (512) 991-2267" },
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== col)
    return <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
  ) : (
    <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
  );
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sortKey, setSortKey] = useState<SortKey>("soldDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(loadingTimer);
  }, []);

  const { customerName, contact, purchases, claims } = useMemo(() => {
    const matched = SERIALIZED_ITEMS.filter(
      (serial) => serial.customer && slugify(serial.customer) === id && serial.soldDate && serial.soldPrice
    );
    const name = matched[0]?.customer ?? "Unknown Customer";
    const matchedClaims = WARRANTY_CLAIMS.filter(
      (claim) => claim.customerName && slugify(claim.customerName) === id
    );
    return {
      customerName: name,
      contact: CUSTOMER_CONTACTS[id] ?? { email: "", phone: "" },
      purchases: matched,
      claims: matchedClaims,
    };
  }, [id]);

  const totalUnits = purchases.length;
  const totalSpend = purchases.reduce((acc, purchase) => acc + (purchase.soldPrice ?? 0), 0);
  const avgUnitValue = totalUnits > 0 ? totalSpend / totalUnits : 0;
  const totalClaims = claims.length;
  const openClaims = claims.filter((claim) =>
    ["pending", "in_review", "in_repair"].includes(claim.status)
  ).length;
  const firstPurchase = purchases.length > 0
    ? [...purchases].sort((left, right) => (left.soldDate ?? "").localeCompare(right.soldDate ?? ""))[0].soldDate
    : null;
  const lastPurchase = purchases.length > 0
    ? [...purchases].sort((left, right) => (right.soldDate ?? "").localeCompare(left.soldDate ?? ""))[0].soldDate
    : null;

  const productBreakdown = useMemo(() => {
    const productMap = new Map<string, { count: number; spend: number }>();
    for (const purchase of purchases) {
      const productKey = purchase.productName;
      if (!productMap.has(productKey)) productMap.set(productKey, { count: 0, spend: 0 });
      const totals = productMap.get(productKey)!;
      totals.count++;
      totals.spend += purchase.soldPrice ?? 0;
    }
    return Array.from(productMap.entries())
      .map(([name, totals]) => ({ name, ...totals }))
      .sort((left, right) => right.spend - left.spend);
  }, [purchases]);

  const claimStatusCounts = useMemo(() => {
    const counts = { open: 0, resolved: 0, rejected: 0 };
    for (const claim of claims) {
      if (["pending", "in_review", "in_repair"].includes(claim.status)) counts.open++;
      else if (["repaired", "replaced", "closed"].includes(claim.status)) counts.resolved++;
      else if (claim.status === "rejected") counts.rejected++;
    }
    return counts;
  }, [claims]);

  const sortedPurchases = useMemo(() => {
    const purchasesCopy = [...purchases];
    purchasesCopy.sort((left, right) => {
      let cmp = 0;
      switch (sortKey) {
        case "serial":    cmp = left.serialNumber.localeCompare(right.serialNumber); break;
        case "product":   cmp = left.productName.localeCompare(right.productName); break;
        case "soldDate":  cmp = (left.soldDate ?? "").localeCompare(right.soldDate ?? ""); break;
        case "soldPrice": cmp = (left.soldPrice ?? 0) - (right.soldPrice ?? 0); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return purchasesCopy;
  }, [purchases, sortKey, sortDir]);

  const handleSort = (selectedKey: SortKey) => {
    if (sortKey === selectedKey) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else { setSortKey(selectedKey); setSortDir("asc"); }
  };

  if (!isLoading && purchases.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors mb-6"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Back to Customers
          </Link>
          <div className="text-center py-24">
            <Users size={32} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-4" />
            <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/30">
              Customer not found
            </p>
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
              No purchase records match this customer ID
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <Link
        href="/customers"
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        Back to Customers
      </Link>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {isLoading ? (
            <>
              <div className="h-10 w-64 bg-blue-primary/8 animate-pulse mb-2" />
              <div className="h-3 w-44 bg-blue-primary/5 animate-pulse" />
            </>
          ) : (
            <>
              <motion.h1
                className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
                initial={{ x: -30 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                {customerName}
              </motion.h1>
              <motion.p
                className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease }}
              >
                {contact.email}&nbsp;&middot;&nbsp;{totalUnits} unit{totalUnits !== 1 && "s"} purchased
              </motion.p>
            </>
          )}
        </div>
        <motion.span
          className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          [INV.CUS.DTL]
        </motion.span>
      </div>

      <div className="h-px bg-blue-primary/10" />

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {[
          {
            icon: Package,
            label: "Units Purchased",
            value: isLoading ? "—" : totalUnits.toString(),
            sub: isLoading ? "" : `${productBreakdown.length} product type${productBreakdown.length !== 1 ? "s" : ""}`,
          },
          {
            icon: TrendingUp,
            label: "Total Spend",
            value: isLoading ? "—" : formatCurrency(totalSpend),
            sub: isLoading ? "" : `avg ${formatCurrency(avgUnitValue)} / unit`,
          },
          {
            icon: ShieldAlert,
            label: "Warranty Claims",
            value: isLoading ? "—" : totalClaims.toString(),
            sub: isLoading ? "" : `${openClaims} open`,
          },
          {
            icon: Users,
            label: "Customer Since",
            value: isLoading ? "—" : (firstPurchase ? formatDate(firstPurchase) : "—"),
            sub: isLoading ? "" : (lastPurchase ? `Last: ${formatDate(lastPurchase)}` : ""),
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-cream-light px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
                {kpi.label}
              </span>
              <kpi.icon size={13} strokeWidth={1.5} className="text-blue-primary/15" />
            </div>
            <div>
              <span className="font-sans text-2xl font-bold text-blue-primary leading-none block">
                {kpi.value}
              </span>
              <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25 mt-1.5 block">
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.11, ease }}
      >
        <div className="bg-cream-light p-5 flex flex-col gap-4">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
            Account Info
          </p>
          {[
            { label: "Company",  value: customerName },
            { label: "Email",    value: contact.email },
            { label: "Phone",    value: contact.phone },
            { label: "Since",    value: firstPurchase ? formatDate(firstPurchase) : "—" },
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/25">
                {row.label}
              </span>
              <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary">
                {isLoading
                  ? <span className="inline-block h-2.5 w-32 bg-blue-primary/8 animate-pulse" />
                  : row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-cream-light p-5">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 mb-5">
            Purchase Breakdown
          </p>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, skeletonIndex) => (
                <div key={skeletonIndex} className="h-8 bg-blue-primary/5 animate-pulse" />
              ))}
            </div>
          ) : productBreakdown.length === 0 ? (
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/20">
              No purchases recorded
            </p>
          ) : (
            <div className="space-y-3">
              {productBreakdown.map((product) => {
                const pct = totalSpend > 0 ? (product.spend / totalSpend) * 100 : 0;
                return (
                  <div key={product.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] tracking-[0.06em] uppercase text-blue-primary/60 truncate max-w-[60%]">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/30">
                          {product.count} unit{product.count !== 1 && "s"}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.04em] font-semibold text-blue-primary">
                          {formatCurrency(product.spend)}
                        </span>
                      </div>
                    </div>
                    <div className="h-0.5 bg-blue-primary/8 w-full">
                      <div
                        className="h-full bg-blue-primary transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && totalClaims > 0 && (
            <div className="mt-6 pt-5 border-t border-blue-primary/8">
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 mb-3">
                Warranty Claims
              </p>
              <div className="grid grid-cols-3 gap-px bg-blue-primary/10 border border-blue-primary/10">
                {[
                  { label: "Open",     value: claimStatusCounts.open },
                  { label: "Resolved", value: claimStatusCounts.resolved },
                  { label: "Rejected", value: claimStatusCounts.rejected },
                ].map((status) => (
                  <div key={status.label} className="bg-cream-light px-3 py-4 text-center">
                    <span className="font-mono text-[20px] font-semibold leading-none block text-blue-primary">
                      {status.value}
                    </span>
                    <span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/40 mt-1.5 block">
                      {status.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Purchase History
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
            {sortedPurchases.length} unit{sortedPurchases.length !== 1 && "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="text-left px-5 align-middle">
                  <button
                    onClick={() => handleSort("serial")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Serial # <SortIcon col="serial" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("product")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Product <SortIcon col="product" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("soldDate")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Date <SortIcon col="soldDate" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("soldPrice")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Price <SortIcon col="soldPrice" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                    Warranty
                  </span>
                </th>
                <th className="w-10 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, skeletonIndex) => (
                  <tr key={skeletonIndex} className="border-b border-blue-primary/6 h-14">
                    <td className="px-5 align-middle"><div className="h-2.5 w-28 bg-blue-primary/8 animate-pulse" /></td>
                    <td className="px-3 align-middle"><div className="h-2.5 w-44 bg-blue-primary/8 animate-pulse" /></td>
                    <td className="px-3 align-middle"><div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse" /></td>
                    <td className="px-3 align-middle"><div className="h-2.5 w-16 bg-blue-primary/8 animate-pulse ml-auto" /></td>
                    <td className="px-3 align-middle"><div className="h-5 w-16 bg-blue-primary/8 animate-pulse mx-auto" /></td>
                    <td className="px-3 align-middle" />
                  </tr>
                ))
              ) : sortedPurchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/25">
                      No purchases found
                    </p>
                  </td>
                </tr>
              ) : (
                sortedPurchases.map((purchase) => {
                  const hasClaim = WARRANTY_CLAIMS.some(
                    (claim) => claim.serialNumber === purchase.serialNumber
                  );
                  const warrantyExpired = purchase.warrantyExpiry
                    ? new Date(purchase.warrantyExpiry) < new Date()
                    : false;

                  return (
                    <tr
                      key={purchase.serialNumber}
                      className="border-b border-blue-primary/6 hover:bg-blue-primary/[0.02] transition-colors duration-150 h-14"
                    >
                      <td className="px-5 align-middle">
                        <Link
                          href={`/products/serial-inventory`}
                          className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors"
                        >
                          {purchase.serialNumber}
                        </Link>
                      </td>
                      <td className="px-3 align-middle max-w-[220px]">
                        <p className="font-mono text-[9px] tracking-[0.04em] uppercase text-blue-primary/60 truncate">
                          {purchase.productName}
                        </p>
                        {purchase.productId && (
                          <p className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25 mt-0.5 leading-none">
                            {purchase.productId}
                          </p>
                        )}
                      </td>
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {purchase.soldDate ? formatDate(purchase.soldDate) : "—"}
                        </span>
                      </td>
                      <td className="px-3 align-middle text-right">
                        <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary">
                          {purchase.soldPrice ? formatCurrency(purchase.soldPrice) : "—"}
                        </span>
                      </td>
                      <td className="px-3 align-middle text-center">
                        {purchase.warrantyExpiry ? (
                          <span
                            className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${
                              warrantyExpired
                                ? "text-blue-primary/40 bg-blue-primary/5"
                                : "text-blue-primary bg-blue-primary/10"
                            }`}
                          >
                            {warrantyExpired ? "Expired" : "Active"}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-blue-primary/15">—</span>
                        )}
                        {hasClaim && (
                          <span className="font-mono text-[7px] tracking-[0.08em] uppercase text-blue-primary/30 leading-none block mt-1">
                            claim filed
                          </span>
                        )}
                      </td>
                      <td className="w-10 px-3 align-middle text-center">
                        <Link
                          href={`/products/serial-inventory`}
                          className="p-1 text-blue-primary/20 hover:text-blue-primary transition-colors inline-flex items-center justify-center"
                        >
                          <Eye size={13} strokeWidth={1.5} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && sortedPurchases.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sortedPurchases.length} unit{sortedPurchases.length !== 1 && "s"} &middot; {formatCurrency(totalSpend)} total
            </span>
            <Link
              href="/customers"
              className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors flex items-center gap-1.5"
            >
              All Customers
              <ArrowLeft size={10} strokeWidth={1.5} className="rotate-180" />
            </Link>
          </div>
        )}
      </motion.div>

      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.CUS.DTL.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
