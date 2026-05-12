import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { fallbackProducts } from "@/lib/products"
import { getProductJsonLd, getProductMetadata } from "@/lib/seo"

type ProductPageProps = {
  params: Promise<{
    slug: string
  }>
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

export function generateStaticParams() {
  return fallbackProducts.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = fallbackProducts.find((item) => item.slug === slug)
  if (!product) return {}
  return getProductMetadata(product)
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = fallbackProducts.find((item) => item.slug === slug)
  if (!product) notFound()

  const jsonLd = getProductJsonLd(product)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-36 lg:grid-cols-[1fr_0.85fr] lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-border/60 bg-muted">
          <img
            src={product.image}
            alt={`Sorevia ${product.name} premium high-protein peanut butter`}
            className="h-full min-h-[420px] w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <Link href="/#produits" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">{product.tag}</p>
          <h1 className="mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">
            Sorevia {product.name} Peanut Butter
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{product.description}</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            This product variant is made for premium high-protein peanut butter routines, clean ingredients, natural flavor,
            fitness nutrition, breakfast bowls, smoothies, toast, snacks, and post-workout meals.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
            ) : null}
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
              {product.stock > 0 ? "In stock" : "Sold out"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
              <Link href="/payment">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to cart
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full bg-transparent px-6">
              <Link href="/contact">Contact Sorevia</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
