"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Briefcase,
  CalendarDays,
  Building2,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { EMPLOYEES, STATUS_LABEL } from "../page";
import { formatCurrency } from "@/lib/utils/format";

const ease = [0.16, 1, 0.3, 1] as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTenureYears(hireDate: string): number {
  const elapsedMs = Date.now() - new Date(hireDate).getTime();
  return Math.floor(elapsedMs / (1000 * 60 * 60 * 24 * 365.25));
}

function getTenureDetailed(hireDate: string): string {
  const start = new Date(hireDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`;
  if (months === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} yr${years !== 1 ? "s" : ""} ${months} mo`;
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(loadingTimer);
  }, []);

  const employee = useMemo(
    () => EMPLOYEES.find((emp) => emp.id === id) ?? null,
    [id]
  );

  const colleagues = useMemo(
    () =>
      employee
        ? EMPLOYEES.filter(
            (emp) => emp.department === employee.department && emp.id !== employee.id
          )
        : [],
    [employee]
  );

  const deptEmployees = useMemo(
    () =>
      employee
        ? EMPLOYEES.filter((emp) => emp.department === employee.department)
        : [],
    [employee]
  );

  const deptPayroll = useMemo(
    () =>
      deptEmployees
        .filter((emp) => emp.status !== "inactive")
        .reduce((acc, emp) => acc + emp.salary, 0),
    [deptEmployees]
  );

  if (!isLoading && !employee) {
    return (
      <div className="space-y-6">
        <Link
          href="/employees"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          Back to Employees
        </Link>
        <div className="text-center py-24">
          <Users size={32} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-4" />
          <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/30">
            Employee not found
          </p>
          <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
            No record matches this employee ID
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <Link
        href="/employees"
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        Back to Employees
      </Link>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {isLoading ? (
            <>
              <div className="h-10 w-64 bg-blue-primary/8 animate-pulse mb-2" />
              <div className="h-3 w-44 bg-blue-primary/5 animate-pulse" />
            </>
          ) : (
            <>
              <motion.h1
                className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
                initial={{ x: -30 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                {employee!.name}
              </motion.h1>
              <motion.p
                className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease }}
              >
                {employee!.role}&nbsp;&middot;&nbsp;{employee!.department}
              </motion.p>
            </>
          )}
        </div>
        <motion.span
          className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          [INV.EMP.DTL]
        </motion.span>
      </div>

      <div className="h-px bg-blue-primary/10" />

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {[
          {
            icon: Briefcase,
            label: "Role",
            display: isLoading ? "—" : employee!.role,
            sub: isLoading ? "" : employee!.department,
          },
          {
            icon: DollarSign,
            label: "Annual Salary",
            display: isLoading ? "—" : formatCurrency(employee!.salary),
            sub: isLoading ? "" : `${formatCurrency(Math.round(employee!.salary / 12))} / month`,
          },
          {
            icon: CalendarDays,
            label: "Hire Date",
            display: isLoading ? "—" : formatDate(employee!.hireDate),
            sub: isLoading ? "" : getTenureDetailed(employee!.hireDate),
          },
          {
            icon: Building2,
            label: "Dept Payroll",
            display: isLoading ? "—" : formatCurrency(deptPayroll),
            sub: isLoading ? "" : `${deptEmployees.length} member${deptEmployees.length !== 1 ? "s" : ""} · annual`,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-cream-light px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
                {kpi.label}
              </span>
              <kpi.icon size={13} strokeWidth={1.5} className="text-blue-primary/15" />
            </div>
            <div>
              <span className="font-sans text-xl font-bold text-blue-primary leading-none block">
                {kpi.display}
              </span>
              <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25 mt-1.5 block">
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.11, ease }}
      >
        <div className="bg-cream-light p-5 flex flex-col gap-4">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30">
            Employee Record
          </p>
          {[
            { label: "Full Name",   display: employee?.name ?? "" },
            { label: "Email",       display: employee?.email ?? "" },
            { label: "Phone",       display: employee?.phone ?? "" },
            { label: "Department",  display: employee?.department ?? "" },
            { label: "Role",        display: employee?.role ?? "" },
            { label: "Status",      display: employee ? STATUS_LABEL[employee.status] : "" },
            { label: "Hired",       display: employee ? formatDate(employee.hireDate) : "" },
            { label: "Tenure",      display: employee ? getTenureDetailed(employee.hireDate) : "" },
            { label: "Annual Salary", display: employee ? formatCurrency(employee.salary) : "" },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/25">
                {field.label}
              </span>
              {isLoading ? (
                <span className="inline-block h-2.5 w-32 bg-blue-primary/8 animate-pulse" />
              ) : (
                <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary">
                  {field.display}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-cream-light p-5">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 mb-5">
            {employee?.department} Department
          </p>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, skeletonIndex) => (
                <div key={skeletonIndex} className="h-10 bg-blue-primary/5 animate-pulse" />
              ))}
            </div>
          ) : colleagues.length === 0 ? (
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/20">
              No other members in this department
            </p>
          ) : (
            <div className="border border-blue-primary/10 divide-y divide-blue-primary/8">
              {colleagues.map((colleague) => (
                <div
                  key={colleague.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-blue-primary/[0.02] transition-colors"
                >
                  <div>
                    <Link
                      href={`/employees/${colleague.id}`}
                      className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors block leading-none"
                    >
                      {colleague.name}
                    </Link>
                    <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/35 mt-0.5 block leading-none">
                      {colleague.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.03em] font-semibold text-blue-primary/50">
                      {formatCurrency(colleague.salary)}
                    </span>
                    <span
                      className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${
                        colleague.status === "active"
                          ? "text-blue-primary bg-blue-primary/10"
                          : colleague.status === "on_leave"
                          ? "text-blue-primary/60 bg-blue-primary/5"
                          : "text-blue-primary/30 bg-blue-primary/[0.03]"
                      }`}
                    >
                      {STATUS_LABEL[colleague.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && deptEmployees.length > 0 && (
            <div className="mt-6 pt-5 border-t border-blue-primary/8">
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 mb-3">
                Department Summary
              </p>
              <div className="grid grid-cols-3 gap-px bg-blue-primary/10 border border-blue-primary/10">
                {[
                  { label: "Active",         display: deptEmployees.filter((emp) => emp.status === "active").length.toString() },
                  { label: "On Leave",       display: deptEmployees.filter((emp) => emp.status === "on_leave").length.toString() },
                  { label: "Dept Payroll",   display: formatCurrency(deptPayroll) },
                ].map((stat) => (
                  <div key={stat.label} className="bg-cream-light px-3 py-4 text-center">
                    <span className="font-mono text-[16px] font-semibold leading-none block text-blue-primary">
                      {stat.display}
                    </span>
                    <span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/40 mt-1.5 block">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
            Payroll by Department
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
            {formatCurrency(
              EMPLOYEES.filter((emp) => emp.status !== "inactive").reduce((acc, emp) => acc + emp.salary, 0)
            )} / year total
          </span>
        </div>

        <div className="p-5 space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, skeletonIndex) => (
              <div key={skeletonIndex} className="h-8 bg-blue-primary/5 animate-pulse" />
            ))
          ) : (
            (() => {
              const payrollByDept = new Map<string, number>();
              for (const emp of EMPLOYEES) {
                if (emp.status === "inactive") continue;
                payrollByDept.set(emp.department, (payrollByDept.get(emp.department) ?? 0) + emp.salary);
              }
              const sortedDepts = Array.from(payrollByDept.entries()).sort((left, right) => right[1] - left[1]);
              const maxPayroll = sortedDepts[0]?.[1] ?? 1;
              return sortedDepts.map(([dept, payroll]) => {
                const pct = (payroll / maxPayroll) * 100;
                const isCurrent = dept === employee?.department;
                return (
                  <div key={dept}>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-mono text-[9px] tracking-[0.06em] uppercase ${
                          isCurrent ? "text-blue-primary" : "text-blue-primary/50"
                        }`}
                      >
                        {dept}
                        {isCurrent && (
                          <span className="ml-2 text-[7px] tracking-[0.1em] text-blue-primary/40">
                            [current]
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.04em] font-semibold text-blue-primary">
                        {formatCurrency(payroll)}
                      </span>
                    </div>
                    <div className="h-0.5 bg-blue-primary/8 w-full">
                      <div
                        className={`h-full transition-all duration-700 ${
                          isCurrent ? "bg-blue-primary" : "bg-blue-primary/30"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              });
            })()
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
            {new Set(EMPLOYEES.map((emp) => emp.department)).size} departments &middot; {EMPLOYEES.length} employees
          </span>
          <Link
            href="/employees"
            className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors flex items-center gap-1.5"
          >
            All Employees
            <ArrowLeft size={10} strokeWidth={1.5} className="rotate-180" />
          </Link>
        </div>
      </motion.div>

      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.EMP.DTL.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
