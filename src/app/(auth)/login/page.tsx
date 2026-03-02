// src/app/(auth)/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// ── Validation ──
interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validateLogin(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!email.trim()) {
    errors.email = "EMAIL ADDRESS IS REQUIRED.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "INVALID EMAIL FORMAT.";
  }
  if (!password) {
    errors.password = "PASSWORD IS REQUIRED.";
  } else if (password.length < 6) {
    errors.password = "MINIMUM 6 CHARACTERS.";
  }
  return errors;
}

// ── Demo credentials ──
const DEMO_EMAIL = "admin@inventra.com";
const DEMO_PASSWORD = "inventra123";

// ── Animation ──
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("inventra_remembered_email");
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateLogin(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const registeredUsers = JSON.parse(
      localStorage.getItem("inventra_users") || "[]"
    );
    const isDemo = email === DEMO_EMAIL && password === DEMO_PASSWORD;
    const isRegistered = registeredUsers.find(
      (u: { email: string; password: string }) =>
        u.email === email && u.password === password
    );

    if (!isDemo && !isRegistered) {
      setErrors({ general: "INVALID CREDENTIALS. CHECK EMAIL AND PASSWORD." });
      setIsLoading(false);
      return;
    }

    localStorage.setItem(
      "inventra_session",
      JSON.stringify({
        email,
        name: isDemo ? "Admin" : isRegistered?.name || "User",
        loggedInAt: new Date().toISOString(),
      })
    );

    if (rememberMe) {
      localStorage.setItem("inventra_remembered_email", email);
    } else {
      localStorage.removeItem("inventra_remembered_email");
    }

    setIsLoading(false);
    router.push("/");
  }

  if (!mounted) return null;

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0">
      {/* ── Header ── */}
      <motion.div
        className="flex items-center justify-between mb-6"
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary opacity-40">
          Authentication
        </span>
        <span className="section-marker text-blue-primary opacity-30">
          [INV.AUTH.01]
        </span>
      </motion.div>

      {/* ── Demo credentials — positioned prominently near top ── */}
      <motion.div
        className="mb-10 py-3 px-4 border border-blue-primary/15 bg-blue-primary/[0.03]"
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <p className="font-mono text-[10px] tracking-[0.08em] text-blue-primary opacity-50 leading-[1.8]">
          <span className="opacity-70">{"//"} DEMO CREDENTIALS</span>
          <br />
          <span className="opacity-70">{"//"}</span> EMAIL:{" "}
          <span className="text-blue-primary opacity-90 select-all">admin@inventra.com</span>
          <br />
          <span className="opacity-70">{"//"}</span> PASSWORD:{" "}
          <span className="text-blue-primary opacity-90 select-all">inventra123</span>
        </p>
      </motion.div>

      {/* ── Headline ── */}
      <motion.h1
        className="font-sans font-bold text-blue-primary leading-[0.9] tracking-tight mb-3"
        style={{ fontSize: "clamp(48px, 7vw, 80px)" }}
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        Log In
      </motion.h1>

      <motion.p
        className="font-mono text-[12px] tracking-[0.15em] uppercase text-blue-primary opacity-50 mb-10"
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        Access your inventory management system.
      </motion.p>

      {/* ── General error ── */}
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

      {/* ── Form ── */}
      <form onSubmit={handleSubmit}>
        {/* 01 EMAIL */}
        <motion.div
          className="mb-8"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-sans font-bold text-blue-primary text-[44px] leading-none tracking-tight opacity-10 select-none">
              01
            </span>
            <label
              htmlFor="email"
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary"
            >
              Email Address
            </label>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
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

        {/* 02 PASSWORD */}
        <motion.div
          className="mb-8"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-sans font-bold text-blue-primary text-[44px] leading-none tracking-tight opacity-10 select-none">
              02
            </span>
            <label
              htmlFor="password"
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="••••••••••"
              autoComplete="current-password"
              className="w-full bg-transparent border-0 border-b border-blue-primary/20 pb-3 pt-1 pr-16 font-mono text-[14px] tracking-[0.15em] text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary transition-colors duration-300"
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

        {/* Options row */}
        <motion.div
          className="flex items-center justify-between mb-10"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-4 h-4 border flex items-center justify-center transition-all duration-200 ${
                rememberMe
                  ? "bg-blue-primary border-blue-primary"
                  : "border-blue-primary/30 group-hover:border-blue-primary/60"
              }`}
              onClick={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
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
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only"
            />
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary opacity-50 group-hover:opacity-80 transition-opacity">
              Remember me
            </span>
          </label>

          <button
            type="button"
            className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary opacity-40 hover:opacity-100 transition-opacity duration-200"
          >
            [ Forgot Password &rarr; ]
          </button>
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="relative w-full h-14 bg-blue-primary text-cream-primary font-mono text-[12px] tracking-[0.25em] uppercase overflow-hidden transition-colors duration-300 hover:bg-blue-dark disabled:opacity-70 group"
          variants={slideIn as never}
          initial="hidden"
          animate="visible"
          custom={7}
        >
          <span className="absolute inset-0 bg-blue-dark translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <span className="inline-block w-3 h-3 border border-cream-primary border-t-transparent animate-spin" />
                Authenticating...
              </>
            ) : (
              "[ Log In → ]"
            )}
          </span>
        </motion.button>
      </form>

      {/* Register link */}
      <motion.div
        className="mt-6 flex items-center gap-2"
        variants={slideIn as never}
        initial="hidden"
        animate="visible"
        custom={8}
      >
        <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary opacity-40">
          No account?
        </span>
        <Link
          href="/register"
          className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary hover:opacity-60 transition-opacity duration-200"
        >
          [ Create Account &rarr; ]
        </Link>
      </motion.div>
    </div>
  );
}
