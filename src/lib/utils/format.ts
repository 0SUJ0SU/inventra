// src/lib/utils/format.ts
// Locale-safe number formatting to avoid hydration mismatches

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCurrency(value: number): string {
  return `$${new Intl.NumberFormat("en-US").format(value)}`;
}

export function formatCompact(value: number): string {
  if (value >= 1000000) {
    const m = value / 1000000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const k = value / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return value.toString();
}
