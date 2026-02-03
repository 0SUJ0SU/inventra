"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
}

// =============================================================================
// Filter Dropdown Component
// =============================================================================

export function FilterDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = "All",
  searchable = false,
  loading = false,
  disabled = false,
  className,
  align = "start",
}: FilterDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Get display text for trigger
  const getDisplayText = () => {
    if (selected.length === 0) {
      return placeholder;
    }
    if (selected.length === 1) {
      const selectedOption = options.find((opt) => opt.value === selected[0]);
      return selectedOption?.label ?? selected[0];
    }
    return `${selected.length} selected`;
  };

  // Toggle selection
  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  // Clear all selections
  const clearAll = () => {
    onChange([]);
  };

  // Select all visible options
  const selectAll = () => {
    const allVisibleValues = filteredOptions.map((opt) => opt.value);
    // Merge with existing selections, avoiding duplicates
    const newSelected = Array.from(new Set([...selected, ...allVisibleValues]));
    onChange(newSelected);
  };

  // Reset search when closing
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  const hasSelection = selected.length > 0;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            // Layout
            "inline-flex items-center justify-between gap-2",
            // Size
            "h-10 min-w-[140px] px-3",
            // Typography
            "text-sm font-medium",
            // Border
            "border rounded-md",
            // Background and border based on selection state
            hasSelection
              ? "border-[var(--accent-500)]/30 bg-[var(--accent-500)]/10 dark:bg-[var(--accent-500)]/15"
              : "bg-[var(--surface)] dark:bg-[var(--surface-dark)] border-[var(--border)] dark:border-[var(--border-dark)]",
            // Text color
            "text-[var(--text)] dark:text-[var(--text-dark)]",
            // Transitions
            "transition-all duration-200",
            // Hover state
            "hover:border-[var(--accent-500)]/50",
            // Focus state
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]/20 focus-visible:border-[var(--accent-500)]",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Open state
            open && "border-[var(--accent-500)] ring-2 ring-[var(--accent-500)]/20",
            className
          )}
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
              {label}:
            </span>
            <span className="truncate">{getDisplayText()}</span>
          </span>
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--accent-500)]" />
          ) : (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          )}
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          sideOffset={4}
          className={cn(
            // Position
            "z-50",
            // Size
            "w-[220px]",
            // Background
            "bg-[var(--surface-raised)] dark:bg-[var(--surface-raised-dark)]",
            // Border
            "border border-[var(--border)] dark:border-[var(--border-dark)]",
            // Border radius
            "rounded-md",
            // Shadow
            "shadow-lg",
            // Animations
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "origin-[--radix-popover-content-transform-origin]"
          )}
        >
          {/* Search Input */}
          {searchable && (
            <div className="border-b border-[var(--border)] dark:border-[var(--border-dark)] p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={cn(
                    "w-full h-8 pl-8 pr-8 text-sm rounded-md",
                    "bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]",
                    "text-[var(--text)] dark:text-[var(--text-dark)]",
                    "placeholder:text-[var(--text-muted)] dark:placeholder:text-[var(--text-muted-dark)]",
                    "border-0 outline-none",
                    "focus:ring-1 focus:ring-[var(--accent-500)]/30"
                  )}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] hover:text-[var(--text)] dark:hover:text-[var(--text-dark)] transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[250px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      // Layout
                      "relative flex w-full cursor-pointer select-none items-center",
                      // Padding and radius
                      "rounded-sm py-2 pl-8 pr-2",
                      // Typography
                      "text-sm",
                      // Text color
                      "text-[var(--text)] dark:text-[var(--text-dark)]",
                      // Transitions
                      "transition-colors duration-150",
                      // Hover state
                      "hover:bg-[var(--background-alt)] dark:hover:bg-[var(--background-alt-dark)]",
                      // Selected state subtle background
                      isSelected && "bg-[var(--accent-50)]/50 dark:bg-[var(--accent-900)]/10"
                    )}
                  >
                    {/* Checkbox indicator */}
                    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                      <span
                        className={cn(
                          "h-4 w-4 rounded-sm border transition-all duration-150",
                          isSelected
                            ? "border-[var(--accent-500)] bg-[var(--accent-500)]"
                            : "border-[var(--border)] dark:border-[var(--border-dark)]"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-3 w-3 text-white transition-opacity duration-150",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </span>
                    </span>

                    {/* Label */}
                    <span className="flex-1 truncate text-left">{option.label}</span>

                    {/* Count badge */}
                    {option.count !== undefined && (
                      <span className="ml-2 shrink-0 rounded px-1.5 py-0.5 text-xs bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)] text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
                        {option.count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[var(--border)] dark:border-[var(--border-dark)] p-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={clearAll}
              disabled={selected.length === 0}
              className={cn(
                "text-sm px-2 py-1 rounded-sm transition-colors",
                "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]",
                "hover:text-[var(--text)] dark:hover:text-[var(--text-dark)]",
                "hover:bg-[var(--background-alt)] dark:hover:bg-[var(--background-alt-dark)]",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={selectAll}
              disabled={filteredOptions.length === 0}
              className={cn(
                "text-sm px-2 py-1 rounded-sm transition-colors",
                "text-[var(--accent-600)] dark:text-[var(--accent-400)]",
                "hover:bg-[var(--accent-50)] dark:hover:bg-[var(--accent-900)]/20",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
            >
              Select All
            </button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
