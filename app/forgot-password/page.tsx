"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatus("error")
      setMessage("Supabase Auth is not configured.")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    if (error) {
      setStatus("error")
      setMessage(error.message)
      return
    }

    setStatus("success")
    setMessage("Password reset link sent. Check your email inbox.")
    setEmail("")
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8">
      <div className="mx-auto max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <section className="mt-8 rounded-[28px] border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Account recovery</p>
          <h1 className="mt-3 font-serif text-4xl font-light">Forgot password</h1>
          <p className="mt-3 text-sm text-muted-foreground">Enter your email and Supabase will send a password reset link.</p>

          <form className="mt-7 space-y-4" onSubmit={handleReset}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="h-12 w-full rounded-full border border-border bg-background px-5 outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
            <Button className="h-12 w-full rounded-full bg-primary hover:bg-primary/90" disabled={status === "loading"}>
              <Mail className="mr-2 h-4 w-4" />
              {status === "loading" ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          {message ? <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-primary"}`}>{message}</p> : null}
        </section>
      </div>
    </main>
  )
}
