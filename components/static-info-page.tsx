import Link from "next/link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

type StaticInfoPageProps = {
  eyebrow: string
  title: string
  description: string
  sections: Array<{
    title: string
    body: string
  }>
}

export function StaticInfoPage({ eyebrow, title, description, sections }: StaticInfoPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-36 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">{title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-3xl font-light">{section.title}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/contact" className="text-primary hover:underline">
            Contact
          </Link>
          <Link href="/shipping" className="text-primary hover:underline">
            Shipping
          </Link>
          <Link href="/refund-policy" className="text-primary hover:underline">
            Refund Policy
          </Link>
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-primary hover:underline">
            Terms
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
