import { NextResponse } from "next/server"
import { fallbackProducts } from "@/lib/products"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return NextResponse.json({ products: fallbackProducts, source: "fallback" })
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,description,image,tag,price,compare_at_price,stock,featured")
    .eq("active", true)
    .order("sort_order", { ascending: true })

  if (error) {
    return NextResponse.json({ error: "Unable to load products" }, { status: 500 })
  }

  const products = data.map((product) => ({
    id: product.id,
    name: product.id === "honey-fit" ? "Honey Fit" : product.name,
    slug: product.slug,
    description: product.description,
    image: product.image,
    tag: product.tag,
    price: product.price,
    compareAtPrice: product.compare_at_price,
    stock: product.stock,
    featured: product.featured,
  }))

  return NextResponse.json({ products, source: "supabase" })
}
