import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-server"
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay"
import { getSupabaseServerClient } from "@/lib/supabase-server"

type OrderItem = {
  productId: string
  quantity: number
  unitPrice?: number
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request)
  if (!user?.email) {
    return NextResponse.json({ error: "Login is required before checkout." }, { status: 401 })
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay is not configured yet." }, { status: 503 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is required for Razorpay checkout." }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const email = user.email.toLowerCase()
  const customerName = typeof body?.customerName === "string" ? body.customerName.trim() : ""
  const phone = typeof body?.phone === "string" ? body.phone.trim() : ""
  const address = typeof body?.address === "string" ? body.address.trim() : ""
  const total = Number(body?.total || 0)
  const items = Array.isArray(body?.items) ? (body.items as OrderItem[]) : []

  if (!customerName || !phone || !address || !items.length || total <= 0) {
    return NextResponse.json({ error: "Customer details and cart items are required." }, { status: 400 })
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

  const { data: soreviaOrderId, error: orderError } = await supabase.rpc("create_order_with_stock", {
    p_customer_name: customerName,
    p_customer_email: email,
    p_phone: phone,
    p_address: address,
    p_payment_method: "razorpay",
    p_total_amount: total,
    p_items: normalizedItems,
  })

  if (orderError || !soreviaOrderId) {
    return NextResponse.json({ error: orderError?.message || "Could not create order." }, { status: 409 })
  }

  try {
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: String(soreviaOrderId).slice(0, 40),
      notes: {
        sorevia_order_id: String(soreviaOrderId),
        customer_email: email,
      },
    })

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      razorpayOrderId: razorpayOrder.id,
      soreviaOrderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      customer: {
        name: customerName,
        email,
        phone,
      },
    })
  } catch (error) {
    await supabase
      .from("orders")
      .update({ payment_status: "payment_setup_failed", status: "pending" })
      .eq("id", soreviaOrderId)
      .eq("customer_email", email)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create Razorpay order." },
      { status: 502 },
    )
  }
}
