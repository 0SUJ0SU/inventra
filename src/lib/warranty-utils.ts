import {
  Clock,
  Eye,
  Wrench,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { ClaimType, ClaimStatus } from "@/lib/demo-data";

export const CLAIM_TYPE_SHORT: Record<ClaimType, string> = {
  customer_to_store: "Customer → Store",
  store_to_supplier: "Store → Supplier",
  supplier_to_store: "Supplier → Store",
};

export const STATUS_WORKFLOW_ICONS: Record<ClaimStatus, React.ElementType> = {
  pending: Clock,
  in_review: Eye,
  in_repair: Wrench,
  repaired: CheckCircle2,
  replaced: RefreshCw,
  rejected: XCircle,
  closed: ShieldCheck,
};

export const WARRANTY_EASE = [0.16, 1, 0.3, 1] as const;

export function formatClaimDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatClaimDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}
