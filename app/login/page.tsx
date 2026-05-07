"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatus("error")
      setMessage("Supabase Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.")
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setStatus("error")
      setMessage(error.message)
      return
    }

    setStatus("success")
    setMessage("Logged in successfully.")
    router.push("/account")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8">
      <div className="mx-auto max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <section className="mt-8 rounded-[28px] border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Welcome back</p>
          <h1 className="mt-3 font-serif text-4xl font-light">Login</h1>
          <p className="mt-3 text-sm text-muted-foreground">Access orders, payment history, and tracking faster.</p>

          <form className="mt-7 space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="h-12 w-full rounded-full border border-border bg-background px-5 outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="h-12 w-full rounded-full border border-border bg-background px-5 outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
            <Button className="h-12 w-full rounded-full bg-primary hover:bg-primary/90" disabled={status === "loading"}>
              <LogIn className="mr-2 h-4 w-4" />
              {status === "loading" ? "Logging in..." : "Login"}
            </Button>
          </form>

          {message ? <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-primary"}`}>{message}</p> : null}

          <p className="mt-5 text-center text-sm">
            <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
              Forgot password?
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Sorevia?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create account
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
