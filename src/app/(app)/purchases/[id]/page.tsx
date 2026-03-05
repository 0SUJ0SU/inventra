// src/app/(app)/purchases/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Truck,
  Ban,
  CircleDot,
  Send,
  PackageCheck,
} from "lucide-react";
import {
  PURCHASE_ORDERS,
  PURCHASE_STATUS_CONFIG,
  type PurchaseOrder,
  type PurchaseStatus,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";

// ————————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————————

const ease = [0.16, 1, 0.3, 1] as const;

// ————————————————————————————————————————————————
// HELPERS
// ————————————————————————————————————————————————

function formatPoDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatPoDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface TimelineEntry {
  label: string;
  sub: string;
  date: string;
  isLatest: boolean;
}

function buildTimeline(order: PurchaseOrder): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    {
      label: "Order Created",
      sub: `${order.poNumber} drafted`,
      date: order.date,
      isLatest: false,
    },
  ];

  if (order.status === "cancelled") {
    entries.push({
      label: "Order Cancelled",
      sub: order.notes ?? "Purchase order cancelled",
      date: order.date,
      isLatest: true,
    });
    return entries;
  }

  if (order.status !== "draft") {
    entries.push({
      label: "Sent to Supplier",
      sub: `Sent to ${order.supplierName}`,
      date: order.date,
      isLatest: false,
    });
  }

  if (order.status === "partial") {
    const totalQty = order.items.reduce((a, i) => a + i.qty, 0);
    const totalReceived = order.items.reduce((a, i) => a + i.qtyReceived, 0);
    entries.push({
      label: "Partially Received",
      sub: `${totalReceived} of ${totalQty} units received`,
      date: order.expectedDate,
      isLatest: true,
    });
  } else if (order.status === "received") {
    entries.push({
      label: "Fully Received",
      sub: "All units received and stocked",
      date: order.expectedDate,
      isLatest: true,
    });
  } else if (order.status === "sent") {
    entries[entries.length - 1] = {
      ...entries[entries.length - 1],
      isLatest: true,
    };
  } else if (order.status === "draft") {
    entries[entries.length - 1] = {
      ...entries[entries.length - 1],
      isLatest: true,
    };
  }

  return entries;
}

// ————————————————————————————————————————————————
// SUB-COMPONENTS
// ————————————————————————————————————————————————

function CardHeader({ title, marker }: { title: string; marker?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-blue-primary/8 shrink-0">
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

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-blue-primary/6 last:border-b-0">
      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 shrink-0 pr-4">
        {label}
      </span>
      <span
        className={`text-right font-mono text-[11px] text-blue-primary ${
          mono ? "tracking-[0.05em] uppercase" : "tracking-[0.03em]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color = "text-blue-primary",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="border border-blue-primary/10 bg-cream-light p-4">
      <div className="border-t-2 border-blue-primary pt-2.5">
        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">
          {label}
        </p>
        <p
          className={`font-mono text-2xl font-bold tracking-tight mt-1 leading-none ${color}`}
        >
          {value}
        </p>
        {sub && (
          <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 mt-1.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const initial = PURCHASE_ORDERS.find((o) => o.id === id) ?? null;
  const [order, setOrder] = useState<PurchaseOrder | null>(initial);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Truck
          size={32}
          strokeWidth={1}
          className="text-blue-primary/15 mb-3"
        />
        <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/40">
          Purchase order not found
        </p>
        <button
          onClick={() => router.push("/purchases")}
          className="mt-4 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/60 hover:text-blue-primary flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to orders
        </button>
      </div>
    );
  }

  // — Derived —
  const sCfg = PURCHASE_STATUS_CONFIG[order.status];
  const isTerminal =
    order.status === "cancelled" || order.status === "received";
  const totalQty = order.items.reduce((a, i) => a + i.qty, 0);
  const totalReceived = order.items.reduce((a, i) => a + i.qtyReceived, 0);
  const timeline = buildTimeline(order);

  const handleCancel = () => {
    if (!confirm("Cancel this purchase order? This cannot be undone.")) return;
    setOrder((prev) =>
      prev ? { ...prev, status: "cancelled" as PurchaseStatus } : prev
    );
  };

  const handleMarkSent = () => {
    setOrder((prev) =>
      prev ? { ...prev, status: "sent" as PurchaseStatus } : prev
    );
  };

  const handleMarkReceived = () => {
    if (!confirm("Mark this order as fully received?")) return;
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: "received" as PurchaseStatus,
            items: prev.items.map((i) => ({ ...i, qtyReceived: i.qty })),
          }
        : prev
    );
  };

  // ————————————————————————————————————————————————
  // RENDER
  // ————————————————————————————————————————————————

  return (
    <div className="space-y-4">

      {/* ┌── HEADER ──┐ */}
      <div className="flex flex-col gap-3">
        <motion.button
          onClick={() => router.push("/purchases")}
          className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary flex items-center gap-2 transition-colors w-fit"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to orders
        </motion.button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-1.5 flex-wrap"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40">
                {order.poNumber}
              </span>
              <span
                className={`font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 ${sCfg.color} ${sCfg.bg}`}
              >
                {sCfg.label}
              </span>
              {(order.status === "partial" || order.status === "received") && (
                <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 bg-blue-primary/5 text-blue-primary/50">
                  {totalReceived}/{totalQty} units recv
                </span>
              )}
            </motion.div>
            <motion.h1
              className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-blue-primary leading-none"
              initial={{ x: -30 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.03, ease }}
            >
              {order.supplierName}
            </motion.h1>
            <motion.p
              className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/30 mt-1.5"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease }}
            >
              {formatPoDate(order.date)}
            </motion.p>
          </div>

          <motion.div
            className="flex items-center gap-2 flex-wrap"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease }}
          >
            {order.status === "draft" && (
              <button
                onClick={handleMarkSent}
                className="h-9 px-4 border border-blue-primary/15 text-blue-primary/60 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
              >
                <Send size={12} strokeWidth={1.5} />
                Mark as Sent
              </button>
            )}
            {(order.status === "sent" || order.status === "partial") && (
              <button
                onClick={handleMarkReceived}
                className="h-9 px-4 border border-success/20 text-success/70 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-success/40 hover:text-success transition-colors"
              >
                <PackageCheck size={12} strokeWidth={1.5} />
                Mark Received
              </button>
            )}
            {!isTerminal && (
              <button
                onClick={handleCancel}
                className="h-9 px-4 border border-error/20 text-error/60 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-error/40 hover:text-error transition-colors"
              >
                <Ban size={12} strokeWidth={1.5} />
                Cancel Order
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="h-px bg-blue-primary/10" />

      {/* ┌── ROW 1: 4 STAT CARDS ──┐ */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        <StatCard
          label="Order Total"
          value={formatCurrency(order.total)}
          sub={
            order.shippingCost > 0
              ? `${formatCurrency(order.shippingCost)} shipping included`
              : `Subtotal ${formatCurrency(order.subtotal)}`
          }
        />
        <StatCard
          label="Units Ordered"
          value={totalQty}
          sub={`${order.items.length} line item${order.items.length !== 1 ? "s" : ""}`}
        />
        <StatCard
          label="Units Received"
          value={totalReceived}
          sub={
            totalReceived === totalQty
              ? "Fully received"
              : `${totalQty - totalReceived} pending`
          }
          color={
            totalReceived === totalQty
              ? "text-success"
              : totalReceived > 0
              ? "text-warning"
              : "text-blue-primary"
          }
        />
        <StatCard
          label="Status"
          value={sCfg.label}
          sub={`Expected ${formatPoDateShort(order.expectedDate)}`}
          color={sCfg.color}
        />
      </motion.div>

      {/* ┌── ROW 2: 1/3 + 2/3 — Order Info + Line Items ──┐ */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        initial={{ y: 25 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        {/* —— LEFT 1/3: Order Info —— */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader title="Order Info" />
          <div className="px-5 py-2 flex-1">
            <InfoRow label="PO #"      value={order.poNumber}                    mono />
            <InfoRow label="Order Date" value={formatPoDateShort(order.date)}    mono />
            <InfoRow label="Expected"   value={formatPoDateShort(order.expectedDate)} mono />
            <InfoRow label="Supplier"   value={order.supplierName}               />
            <InfoRow label="Contact"    value={order.supplierContact}            />
            <InfoRow label="Handled By" value={order.handledBy}                  />
            <InfoRow
              label="Status"
              value={
                <span
                  className={`font-mono text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 ${sCfg.color} ${sCfg.bg}`}
                >
                  {sCfg.label}
                </span>
              }
            />
          </div>
        </div>

        {/* —— RIGHT 2/3: Line Items —— */}
        <div className="lg:col-span-2 border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader title="Line Items" marker="/001" />
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-primary/8 h-9">
                  <th className="text-left px-5 align-middle">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
                      Product
                    </span>
                  </th>
                  <th className="text-center px-4 align-middle w-20">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
                      Ordered
                    </span>
                  </th>
                  <th className="text-center px-4 align-middle w-24">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
                      Received
                    </span>
                  </th>
                  <th className="text-right px-4 align-middle w-28">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
                      Unit Cost
                    </span>
                  </th>
                  <th className="text-right px-5 align-middle w-28">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
                      Line Total
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const fullyReceived = item.qtyReceived >= item.qty;
                  const partiallyReceived =
                    item.qtyReceived > 0 && item.qtyReceived < item.qty;
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-blue-primary/6 last:border-b-0 h-14 hover:bg-blue-primary/[0.02] transition-colors"
                    >
                      <td className="px-5 align-middle">
                        <p className="font-mono text-[11px] tracking-[0.04em] uppercase text-blue-primary leading-none">
                          {item.productName}
                        </p>
                        <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30 mt-1 leading-none">
                          {item.sku}
                        </p>
                      </td>
                      <td className="px-4 align-middle text-center w-20">
                        <span className="font-mono text-[11px] tracking-[0.04em] font-semibold text-blue-primary/60">
                          {item.qty}
                        </span>
                      </td>
                      <td className="px-4 align-middle text-center w-24">
                        <span
                          className={`font-mono text-[11px] tracking-[0.04em] font-semibold ${
                            fullyReceived
                              ? "text-success"
                              : partiallyReceived
                              ? "text-warning"
                              : "text-blue-primary/30"
                          }`}
                        >
                          {item.qtyReceived}
                        </span>
                        {partiallyReceived && (
                          <span className="font-mono text-[7px] tracking-[0.08em] uppercase text-warning/60 block leading-none mt-0.5">
                            partial
                          </span>
                        )}
                      </td>
                      <td className="px-4 align-middle text-right w-28">
                        <span className="font-mono text-[11px] tracking-[0.03em] text-blue-primary/50">
                          {formatCurrency(item.unitCost)}
                        </span>
                      </td>
                      <td className="px-5 align-middle text-right w-28">
                        <span className="font-mono text-[11px] tracking-[0.03em] font-semibold text-blue-primary">
                          {formatCurrency(item.lineTotal)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Totals — pinned to bottom */}
          <div className="border-t border-blue-primary/10 mt-auto">
            {order.shippingCost > 0 && (
              <div className="flex items-center h-10 border-b border-blue-primary/6">
                <div className="flex-1 px-5" />
                <div className="w-20 px-4" />
                <div className="w-24 px-4" />
                <div className="w-28 px-4 text-right">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/30">
                    Shipping
                  </span>
                </div>
                <div className="w-28 px-5 text-right">
                  <span className="font-mono text-[11px] tracking-[0.03em] text-blue-primary/50">
                    +{formatCurrency(order.shippingCost)}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center h-12 bg-blue-primary/[0.02]">
              <div className="flex-1 px-5" />
              <div className="w-20 px-4" />
              <div className="w-24 px-4" />
              <div className="w-28 px-4 text-right">
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                  Total
                </span>
              </div>
              <div className="w-28 px-5 text-right">
                <span className="font-mono text-[11px] tracking-[0.03em] font-bold text-blue-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ┌── ROW 3: 3 EQUAL COLUMNS ──┐ */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"
        initial={{ y: 25 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.14, ease }}
      >

        {/* —— Col 1: Pricing & Shipping —— */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader title="Pricing & Shipping" marker="/002" />
          <div className="px-5 py-2 flex-1">
            <InfoRow label="Subtotal" value={formatCurrency(order.subtotal)} mono />
            <InfoRow
              label="Shipping"
              value={
                order.shippingCost > 0
                  ? formatCurrency(order.shippingCost)
                  : "—"
              }
              mono
            />
            <InfoRow
              label="Total"
              value={
                <span className="font-semibold">
                  {formatCurrency(order.total)}
                </span>
              }
            />
            <InfoRow
              label="Expected"
              value={formatPoDateShort(order.expectedDate)}
              mono
            />
            <InfoRow label="Supplier" value={order.supplierName} />
            <InfoRow label="Contact" value={order.supplierContact} />
          </div>
          {order.notes && (
            <div className="px-5 py-3 border-t border-blue-primary/8 shrink-0">
              <p className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/30 mb-1.5">
                Notes
              </p>
              <p className="font-mono text-[10px] tracking-[0.03em] text-blue-primary/50 leading-relaxed">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* —— Col 2: Receiving Status —— */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader
            title={`Receiving Status (${totalReceived}/${totalQty})`}
            marker="/003"
          />
          <div className="divide-y divide-blue-primary/6 flex-1">
            {order.items.map((item) => {
              const pct =
                item.qty > 0
                  ? Math.round((item.qtyReceived / item.qty) * 100)
                  : 0;
              const fullyReceived = item.qtyReceived >= item.qty;
              const partiallyReceived =
                item.qtyReceived > 0 && item.qtyReceived < item.qty;

              return (
                <div key={item.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 leading-none mb-1">
                        {item.sku}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate leading-none">
                        {item.productName}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-[10px] tracking-[0.04em] font-semibold shrink-0 ${
                        fullyReceived
                          ? "text-success"
                          : partiallyReceived
                          ? "text-warning"
                          : "text-blue-primary/30"
                      }`}
                    >
                      {item.qtyReceived}/{item.qty}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 bg-blue-primary/8 w-full">
                    <div
                      className={`h-full transition-all duration-500 ${
                        fullyReceived
                          ? "bg-success"
                          : partiallyReceived
                          ? "bg-warning"
                          : "bg-blue-primary/15"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/25 mt-1 leading-none">
                    {pct}% received
                  </p>
                </div>
              );
            })}
          </div>
          {/* Summary footer */}
          <div className="shrink-0 border-t border-blue-primary/8 px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
                Overall progress
              </span>
              <span
                className={`font-mono text-[11px] tracking-[0.04em] font-semibold ${
                  totalReceived === totalQty
                    ? "text-success"
                    : totalReceived > 0
                    ? "text-warning"
                    : "text-blue-primary/30"
                }`}
              >
                {totalQty > 0
                  ? Math.round((totalReceived / totalQty) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="h-1 bg-blue-primary/8 w-full mt-1.5">
              <div
                className={`h-full transition-all duration-500 ${
                  totalReceived === totalQty
                    ? "bg-success"
                    : totalReceived > 0
                    ? "bg-warning"
                    : "bg-blue-primary/15"
                }`}
                style={{
                  width: `${
                    totalQty > 0
                      ? Math.round((totalReceived / totalQty) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* —— Col 3: Timeline —— */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader title="Order Timeline" marker="/004" />
          <div className="flex-1 p-4">
            {timeline.map((entry, i) => {
              const isLast = i === timeline.length - 1;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-6 h-6 flex items-center justify-center border ${
                        entry.isLatest
                          ? "border-blue-primary/30 bg-blue-primary/5"
                          : "border-blue-primary/10 bg-cream-light"
                      }`}
                    >
                      <CircleDot
                        size={11}
                        strokeWidth={1.5}
                        className={
                          entry.isLatest
                            ? "text-blue-primary/60"
                            : "text-blue-primary/25"
                        }
                      />
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 min-h-[20px] bg-blue-primary/10" />
                    )}
                  </div>
                  <div className="pb-4 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-mono text-[10px] tracking-[0.06em] uppercase leading-none ${
                          entry.isLatest
                            ? "text-blue-primary"
                            : "text-blue-primary/50"
                        }`}
                      >
                        {entry.label}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/25 leading-none">
                        {formatPoDateShort(entry.date)}
                      </span>
                    </div>
                    <p className="font-mono text-[9px] tracking-[0.02em] text-blue-primary/40 mt-1 leading-relaxed">
                      {entry.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-blue-primary/8 p-4">
            {isTerminal ? (
              <div className="flex items-center gap-2 justify-center">
                <span
                  className={`font-mono text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${sCfg.color} ${sCfg.bg}`}
                >
                  {sCfg.label}
                </span>
                <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25">
                  No further actions
                </span>
              </div>
            ) : order.status === "draft" ? (
              <button
                onClick={handleMarkSent}
                className="w-full h-9 border border-blue-primary/15 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 flex items-center justify-center gap-2 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
              >
                <Send size={11} strokeWidth={1.5} />
                Mark as Sent
              </button>
            ) : (
              <button
                onClick={handleMarkReceived}
                className="w-full h-9 border border-success/15 font-mono text-[9px] tracking-[0.1em] uppercase text-success/50 flex items-center justify-center gap-2 hover:border-success/30 hover:text-success transition-colors"
              >
                <PackageCheck size={11} strokeWidth={1.5} />
                Mark Fully Received
              </button>
            )}
          </div>
        </div>

      </motion.div>

      {/* Bottom marker */}
      <div className="flex items-center justify-between">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.PO.DETAIL]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
