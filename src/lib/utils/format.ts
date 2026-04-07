export function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount)
}

export function formatCurrency(amount: number): string {
  return `$${new Intl.NumberFormat("en-US").format(amount)}`
}

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
  }
  return amount.toString()
}

export function formatDate(date: string | Date): string {
  const parsed = typeof date === "string" ? new Date(date) : date
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateShort(date: string | Date): string {
  const parsed = typeof date === "string" ? new Date(date) : date
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  })
}
