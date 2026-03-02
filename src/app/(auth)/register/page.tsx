// src/app/(auth)/register/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// ── Validation ──
interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

function validateRegister(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  terms: boolean
): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) errors.name = "FULL NAME IS REQUIRED.";
  if (!email.trim()) {
    errors.email = "EMAIL ADDRESS IS REQUIRED.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "INVALID EMAIL FORMAT.";
  }
  if (!password) {
    errors.password = "PASSWORD IS REQUIRED.";
  } else if (password.length < 8) {
    errors.password = "MINIMUM 8 CHARACTERS.";
  }
  if (!confirmPassword) {
    errors.confirmPassword = "PLEASE CONFIRM YOUR PASSWORD.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "PASSWORDS DO NOT MATCH.";
  }
  if (!terms) errors.terms = "YOU MUST ACCEPT THE TERMS.";
  return errors;
}

// ── Password strength ──
function getPasswordStrength(password: string): {
  score: number;
  label: string;
} {
  if (!password) return { score: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "WEAK" };
  if (score <= 2) return { score: 2, label: "FAIR" };
  if (score <= 3) return { score: 3, label: "GOOD" };
  if (score <= 4) return { score: 4, label: "STRONG" };
  return { score: 5, label: "EXCELLENT" };
}

// ── Animation variants ──
const slideIn = {
  hidden: { x: 80, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      delay: 0.15 + i * 0.08,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function clearFieldError(field: keyof FormErrors) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateRegister(
      name,
      email,
      password,
      confirmPassword,
      terms
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1800));

    // Check for existing user
    const existingUsers = JSON.parse(
      localStorage.getItem("inventra_users") || "[]"
    );
    if (existingUsers.find((u: { email: string }) => u.email === email)) {
      setErrors({ general: "AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS." });
      setIsLoading(false);
      return;
    }

    // Save user
    existingUsers.push({ name, email, password, createdAt: new Date().toISOString() });
    localStorage.setItem("inventra_users", JSON.stringify(existingUsers));

    setIsLoading(false);
    setIsSuccess(true);

    // Redirect to login after success
    setTimeout(() => {
      router.push("/login");
    }, 2500);
  }

  if (!mounted) return null;

  // ── Success state ──
  if (isSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto lg:mx-0">
        <motion.div
          className="flex flex-col items-start"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary opacity-40 mb-16">
            Registration Complete
          </span>

          <h1
            className="font-sans font-bold text-blue-primary leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: "clamp(48px, 7vw, 72px)" }}
          >
            Account
            <br />
            Created
          </h1>

          <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary opacity-50 mb-8 leading-relaxed">
            Redirecting to login...
          </p>

          {/* Animated progress line */}
          <div className="w-full h-px bg-blue-primary/10 overflow-hidden">
            <motion.div
              className="h-full bg-blue-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0">
      {/* Section marker */}
      <motion.div
        className="flex items-center justify-between mb-12"
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary opacity-40">
          New Account
        </span>
        <span className="section-marker text-blue-primary opacity-30">
          [INV.AUTH.02]
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="font-sans font-bold text-blue-primary leading-[0.9] tracking-tight mb-4"
        style={{ fontSize: "clamp(44px, 6vw, 72px)" }}
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        Register
      </motion.h1>

      <motion.p
        className="font-mono text-[12px] tracking-[0.15em] uppercase text-blue-primary opacity-50 mb-10"
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        Create your Inventra account.
      </motion.p>

      {/* General error */}
      {errors.general && (
        <motion.div
          className="mb-6 py-3 px-4 border border-blue-primary bg-blue-primary/[0.04]"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary">
            {errors.general}
          </p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-0">
        {/* ── 01 FULL NAME ── */}
        <motion.div
          className="relative pb-6"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-sans font-bold text-blue-primary text-[40px] leading-none tracking-tight opacity-10 select-none">
              01
            </span>
            <label
              htmlFor="name"
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary"
            >
              Full Name
            </label>
          </div>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            placeholder="Jonathan Doe"
            autoComplete="name"
            className="w-full bg-transparent border-0 border-b border-blue-primary/20 pb-3 pt-1 font-mono text-[14px] tracking-[0.05em] text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary transition-colors duration-300"
          />
          {errors.name && (
            <p className="mt-2 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary opacity-70">
              {errors.name}
            </p>
          )}
        </motion.div>

        {/* ── 02 EMAIL ── */}
        <motion.div
          className="relative pb-6"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-sans font-bold text-blue-primary text-[40px] leading-none tracking-tight opacity-10 select-none">
              02
            </span>
            <label
              htmlFor="reg-email"
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary"
            >
              Email Address
            </label>
          </div>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            placeholder="name@company.com"
            autoComplete="email"
            className="w-full bg-transparent border-0 border-b border-blue-primary/20 pb-3 pt-1 font-mono text-[14px] tracking-[0.05em] text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary transition-colors duration-300"
          />
          {errors.email && (
            <p className="mt-2 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary opacity-70">
              {errors.email}
            </p>
          )}
        </motion.div>

        {/* ── 03 PASSWORD ── */}
        <motion.div
          className="relative pb-2"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-sans font-bold text-blue-primary text-[40px] leading-none tracking-tight opacity-10 select-none">
              03
            </span>
            <label
              htmlFor="reg-password"
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              className="w-full bg-transparent border-0 border-b border-blue-primary/20 pb-3 pt-1 pr-16 font-mono text-[14px] tracking-[0.15em] text-blue-primary placeholder:text-blue-primary/25 placeholder:tracking-[0.05em] focus:outline-none focus:border-blue-primary transition-colors duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 bottom-3 font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary opacity-40 hover:opacity-100 transition-opacity duration-200"
            >
              {showPassword ? "[ HIDE ]" : "[ SHOW ]"}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary opacity-70">
              {errors.password}
            </p>
          )}
        </motion.div>

        {/* Password strength indicator */}
        <motion.div
          className="pb-6"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          {password.length > 0 && (
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-px bg-blue-primary/10 overflow-hidden">
                <motion.div
                  className="h-full bg-blue-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(strength.score / 5) * 100}%` }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    opacity: 0.15 + strength.score * 0.17,
                  }}
                />
              </div>
              <span
                className="font-mono text-[9px] tracking-[0.2em] uppercase text-blue-primary shrink-0"
                style={{ opacity: 0.25 + strength.score * 0.12 }}
              >
                {strength.label}
              </span>
            </div>
          )}
        </motion.div>

        {/* ── 04 CONFIRM PASSWORD ── */}
        <motion.div
          className="relative pb-6"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-sans font-bold text-blue-primary text-[40px] leading-none tracking-tight opacity-10 select-none">
              04
            </span>
            <label
              htmlFor="confirm-password"
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary"
            >
              Confirm Password
            </label>
          </div>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              placeholder="Re-enter password"
              autoComplete="new-password"
              className="w-full bg-transparent border-0 border-b border-blue-primary/20 pb-3 pt-1 pr-16 font-mono text-[14px] tracking-[0.15em] text-blue-primary placeholder:text-blue-primary/25 placeholder:tracking-[0.05em] focus:outline-none focus:border-blue-primary transition-colors duration-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-0 bottom-3 font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary opacity-40 hover:opacity-100 transition-opacity duration-200"
            >
              {showConfirm ? "[ HIDE ]" : "[ SHOW ]"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary opacity-70">
              {errors.confirmPassword}
            </p>
          )}
        </motion.div>

        {/* ── 05 TERMS ── */}
        <motion.div
          className="pb-10"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={7}
        >
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-sans font-bold text-blue-primary text-[40px] leading-none tracking-tight opacity-10 select-none">
              05
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary">
              Terms & Conditions
            </span>
          </div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`w-4 h-4 border flex items-center justify-center transition-all duration-200 shrink-0 mt-px ${
                terms
                  ? "bg-blue-primary border-blue-primary"
                  : "border-blue-primary/30 group-hover:border-blue-primary/60"
              }`}
              onClick={() => {
                setTerms(!terms);
                clearFieldError("terms");
              }}
            >
              {terms && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="var(--color-cream-primary)"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => {
                setTerms(e.target.checked);
                clearFieldError("terms");
              }}
              className="sr-only"
            />
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary opacity-50 group-hover:opacity-80 transition-opacity leading-relaxed">
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>
          {errors.terms && (
            <p className="mt-2 ml-7 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary opacity-70">
              {errors.terms}
            </p>
          )}
        </motion.div>

        {/* ── Submit button ── */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="relative w-full h-14 bg-blue-primary text-cream-primary font-mono text-[12px] tracking-[0.25em] uppercase overflow-hidden transition-colors duration-300 hover:bg-blue-dark disabled:opacity-70 group"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={8}
        >
          <span className="absolute inset-0 bg-blue-dark translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <span className="inline-block w-3 h-3 border border-cream-primary border-t-transparent animate-spin" />
                Creating Account...
              </>
            ) : (
              "[ Create Account → ]"
            )}
          </span>
        </motion.button>
      </form>

      {/* ── Login link ── */}
      <motion.div
        className="mt-8 flex items-center gap-2"
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={9}
      >
        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary opacity-40">
          Already registered?
        </span>
        <Link
          href="/login"
          className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary hover:opacity-60 transition-opacity duration-200"
        >
          [ Log In &rarr; ]
        </Link>
      </motion.div>
    </div>
  );
}
