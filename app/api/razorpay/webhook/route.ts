import { NextResponse } from "next/server"
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay"
import { getSupabaseServerClient } from "@/lib/supabase-server"

type RazorpayWebhookPayload = {
  event?: string
  payload?: {
    payment?: {
      entity?: {
        notes?: {
          sorevia_order_id?: string
        }
      }
    }
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature") || ""
  const rawPayload = await request.text()

  if (!verifyRazorpayWebhookSignature(rawPayload, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  }

  const payload = JSON.parse(rawPayload) as RazorpayWebhookPayload
  const soreviaOrderId = payload.payload?.payment?.entity?.notes?.sorevia_order_id

  if (!soreviaOrderId) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  if (payload.event === "payment.captured") {
    await supabase.from("orders").update({ payment_status: "paid", status: "confirmed" }).eq("id", soreviaOrderId)
  }

  if (payload.event === "payment.failed") {
    await supabase.from("orders").update({ payment_status: "failed", status: "pending" }).eq("id", soreviaOrderId)
  }

  return NextResponse.json({ ok: true })
}
