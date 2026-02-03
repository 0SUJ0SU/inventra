"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Re-export ColumnDef for consumers
export type { ColumnDef } from "@tanstack/react-table"

export interface FilterConfig {
  columnId: string
  label: string
  options: { label: string; value: string }[]
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  filters?: FilterConfig[]
  pagination?: boolean
  pageSize?: number
  selectable?: boolean
  onRowSelectionChange?: (selectedRows: TData[]) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
}

function DataTableSkeleton({
  columns,
  rows,
}: {
  columns: number
  rows: number
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-[var(--border)] dark:border-[var(--border-dark)]"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 w-full animate-pulse rounded bg-[var(--border)] dark:bg-[var(--border-dark)]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
  className,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: (checked: boolean) => void
  className?: string
}) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false
    }
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={cn(
        "h-4 w-4 cursor-pointer rounded border-[var(--border)] bg-[var(--surface)] text-[var(--accent-500)]",
        "focus:ring-2 focus:ring-[var(--accent-500)]/20 focus:ring-offset-0",
        "checked:bg-[var(--accent-500)] checked:border-[var(--accent-500)]",
        "indeterminate:bg-[var(--accent-500)] indeterminate:border-[var(--accent-500)]",
        className
      )}
    />
  )
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  pagination = true,
  pageSize = 10,
  selectable = false,
  onRowSelectionChange,
  loading = false,
  emptyMessage = "No results found.",
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [searchValue, setSearchValue] = React.useState("")
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState("")

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  // Apply search filter
  React.useEffect(() => {
    if (searchKey) {
      setColumnFilters((prev) => {
        const otherFilters = prev.filter((f) => f.id !== searchKey)
        if (debouncedSearchValue) {
          return [...otherFilters, { id: searchKey, value: debouncedSearchValue }]
        }
        return otherFilters
      })
    }
  }, [debouncedSearchValue, searchKey])

  // Add selection column if selectable
  const tableColumns = React.useMemo(() => {
    if (!selectable) return columns

    const selectionColumn: ColumnDef<TData, TValue> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={(checked) => row.toggleSelected(checked)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    return [selectionColumn, ...columns]
  }, [columns, selectable])

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)
      onRowSelectionChange(selectedRows)
    }
  }, [rowSelection, onRowSelectionChange, table])

  const totalRows = table.getFilteredRowModel().rows.length
  const currentPage = table.getState().pagination.pageIndex
  const totalPages = table.getPageCount()
  const startRow = currentPage * pageSize + 1
  const endRow = Math.min((currentPage + 1) * pageSize, totalRows)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      {searchKey && (
        <div className="flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-left text-xs font-medium uppercase tracking-wide",
                        "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]",
                        header.column.getCanSort() && "cursor-pointer select-none"
                      )}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanSort() && (
                          <span className="text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-[var(--surface)] dark:bg-[var(--surface-dark)]">
              {loading ? (
                <DataTableSkeleton
                  columns={tableColumns.length}
                  rows={pageSize}
                />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "border-b border-[var(--border)] dark:border-[var(--border-dark)]",
                      "transition-colors duration-150",
                      "hover:bg-[var(--background-alt)]/50 dark:hover:bg-[var(--background-alt-dark)]/50",
                      "data-[state=selected]:bg-[rgba(184,115,51,0.15)]"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-[var(--text)] dark:text-[var(--text-dark)]"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableColumns.length}
                    className="px-4 py-12 text-center text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalRows > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Selection info / Row count */}
          <div className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
            {selectable && Object.keys(rowSelection).length > 0 ? (
              <span>
                {Object.keys(rowSelection).length} of {totalRows} row(s) selected
              </span>
            ) : (
              <span>
                Showing {startRow} to {endRow} of {totalRows} results
              </span>
            )}
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            <div className="flex items-center gap-1 text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
              <span>Page</span>
              <span className="font-medium text-[var(--text)] dark:text-[var(--text-dark)]">
                {currentPage + 1}
              </span>
              <span>of</span>
              <span className="font-medium text-[var(--text)] dark:text-[var(--text-dark)]">
                {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
