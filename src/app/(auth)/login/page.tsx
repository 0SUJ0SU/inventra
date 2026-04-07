"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid credentials")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="border border-blue-primary/10 bg-cream-light">
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-primary/8">
        <span className="font-mono text-xs tracking-[0.25em] uppercase text-blue-primary">
          Inventra
        </span>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          [AUTH.LOGIN]
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-tight text-blue-primary leading-none">
            Sign In
          </h1>
          <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/40 mt-2">
            Access your inventory dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 border border-error/20 bg-error/5">
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-error">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 block mb-1.5">
              Email<span className="text-error ml-0.5">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@inventra.dev"
              required
              className="w-full h-10 px-3 bg-cream-primary border border-blue-primary/10 font-mono text-[11px] tracking-[0.05em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none focus:border-blue-primary/30 transition-colors"
            />
          </div>

          <div>
            <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 block mb-1.5">
              Password<span className="text-error ml-0.5">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo1234"
              required
              className="w-full h-10 px-3 bg-cream-primary border border-blue-primary/10 font-mono text-[11px] tracking-[0.05em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none focus:border-blue-primary/30 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-blue-dark transition-colors disabled:opacity-60"
        >
          {isLoading ? (
            <><Loader2 size={14} strokeWidth={1.5} className="animate-spin" /> Signing in...</>
          ) : (
            <><LogIn size={14} strokeWidth={1.5} /> Sign In</>
          )}
        </button>

        <div className="p-3 border border-blue-primary/8 bg-cream-primary">
          <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/30 mb-1">
            Demo Credentials
          </p>
          <p className="font-mono text-[10px] tracking-[0.05em] text-blue-primary/50">
            demo@inventra.dev / demo1234
          </p>
        </div>
      </form>

      <div className="flex items-center justify-between px-6 py-3 border-t border-blue-primary/8">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [AUTH.LOGIN.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  )
}
