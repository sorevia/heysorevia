"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { Award, Clock, Dumbbell, Flame, HeartPulse, Leaf, Lock, Mail, Play, Sparkles, Star, Wheat } from "lucide-react"
import { Button } from "@/components/ui/button"

const trustBadges = [
  { icon: Dumbbell, label: "High Protein" },
  { icon: Leaf, label: "No Artificial Preservatives" },
  { icon: Wheat, label: "Made With Real Peanuts" },
  { icon: Award, label: "Lab Tested" },
  { icon: Sparkles, label: "Freshly Crafted" },
  { icon: Lock, label: "Secure Checkout" },
]

export function ConversionSections() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [newsletterMessage, setNewsletterMessage] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("animate-fade-up")),
      { threshold: 0.12 },
    )
    sectionRef.current?.querySelectorAll(".reveal").forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const handleNewsletterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNewsletterStatus("loading")
    setNewsletterMessage("")

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      setNewsletterStatus("error")
      setNewsletterMessage(data.error || "Could not join right now. Please try again.")
      return
    }

    setNewsletterStatus("success")
    setNewsletterMessage(data.message || "Welcome to the Sorevia community.")
    setEmail("")
  }

  return (
    <div ref={sectionRef}>
      <section className="relative overflow-hidden bg-background py-20 lg:py-28">
        <div className="absolute inset-0 floating-particles" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["10,000+ jars sold", "Loved by fitness enthusiasts"],
              ["42 gym partners", "Trusted by athletes and trainers"],
              ["4.9/5 average rating", "Clean nutrition that earns repeats"],
            ].map(([value, label], index) => (
              <div key={value} className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : ""} border-y border-border/70 py-8 text-center md:border-x md:px-6`}>
                <div className="font-serif text-4xl text-foreground md:text-5xl">{value}</div>
                <p className="mt-3 text-sm uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="reveal opacity-0 mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Trust built into every jar</p>
              <h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">Clean Energy Without Compromise</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Premium nutrition that fits your lifestyle: real peanuts, smart protein, satisfying texture, and a checkout experience that feels as polished as the product.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="group rounded-2xl border border-border/70 bg-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <badge.icon className="mb-5 h-6 w-6 text-primary" />
                  <p className="text-sm font-semibold leading-snug">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="bundles" className="bg-muted/35 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="reveal opacity-0 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Smart upsells</p>
              <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">Built For Strength & Recovery</h2>
            </div>
            <div className="rounded-2xl bg-foreground px-5 py-4 text-background">
              <div className="flex items-center gap-3 text-sm font-medium"><Clock className="h-4 w-4 text-accent" /> Flash sale ends in 04:18:26</div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {[
              ["Starter Combo", "Classic + Crunchy + Cocoa", "Save 18%", "Best Seller"],
              ["Monthly Ritual", "2 jars delivered every month", "Subscribe & save", "Low stock"],
              ["Family Pack", "6 jars for busy kitchens", "Free shipping", "Value"],
              ["Gym Pack", "12 jars for trainers and cafes", "Partner pricing", "Athlete pick"],
            ].map(([name, detail, offer, tag], index) => (
              <div key={name} className={`reveal opacity-0 ${index > 0 ? "animation-delay-200" : ""} group rounded-2xl border border-border/70 bg-card p-5 transition duration-500 hover:-translate-y-2 hover:shadow-xl`}>
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{tag}</span>
                  <Flame className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-serif text-2xl">{name}</h3>
                <p className="mt-3 min-h-12 text-sm leading-relaxed text-muted-foreground">{detail}</p>
                <p className="mt-6 text-lg font-semibold">{offer}</p>
                <Button className="mt-5 w-full rounded-full bg-primary hover:bg-primary/90">Add to cart</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-to-use" className="overflow-hidden bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="reveal opacity-0 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-secondary">Video campaign</p>
              <h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">Watch Sorevia in motion</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                A dedicated premium ad space for product films, transformation clips, customer reels, discount drops, and seasonal launches.
              </p>
              <div className="mt-7 inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">
                <Play className="h-4 w-4 fill-current text-accent" />
                Autoplay ad slot
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-border bg-foreground shadow-2xl shadow-foreground/15">
              <video
                className="aspect-video h-full w-full object-cover"
                src="/videos/advertisement1.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
              />
              <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground backdrop-blur">
                Featured ad
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="bg-primary py-20 text-primary-foreground lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="reveal opacity-0">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/70">Sorevia community</p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">Premium Nutrition That Fits Your Lifestyle</h2>
          </div>
          <div className="reveal opacity-0 animation-delay-200 rounded-[28px] border border-primary-foreground/15 bg-primary-foreground/8 p-6 md:p-8">
            <p className="text-lg leading-relaxed text-primary-foreground/80">
              Join for high-protein recipes, fitness tips, discount drops, transformation stories, and first access to new seasonal flavors.
            </p>
            <form className="mt-7 flex flex-col gap-3 sm:flex-row" onSubmit={handleNewsletterSubmit}>
              <label className="flex min-h-12 flex-1 items-center rounded-full bg-background px-5 text-foreground">
                <span className="sr-only">Email address</span>
                <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  required
                />
              </label>
              <Button
                className="min-h-12 rounded-full bg-accent px-8 text-accent-foreground hover:bg-accent/90"
                disabled={newsletterStatus === "loading"}
              >
                {newsletterStatus === "loading" ? "Joining..." : "Join the club"}
              </Button>
            </form>
            {newsletterMessage ? (
              <p className={`mt-3 text-sm ${newsletterStatus === "error" ? "text-red-200" : "text-primary-foreground/75"}`}>
                {newsletterMessage}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-primary-foreground/70">
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-current text-accent" /> Recipes</span>
              <span className="inline-flex items-center gap-2"><HeartPulse className="h-4 w-4 text-accent" /> Fitness tips</span>
              <span className="inline-flex items-center gap-2"><Flame className="h-4 w-4 text-accent" /> Launch discounts</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
