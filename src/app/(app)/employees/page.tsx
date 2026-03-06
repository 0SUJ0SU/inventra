"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/format";

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "active" | "on_leave" | "inactive";
  hireDate: string;
  salary: number;
}

type SortKey = "name" | "role" | "department" | "status" | "hireDate" | "salary";
type SortDir = "asc" | "desc";

const PAGE_SIZES = [10, 20, 50] as const;
const ease = [0.16, 1, 0.3, 1] as const;

export const EMPLOYEES: Employee[] = [
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    role: "Operations Manager",
    department: "Operations",
    email: "m.chen@inventra.io",
    phone: "+1 (415) 301-8820",
    status: "active",
    hireDate: "2020-03-15",
    salary: 92000,
  },
  {
    id: "priya-kapoor",
    name: "Priya Kapoor",
    role: "Inventory Analyst",
    department: "Operations",
    email: "p.kapoor@inventra.io",
    phone: "+1 (415) 301-8821",
    status: "active",
    hireDate: "2021-07-01",
    salary: 74000,
  },
  {
    id: "james-okonkwo",
    name: "James Okonkwo",
    role: "Sales Lead",
    department: "Sales",
    email: "j.okonkwo@inventra.io",
    phone: "+1 (415) 301-8822",
    status: "active",
    hireDate: "2019-11-10",
    salary: 88000,
  },
  {
    id: "sofia-reyes",
    name: "Sofia Reyes",
    role: "Sales Associate",
    department: "Sales",
    email: "s.reyes@inventra.io",
    phone: "+1 (415) 301-8823",
    status: "active",
    hireDate: "2022-02-14",
    salary: 62000,
  },
  {
    id: "daniel-wu",
    name: "Daniel Wu",
    role: "Warranty Technician",
    department: "Service",
    email: "d.wu@inventra.io",
    phone: "+1 (415) 301-8824",
    status: "active",
    hireDate: "2021-09-20",
    salary: 68000,
  },
  {
    id: "anya-petrov",
    name: "Anya Petrov",
    role: "Service Coordinator",
    department: "Service",
    email: "a.petrov@inventra.io",
    phone: "+1 (415) 301-8825",
    status: "on_leave",
    hireDate: "2022-06-01",
    salary: 65000,
  },
  {
    id: "liam-foster",
    name: "Liam Foster",
    role: "Procurement Specialist",
    department: "Procurement",
    email: "l.foster@inventra.io",
    phone: "+1 (415) 301-8826",
    status: "active",
    hireDate: "2020-08-03",
    salary: 78000,
  },
  {
    id: "nina-shaw",
    name: "Nina Shaw",
    role: "Finance Controller",
    department: "Finance",
    email: "n.shaw@inventra.io",
    phone: "+1 (415) 301-8827",
    status: "active",
    hireDate: "2018-05-22",
    salary: 105000,
  },
  {
    id: "omar-hassan",
    name: "Omar Hassan",
    role: "IT Administrator",
    department: "IT",
    email: "o.hassan@inventra.io",
    phone: "+1 (415) 301-8828",
    status: "active",
    hireDate: "2023-01-09",
    salary: 82000,
  },
  {
    id: "claire-nguyen",
    name: "Claire Nguyen",
    role: "HR Manager",
    department: "HR",
    email: "c.nguyen@inventra.io",
    phone: "+1 (415) 301-8829",
    status: "inactive",
    hireDate: "2019-04-17",
    salary: 85000,
  },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTenureYears(hireDate: string): number {
  const ms = Date.now() - new Date(hireDate).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
}

export const STATUS_LABEL: Record<Employee["status"], string> = {
  active: "Active",
  on_leave: "On Leave",
  inactive: "Inactive",
};

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== col)
    return <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
  ) : (
    <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
  );
}

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(loadingTimer);
  }, []);

  const totalEmployees = EMPLOYEES.length;
  const activeCount = EMPLOYEES.filter((employee) => employee.status === "active").length;
  const departmentCount = new Set(EMPLOYEES.map((employee) => employee.department)).size;
  const totalAnnualPayroll = EMPLOYEES.filter((employee) => employee.status !== "inactive").reduce(
    (payrollSum, employee) => payrollSum + employee.salary,
    0
  );
  const monthlyPayroll = totalAnnualPayroll / 12;

  const filtered = useMemo(() => {
    if (!search.trim()) return EMPLOYEES;
    const searchLower = search.toLowerCase().trim();
    return EMPLOYEES.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchLower) ||
        employee.role.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const sorted = useMemo(() => {
    const employeesCopy = [...filtered];
    employeesCopy.sort((left, right) => {
      let comparison = 0;
      switch (sortKey) {
        case "name":       comparison = left.name.localeCompare(right.name); break;
        case "role":       comparison = left.role.localeCompare(right.role); break;
        case "department": comparison = left.department.localeCompare(right.department); break;
        case "status":     comparison = left.status.localeCompare(right.status); break;
        case "hireDate":   comparison = left.hireDate.localeCompare(right.hireDate); break;
        case "salary":     comparison = left.salary - right.salary; break;
      }
      return sortDir === "asc" ? comparison : -comparison;
    });
    return employeesCopy;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((currentDir) => (currentDir === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Employees
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {totalEmployees} staff member{totalEmployees !== 1 && "s"}&nbsp;&middot;&nbsp;
            {departmentCount} department{departmentCount !== 1 && "s"}
          </motion.p>
        </div>
        <motion.span
          className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          [INV.EMP]
        </motion.span>
      </div>

      <div className="h-px bg-blue-primary/10" />

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {[
          {
            label: "Total Staff",
            value: totalEmployees.toString(),
            sub: "All employees",
          },
          {
            label: "Active",
            value: activeCount.toString(),
            sub: `${totalEmployees - activeCount} inactive or on leave`,
          },
          {
            label: "Departments",
            value: departmentCount.toString(),
            sub: "Across the company",
          },
          {
            label: "Monthly Payroll",
            value: formatCurrency(monthlyPayroll),
            sub: `${formatCurrency(totalAnnualPayroll)} / year`,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-cream-light px-4 py-5">
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 block mb-2">
              {kpi.label}
            </span>
            <span className="font-sans text-2xl font-bold text-blue-primary leading-none block">
              {kpi.value}
            </span>
            <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25 mt-1.5 block">
              {kpi.sub}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        <div className="relative max-w-md">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
          />
          <input
            type="text"
            placeholder="SEARCH NAME, ROLE, DEPARTMENT..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Staff Directory
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="text-left px-5 align-middle">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Employee <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("role")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Role <SortIcon col="role" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("department")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Dept <SortIcon col="department" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("salary")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Salary <SortIcon col="salary" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("hireDate")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Hired <SortIcon col="hireDate" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-10 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, skeletonIndex) => (
                  <tr key={skeletonIndex} className="border-b border-blue-primary/6 h-16">
                    <td className="px-5 align-middle">
                      <div className="h-2.5 w-36 bg-blue-primary/8 animate-pulse mb-1.5" />
                      <div className="h-2 w-44 bg-blue-primary/5 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-32 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-5 w-14 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle" />
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Users size={28} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-3" />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {search ? "No employees found" : "No employees yet"}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      {search ? "Try a different search term" : "Add staff to get started"}
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="mt-4 h-8 px-4 border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-blue-primary/6 hover:bg-blue-primary/[0.02] transition-colors duration-150 h-16"
                  >
                    <td className="px-5 align-middle">
                      <Link
                        href={`/employees/${emp.id}`}
                        className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors block leading-none"
                      >
                        {emp.name}
                      </Link>
                      <span className="font-mono text-[8px] tracking-[0.04em] text-blue-primary/30 mt-0.5 block leading-none">
                        {emp.email}
                      </span>
                    </td>
                    <td className="px-3 align-middle">
                      <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/60">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-3 align-middle">
                      <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/50">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-3 align-middle text-center">
                      <span
                        className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${
                          emp.status === "active"
                            ? "text-blue-primary bg-blue-primary/10"
                            : emp.status === "on_leave"
                            ? "text-blue-primary/60 bg-blue-primary/5"
                            : "text-blue-primary/30 bg-blue-primary/[0.03]"
                        }`}
                      >
                        {STATUS_LABEL[emp.status]}
                      </span>
                    </td>
                    <td className="px-3 align-middle text-right">
                      <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary leading-none block">
                        {formatCurrency(emp.salary)}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25 block mt-0.5 leading-none">
                        {formatCurrency(Math.round(emp.salary / 12))} / mo
                      </span>
                    </td>
                    <td className="px-3 align-middle text-right">
                      <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50 block leading-none">
                        {formatDate(emp.hireDate)}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25 mt-0.5 block leading-none">
                        {getTenureYears(emp.hireDate)} yr{getTenureYears(emp.hireDate) !== 1 && "s"}
                      </span>
                    </td>
                    <td className="w-10 px-3 align-middle text-center">
                      <Link
                        href={`/employees/${emp.id}`}
                        className="p-1 text-blue-primary/20 hover:text-blue-primary transition-colors inline-flex items-center justify-center"
                      >
                        <ArrowRight size={13} strokeWidth={1.5} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sorted.length > 0 ? `${(safePage - 1) * pageSize + 1}` : "0"}
              &ndash;{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </span>
            <div className="w-px h-3 bg-blue-primary/10" />
            <select
              value={pageSize}
              onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}
              className="h-7 px-2 bg-transparent border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 focus:outline-none cursor-pointer appearance-none"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>{size} rows</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={safePage <= 1}
              className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={12} strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1)
              .filter((pageNum) => {
                if (totalPages <= 5) return true;
                if (pageNum === 1 || pageNum === totalPages) return true;
                if (Math.abs(pageNum - safePage) <= 1) return true;
                return false;
              })
              .map((pageNum, position, visiblePages) => {
                const previousPage = visiblePages[position - 1];
                const showEllipsis = previousPage != null && pageNum - previousPage > 1;
                return (
                  <span key={pageNum} className="flex items-center">
                    {showEllipsis && (
                      <span className="w-7 h-7 flex items-center justify-center font-mono text-[9px] text-blue-primary/20">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setPage(pageNum)}
                      className={`w-7 h-7 flex items-center justify-center font-mono text-[10px] tracking-[0.05em] border transition-colors ${
                        pageNum === safePage
                          ? "bg-blue-primary text-cream-primary border-blue-primary"
                          : "border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30"
                      }`}
                    >
                      {pageNum}
                    </button>
                  </span>
                );
              })}
            <button
              onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
              disabled={safePage >= totalPages}
              className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={12} strokeWidth={2} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.EMP.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
