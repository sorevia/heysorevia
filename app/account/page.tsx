"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, LogOut, Package, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [supabase])

  const handleLogout = async () => {
    await supabase?.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <section className="mt-8 rounded-[28px] border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Account</p>
          <h1 className="mt-3 font-serif text-4xl font-light md:text-6xl">Your Sorevia profile</h1>

          {loading ? (
            <p className="mt-6 text-muted-foreground">Loading account...</p>
          ) : user ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-5">
                <UserRound className="mb-5 h-7 w-7 text-primary" />
                <h2 className="font-serif text-2xl">{String(user.user_metadata?.full_name || "Sorevia customer")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-5">
                <Package className="mb-5 h-7 w-7 text-primary" />
                <h2 className="font-serif text-2xl">Orders</h2>
                <p className="mt-2 text-sm text-muted-foreground">View payment history and track deliveries.</p>
                <Button asChild className="mt-5 rounded-full bg-primary hover:bg-primary/90">
                  <Link href="/orders">Open order history</Link>
                </Button>
              </div>
              <Button onClick={handleLogout} variant="outline" className="rounded-full md:w-fit">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-border bg-background p-5">
              <p className="text-muted-foreground">You are not logged in.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/signup">Create account</Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
