import { NextResponse } from "next/server"
import { requireAdminUser } from "@/lib/auth-server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

type AdminProduct = {
  id: string
  name: string
  slug: string
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
  phone: string
  address: string
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
    products?: {
      name: string
      image: string
      tag: string
    } | null
  }[]
}

export async function GET(request: Request) {
  const admin = await requireAdminUser(request)
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 })
  }

  const [{ data: products, error: productsError }, { data: orders, error: ordersError }] = await Promise.all([
    supabase.from("products").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("orders")
      .select(
        "id,customer_name,customer_email,phone,address,payment_method,payment_status,total_amount,status,created_at,order_items(id,product_id,quantity,unit_price,products(name,image,tag))",
      )
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  if (productsError || ordersError) {
    return NextResponse.json({ error: "Could not load admin dashboard." }, { status: 500 })
  }

  const typedProducts = (products || []) as AdminProduct[]
  const typedOrders = (orders || []) as unknown as AdminOrder[]
  const paidOrPendingOrders = typedOrders.filter((order) => order.status !== "cancelled")
  const totalRevenue = paidOrPendingOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
  const lowStockProducts = typedProducts.filter((product) => product.stock <= 10)

  const salesMap = new Map<string, { productId: string; name: string; sold: number; revenue: number }>()
  typedOrders.forEach((order) => {
    order.order_items?.forEach((item) => {
      const existing = salesMap.get(item.product_id) || {
        productId: item.product_id,
        name: Array.isArray(item.products) ? item.products[0]?.name || item.product_id : item.products?.name || item.product_id,
        sold: 0,
        revenue: 0,
      }
      existing.sold += item.quantity
      existing.revenue += item.quantity * item.unit_price
      salesMap.set(item.product_id, existing)
    })
  })

  const bestSellers = Array.from(salesMap.values()).sort((a, b) => b.sold - a.sold)
  const recentOrders = typedOrders.slice(0, 12)

  return NextResponse.json({
    adminEmail: admin.email,
    products: typedProducts,
    orders: recentOrders,
    analytics: {
      totalRevenue,
      orderCount: typedOrders.length,
      unitsSold: bestSellers.reduce((sum, item) => sum + item.sold, 0),
      lowStockCount: lowStockProducts.length,
      bestSellers,
      lowStockProducts,
    },
  })
}
