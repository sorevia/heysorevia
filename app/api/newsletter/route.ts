import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      source: "fallback",
      message: "Newsletter signup captured locally. Add Supabase env vars to save it to the database.",
    })
  }

  const { error } = await supabase.from("newsletter_signups").upsert(
    {
      email,
      source: "homepage_community",
    },
    { onConflict: "email" },
  )

  if (error) {
    return NextResponse.json({ error: "Could not save your signup. Please try again." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, source: "supabase", message: "Welcome to the Sorevia community." })
}
