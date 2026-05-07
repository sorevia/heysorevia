import { NextResponse } from "next/server"
import { fallbackProducts } from "@/lib/products"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { getAuthenticatedUser } from "@/lib/auth-server"
import type { OrderHistoryItem } from "@/lib/orders"

type OrderItem = {
  productId: string
  quantity: number
  unitPrice?: number
}

type SupabaseOrder = {
  id: string
  customer_name: string
  customer_email: string
  phone: string
  address: string
  payment_method: string
  payment_status: string
  status: string
  total_amount: number
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

function mapOrder(order: SupabaseOrder): OrderHistoryItem {
  return {
    id: order.id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    phone: order.phone,
    address: order.address,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    status: order.status,
    totalAmount: order.total_amount,
    createdAt: order.created_at,
    items:
      order.order_items?.map((item) => ({
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        product: Array.isArray(item.products) ? item.products[0] : item.products || undefined,
      })) || [],
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("orderId")?.trim()

  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json({ orders: [], source: "fallback" })
  }

  const user = await getAuthenticatedUser(request)
  if (!user?.email) {
    return NextResponse.json({ error: "Login is required to view orders." }, { status: 401 })
  }

  let query = supabase
    .from("orders")
    .select(
      "id,customer_name,customer_email,phone,address,payment_method,payment_status,status,total_amount,created_at,order_items(id,product_id,quantity,unit_price,products(name,image,tag))",
    )
    .order("created_at", { ascending: false })
    .eq("customer_email", user.email.toLowerCase())

  if (orderId) {
    query = query.eq("id", orderId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: "Unable to load orders." }, { status: 500 })
  }

  return NextResponse.json({ orders: (data as unknown as SupabaseOrder[]).map(mapOrder), source: "supabase" })
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request)
  if (!user?.email) {
    return NextResponse.json({ error: "Login is required before checkout." }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const email = user.email.toLowerCase()
  const customerName = typeof body?.customerName === "string" ? body.customerName.trim() : ""
  const phone = typeof body?.phone === "string" ? body.phone.trim() : ""
  const address = typeof body?.address === "string" ? body.address.trim() : ""
  const paymentMethod = typeof body?.paymentMethod === "string" ? body.paymentMethod.trim() : "upi"
  const total = Number(body?.total || 0)
  const items = Array.isArray(body?.items) ? (body.items as OrderItem[]) : []

  if (!email || !customerName || !phone || !address || !items.length) {
    return NextResponse.json({ error: "Customer details and at least one order item are required." }, { status: 400 })
  }

  const normalizedItems = items
    .map((item) => ({
      productId: String(item.productId || ""),
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
    }))
    .filter((item) => item.productId && item.quantity > 0)

  if (!normalizedItems.length) {
    return NextResponse.json({ error: "Order items are invalid." }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()

  if (!supabase) {
    const unavailableItem = normalizedItems.find((item) => {
      const product = fallbackProducts.find((fallbackProduct) => fallbackProduct.id === item.productId)
      return !product || item.quantity > product.stock
    })

    if (unavailableItem) {
      const product = fallbackProducts.find((fallbackProduct) => fallbackProduct.id === unavailableItem.productId)
      return NextResponse.json(
        { error: product ? `Only ${product.stock} left for ${product.name}.` : "Product is not available." },
        { status: 409 },
      )
    }

    return NextResponse.json({
      ok: true,
      source: "fallback",
      order: {
        id: `mock_${Date.now()}`,
        email,
        customerName,
        phone,
        address,
        paymentMethod,
        total,
        items: normalizedItems,
        products: fallbackProducts.filter((product) => normalizedItems.some((item) => item.productId === product.id)),
      },
    })
  }

  const { data: orderId, error: orderError } = await supabase.rpc("create_order_with_stock", {
    p_customer_name: customerName,
    p_customer_email: email,
    p_phone: phone,
    p_address: address,
    p_payment_method: paymentMethod,
    p_total_amount: total,
    p_items: normalizedItems,
  })

  if (orderError) {
    return NextResponse.json({ error: orderError.message || "Could not create order." }, { status: 409 })
  }

  return NextResponse.json({ ok: true, source: "supabase", orderId })
}
