// src/app/(app)/warranty/claims/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CircleDot,
  Send,
} from "lucide-react";
import {
  WARRANTY_CLAIMS,
  SERIALIZED_ITEMS,
  CLAIM_STATUS_CONFIG,
  CLAIM_STATUS_TRANSITIONS,
  getWarrantyStatus,
  type WarrantyClaim,
  type WarrantyClaimNote,
  type ClaimStatus,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import {
  WARRANTY_EASE as ease,
  CLAIM_TYPE_SHORT,
  STATUS_WORKFLOW_ICONS,
  formatClaimDate as formatDate,
  formatClaimDateShort as formatDateShort,
} from "@/lib/warranty-utils";

// ————————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————————

const WARRANTY_STATUS_CONFIG = {
  active:        { label: "Active",        color: "text-emerald-700",     bg: "bg-emerald-700/10" },
  expiring_soon: { label: "Expiring Soon", color: "text-warning",         bg: "bg-warning/10"     },
  expired:       { label: "Expired",       color: "text-error",           bg: "bg-error/10"       },
  "n/a":         { label: "N/A",           color: "text-blue-primary/40", bg: "bg-blue-primary/5" },
};

// ————————————————————————————————————————————————
// HELPERS
// ————————————————————————————————————————————————

function getDaysOpen(claimDate: string, updatedAt: string, status: ClaimStatus): number {
  const start = new Date(claimDate);
  const end = (status === "closed" || status === "rejected") ? new Date(updatedAt) : new Date();
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
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

export default function WarrantyClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const initial = WARRANTY_CLAIMS.find((c) => c.id === id) ?? null;
  const [claim, setClaim] = useState<WarrantyClaim | null>(initial);
  const [newNote, setNewNote] = useState("");

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <ShieldCheck size={32} strokeWidth={1} className="text-blue-primary/15 mb-3" />
        <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/40">Claim not found</p>
        <button
          onClick={() => router.push("/warranty/claims")}
          className="mt-4 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/60 hover:text-blue-primary flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to claims
        </button>
      </div>
    );
  }

  // — Derived —
  const sCfg        = CLAIM_STATUS_CONFIG[claim.status];
  const nextStatuses = CLAIM_STATUS_TRANSITIONS[claim.status];
  const daysOpen    = getDaysOpen(claim.claimDate, claim.updatedAt, claim.status);
  const isTerminal  = claim.status === "closed" || claim.status === "rejected";

  const serialItem     = SERIALIZED_ITEMS.find((s) => s.id === claim.serializedItemId) ?? null;
  const warrantyStatus = serialItem ? getWarrantyStatus(serialItem) : "n/a";
  const wCfg           = WARRANTY_STATUS_CONFIG[warrantyStatus];

  const relatedClaims = WARRANTY_CLAIMS.filter(
    (c) => c.serializedItemId === claim.serializedItemId && c.id !== claim.id
  );

  // — Handlers —
  const handleStatusUpdate = (newStatus: ClaimStatus) => {
    const now = new Date().toISOString().split("T")[0];
    setClaim((prev) => !prev ? prev : {
      ...prev,
      status: newStatus,
      updatedAt: now,
      statusHistory: [
        ...prev.statusHistory,
        { from: prev.status, to: newStatus, date: now, note: `Status changed to ${CLAIM_STATUS_CONFIG[newStatus].label}` },
      ],
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    const noteObj: WarrantyClaimNote = {
      id: `wcn-${Date.now()}`,
      warrantyClaimId: claim.id,
      note: newNote.trim(),
      createdBy: "Admin",
      createdAt: now,
    };
    setClaim((prev) => !prev ? prev : { ...prev, notes: [...prev.notes, noteObj], updatedAt: now });
    setNewNote("");
  };

  // ————————————————————————————————————————————————
  // RENDER
  // ————————————————————————————————————————————————

  return (
    <div className="space-y-4">

      {/* ━━━ HEADER ━━━ */}
      <div className="flex flex-col gap-3">
        <motion.button
          onClick={() => router.push("/warranty/claims")}
          className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary flex items-center gap-2 transition-colors w-fit"
          initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.4, ease }}
        >
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to claims
        </motion.button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-1.5 flex-wrap"
              initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease }}
            >
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40">{claim.claimNumber}</span>
              <span className={`font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 ${sCfg.color} ${sCfg.bg}`}>{sCfg.label}</span>
              <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 bg-blue-primary/5 text-blue-primary/50">
                {CLAIM_TYPE_SHORT[claim.claimType]}
              </span>
            </motion.div>
            <motion.h1
              className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-blue-primary leading-none"
              initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.03, ease }}
            >
              {claim.productName}
            </motion.h1>
            <motion.p
              className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/30 mt-1.5"
              initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.06, ease }}
            >
              {claim.serialNumber}
            </motion.p>
          </div>

          {nextStatuses.length > 0 && (
            <motion.div
              className="flex items-center gap-2 flex-wrap"
              initial={{ x: 20 }} animate={{ x: 0 }} transition={{ duration: 0.4, delay: 0.08, ease }}
            >
              {nextStatuses.map((ns, i) => {
                const nCfg = CLAIM_STATUS_CONFIG[ns];
                const Icon = STATUS_WORKFLOW_ICONS[ns];
                return (
                  <button
                    key={ns}
                    onClick={() => handleStatusUpdate(ns)}
                    className={`h-9 px-4 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 transition-colors ${
                      i === 0
                        ? "bg-blue-primary text-cream-primary hover:bg-blue-dark"
                        : "border border-blue-primary/15 text-blue-primary/60 hover:border-blue-primary/30 hover:text-blue-primary"
                    }`}
                  >
                    <Icon size={12} strokeWidth={1.5} />
                    {nCfg.label}
                    <ArrowRight size={10} strokeWidth={1.5} className={i === 0 ? "text-cream-primary/40" : "text-blue-primary/20"} />
                  </button>
                );
              })}
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
        <StatCard label="Claim Date" value={formatDate(claim.claimDate).split(",")[0]} sub={formatDate(claim.claimDate)} />
        <StatCard
          label="Status"
          value={sCfg.label}
          sub={nextStatuses.length > 0 ? `${nextStatuses.length} action${nextStatuses.length !== 1 ? "s" : ""} available` : "Terminal state"}
          color={sCfg.color}
        />
        <StatCard
          label="Repair Cost"
          value={claim.repairCost !== null ? formatCurrency(claim.repairCost) : "\u2014"}
          sub={claim.repairCost !== null ? "Cost incurred" : "Not yet determined"}
        />
        <StatCard
          label="Days Open"
          value={daysOpen}
          sub={isTerminal ? "Days to resolution" : "Days and counting"}
          color={!isTerminal && daysOpen > 14 ? "text-warning" : "text-blue-primary"}
        />
      </motion.div>

      {/* ━━━ ROW 2: 3-COLUMN GRID ━━━ */}
      {/*
        Left  col: Serial Info + Customer (stacked)
        Middle col: Issue Description + Workflow Actions + Status History (stacked)
        Right  col: Notes — single tall card with internal scroll
      */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"
        initial={{ y: 25 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.12, ease }}
      >

        {/* ── LEFT: Serial Info + Customer ── */}
        <div className="flex flex-col gap-4">

          {/* Serial Info */}
          <div className="border border-blue-primary/10 bg-cream-light">
            <CardHeader title="Serial Info" />
            <div className="px-5 py-2">
              <InfoRow label="Serial #" value={claim.serialNumber} mono />
              <InfoRow label="Product" value={claim.productName} />
              {serialItem?.purchaseDate && <InfoRow label="Purchased" value={formatDate(serialItem.purchaseDate)} mono />}
              {serialItem?.soldDate     && <InfoRow label="Sold"      value={formatDate(serialItem.soldDate)}     mono />}
              {serialItem?.warrantyExpiry && <InfoRow label="Warranty Exp." value={formatDate(serialItem.warrantyExpiry)} mono />}
              <InfoRow
                label="Warranty"
                value={
                  <span className={`font-mono text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 ${wCfg.color} ${wCfg.bg}`}>
                    {wCfg.label}
                  </span>
                }
              />
              {claim.replacementSerialNumber && <InfoRow label="Replacement" value={claim.replacementSerialNumber} mono />}
            </div>
          </div>

          {/* Customer / Supplier */}
          <div className="border border-blue-primary/10 bg-cream-light flex-1 flex flex-col">
            <CardHeader title={claim.claimType === "customer_to_store" ? "Customer" : "Supplier"} />
            <div className="px-5 py-2">
              {claim.customerName && <InfoRow label="Name"     value={claim.customerName} />}
              {claim.supplierName && <InfoRow label="Supplier" value={claim.supplierName} />}
              <InfoRow
                label="Claim Type"
                value={
                  <span className="font-mono text-[9px] tracking-[0.06em] uppercase px-1.5 py-0.5 bg-blue-primary/5 text-blue-primary/60">
                    {CLAIM_TYPE_SHORT[claim.claimType]}
                  </span>
                }
              />
              <InfoRow label="Filed"        value={formatDate(claim.claimDate)}  mono />
              <InfoRow label="Last Updated" value={formatDate(claim.updatedAt)}  mono />
              {claim.repairCost !== null && <InfoRow label="Repair Cost" value={formatCurrency(claim.repairCost)} mono />}
            </div>
          </div>

          {/* Linked Claims (if any) */}
          {relatedClaims.length > 0 && (
            <div className="border border-blue-primary/10 bg-cream-light">
              <CardHeader title={`Linked Claims (${relatedClaims.length})`} />
              <div className="divide-y divide-blue-primary/6">
                {relatedClaims.map((rc) => {
                  const rcCfg = CLAIM_STATUS_CONFIG[rc.status];
                  return (
                    <Link
                      key={rc.id}
                      href={`/warranty/claims/${rc.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-blue-primary/[0.02] transition-colors group"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary group-hover:underline underline-offset-2 decoration-blue-primary/30">
                          {rc.claimNumber}
                        </span>
                        <span className={`font-mono text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 self-start ${rcCfg.color} ${rcCfg.bg}`}>
                          {rcCfg.label}
                        </span>
                      </div>
                      <ArrowRight size={12} strokeWidth={1.5} className="text-blue-primary/20 group-hover:text-blue-primary/50 transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── MIDDLE: Issue + Workflow + History ── */}
        <div className="flex flex-col gap-4">

          {/* Issue Description */}
          <div className="border border-blue-primary/10 bg-cream-light">
            <CardHeader title="Issue Description" marker="/001" />
            <div className="p-5">
              <p className="font-mono text-[11px] tracking-[0.03em] text-blue-primary/70 leading-relaxed">
                {claim.issueDescription}
              </p>
            </div>
          </div>

          {/* Resolution (when set) */}
          {claim.resolution && (
            <div className="border border-emerald-700/15 bg-cream-light">
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-emerald-700/10 shrink-0">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-emerald-700/50">Resolution</p>
                <span className="font-mono text-[9px] tracking-[0.1em] text-emerald-700/25">/002</span>
              </div>
              <div className="p-5">
                <p className="font-mono text-[11px] tracking-[0.03em] text-emerald-700/70 leading-relaxed">
                  {claim.resolution}
                </p>
              </div>
            </div>
          )}

          {/* Workflow Actions */}
          <div className="border border-blue-primary/10 bg-cream-light">
            <CardHeader title="Workflow Actions" />
            {nextStatuses.length > 0 ? (
              <div className="p-4 space-y-2">
                {nextStatuses.map((ns) => {
                  const nCfg = CLAIM_STATUS_CONFIG[ns];
                  const Icon = STATUS_WORKFLOW_ICONS[ns];
                  return (
                    <button
                      key={ns}
                      onClick={() => handleStatusUpdate(ns)}
                      className="w-full h-9 px-3 border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase flex items-center justify-between hover:border-blue-primary/30 hover:bg-blue-primary/[0.02] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={12} strokeWidth={1.5} className={`${nCfg.color} shrink-0`} />
                        <span className={nCfg.color}>{nCfg.label}</span>
                      </div>
                      <ArrowRight size={10} strokeWidth={1.5} className="text-blue-primary/15 group-hover:text-blue-primary/40 transition-colors" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-5 flex items-center gap-2">
                <ShieldCheck size={14} strokeWidth={1.5} className="text-blue-primary/15 shrink-0" />
                <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/25">No further actions</p>
              </div>
            )}
          </div>

          {/* Status History */}
          <div className="border border-blue-primary/10 bg-cream-light flex-1 flex flex-col">
            <CardHeader title="Status History" />
            <div className="p-4">
              {claim.statusHistory.map((entry, i) => {
                const Icon  = STATUS_WORKFLOW_ICONS[entry.to] ?? CircleDot;
                const isLast = i === claim.statusHistory.length - 1;
                const cfg   = CLAIM_STATUS_CONFIG[entry.to];
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-6 h-6 flex items-center justify-center border ${
                        isLast ? "border-blue-primary/30 bg-blue-primary/5" : "border-blue-primary/10 bg-cream-light"
                      }`}>
                        <Icon size={11} strokeWidth={1.5} className={isLast ? "text-blue-primary/60" : "text-blue-primary/25"} />
                      </div>
                      {!isLast && <div className="w-px flex-1 min-h-[16px] bg-blue-primary/10" />}
                    </div>
                    <div className="pb-3 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 leading-none ${cfg.color} ${cfg.bg}`}>
                          {cfg.label}
                        </span>
                        <span className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/25 leading-none">
                          {formatDateShort(entry.date)}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] tracking-[0.02em] text-blue-primary/40 mt-1 leading-relaxed">
                        {entry.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Notes (tall, scrollable) ── */}
        <div className="border border-blue-primary/10 bg-cream-light flex flex-col" style={{ maxHeight: "calc(100vh - 120px)" }}>
          <CardHeader title={`Notes (${claim.notes.length})`} marker="/003" />

          {/* Scrollable note list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {claim.notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Send size={20} strokeWidth={1} className="text-blue-primary/15" />
                <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/25">No notes yet</p>
              </div>
            ) : (
              claim.notes.map((note) => (
                <div key={note.id} className="p-3 bg-cream-primary border border-blue-primary/8">
                  <p className="font-mono text-[10px] tracking-[0.03em] text-blue-primary/60 leading-relaxed">
                    {note.note}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {note.createdBy}
                    </span>
                    <span className="w-px h-2 bg-blue-primary/15" />
                    <span className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/20">
                      {formatDateShort(note.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add note input — pinned to bottom */}
          {!isTerminal && (
            <div className="shrink-0 border-t border-blue-primary/8 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddNote(); }}
                  placeholder="ADD A NOTE..."
                  className="flex-1 h-9 px-3 bg-cream-primary border border-blue-primary/10 font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary placeholder:text-blue-primary/20 focus:outline-none focus:border-blue-primary/30 transition-colors"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="h-9 px-3 bg-blue-primary text-cream-primary font-mono text-[9px] tracking-[0.1em] uppercase flex items-center gap-1.5 hover:bg-blue-dark transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Send size={11} strokeWidth={1.5} /> Add
                </button>
              </div>
            </div>
          )}
        </div>

      </motion.div>

      {/* Bottom marker */}
      <div className="flex items-center justify-between">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">[INV.WTY.CLAIM]</span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}