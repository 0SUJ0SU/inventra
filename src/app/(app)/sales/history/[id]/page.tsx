// src/app/(app)/sales/history/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Ban,
  Receipt,
  CircleDot,
} from "lucide-react";
import {
  SALE_RECORDS,
  SALE_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG,
  type SaleRecord,
  type SaleStatus,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

// ————————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————————

const ease = [0.16, 1, 0.3, 1] as const;

// ————————————————————————————————————————————————
// HELPERS
// ————————————————————————————————————————————————

function formatSaleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatSaleDateShort(iso: string): string {
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

function buildTimeline(sale: SaleRecord): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    {
      label: "Sale Created",
      sub: `${sale.saleNumber} processed`,
      date: sale.date,
      isLatest: false,
    },
    {
      label: `Payment — ${PAYMENT_METHOD_CONFIG[sale.paymentMethod].label}`,
      sub: formatCurrency(sale.total),
      date: sale.date,
      isLatest: false,
    },
  ];

  if (sale.status === "refunded") {
    entries.push({ label: "Refunded", sub: "Full refund processed", date: sale.date, isLatest: true });
  } else if (sale.status === "partial_refund") {
    entries.push({ label: "Partial Refund", sub: "Partial refund processed", date: sale.date, isLatest: true });
  } else if (sale.status === "voided") {
    entries.push({ label: "Voided", sub: sale.notes ?? "Transaction voided", date: sale.date, isLatest: true });
  } else {
    entries[entries.length - 1] = { ...entries[entries.length - 1], isLatest: true };
  }

  return entries;
}

// ————————————————————————————————————————————————
// SUB-COMPONENTS
// ————————————————————————————————————————————————

function CardHeader({ title, marker }: { title: string; marker?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-blue-primary/8 shrink-0">
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">{title}</p>
      {marker && <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">{marker}</span>}
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-blue-primary/6 last:border-b-0">
      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 shrink-0 pr-4">
        {label}
      </span>
      <span className={`text-right font-mono text-[11px] text-blue-primary ${mono ? "tracking-[0.05em] uppercase" : "tracking-[0.03em]"}`}>
        {value}
      </span>
    </div>
  );
}

function StatCard({ label, value, sub, color = "text-blue-primary" }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="border border-blue-primary/10 bg-cream-light p-4">
      <div className="border-t-2 border-blue-primary pt-2.5">
        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">{label}</p>
        <p className={`font-mono text-2xl font-bold tracking-tight mt-1 leading-none ${color}`}>{value}</p>
        {sub && <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const initial = SALE_RECORDS.find((s) => s.id === id) ?? null;
  const [sale, setSale] = useState<SaleRecord | null>(initial);

  if (!sale) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <ShoppingCart size={32} strokeWidth={1} className="text-blue-primary/15 mb-3" />
        <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/40">Sale not found</p>
        <button
          onClick={() => router.push("/sales/history")}
          className="mt-4 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/60 hover:text-blue-primary flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to sales
        </button>
      </div>
    );
  }

  // — Derived —
  const sCfg = SALE_STATUS_CONFIG[sale.status];
  const isTerminal = sale.status === "voided" || sale.status === "refunded";
  const totalItems = sale.items.reduce((acc, i) => acc + i.qty, 0);
  const timeline = buildTimeline(sale);
  const serializedLines = sale.items.filter((i) => i.serialNumber);

  const handleVoid = () => {
    if (!confirm("Void this sale? This cannot be undone.")) return;
    setSale((prev) => prev ? { ...prev, status: "voided" as SaleStatus } : prev);
  };

  // ————————————————————————————————————————————————
  // RENDER
  // ————————————————————————————————————————————————

  return (
    <div className="space-y-4">

      {/* ━━━ HEADER ━━━ */}
      <div className="flex flex-col gap-3">
        <motion.button
          onClick={() => router.push("/sales/history")}
          className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary flex items-center gap-2 transition-colors w-fit"
          initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.4, ease }}
        >
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to sales
        </motion.button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-1.5 flex-wrap"
              initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease }}
            >
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40">{sale.saleNumber}</span>
              <span className={`font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 ${sCfg.color} ${sCfg.bg}`}>{sCfg.label}</span>
              <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 bg-blue-primary/5 text-blue-primary/50">
                {PAYMENT_METHOD_CONFIG[sale.paymentMethod].label}
              </span>
            </motion.div>
            <motion.h1
              className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-blue-primary leading-none"
              initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.03, ease }}
            >
              {sale.customerName}
            </motion.h1>
            <motion.p
              className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/30 mt-1.5"
              initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.06, ease }}
            >
              {formatSaleDate(sale.date)}
            </motion.p>
          </div>

          {!isTerminal && (
            <motion.div
              className="flex items-center gap-2 flex-wrap"
              initial={{ x: 20 }} animate={{ x: 0 }} transition={{ duration: 0.4, delay: 0.08, ease }}
            >
              <button
                onClick={() => window.print()}
                className="h-9 px-4 border border-blue-primary/15 text-blue-primary/60 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
              >
                <Receipt size={12} strokeWidth={1.5} />
                Print Receipt
              </button>
              <button
                onClick={handleVoid}
                className="h-9 px-4 border border-error/20 text-error/60 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-error/40 hover:text-error transition-colors"
              >
                <Ban size={12} strokeWidth={1.5} />
                Void Sale
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="h-px bg-blue-primary/10" />

      {/* ━━━ ROW 1: 4 STAT CARDS ━━━ */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        <StatCard
          label="Sale Total"
          value={formatCurrency(sale.total)}
          sub={sale.discount > 0 ? `${formatCurrency(sale.discount)} discount applied` : `Subtotal ${formatCurrency(sale.subtotal)}`}
        />
        <StatCard
          label="Items Sold"
          value={totalItems}
          sub={`${sale.items.length} line item${sale.items.length !== 1 ? "s" : ""}`}
        />
        <StatCard
          label="Payment"
          value={PAYMENT_METHOD_CONFIG[sale.paymentMethod].label}
          sub="Method of payment"
        />
        <StatCard
          label="Status"
          value={sCfg.label}
          sub={formatSaleDateShort(sale.date)}
          color={sCfg.color}
        />
      </motion.div>

      {/* ━━━ ROW 2: 1/3 + 2/3 — Sale Info + Line Items ━━━ */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        initial={{ y: 25 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        {/* ── LEFT 1/3: Sale Info ── */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader title="Sale Info" />
          <div className="px-5 py-2 flex-1">
            <InfoRow label="Sale #"     value={sale.saleNumber}            mono />
            <InfoRow label="Date"       value={formatSaleDateShort(sale.date)} mono />
            <InfoRow label="Customer"   value={sale.customerName}          />
            <InfoRow label="Handled By" value={sale.handledBy}             />
            <InfoRow
              label="Payment"
              value={
                <span className="font-mono text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 bg-blue-primary/5 text-blue-primary/60">
                  {PAYMENT_METHOD_CONFIG[sale.paymentMethod].label}
                </span>
              }
            />
            <InfoRow
              label="Status"
              value={
                <span className={`font-mono text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 ${sCfg.color} ${sCfg.bg}`}>
                  {sCfg.label}
                </span>
              }
            />
          </div>
        </div>

        {/* ── RIGHT 2/3: Line Items ── */}
        <div className="lg:col-span-2 border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader title="Line Items" marker="/001" />
          <div className="flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-primary/8 h-9">
                  <th className="text-left px-5 align-middle">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">Product</span>
                  </th>
                  <th className="text-center px-4 align-middle w-20">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">Qty</span>
                  </th>
                  <th className="text-right px-4 align-middle w-28">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">Unit Price</span>
                  </th>
                  <th className="text-right px-5 align-middle w-28">
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">Line Total</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item) => (
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
                        {item.serialNumber && (
                          <span className="ml-2 text-blue-primary/40">· {item.serialNumber}</span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 align-middle text-center w-20">
                      <span className="font-mono text-[11px] tracking-[0.04em] font-semibold text-blue-primary/60">
                        {item.qty}
                      </span>
                    </td>
                    <td className="px-4 align-middle text-right w-28">
                      <span className="font-mono text-[11px] tracking-[0.03em] text-blue-primary/50">
                        {formatCurrency(item.unitPrice)}
                      </span>
                    </td>
                    <td className="px-5 align-middle text-right w-28">
                      <span className="font-mono text-[11px] tracking-[0.03em] font-semibold text-blue-primary">
                        {formatCurrency(item.lineTotal)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Totals — pinned to bottom, columns mirror table exactly */}
          <div className="border-t border-blue-primary/10 mt-auto">
            {sale.discount > 0 && (
              <div className="flex items-center h-10 border-b border-blue-primary/6">
                <div className="flex-1 px-5" />
                <div className="w-20 px-4" />
                <div className="w-28 px-4 text-right">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/30">
                    Discount
                  </span>
                </div>
                <div className="w-28 px-5 text-right">
                  <span className="font-mono text-[11px] tracking-[0.03em] text-warning">
                    -{formatCurrency(sale.discount)}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center h-12 bg-blue-primary/[0.02]">
              <div className="flex-1 px-5" />
              <div className="w-20 px-4" />
              <div className="w-28 px-4 text-right">
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                  Total
                </span>
              </div>
              <div className="w-28 px-5 text-right">
                <span className="font-mono text-[11px] tracking-[0.03em] font-bold text-blue-primary">
                  {formatCurrency(sale.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━ ROW 3: 3 EQUAL COLUMNS ━━━ */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"
        initial={{ y: 25 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.14, ease }}
      >

        {/* ── Col 1: Pricing ── */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader title="Pricing" marker="/002" />
          <div className="px-5 py-2 flex-1">
            <InfoRow label="Subtotal" value={formatCurrency(sale.subtotal)} mono />
            <InfoRow
              label="Discount"
              value={
                sale.discount > 0 ? (
                  <span className="text-warning">-{formatCurrency(sale.discount)}</span>
                ) : "—"
              }
            />
            <InfoRow
              label="Total"
              value={
                <span className="font-semibold">{formatCurrency(sale.total)}</span>
              }
            />
            <InfoRow
              label="Payment"
              value={PAYMENT_METHOD_CONFIG[sale.paymentMethod].label}
              mono
            />
          </div>
          {sale.notes && (
            <div className="px-5 py-3 border-t border-blue-primary/8">
              <p className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/30 mb-1.5">Notes</p>
              <p className="font-mono text-[10px] tracking-[0.03em] text-blue-primary/50 leading-relaxed">
                {sale.notes}
              </p>
            </div>
          )}
        </div>

        {/* ── Col 2: Serialized Lines ── */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader
            title={serializedLines.length > 0 ? `Serialized Lines (${serializedLines.length})` : "Serialized Lines"}
            marker="/003"
          />
          {serializedLines.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 gap-2">
              <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/25">
                No serial numbers
              </p>
              <p className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/15">
                Non-serialized items only
              </p>
            </div>
          ) : (
            <div className="divide-y divide-blue-primary/6 flex-1">
              {serializedLines.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 leading-none mb-1">
                      {item.sku}
                      {item.qty > 1 && (
                        <span className="ml-1.5 text-blue-primary/20">×{item.qty}</span>
                      )}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate leading-none">
                      {item.productName}
                    </p>
                  </div>
                  <Link
                    href="/products/serial-inventory"
                    className="font-mono text-[9px] tracking-[0.06em] uppercase text-blue-primary/50 hover:text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors shrink-0 ml-3"
                  >
                    {item.serialNumber}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Col 3: Timeline ── */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col">
          <CardHeader title="Transaction Timeline" marker="/004" />
          <div className="flex-1 p-4">
            {timeline.map((entry, i) => {
              const isLast = i === timeline.length - 1;
              return (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 flex items-center justify-center border ${
                      entry.isLatest
                        ? "border-blue-primary/30 bg-blue-primary/5"
                        : "border-blue-primary/10 bg-cream-light"
                    }`}>
                      <CircleDot
                        size={11}
                        strokeWidth={1.5}
                        className={entry.isLatest ? "text-blue-primary/60" : "text-blue-primary/25"}
                      />
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 min-h-[20px] bg-blue-primary/10" />
                    )}
                  </div>
                  <div className="pb-4 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-mono text-[10px] tracking-[0.06em] uppercase leading-none ${
                        entry.isLatest ? "text-blue-primary" : "text-blue-primary/50"
                      }`}>
                        {entry.label}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/25 leading-none">
                        {formatSaleDateShort(entry.date)}
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
                <span className={`font-mono text-[9px] tracking-[0.1em] uppercase px-2 py-1 ${sCfg.color} ${sCfg.bg}`}>
                  {sCfg.label}
                </span>
                <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25">
                  No further actions
                </span>
              </div>
            ) : (
              <button
                onClick={handleVoid}
                className="w-full h-9 border border-error/15 font-mono text-[9px] tracking-[0.1em] uppercase text-error/50 flex items-center justify-center gap-2 hover:border-error/30 hover:text-error transition-colors"
              >
                <Ban size={11} strokeWidth={1.5} />
                Void This Sale
              </button>
            )}
          </div>
        </div>

      </motion.div>

      {/* Bottom marker */}
      <div className="flex items-center justify-between">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.SALES.DETAIL]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
