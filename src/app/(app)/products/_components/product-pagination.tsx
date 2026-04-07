"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductPaginationProps {
  page: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZES = [10, 20, 50] as const

export function ProductPagination({ page, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }: ProductPaginationProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((n) => {
    if (totalPages <= 5) return true
    if (n === 1 || n === totalPages) return true
    return Math.abs(n - page) <= 1
  })

  const pageBtn = "w-7 h-7 flex items-center justify-center font-mono text-[10px] tracking-[0.05em] border transition-colors"

  return (
    <div className="flex items-center justify-between px-5 py-3 border border-blue-primary/10 bg-cream-light">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
          {totalItems === 0 ? "0 of 0" : `${start}–${end} of ${totalItems}`}
        </span>
        <div className="w-px h-3 bg-blue-primary/10" />
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-7 px-2 bg-transparent border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 focus:outline-none cursor-pointer appearance-none"
        >
          {PAGE_SIZES.map((size) => <option key={size} value={size}>{size} rows</option>)}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors">
          <ChevronLeft size={12} strokeWidth={2} />
        </button>
        {visiblePages.map((pageNum, idx) => {
          const prev = visiblePages[idx - 1]
          const showEllipsis = prev != null && pageNum - prev > 1
          return (
            <span key={pageNum} className="flex items-center">
              {showEllipsis && <span className="w-7 h-7 flex items-center justify-center font-mono text-[9px] text-blue-primary/20">...</span>}
              <button
                onClick={() => onPageChange(pageNum)}
                className={`${pageBtn} ${pageNum === page ? "bg-blue-primary text-cream-primary border-blue-primary" : "border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30"}`}
              >
                {pageNum}
              </button>
            </span>
          )
        })}
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors">
          <ChevronRight size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
