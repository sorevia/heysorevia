"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ArrowLeft, Boxes, IndianRupee, PackageCheck, RefreshCw, Save, ShoppingBag, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

type AdminProduct = {
  id: string
  name: string
  description: string
  image: string
  tag: string
  price: number
  compare_at_price: number | null
  stock: number
  featured: boolean
  active: boolean
  sort_order: number
}

type AdminOrder = {
  id: string
  customer_name: string
  customer_email: string
  payment_method: string
  payment_status: string
  total_amount: number
  status: string
  created_at: string
  order_items?: {
    id: string
    product_id: string
    quantity: number
    unit_price: number
    products?: { name: string } | { name: string }[] | null
  }[]
}

type DashboardData = {
  adminEmail: string
  products: AdminProduct[]
  orders: AdminOrder[]
  analytics: {
    totalRevenue: number
    orderCount: number
    unitsSold: number
    lowStockCount: number
    bestSellers: { productId: string; name: string; sold: number; revenue: number }[]
    lowStockProducts: AdminProduct[]
  }
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

const orderStatuses = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"]
const paymentStatuses = ["payment_pending", "paid", "failed", "refunded", "cod_pending"]

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [draftProducts, setDraftProducts] = useState<Record<string, AdminProduct>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [accessToken, setAccessToken] = useState("")

  const chartData = useMemo(() => data?.analytics.bestSellers.slice(0, 6) || [], [data])

  const loadDashboard = async () => {
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

    if (!session?.access_token) {
      setStatus("error")
      setMessage("Login with an admin account to view this dashboard.")
      return
    }

    setAccessToken(session.access_token)
    const response = await fetch("/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
    const nextData = await response.json().catch(() => ({}))

    if (!response.ok) {
      setStatus("error")
      setMessage(nextData.error || "Could not load admin dashboard.")
      return
    }

    setData(nextData)
    setDraftProducts(
      Object.fromEntries((nextData.products as AdminProduct[]).map((product) => [product.id, { ...product }])),
    )
    setStatus("success")
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const updateDraftProduct = (id: string, patch: Partial<AdminProduct>) => {
    setDraftProducts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }))
  }

  const saveProduct = async (product: AdminProduct) => {
    setMessage("")
    const response = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        tag: product.tag,
        image: product.image,
        price: product.price,
        compareAtPrice: product.compare_at_price,
        stock: product.stock,
        active: product.active,
        featured: product.featured,
        sortOrder: product.sort_order,
      }),
    })
    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      setMessage(result.error || "Could not update product.")
      return
    }

    setMessage(`${product.name} updated.`)
    await loadDashboard()
  }

  const updateOrder = async (orderId: string, patch: { status?: string; paymentStatus?: string }) => {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: orderId, ...patch }),
    })
    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      setMessage(result.error || "Could not update order.")
      return
    }

    setMessage("Order updated.")
    await loadDashboard()
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <Button variant="outline" className="rounded-full" onClick={loadDashboard} disabled={status === "loading"}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <section className="mt-8 rounded-[28px] border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Sorevia manager</p>
          <h1 className="mt-3 font-serif text-4xl font-light leading-tight md:text-6xl">Admin dashboard</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Track stock, revenue, best sellers, payment status, and fulfillment from one private dashboard.
          </p>
          {data?.adminEmail ? <p className="mt-4 text-sm text-muted-foreground">Signed in as {data.adminEmail}</p> : null}
          {message ? <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-primary"}`}>{message}</p> : null}
        </section>

        {status === "error" ? (
          <section className="mt-6 rounded-2xl border border-border/70 bg-card p-6">
            <p className="text-red-600">{message}</p>
            <Button asChild className="mt-5 rounded-full bg-primary hover:bg-primary/90">
              <Link href="/login">Login</Link>
            </Button>
          </section>
        ) : null}

        {data ? (
          <>
            <section className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                { label: "Revenue", value: formatPrice(data.analytics.totalRevenue), icon: IndianRupee },
                { label: "Orders", value: data.analytics.orderCount.toString(), icon: ShoppingBag },
                { label: "Units sold", value: data.analytics.unitsSold.toString(), icon: TrendingUp },
                { label: "Low stock", value: data.analytics.lowStockCount.toString(), icon: Boxes },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-border/70 bg-card p-5">
                  <metric.icon className="mb-5 h-6 w-6 text-primary" />
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 font-serif text-3xl">{metric.value}</p>
                </div>
              ))}
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <h2 className="font-serif text-3xl">Best sellers</h2>
                <ChartContainer
                  className="mt-6 h-[320px]"
                  config={{
                    sold: {
                      label: "Units sold",
                      color: "oklch(0.34 0.09 142)",
                    },
                  }}
                >
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sold" fill="var(--color-sold)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <h2 className="font-serif text-3xl">Low stock alerts</h2>
                <div className="mt-6 space-y-3">
                  {data.analytics.lowStockProducts.length ? (
                    data.analytics.lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
                        <span className="font-medium">{product.name}</span>
                        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                          {product.stock <= 0 ? "Sold out" : `${product.stock} left`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No low-stock products right now.</p>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-border/70 bg-card p-5">
              <h2 className="font-serif text-3xl">Product manager</h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {data.products.map((product) => {
                  const draft = draftProducts[product.id] || product
                  return (
                    <article key={product.id} className="rounded-2xl border border-border bg-background p-4">
                      <img src={product.image} alt={product.name} className="h-40 w-full rounded-xl object-cover" />
                      <div className="mt-4 space-y-3">
                        <input
                          value={draft.name}
                          onChange={(event) => updateDraftProduct(product.id, { name: event.target.value })}
                          className="h-11 w-full rounded-full border border-border bg-card px-4 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <label className="text-xs text-muted-foreground">
                            Price
                            <input
                              type="number"
                              value={draft.price}
                              onChange={(event) => updateDraftProduct(product.id, { price: Number(event.target.value) })}
                              className="mt-1 h-10 w-full rounded-full border border-border bg-card px-4 text-foreground outline-none"
                            />
                          </label>
                          <label className="text-xs text-muted-foreground">
                            Stock
                            <input
                              type="number"
                              value={draft.stock}
                              onChange={(event) => updateDraftProduct(product.id, { stock: Number(event.target.value) })}
                              className="mt-1 h-10 w-full rounded-full border border-border bg-card px-4 text-foreground outline-none"
                            />
                          </label>
                        </div>
                        <textarea
                          value={draft.description}
                          onChange={(event) => updateDraftProduct(product.id, { description: event.target.value })}
                          className="min-h-24 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={draft.active}
                              onChange={(event) => updateDraftProduct(product.id, { active: event.target.checked })}
                            />
                            Active
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={draft.featured}
                              onChange={(event) => updateDraftProduct(product.id, { featured: event.target.checked })}
                            />
                            Featured
                          </label>
                        </div>
                        <Button className="w-full rounded-full bg-primary hover:bg-primary/90" onClick={() => saveProduct(draft)}>
                          <Save className="mr-2 h-4 w-4" />
                          Save product
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-border/70 bg-card p-5">
              <h2 className="font-serif text-3xl">Recent orders</h2>
              <div className="mt-6 space-y-4">
                {data.orders.map((order) => (
                  <article key={order.id} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                        <h3 className="mt-2 font-serif text-2xl">{formatPrice(order.total_amount)}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {order.customer_name} · {order.customer_email}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <select
                          value={order.status}
                          onChange={(event) => updateOrder(order.id, { status: event.target.value })}
                          className="h-11 rounded-full border border-border bg-card px-4 text-sm outline-none"
                        >
                          {orderStatuses.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        <select
                          value={order.payment_status}
                          onChange={(event) => updateOrder(order.id, { paymentStatus: event.target.value })}
                          className="h-11 rounded-full border border-border bg-card px-4 text-sm outline-none"
                        >
                          {paymentStatuses.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2">
                      {order.order_items?.map((item) => {
                        const productName = Array.isArray(item.products)
                          ? item.products[0]?.name || item.product_id
                          : item.products?.name || item.product_id
                        return (
                          <div key={item.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-sm">
                            <span>{productName}</span>
                            <span className="font-semibold">
                              {item.quantity} x {formatPrice(item.unit_price)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}
