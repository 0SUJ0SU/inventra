// Locale-safe formatting avoids hydration mismatches between server/client

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount);
}

export function formatCurrency(amount: number): string {
  return `$${new Intl.NumberFormat("en-US").format(amount)}`;
}

export function formatCompact(amount: number): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return amount.toString();
}
