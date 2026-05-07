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

  if (!id) {
    return NextResponse.json({ error: "Product ID is required." }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (typeof body.name === "string") update.name = body.name.trim()
  if (typeof body.tag === "string") update.tag = body.tag.trim()
  if (typeof body.description === "string") update.description = body.description.trim()
  if (typeof body.image === "string") update.image = body.image.trim()
  if (typeof body.active === "boolean") update.active = body.active
  if (typeof body.featured === "boolean") update.featured = body.featured
  if (Number.isFinite(Number(body.price))) update.price = Math.max(0, Number(body.price))
  if (body.compareAtPrice === null) update.compare_at_price = null
  if (Number.isFinite(Number(body.compareAtPrice))) update.compare_at_price = Math.max(0, Number(body.compareAtPrice))
  if (Number.isFinite(Number(body.stock))) update.stock = Math.max(0, Number(body.stock))
  if (Number.isFinite(Number(body.sortOrder))) update.sort_order = Number(body.sortOrder)

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 })
  }

  const { data, error } = await supabase.from("products").update(update).eq("id", id).select("*").single()

  if (error) {
    return NextResponse.json({ error: "Could not update product." }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}
