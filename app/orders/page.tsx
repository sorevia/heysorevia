"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, CreditCard, PackageCheck, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { formatOrderStatus, type OrderHistoryItem } from "@/lib/orders"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([])
  const [userEmail, setUserEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const loadOrders = async () => {
    setStatus("loading")
    setMessage("")

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatus("error")
      setMessage("Supabase Auth is not configured.")
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token || !session.user.email) {
      setStatus("error")
      setMessage("Login to view your order history.")
      return
    }

    setUserEmail(session.user.email)

    const response = await fetch("/api/orders", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      setStatus("error")
      setMessage(data.error || "Could not load your order history.")
      return
    }

    setOrders(data.orders || [])
    setStatus("success")
    setMessage(data.orders?.length ? "" : "No orders found for your account yet.")
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <section className="mt-8 rounded-[28px] border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Order history</p>
          <h1 className="mt-3 font-serif text-4xl font-light leading-tight md:text-6xl">Your payment and order history</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Orders are loaded from your logged-in Sorevia account. No one can search another customer&apos;s email here.
          </p>

          <div className="mt-7 flex flex-col justify-between gap-3 rounded-2xl bg-muted/40 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Signed in as</p>
              <p className="mt-1 font-semibold">{userEmail || "Not logged in"}</p>
            </div>
            <div className="flex gap-3">
              {status === "error" ? (
                <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
                  <Link href="/login">Login</Link>
                </Button>
              ) : null}
              <Button variant="outline" className="rounded-full" onClick={loadOrders} disabled={status === "loading"}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {status === "loading" ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>
          {message ? <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-muted-foreground"}`}>{message}</p> : null}
        </section>

        <section className="mt-6 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                  <h2 className="mt-2 font-serif text-3xl">{formatPrice(order.totalAmount)}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="grid gap-2 text-sm md:text-right">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                    <PackageCheck className="h-4 w-4" />
                    {formatOrderStatus(order.status)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 font-semibold text-secondary">
                    <CreditCard className="h-4 w-4" />
                    {order.paymentMethod.toUpperCase()} · {formatOrderStatus(order.paymentStatus)}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-sm">
                    <span>{item.product?.name || item.productId}</span>
                    <span className="font-semibold">
                      {item.quantity} x {formatPrice(item.unitPrice)}
                    </span>
                  </div>
                ))}
              </div>

              <Button asChild variant="outline" className="mt-5 rounded-full">
                <Link href={`/track-order?orderId=${order.id}`}>
                  <Clock className="mr-2 h-4 w-4" />
                  Track order
                </Link>
              </Button>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
