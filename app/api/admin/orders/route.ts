import { NextResponse } from "next/server"
import { requireAdminUser } from "@/lib/auth-server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function PATCH(request: Request) {
  const admin = await requireAdminUser(request)
  if (!admin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const id = typeof body?.id === "string" ? body.id : ""
  const status = typeof body?.status === "string" ? body.status : ""
  const paymentStatus = typeof body?.paymentStatus === "string" ? body.paymentStatus : ""

  if (!id) {
    return NextResponse.json({ error: "Order ID is required." }, { status: 400 })
  }

  const update: Record<string, string> = {}
  if (status) update.status = status
  if (paymentStatus) update.payment_status = paymentStatus

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 })
  }

  const { data, error } = await supabase.from("orders").update(update).eq("id", id).select("*").single()

  if (error) {
    return NextResponse.json({ error: "Could not update order." }, { status: 500 })
  }

  return NextResponse.json({ order: data })
}
