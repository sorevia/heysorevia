import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-server"
import { isRazorpayConfigured, verifyRazorpayPaymentSignature } from "@/lib/razorpay"
import { getSupabaseServerClient } from "@/lib/supabase-server"

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
    return NextResponse.json({ error: "Supabase is required for payment verification." }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const soreviaOrderId = typeof body?.soreviaOrderId === "string" ? body.soreviaOrderId.trim() : ""
  const razorpayOrderId = typeof body?.razorpayOrderId === "string" ? body.razorpayOrderId.trim() : ""
  const razorpayPaymentId = typeof body?.razorpayPaymentId === "string" ? body.razorpayPaymentId.trim() : ""
  const razorpaySignature = typeof body?.razorpaySignature === "string" ? body.razorpaySignature.trim() : ""

  if (!soreviaOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Payment verification details are missing." }, { status: 400 })
  }

  const isValidSignature = verifyRazorpayPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  })

  if (!isValidSignature) {
    return NextResponse.json({ error: "Payment signature verification failed." }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "confirmed",
    })
    .eq("id", soreviaOrderId)
    .eq("customer_email", user.email.toLowerCase())
    .select("id")
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Could not mark payment as paid." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, orderId: soreviaOrderId, paymentId: razorpayPaymentId })
}
