"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowLeft, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatus("error")
      setMessage("Supabase Auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.")
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      setStatus("error")
      setMessage(error.message)
      return
    }

    setStatus("success")
    setMessage("Account created. If email confirmation is enabled in Supabase, confirm your email before logging in.")
    setName("")
    setEmail("")
    setPassword("")
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8">
      <div className="mx-auto max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <section className="mt-8 rounded-[28px] border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Join Sorevia</p>
          <h1 className="mt-3 font-serif text-4xl font-light">Create account</h1>
          <p className="mt-3 text-sm text-muted-foreground">Save checkout details, view order history, and track deliveries.</p>

          <form className="mt-7 space-y-4" onSubmit={handleSignup}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              className="h-12 w-full rounded-full border border-border bg-background px-5 outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
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
              minLength={6}
              className="h-12 w-full rounded-full border border-border bg-background px-5 outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
            <Button className="h-12 w-full rounded-full bg-primary hover:bg-primary/90" disabled={status === "loading"}>
              <UserPlus className="mr-2 h-4 w-4" />
              {status === "loading" ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          {message ? <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-primary"}`}>{message}</p> : null}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
