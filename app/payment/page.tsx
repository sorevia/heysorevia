"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCartCount, getCartTotal, readCart, writeCart } from "@/lib/cart"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import type { CartItem } from "@/lib/cart"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

export default function PaymentPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [createdOrderId, setCreatedOrderId] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [isSuccessOverlayVisible, setIsSuccessOverlayVisible] = useState(false)

  const subtotal = useMemo(() => getCartTotal(items), [items])
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79
  const total = subtotal + shipping

  useEffect(() => {
    setItems(readCart())
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      if (!session) return

      setAccessToken(session.access_token)
      setEmail(session.user.email || "")
      setName(String(session.user.user_metadata?.full_name || ""))
    })
  }, [])

  const updateItems = (nextItems: CartItem[]) => {
    setItems(nextItems)
    writeCart(nextItems)
  }

  const updateQuantity = (productId: string, change: number) => {
    const nextItems = items
      .map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(item.product.stock, Math.max(0, item.quantity + change)) }
          : item,
      )
      .filter((item) => item.quantity > 0)

    updateItems(nextItems)
  }

  const handlePay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    setMessage("")
    setCreatedOrderId("")

    if (!accessToken) {
      setStatus("error")
      setMessage("Login is required before checkout.")
      return
    }

    const overStockItem = items.find((item) => item.quantity > item.product.stock)
    if (overStockItem) {
      setStatus("error")
      setMessage(`Only ${overStockItem.product.stock} left for ${overStockItem.product.name}.`)
      return
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email,
        customerName: name,
        phone,
        address,
        paymentMethod,
        total,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      setStatus("error")
      setMessage(data.error || "Payment could not be started. Please try again.")
      return
    }

    setStatus("success")
    const orderId = data.orderId || data.order?.id || ""
    setCreatedOrderId(orderId)
    setMessage(`Order created. Payment method selected: ${paymentMethod.toUpperCase()}.`)
    setIsSuccessOverlayVisible(true)
    updateItems([])
    window.setTimeout(() => setIsSuccessOverlayVisible(false), 1800)
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8">
      {isSuccessOverlayVisible ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-white">
          <div className="text-center">
            <div className="upi-check mx-auto">
              <svg viewBox="0 0 72 72" aria-hidden="true">
                <circle cx="36" cy="36" r="32" />
                <path d="M22 37.5 31.5 47 51 26" />
              </svg>
            </div>
            <p className="mt-5 text-lg font-semibold text-foreground">Payment request created</p>
            <p className="mt-1 text-sm text-muted-foreground">Your Sorevia order is confirmed.</p>
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl">
        <Link href="/#produits" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Secure checkout</p>
            <h1 className="mt-3 font-serif text-4xl font-light leading-tight md:text-6xl">Your Sorevia cart</h1>

            <div className="mt-8 space-y-4">
              {items.length ? (
                items.map((item) => (
                  <div key={item.product.id} className="grid gap-4 rounded-2xl border border-border/70 bg-card p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-28 w-full rounded-xl object-cover md:w-28"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-serif text-2xl">{item.product.name}</h2>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {item.product.tag}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.product.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <p className="font-semibold">{formatPrice(item.product.price)}</p>
                        {item.product.stock <= 10 ? (
                          <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                            Only {item.product.stock} left
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
                      <div className="flex items-center rounded-full border border-border bg-background">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="grid h-10 w-10 place-items-center"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="grid h-10 w-10 place-items-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateItems(items.filter((cartItem) => cartItem.product.id !== item.product.id))}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-border/70 bg-card p-8 text-center">
                  <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h2 className="mt-4 font-serif text-3xl">Your cart is empty</h2>
                  <p className="mt-2 text-muted-foreground">Add a jar to start checkout.</p>
                  <Button asChild className="mt-6 rounded-full bg-primary hover:bg-primary/90">
                    <Link href="/#produits">Shop products</Link>
                  </Button>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div>
                <h2 className="font-serif text-3xl">Payment summary</h2>
                <p className="mt-1 text-sm text-muted-foreground">{getCartCount(items)} items in cart</p>
              </div>
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>

            <div className="space-y-3 border-b border-border py-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping ? formatPrice(shipping) : "Free"}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handlePay}>
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
                readOnly
                placeholder="Email address"
                className="h-12 w-full rounded-full border border-border bg-muted/50 px-5 outline-none"
                required
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                className="h-12 w-full rounded-full border border-border bg-background px-5 outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Delivery address"
                className="min-h-24 w-full rounded-2xl border border-border bg-background px-5 py-4 outline-none focus:ring-2 focus:ring-primary/30"
                required
              />

              <div className="grid gap-3 sm:grid-cols-3">
                {["upi", "card", "cod"].map((method) => (
                  <label
                    key={method}
                    className={`cursor-pointer rounded-2xl border p-4 text-center text-sm font-semibold uppercase ${
                      paymentMethod === method ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="sr-only"
                    />
                    {method}
                  </label>
                ))}
              </div>

              <Button
                className="h-13 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                disabled={!items.length || status === "loading"}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {status === "loading" ? "Starting payment..." : `Pay ${formatPrice(total)}`}
              </Button>
            </form>

            {message ? (
              <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-primary"}`}>{message}</p>
            ) : null}
            {!accessToken ? (
              <Button asChild variant="outline" className="mt-4 rounded-full">
                <Link href="/login">Login to checkout</Link>
              </Button>
            ) : null}
            {createdOrderId ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={`/track-order?orderId=${createdOrderId}`}>Track this order</Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full">
                  <Link href="/orders">View order history</Link>
                </Button>
              </div>
            ) : null}
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              UPI/Card are checkout-ready placeholders. Connect Razorpay or Stripe next to collect live payments.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
