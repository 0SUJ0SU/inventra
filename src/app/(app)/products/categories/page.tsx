// src/app/(app)/products/categories/page.tsx
"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  AlertTriangle,
  Package,
  FolderOpen,
} from "lucide-react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/demo-data";

// ————————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————————

type SortKey = "name" | "productCount";
type SortDir = "asc" | "desc";

interface ModalState {
  open: boolean;
  mode: "add" | "edit";
  category: Category | null;
}

interface DeleteState {
  open: boolean;
  category: Category | null;
}

// ————————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————————

const ease = [0.16, 1, 0.3, 1] as const;

// ————————————————————————————————————————————————
// VALIDATION
// ————————————————————————————————————————————————

function validateCategory(
  name: string,
  description: string,
  existing: Category[],
  editId: string | null
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!name.trim()) {
    errors.name = "Required";
  } else if (name.trim().length < 2) {
    errors.name = "Min 2 characters";
  } else if (
    existing.some(
      (c) =>
        c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== editId
    )
  ) {
    errors.name = "Already exists";
  }
  if (description.trim().length > 200) {
    errors.description = "Max 200 characters";
  }
  return errors;
}

// ————————————————————————————————————————————————
// SORT ICON
// ————————————————————————————————————————————————

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col)
    return (
      <ChevronsUpDown
        size={12}
        strokeWidth={1.5}
        className="text-blue-primary/20"
      />
    );
  return sortDir === "asc" ? (
    <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
  ) : (
    <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
  );
}

// ————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————

export default function CategoriesPage() {
  // — Mounted (portal hydration fix) —
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  // — Data —
  const [categories, setCategories] = useState<Category[]>(() =>
    CATEGORIES.map((c) => ({
      ...c,
      productCount: PRODUCTS.filter((p) => p.categoryId === c.id).length,
    }))
  );

  // — Search —
  const [search, setSearch] = useState("");

  // — Sort —
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // — Modal —
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "add",
    category: null,
  });
  const [modalName, setModalName] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({});

  // — Delete dialog —
  const [deleteDialog, setDeleteDialog] = useState<DeleteState>({
    open: false,
    category: null,
  });

  // ——— DERIVED DATA ———

  const filtered = useMemo(() => {
    let data = [...categories];
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    return data;
  }, [categories, search]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "productCount":
          cmp = (a.productCount ?? 0) - (b.productCount ?? 0);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [filtered, sortKey, sortDir]);

  // ——— HANDLERS ———

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openAddModal = () => {
    setModalName("");
    setModalDesc("");
    setModalErrors({});
    setModal({ open: true, mode: "add", category: null });
  };

  const openEditModal = (cat: Category) => {
    setModalName(cat.name);
    setModalDesc(cat.description);
    setModalErrors({});
    setModal({ open: true, mode: "edit", category: cat });
  };

  const closeModal = () => {
    setModal({ open: false, mode: "add", category: null });
    setModalErrors({});
  };

  const handleModalSubmit = () => {
    const editId = modal.mode === "edit" ? modal.category?.id ?? null : null;
    const errs = validateCategory(modalName, modalDesc, categories, editId);
    if (Object.keys(errs).length > 0) {
      setModalErrors(errs);
      return;
    }

    if (modal.mode === "add") {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: modalName.trim(),
        description: modalDesc.trim(),
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    } else if (modal.category) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === modal.category!.id
            ? { ...c, name: modalName.trim(), description: modalDesc.trim() }
            : c
        )
      );
    }
    closeModal();
  };

  const openDeleteDialog = (cat: Category) => {
    setDeleteDialog({ open: true, category: cat });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, category: null });
  };

  const handleDelete = () => {
    if (deleteDialog.category) {
      setCategories((prev) =>
        prev.filter((c) => c.id !== deleteDialog.category!.id)
      );
    }
    closeDeleteDialog();
  };

  // ——— RENDER ———

  return (
    <div className="space-y-6">
      {/* ━━━ PAGE HEADER ━━━ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Categories
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}{" "}
            configured
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          <button
            onClick={openAddModal}
            className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"
          >
            <Plus size={13} strokeWidth={1.5} />
            Add Category
          </button>
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block">
            [INV.CAT]
          </span>
        </motion.div>
      </div>

      {/* Blueprint divider */}
      <div className="h-px bg-blue-primary/10" />

      {/* ━━━ SEARCH ━━━ */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
      >
        <div className="relative max-w-md">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
          />
          <input
            type="text"
            placeholder="SEARCH CATEGORIES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
        </div>
      </motion.div>

      {/* ━━━ TABLE ━━━ */}
      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Category List
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/30">
            /001
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="text-left px-5 align-middle">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Category <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-5 align-middle hidden sm:table-cell">
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                    Description
                  </span>
                </th>
                <th className="text-right px-5 align-middle">
                  <button
                    onClick={() => handleSort("productCount")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Products <SortIcon col="productCount" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-24 px-5 align-middle" />
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <FolderOpen
                      size={28}
                      strokeWidth={1}
                      className="text-blue-primary/15 mx-auto mb-3"
                    />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {search ? "No categories found" : "No categories yet"}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      {search
                        ? "Try a different search term"
                        : "Add your first category to get started"}
                    </p>
                  </td>
                </tr>
              ) : (
                sorted.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-blue-primary/6 transition-colors duration-150 h-14 hover:bg-blue-primary/[0.02]"
                  >
                    {/* Name */}
                    <td className="px-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 shrink-0 border border-blue-primary/10 bg-cream-primary flex items-center justify-center">
                          <Package
                            size={14}
                            strokeWidth={1.2}
                            className="text-blue-primary/25"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] tracking-[0.04em] uppercase text-blue-primary truncate leading-none">
                            {cat.name}
                          </p>
                          {/* Show description on mobile under name */}
                          <p className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/30 mt-1 sm:hidden truncate leading-none">
                            {cat.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Description (hidden on mobile) */}
                    <td className="px-5 align-middle hidden sm:table-cell">
                      <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50 truncate max-w-xs">
                        {cat.description || "—"}
                      </p>
                    </td>
                    {/* Product count */}
                    <td className="px-5 align-middle text-right">
                      <span className="font-mono text-[12px] tracking-[0.05em] font-semibold text-blue-primary">
                        {cat.productCount ?? 0}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/40 ml-1.5">
                        items
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="w-24 px-5 align-middle">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="w-7 h-7 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={13} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(cat)}
                          className="w-7 h-7 flex items-center justify-center text-blue-primary/20 hover:text-error hover:bg-error/5 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50">
            {sorted.length} of {categories.length} categor
            {categories.length !== 1 ? "ies" : "y"}
          </span>
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/40">
            {categories.reduce((sum, c) => sum + (c.productCount ?? 0), 0)}{" "}
            total products
          </span>
        </div>
      </motion.div>

      {/* Bottom marker */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.CAT.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>

      {/* ━━━ ADD/EDIT MODAL ━━━ */}
      {mounted && createPortal(
      <AnimatePresence>
        {modal.open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-blue-primary/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            {/* Panel */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-md bg-cream-primary border border-blue-primary/10 shadow-lg"
                initial={{ y: 30, scale: 0.97 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.97 }}
                transition={{ duration: 0.3, ease }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/50">
                    {modal.mode === "add" ? "New Category" : "Edit Category"}
                  </p>
                  <button
                    onClick={closeModal}
                    className="w-6 h-6 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary transition-colors"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>

                {/* Modal body */}
                <div className="p-5 space-y-4">
                  {/* Name */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                        Category Name
                        <span className="text-error ml-0.5">*</span>
                      </label>
                      {modalErrors.name && (
                        <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-error">
                          {modalErrors.name}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={modalName}
                      onChange={(e) => {
                        setModalName(e.target.value);
                        setModalErrors((prev) => {
                          const n = { ...prev };
                          delete n.name;
                          return n;
                        });
                      }}
                      placeholder="e.g. Smartphones"
                      autoFocus
                      className={`w-full h-9 px-3 bg-cream-light border font-mono text-[11px] tracking-[0.05em] uppercase text-blue-primary placeholder:text-blue-primary/20 focus:outline-none transition-colors ${
                        modalErrors.name
                          ? "border-error/40 focus:border-error/60"
                          : "border-blue-primary/10 focus:border-blue-primary/30"
                      }`}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                        Description
                      </label>
                      {modalErrors.description && (
                        <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-error">
                          {modalErrors.description}
                        </span>
                      )}
                    </div>
                    <textarea
                      value={modalDesc}
                      onChange={(e) => {
                        setModalDesc(e.target.value);
                        setModalErrors((prev) => {
                          const n = { ...prev };
                          delete n.description;
                          return n;
                        });
                      }}
                      placeholder="Brief description of this category..."
                      rows={3}
                      className={`w-full px-3 py-2 bg-cream-light border font-mono text-[11px] tracking-[0.03em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none transition-colors resize-none ${
                        modalErrors.description
                          ? "border-error/40 focus:border-error/60"
                          : "border-blue-primary/10 focus:border-blue-primary/30"
                      }`}
                    />
                    <p className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/20 mt-1 text-right">
                      {modalDesc.length}/200
                    </p>
                  </div>
                </div>

                {/* Modal actions */}
                <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-blue-primary/8">
                  <button
                    onClick={closeModal}
                    className="h-9 px-4 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalSubmit}
                    className="h-9 px-5 bg-blue-primary text-cream-primary font-mono text-[9px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"
                  >
                    {modal.mode === "add" ? (
                      <>
                        <Plus size={12} strokeWidth={1.5} />
                        Add Category
                      </>
                    ) : (
                      <>
                        <Pencil size={12} strokeWidth={1.5} />
                        Update
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}

      {/* ━━━ DELETE CONFIRMATION ━━━ */}
      {mounted && createPortal(
      <AnimatePresence>
        {deleteDialog.open && deleteDialog.category && (
          <>
            <motion.div
              className="fixed inset-0 bg-blue-primary/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteDialog}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm bg-cream-primary border border-blue-primary/10 shadow-lg"
                initial={{ y: 30, scale: 0.97 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.97 }}
                transition={{ duration: 0.3, ease }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-error/70">
                    Delete Category
                  </p>
                  <button
                    onClick={closeDeleteDialog}
                    className="w-6 h-6 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary transition-colors"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <p className="font-mono text-[11px] tracking-[0.04em] uppercase text-blue-primary leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">
                      {deleteDialog.category.name}
                    </span>
                    ?
                  </p>

                  {(deleteDialog.category.productCount ?? 0) > 0 && (
                    <div className="p-3 border border-warning/20 bg-warning/5 flex items-start gap-2">
                      <AlertTriangle
                        size={13}
                        strokeWidth={1.5}
                        className="text-warning shrink-0 mt-0.5"
                      />
                      <p className="font-mono text-[9px] tracking-[0.05em] uppercase text-warning/80 leading-relaxed">
                        This category has{" "}
                        {deleteDialog.category.productCount} product
                        {deleteDialog.category.productCount !== 1 && "s"}{" "}
                        assigned. Deleting it will leave those products
                        uncategorized.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-blue-primary/8">
                  <button
                    onClick={closeDeleteDialog}
                    className="h-9 px-4 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="h-9 px-5 bg-error text-white font-mono text-[9px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-error/90 transition-colors"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
}
