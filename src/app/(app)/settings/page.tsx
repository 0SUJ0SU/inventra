"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Download, RotateCcw, AlertTriangle } from "lucide-react";

interface AppSettings {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  taxRate: string;
  taxEnabled: boolean;
  lowStockThreshold: string;
  dateFormat: string;
  theme: "light" | "dark" | "system";
  defaultWarrantyMonths: string;
  warrantyAlertDays: string;
  claimNumberPrefix: string;
  featureExpenses: boolean;
  featureCustomers: boolean;
  featurePayroll: boolean;
  featureSerialTracking: boolean;
  featureWarranty: boolean;
  featureCreditSales: boolean;
  featureCreditPurchases: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  storeName: "Inventra Demo Store",
  address: "123 Tech Street, San Francisco, CA 94105",
  phone: "+1 (555) 123-4567",
  email: "admin@inventra.demo",
  currency: "USD",
  taxRate: "8.5",
  taxEnabled: true,
  lowStockThreshold: "10",
  dateFormat: "MM/DD/YYYY",
  theme: "light",
  defaultWarrantyMonths: "12",
  warrantyAlertDays: "30",
  claimNumberPrefix: "WC-",
  featureExpenses: true,
  featureCustomers: true,
  featurePayroll: false,
  featureSerialTracking: true,
  featureWarranty: true,
  featureCreditSales: false,
  featureCreditPurchases: false,
};

const ease = [0.16, 1, 0.3, 1] as const;
const STORAGE_KEY = "inventra_settings";

function SectionHeader({ num, label, marker }: { num: string; label: string; marker: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-blue-primary/20">{num}</span>
        <div className="w-px h-3 bg-blue-primary/15" />
        <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary/55 font-medium">{label}</h2>
      </div>
      <span className="font-mono text-[9px] tracking-[0.15em] text-blue-primary/15">{marker}</span>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 block mb-1.5">
      {children}
      {required && <span className="text-blue-primary/20 ml-0.5">*</span>}
    </span>
  );
}

function TextInput({
  label, value, onChange, type = "text", placeholder, required, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; hint?: string;
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-blue-primary/15 focus:border-blue-primary/50 font-mono text-[11px] tracking-[0.04em] text-blue-primary pb-1.5 outline-none placeholder:text-blue-primary/15 transition-colors"
      />
      {hint && (
        <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20 mt-1">{hint}</p>
      )}
    </div>
  );
}

function SelectInput({
  label, value, onChange, options, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; hint?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-cream-light border-b border-blue-primary/15 focus:border-blue-primary/50 font-mono text-[11px] tracking-[0.04em] text-blue-primary pb-1.5 outline-none transition-colors cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && (
        <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20 mt-1">{hint}</p>
      )}
    </div>
  );
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-9 h-[18px] shrink-0 transition-colors duration-200 ${
        enabled ? "bg-blue-primary" : "bg-blue-primary/10"
      }`}
    >
      <motion.div
        className="absolute top-[2px] w-[14px] h-[14px] bg-cream-primary"
        animate={{ left: enabled ? "20px" : "2px" }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
      />
    </button>
  );
}

function FeatureRow({
  label, description, enabled, onToggle, badge,
}: {
  label: string; description: string; enabled: boolean;
  onToggle: () => void; badge?: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-blue-primary/6 last:border-b-0 hover:bg-blue-primary/[0.015] transition-colors">
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/65 font-medium">
            {label}
          </span>
          {badge && (
            <span className="font-mono text-[7px] tracking-[0.15em] uppercase px-1.5 py-0.5 border border-blue-primary/15 text-blue-primary/25">
              {badge}
            </span>
          )}
        </div>
        <p className="font-mono text-[9px] tracking-[0.04em] text-blue-primary/30 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`font-mono text-[8px] tracking-[0.15em] uppercase transition-colors ${
          enabled ? "text-blue-primary/40" : "text-blue-primary/15"
        }`}>
          {enabled ? "ON" : "OFF"}
        </span>
        <Toggle enabled={enabled} onToggle={onToggle} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings]       = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saveStatus, setSaveStatus]   = useState<"idle" | "saving" | "saved">("idle");
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch {}
  }, []);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setSaveStatus("saving");
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2200);
    }, 350);
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setResetConfirm(false);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2200);
  }

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `inventra-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-0">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6">
        <div>
          <motion.h1
            className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            Settings
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            Store configuration and application preferences
          </motion.p>
        </div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`font-mono text-[9px] tracking-[0.15em] uppercase h-9 px-5 flex items-center gap-2 transition-all duration-200 ${
              saveStatus === "saved"
                ? "bg-blue-primary/8 text-blue-primary/40 border border-blue-primary/10"
                : "bg-blue-primary text-cream-primary hover:bg-blue-dark"
            }`}
          >
            {saveStatus === "saved" ? (
              <>
                <Check size={11} strokeWidth={2} />
                [ Saved ]
              </>
            ) : saveStatus === "saving" ? (
              "[ Saving... ]"
            ) : (
              "[ Save Changes ]"
            )}
          </button>
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block ml-1">
            [INV.SET]
          </span>
        </motion.div>
      </div>

      <div className="h-px bg-blue-primary/10" />

      <section className="py-8 space-y-5">
        <SectionHeader num="/01" label="Store Information" marker="[INV.SET.01]" />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-blue-primary/10 border border-blue-primary/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease }}
        >
          <div className="bg-cream-light">
            <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Business Details</p>
              <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
            </div>
            <div className="px-5 py-5 space-y-6">
              <TextInput
                label="Store Name"
                required
                value={settings.storeName}
                onChange={(v) => update("storeName", v)}
                placeholder="Your store name"
              />
              <TextInput
                label="Business Address"
                value={settings.address}
                onChange={(v) => update("address", v)}
                placeholder="Street, City, State, ZIP"
              />
            </div>
          </div>

          <div className="bg-cream-light">
            <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Contact Details</p>
              <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/002</span>
            </div>
            <div className="px-5 py-5 space-y-6">
              <TextInput
                label="Phone Number"
                value={settings.phone}
                onChange={(v) => update("phone", v)}
                placeholder="+1 (555) 000-0000"
                type="tel"
              />
              <TextInput
                label="Email Address"
                value={settings.email}
                onChange={(v) => update("email", v)}
                placeholder="admin@yourstore.com"
                type="email"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <div className="h-px bg-blue-primary/10" />

      <section className="py-8 space-y-5">
        <SectionHeader num="/02" label="Preferences" marker="[INV.SET.02]" />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-blue-primary/10 border border-blue-primary/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.14, ease }}
        >
          <div className="bg-cream-light">
            <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Financial</p>
              <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/003</span>
            </div>
            <div className="px-5 py-5 grid grid-cols-2 gap-x-6 gap-y-6">
              <SelectInput
                label="Currency"
                value={settings.currency}
                onChange={(v) => update("currency", v)}
                options={[
                  { value: "USD", label: "USD — US Dollar"          },
                  { value: "MYR", label: "MYR — Malaysian Ringgit"  },
                  { value: "EUR", label: "EUR — Euro"                },
                  { value: "GBP", label: "GBP — British Pound"      },
                  { value: "SGD", label: "SGD — Singapore Dollar"   },
                  { value: "AUD", label: "AUD — Australian Dollar"  },
                ]}
              />
              <div>
                <FieldLabel>Tax Rate (%)</FieldLabel>
                <div className="flex items-end gap-3">
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => update("taxRate", e.target.value)}
                    min="0" max="100" step="0.1"
                    className="w-full bg-transparent border-b border-blue-primary/15 focus:border-blue-primary/50 font-mono text-[11px] tracking-[0.04em] text-blue-primary pb-1.5 outline-none transition-colors"
                  />
                  <Toggle
                    enabled={settings.taxEnabled}
                    onToggle={() => update("taxEnabled", !settings.taxEnabled)}
                  />
                </div>
                <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20 mt-1">
                  Tax {settings.taxEnabled ? "enabled" : "disabled"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cream-light">
            <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">General</p>
              <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/004</span>
            </div>
            <div className="px-5 py-5 grid grid-cols-2 gap-x-6 gap-y-6">
              <TextInput
                label="Low Stock Threshold"
                value={settings.lowStockThreshold}
                onChange={(v) => update("lowStockThreshold", v)}
                type="number"
                hint="Default minimum units"
                placeholder="10"
              />
              <SelectInput
                label="Date Format"
                value={settings.dateFormat}
                onChange={(v) => update("dateFormat", v)}
                options={[
                  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                ]}
                hint={`Preview: ${
                  settings.dateFormat === "MM/DD/YYYY" ? "03/05/2026"
                  : settings.dateFormat === "DD/MM/YYYY" ? "05/03/2026"
                  : "2026-03-05"
                }`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="border border-blue-primary/10 bg-cream-light overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Interface Theme</p>
            <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/005</span>
          </div>
          <div className="px-5 py-5">
            <FieldLabel>Color Scheme</FieldLabel>
            <div className="flex gap-px mt-3 border border-blue-primary/10">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update("theme", t)}
                  className={`flex-1 py-3 font-mono text-[9px] tracking-[0.15em] uppercase transition-colors ${
                    settings.theme === t
                      ? "bg-blue-primary text-cream-primary"
                      : "text-blue-primary/35 hover:text-blue-primary hover:bg-blue-primary/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20 mt-2">
              {settings.theme === "system"
                ? "Follows your operating system preference"
                : `Always use ${settings.theme} mode`}
            </p>
          </div>
        </motion.div>
      </section>

      <div className="h-px bg-blue-primary/10" />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 03 — SERIAL & WARRANTY                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="py-8 space-y-5">
        <SectionHeader num="/03" label="Serial & Warranty" marker="[INV.SET.03]" />

        <motion.div
          className="border border-blue-primary/10 bg-cream-light overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.22, ease }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Warranty Configuration</p>
            <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/006</span>
          </div>
          <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
            <TextInput
              label="Default Warranty Period"
              value={settings.defaultWarrantyMonths}
              onChange={(v) => update("defaultWarrantyMonths", v)}
              type="number"
              hint="Months from date of sale"
              placeholder="12"
            />
            <TextInput
              label="Expiry Alert Threshold"
              value={settings.warrantyAlertDays}
              onChange={(v) => update("warrantyAlertDays", v)}
              type="number"
              hint="Days before expiry to alert"
              placeholder="30"
            />
            <TextInput
              label="Claim Number Prefix"
              value={settings.claimNumberPrefix}
              onChange={(v) => update("claimNumberPrefix", v)}
              hint={`Preview: ${settings.claimNumberPrefix || "WC-"}2026-0001`}
              placeholder="WC-"
            />
          </div>
        </motion.div>
      </section>

      <div className="h-px bg-blue-primary/10" />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 04 — FEATURE TOGGLES                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="py-8 space-y-5">
        <SectionHeader num="/04" label="Feature Toggles" marker="[INV.SET.04]" />

        <motion.div
          className="border border-blue-primary/10 bg-cream-light overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.26, ease }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Module Configuration</p>
            <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/007</span>
          </div>

          <FeatureRow
            label="Expenses Module"
            description="Track business expenses by category. Adds Expenses to the sidebar navigation."
            enabled={settings.featureExpenses}
            onToggle={() => update("featureExpenses", !settings.featureExpenses)}
            badge="toggleable"
          />
          <FeatureRow
            label="Customer Tracking"
            description="Link sales to customer profiles, track purchase history and receivable balances."
            enabled={settings.featureCustomers}
            onToggle={() => update("featureCustomers", !settings.featureCustomers)}
          />
          <FeatureRow
            label="Serial Number Tracking"
            description="Enable per-unit serial number tracking for products. Required for warranty management."
            enabled={settings.featureSerialTracking}
            onToggle={() => update("featureSerialTracking", !settings.featureSerialTracking)}
          />
          <FeatureRow
            label="Warranty Management"
            description="Process warranty claims between customers and suppliers. Requires serial tracking to be enabled."
            enabled={settings.featureWarranty}
            onToggle={() => update("featureWarranty", !settings.featureWarranty)}
          />
          <FeatureRow
            label="Employee Payroll"
            description="Track employee salaries and generate payroll reports for each pay period."
            enabled={settings.featurePayroll}
            onToggle={() => update("featurePayroll", !settings.featurePayroll)}
            badge="toggleable"
          />
          <FeatureRow
            label="Credit Sales (Receivables)"
            description="Allow sales on credit. Track and manage outstanding customer balances."
            enabled={settings.featureCreditSales}
            onToggle={() => update("featureCreditSales", !settings.featureCreditSales)}
          />
          <FeatureRow
            label="Credit Purchases (Payables)"
            description="Record purchases on credit. Track outstanding supplier balances and payment schedules."
            enabled={settings.featureCreditPurchases}
            onToggle={() => update("featureCreditPurchases", !settings.featureCreditPurchases)}
          />
        </motion.div>
      </section>

      <div className="h-px bg-blue-primary/10" />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 05 — DATA MANAGEMENT                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="py-8 space-y-5">
        <SectionHeader num="/05" label="Data Management" marker="[INV.SET.05]" />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-blue-primary/10 border border-blue-primary/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.30, ease }}
        >
          {/* Export */}
          <div className="bg-cream-light">
            <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Export Configuration</p>
              <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/008</span>
            </div>
            <div className="px-5 py-5">
              <p className="font-mono text-[10px] tracking-[0.06em] text-blue-primary/45 leading-relaxed mb-5">
                Download your current settings as a JSON file for backup or to transfer to another instance.
              </p>
              <button
                onClick={handleExportJSON}
                className="font-mono text-[9px] tracking-[0.12em] uppercase h-9 px-4 border border-blue-primary/15 text-blue-primary/45 hover:text-blue-primary hover:border-blue-primary/30 transition-colors flex items-center gap-2"
              >
                <Download size={11} strokeWidth={1.5} />
                [ Export Settings ]
              </button>
            </div>
          </div>

          {/* Reset */}
          <div className="bg-cream-light">
            <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Reset Demo Data</p>
              <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/009</span>
            </div>
            <div className="px-5 py-5">
              {!resetConfirm ? (
                <>
                  <p className="font-mono text-[10px] tracking-[0.06em] text-blue-primary/45 leading-relaxed mb-5">
                    Restore all settings to their original demo values. This will overwrite any saved preferences.
                  </p>
                  <button
                    onClick={() => setResetConfirm(true)}
                    className="font-mono text-[9px] tracking-[0.12em] uppercase h-9 px-4 border border-blue-primary/15 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={11} strokeWidth={1.5} />
                    [ Reset to Defaults ]
                  </button>
                </>
              ) : (
                <motion.div
                  className="border border-blue-primary/15 bg-blue-primary/[0.03] px-4 py-4"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start gap-2.5 mb-4">
                    <AlertTriangle size={12} strokeWidth={1.5} className="text-blue-primary/40 shrink-0 mt-0.5" />
                    <p className="font-mono text-[9px] tracking-[0.06em] text-blue-primary/55 leading-relaxed">
                      This will reset all settings to default values. This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReset}
                      className="font-mono text-[9px] tracking-[0.12em] uppercase h-8 px-4 bg-blue-primary text-cream-primary hover:bg-blue-dark transition-colors"
                    >
                      [ Confirm Reset ]
                    </button>
                    <button
                      onClick={() => setResetConfirm(false)}
                      className="font-mono text-[9px] tracking-[0.12em] uppercase h-8 px-4 border border-blue-primary/15 text-blue-primary/40 hover:text-blue-primary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* About strip */}
        <motion.div
          className="border border-blue-primary/10 bg-cream-light px-5 py-4 flex flex-wrap items-center justify-between gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.33, ease }}
        >
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "Version",  value: "v1.0.0"                       },
              { label: "Platform", value: "Portfolio / Web"               },
              { label: "Stack",    value: "Next.js 14 · TypeScript"       },
              { label: "Build",    value: "M31 · March 2026"              },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-4">
                {i > 0 && <div className="w-px h-5 bg-blue-primary/10" />}
                <div>
                  <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/20 block mb-0.5">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/45">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span className="font-mono text-[9px] tracking-[0.15em] text-blue-primary/15 hidden sm:block">
            [INV.SET.ABOUT]
          </span>
        </motion.div>
      </section>

      {/* Bottom marker */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.SET.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>

    </div>
  );
}
