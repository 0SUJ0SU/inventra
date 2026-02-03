"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
  showShortcutHint?: boolean;
}

// =============================================================================
// Custom Debounce Hook
// =============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// =============================================================================
// Size Configuration
// =============================================================================

const sizeConfig = {
  sm: {
    height: "h-8",
    text: "text-sm",
    icon: "w-4 h-4",
    padding: "pl-10 pr-10",
    iconLeft: "left-3",
    iconRight: "right-3",
  },
  default: {
    height: "h-10",
    text: "text-sm",
    icon: "w-4 h-4",
    padding: "pl-10 pr-10",
    iconLeft: "left-3",
    iconRight: "right-3",
  },
  lg: {
    height: "h-12",
    text: "text-base",
    icon: "w-5 h-5",
    padding: "pl-12 pr-12",
    iconLeft: "left-4",
    iconRight: "right-4",
  },
};

// =============================================================================
// Search Input Component
// =============================================================================

export function SearchInput({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  onSearch,
  debounceMs = 300,
  loading = false,
  disabled = false,
  className,
  size = "default",
  showShortcutHint = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = React.useState(controlledValue ?? "");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync internal value with controlled value
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Debounce the search value
  const debouncedValue = useDebounce(internalValue, debounceMs);

  // Call onSearch when debounced value changes
  React.useEffect(() => {
    if (onSearch && debouncedValue !== undefined) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const config = sizeConfig[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Immediately trigger search without waiting for debounce
      onSearch?.(internalValue);
    }
    if (e.key === "Escape") {
      handleClear();
    }
  };

  const showClearButton = internalValue.length > 0 && !loading;
  const showShortcut = showShortcutHint && internalValue.length === 0 && !loading;

  return (
    <div className={cn("relative flex items-center", className)}>
      {/* Search Icon / Loading Spinner - Absolutely positioned */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center",
          config.iconLeft
        )}
      >
        {loading ? (
          <Loader2
            className={cn(
              config.icon,
              "animate-spin text-[var(--accent-500)]"
            )}
          />
        ) : (
          <Search
            className={cn(
              config.icon,
              "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]"
            )}
          />
        )}
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          // Base styles
          "w-full rounded-md",
          // Size-specific height and text
          config.height,
          config.text,
          // Consistent padding for icons
          config.padding,
          // Background and text
          "bg-[var(--surface)] dark:bg-[var(--surface-dark)]",
          "text-[var(--text)] dark:text-[var(--text-dark)]",
          // Border
          "border border-[var(--border)] dark:border-[var(--border-dark)]",
          // Placeholder
          "placeholder:text-[var(--text-muted)] dark:placeholder:text-[var(--text-muted-dark)]",
          // Transitions
          "transition-all duration-200",
          // Focus states - warm copper ring
          "focus-visible:outline-none focus-visible:border-[var(--accent-500)] focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]/20",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />

      {/* Right side: Clear button or Shortcut hint - Absolutely positioned */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 flex items-center justify-center",
          config.iconRight
        )}
      >
        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className={cn(
              "flex items-center justify-center rounded-sm p-0.5 transition-colors",
              "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]",
              "hover:text-[var(--text)] dark:hover:text-[var(--text-dark)]",
              "hover:bg-[var(--background-alt)] dark:hover:bg-[var(--background-alt-dark)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]/20",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            <X className={config.icon} />
            <span className="sr-only">Clear search</span>
          </button>
        )}

        {showShortcut && (
          <kbd
            className={cn(
              "pointer-events-none inline-flex items-center gap-1 rounded px-1.5 py-0.5",
              "bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]",
              "border border-[var(--border-subtle)] dark:border-[var(--border-subtle-dark)]",
              "text-[10px] font-medium font-mono",
              "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]"
            )}
          >
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </div>
    </div>
  );
}
