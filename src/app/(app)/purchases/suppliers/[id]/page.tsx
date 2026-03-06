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
  Building2,
  TrendingUp,
  Package,
  CheckCircle2,
} from "lucide-react";
import {
  PURCHASE_ORDERS,
  PURCHASE_STATUS_CONFIG,
  type PurchaseOrder,
  type PurchaseStatus,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

type SortKey = "poNumber" | "date" | "itemCount" | "total" | "status";
type SortDir = "asc" | "desc";

const ease = [0.16, 1, 0.3, 1] as const;

const PURCHASE_STATUSES: PurchaseStatus[] = [
  "draft", "sent", "partial", "received", "cancelled",
];

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

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(loadingTimer);
  }, []);

  const { supplierName, supplierContact, orders } = useMemo(() => {
    const matched = PURCHASE_ORDERS.filter((po) => slugify(po.supplierName) === id);
    return {
      supplierName: matched[0]?.supplierName ?? "Unknown Supplier",
      supplierContact: matched[0]?.supplierContact ?? "",
      orders: matched,
    };
  }, [id]);

  const totalOrders = orders.length;
  const totalSpend = orders
    .filter((po) => po.status === "received" || po.status === "partial")
    .reduce((acc, po) => acc + po.total, 0);
  const allCommitted = orders.reduce((acc, po) => acc + po.total, 0);
  const receivedOrders = orders.filter((po) => po.status === "received").length;
  const activeOrders = orders.filter((po) =>
    ["draft", "sent", "partial"].includes(po.status)
  ).length;
  const avgOrderValue = totalOrders > 0 ? allCommitted / totalOrders : 0;
  const fulfilmentRate =
    totalOrders > 0 ? Math.round((receivedOrders / totalOrders) * 100) : 0;
  const totalUnits = orders.reduce(
    (acc, po) => acc + po.items.reduce((subtotal, lineItem) => subtotal + lineItem.qty, 0),
    0
  );

  const statusCounts = useMemo(() => {
    const counts: Record<PurchaseStatus, number> = {
      draft: 0, sent: 0, partial: 0, received: 0, cancelled: 0,
    };
    orders.forEach((po) => { counts[po.status]++; });
    return counts;
  }, [orders]);

  const sortedOrders = useMemo(() => {
    const ordersCopy = [...orders];
    ordersCopy.sort((left, right) => {
      let cmp = 0;
      switch (sortKey) {
        case "poNumber":   cmp = left.poNumber.localeCompare(right.poNumber); break;
        case "date":       cmp = left.date.localeCompare(right.date); break;
        case "itemCount":  cmp = left.items.length - right.items.length; break;
        case "total":      cmp = left.total - right.total; break;
        case "status": {
          const statusPriority: Record<PurchaseStatus, number> = {
            draft: 0, sent: 1, partial: 2, received: 3, cancelled: 4,
          };
          cmp = statusPriority[left.status] - statusPriority[right.status];
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return ordersCopy;
  }, [orders, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  if (!isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/purchases/suppliers"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors mb-6"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Back to Suppliers
          </Link>
          <div className="text-center py-24">
            <Building2 size={32} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-4" />
            <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/30">
              Supplier not found
            </p>
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
              No purchase orders match this supplier ID
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <Link
        href="/purchases/suppliers"
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        Back to Suppliers
      </Link>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {isLoading ? (
            <>
              <div className="h-10 w-72 bg-blue-primary/8 animate-pulse mb-2" />
              <div className="h-3 w-48 bg-blue-primary/5 animate-pulse" />
            </>
          ) : (
            <>
              <motion.h1
                className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
                initial={{ x: -30 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                {supplierName}
              </motion.h1>
              <motion.p
                className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease }}
              >
                {supplierContact}&nbsp;&middot;&nbsp;{totalOrders} order{totalOrders !== 1 && "s"}
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
          [INV.SUP.DTL]
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
            label: "Total Orders",
            metric: isLoading ? "—" : totalOrders.toString(),
            sub: isLoading ? "" : `${activeOrders} active`,
          },
          {
            icon: TrendingUp,
            label: "Total Spend",
            metric: isLoading ? "—" : formatCurrency(totalSpend),
            sub: isLoading ? "" : `${formatCurrency(allCommitted)} committed`,
          },
          {
            icon: CheckCircle2,
            label: "Fulfilment Rate",
            metric: isLoading ? "—" : `${fulfilmentRate}%`,
            sub: isLoading ? "" : `${receivedOrders} of ${totalOrders} received`,
          },
          {
            icon: Building2,
            label: "Avg Order Value",
            metric: isLoading ? "—" : formatCurrency(avgOrderValue),
            sub: isLoading ? "" : `${totalUnits} units total`,
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
                {kpi.metric}
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
            Supplier Info
          </p>
          {[
            { label: "Company", detail: supplierName },
            { label: "Contact Email", detail: supplierContact },
            { label: "Since", detail: orders.length > 0
                ? formatDate([...orders].sort((left, right) => left.date.localeCompare(right.date))[0].date)
                : "—"
            },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/25">
                {field.label}
              </span>
              <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary">
                {isLoading ? <span className="inline-block h-2.5 w-32 bg-blue-primary/8 animate-pulse" /> : field.detail}
              </span>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-cream-light p-5">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 mb-5">
            Order Breakdown
          </p>
          <div className="grid grid-cols-5 gap-px bg-blue-primary/10 border border-blue-primary/10">
            {PURCHASE_STATUSES.map((status) => {
              const statusConfig = PURCHASE_STATUS_CONFIG[status];
              return (
                <div key={status} className="bg-cream-light px-2 py-4 text-center">
                  <span className={`font-mono text-[20px] font-semibold leading-none block ${statusConfig.color}`}>
                    {isLoading ? "—" : statusCounts[status]}
                  </span>
                  <span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/40 mt-1.5 block">
                    {statusConfig.label}
                  </span>
                </div>
              );
            })}
          </div>

          {!isLoading && allCommitted > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/30">
                  Spend Realised
                </span>
                <span className="font-mono text-[9px] tracking-[0.06em] text-blue-primary/50">
                  {formatCurrency(totalSpend)} / {formatCurrency(allCommitted)}
                </span>
              </div>
              <div className="h-1 bg-blue-primary/8 w-full">
                <div
                  className="h-full bg-blue-primary transition-all duration-700"
                  style={{ width: `${Math.round((totalSpend / allCommitted) * 100)}%` }}
                />
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
            Order History
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
            {sortedOrders.length} order{sortedOrders.length !== 1 && "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="text-left px-5 align-middle">
                  <button
                    onClick={() => handleSort("poNumber")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    PO # <SortIcon col="poNumber" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Date <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                    Items
                  </span>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("itemCount")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Lines <SortIcon col="itemCount" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("total")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Total <SortIcon col="total" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-10 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, skeletonIndex) => (
                  <tr key={skeletonIndex} className="border-b border-blue-primary/6 h-14">
                    <td className="px-5 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-40 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-8 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-5 w-20 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle" />
                  </tr>
                ))
              ) : sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/25">
                      No orders found
                    </p>
                  </td>
                </tr>
              ) : (
                sortedOrders.map((purchaseOrder) => {
                  const statusStyle = PURCHASE_STATUS_CONFIG[purchaseOrder.status];
                  const totalQty = purchaseOrder.items.reduce((acc, lineItem) => acc + lineItem.qty, 0);
                  const totalReceived = purchaseOrder.items.reduce((acc, lineItem) => acc + lineItem.qtyReceived, 0);
                  const productNames = purchaseOrder.items.map((lineItem) => lineItem.productName).join(", ");

                  return (
                    <tr
                      key={purchaseOrder.id}
                      className="border-b border-blue-primary/6 hover:bg-blue-primary/[0.02] transition-colors duration-150 h-14"
                    >
                      <td className="px-5 align-middle">
                        <Link
                          href={`/purchases/${purchaseOrder.id}`}
                          className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors"
                        >
                          {purchaseOrder.poNumber}
                        </Link>
                      </td>
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {formatDate(purchaseOrder.date)}
                        </span>
                      </td>
                      <td className="px-3 align-middle max-w-[220px]">
                        <p className="font-mono text-[9px] tracking-[0.04em] uppercase text-blue-primary/50 truncate">
                          {productNames}
                        </p>
                      </td>
                      <td className="px-3 align-middle text-center">
                        <span className="font-mono text-[11px] font-semibold text-blue-primary/60">
                          {purchaseOrder.items.length}
                        </span>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block leading-none mt-0.5">
                          {totalQty} units
                        </span>
                      </td>
                      <td className="px-3 align-middle text-right">
                        <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary">
                          {formatCurrency(purchaseOrder.total)}
                        </span>
                      </td>
                      <td className="px-3 align-middle">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${statusStyle.color} ${statusStyle.bg}`}
                          >
                            {statusStyle.label}
                          </span>
                          {(purchaseOrder.status === "partial" || purchaseOrder.status === "received") && (
                            <span className="font-mono text-[7px] tracking-[0.08em] uppercase text-blue-primary/30 leading-none">
                              {totalReceived}/{totalQty} recv
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="w-10 px-3 align-middle text-center">
                        <Link
                          href={`/purchases/${purchaseOrder.id}`}
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

        {!isLoading && sortedOrders.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sortedOrders.length} order{sortedOrders.length !== 1 && "s"} &middot; {formatCurrency(allCommitted)} committed
            </span>
            <Link
              href="/purchases"
              className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors flex items-center gap-1.5"
            >
              View All Orders
              <ArrowLeft size={10} strokeWidth={1.5} className="rotate-180" />
            </Link>
          </div>
        )}
      </motion.div>

      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.SUP.DTL.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
