"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ScrollBlurText } from "@/components/scroll-blur-text"
import { fallbackProducts, type Product } from "@/lib/products"
import { addProductToCart } from "@/lib/cart"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

const getInventoryMessage = (stock: number) => {
  if (stock <= 0) return "Sold out"
  if (stock <= 10) return `Only ${stock} left`
  return ""
}

export function ProductSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(fallbackProducts)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return
    addProductToCart(product)
    router.push("/payment")
  }

  useEffect(() => {
    let isMounted = true

    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted && Array.isArray(data.products)) {
          setProducts(data.products)
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts(fallbackProducts)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section ref={sectionRef} id="produits" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-4">
            Shop Sorevia
          </p>
          <ScrollBlurText
            text="Rotating jars, real performance"
            className="font-serif text-3xl text-foreground text-balance mb-6 md:text-7xl font-light"
          />
          <p className="reveal opacity-0 animation-delay-400 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Premium peanut butter jars with clean labels, bold flavor, and smart nutrition for everyday strength.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : ""} group min-w-0`}
            >
              <div className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 product-tilt">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted z-10">
                  <Link href={`/products/${product.slug}`}>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>
                  {/* End of Progressive blur effect from bottom */}
                  <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full z-10">
                    {product.tag}
                  </span>
                </div>
                {/* Content */}
                <div className="p-6 lg:p-8">
                  <h3 className="font-serif text-foreground mb-3 text-3xl font-normal">
                    <Link href={`/products/${product.slug}`} className="hover:text-primary">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-lg font-semibold text-foreground">{formatPrice(product.price)}</span>
                    {product.compareAtPrice ? (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    ) : null}
                    {getInventoryMessage(product.stock) ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.stock <= 0 ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {getInventoryMessage(product.stock)}
                      </span>
                    ) : null}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="h-11 min-w-36 gap-2 rounded-full bg-primary px-5 text-sm text-primary-foreground hover:bg-primary/90 group/btn"
                    disabled={product.stock <= 0}
                  >
                    <span>{product.stock <= 0 ? "Sold out" : "Add to cart"}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
