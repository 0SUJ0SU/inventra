"use client"

export function FieldLabel({ label, required = false, error }: { label: string; required?: boolean; error?: string }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </label>
      {error && <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-error">{error}</span>}
    </div>
  )
}

export function TextInput({
  value, onChange, placeholder, error, disabled = false, type = "text",
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; error?: boolean; disabled?: boolean; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full h-9 px-3 bg-cream-light border font-mono text-[11px] tracking-[0.05em] uppercase text-blue-primary placeholder:text-blue-primary/20 focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        error ? "border-error/40 focus:border-error/60" : "border-blue-primary/10 focus:border-blue-primary/30"
      }`}
    />
  )
}

export function FormCard({ title, marker, children, className = "" }: {
  title: string; marker?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={`border border-blue-primary/10 bg-cream-light ${className}`}>
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-blue-primary/8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">{title}</p>
        {marker && <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">{marker}</span>}
      </div>
      <div className="p-5 flex-1 flex flex-col">{children}</div>
    </div>
  )
}
