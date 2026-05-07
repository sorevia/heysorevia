"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle2, Download, MapPin, Printer, Receipt, Search, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadReceipt, printReceipt, type ReceiptOrder } from "@/lib/receipts"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { formatOrderStatus, getTrackingStepIndex, trackingSteps, type OrderHistoryItem } from "@/lib/orders"

export function TrackOrderClient() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<OrderHistoryItem | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const activeStep = useMemo(() => (order ? getTrackingStepIndex(order.status) : 0), [order])
  const receiptOrder = useMemo<ReceiptOrder | null>(() => {
    if (!order) return null

    return {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      subtotal: order.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
      shipping: Math.max(order.totalAmount - order.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0), 0),
      total: order.totalAmount,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.product?.name || item.productId,
        tag: item.product?.tag || "Sorevia",
        price: item.unitPrice,
        quantity: item.quantity,
      })),
    }
  }, [order])

  const loadOrder = async (id: string) => {
    setStatus("loading")
    setMessage("")
    setOrder(null)

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatus("error")
      setMessage("Supabase Auth is not configured.")
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      setStatus("error")
      setMessage("Login to track your order.")
      return
    }

    const response = await fetch(`/api/orders?orderId=${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      setStatus("error")
      setMessage(data.error || "Could not track this order.")
      return
    }

    const foundOrder = data.orders?.[0]
    if (!foundOrder) {
      setStatus("error")
      setMessage("No order found for this ID.")
      return
    }

    setOrder(foundOrder)
    setStatus("success")
  }

  useEffect(() => {
    const queryOrderId = searchParams.get("orderId")
    if (queryOrderId) {
      setOrderId(queryOrderId)
      loadOrder(queryOrderId)
    }
  }, [searchParams])

  const handleTrack = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await loadOrder(orderId)
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <section className="mt-8 rounded-[28px] border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Track order</p>
          <h1 className="mt-3 font-serif text-4xl font-light leading-tight md:text-6xl">Follow your Sorevia delivery</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Enter your order ID to see payment status, current order stage, and delivery details.
          </p>

          <form className="mt-7 flex flex-col gap-3 sm:flex-row" onSubmit={handleTrack}>
            <input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Order ID"
              className="h-12 flex-1 rounded-full border border-border bg-background px-5 outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
            <Button className="h-12 rounded-full bg-primary px-7 hover:bg-primary/90" disabled={status === "loading"}>
              <Search className="mr-2 h-4 w-4" />
              {status === "loading" ? "Tracking..." : "Track"}
            </Button>
          </form>
          {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}
        </section>

        {order ? (
          <section className="mt-6 rounded-[28px] border border-border/70 bg-card p-6 md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Order #{order.id}</p>
                <h2 className="mt-2 font-serif text-3xl">{formatOrderStatus(order.status)}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Payment: {order.paymentMethod.toUpperCase()} · {formatOrderStatus(order.paymentStatus)}
                </p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-4 text-sm text-primary">
                <MapPin className="mb-2 h-5 w-5" />
                {order.address}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {trackingSteps.map((step, index) => {
                const isDone = index <= activeStep
                return (
                  <div key={step} className={`rounded-2xl border p-4 ${isDone ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                    {isDone ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <Truck className="h-6 w-6 text-muted-foreground" />}
                    <p className={`mt-5 text-sm font-semibold ${isDone ? "text-primary" : "text-muted-foreground"}`}>
                      {formatOrderStatus(step)}
                    </p>
                  </div>
                )
              })}
            </div>

            {receiptOrder ? (
              <div className="mt-8 rounded-2xl border border-border/70 bg-background p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-serif text-2xl">Receipt available</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Download or print receipt #{receiptOrder.id.slice(0, 8).toUpperCase()} anytime.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" variant="outline" className="rounded-full" onClick={() => printReceipt(receiptOrder)}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print / PDF
                    </Button>
                    <Button type="button" className="rounded-full bg-primary hover:bg-primary/90" onClick={() => downloadReceipt(receiptOrder)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download receipt
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  )
}
