import Link from "next/link"

const productVariants = [
  { name: "Classic Crunch", href: "/products/classic-crunch" },
  { name: "Cocoa Strength", href: "/products/cocoa-strength" },
  { name: "Honey Fit", href: "/products/honey-fit" },
]

const supportLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Shipping", href: "/shipping" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms" },
]

export function HomeSeoSection() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Sorevia nutrition</p>
            <h2 className="mt-4 font-serif text-3xl font-light md:text-5xl">
              Premium high-protein peanut butter for fitness nutrition
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Sorevia makes premium high-protein peanut butter with clean ingredients, natural flavor, and everyday
              nutrition for fitness routines, breakfast, smoothies, snacks, and post-workout meals. Product variants
              include Classic Crunch, Cocoa Strength, and Honey Fit.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-light">Product variants</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {productVariants.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-light">Helpful pages</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {supportLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
