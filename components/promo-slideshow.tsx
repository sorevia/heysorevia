"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, Play, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    eyebrow: "Starter Combo Sale",
    title: "Your Daily Protein Ritual",
    body: "25g protein per serving, real peanuts, zero palm oil. Built for strength, recovery, and cravings that deserve better.",
    image: "/images/3flavors.png",
    cta: "Shop Combo",
    badge: "Buy 2 Get 1 Free",
  },
  {
    eyebrow: "Clean Energy",
    title: "Fuel Your Workout Naturally",
    body: "A premium peanut butter made for gym bags, office drawers, breakfast bowls, and post-lift discipline.",
    image: "/images/3flavors.png",
    cta: "Build Your Pack",
    badge: "No Palm Oil",
  },
  {
    eyebrow: "Performance Pantry",
    title: "Healthy Snacking Reimagined",
    body: "From oats to smoothies to pancakes, Sorevia turns simple meals into high-protein rituals you actually look forward to.",
    image: "/images/3flavors.png",
    cta: "Explore Flavors",
    badge: "Limited Drop",
  },
]

export function PromoSlideshow() {
  const [active, setActive] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const current = slides[active]

  const next = useMemo(() => () => setActive((index) => (index + 1) % slides.length), [])
  const previous = () => setActive((index) => (index - 1 + slides.length) % slides.length)

  useEffect(() => {
    const timer = window.setInterval(next, 5500)
    return () => window.clearInterval(timer)
  }, [next])

  const handleTouchEnd = (x: number) => {
    if (touchStart === null) return
    const distance = touchStart - x
    if (Math.abs(distance) > 42) {
      distance > 0 ? next() : previous()
    }
    setTouchStart(null)
  }

  return (
    <section
      id="offers"
      className="relative overflow-hidden bg-foreground text-background"
      onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
      onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
    >
      <div className="pointer-events-none absolute inset-0 drip-field opacity-70" />
      <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em]">
            <Play className="h-3.5 w-3.5 fill-current" />
            {current.eyebrow}
          </div>
          <h2 key={current.title} className="animate-soft-fade font-serif text-4xl font-light leading-tight text-balance md:text-6xl">
            {current.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/78">{current.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full bg-accent px-7 text-accent-foreground hover:bg-accent/90">
              <ShoppingBag className="mr-2 h-4 w-4" />
              {current.cta}
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-background/25 bg-transparent px-7 text-background hover:bg-background/10">
              Watch reel
            </Button>
          </div>
        </div>

        <div className="relative min-h-[420px]">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-all duration-700 ${
                index === active ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
              }`}
            >
              <div className="relative h-full overflow-hidden rounded-[28px] border border-background/15 bg-background/8 shadow-2xl">
                <img src={slide.image} alt={slide.title} className="h-full w-full object-cover transition-transform duration-[2200ms] ease-out hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/15 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground">
                  {slide.badge}
                </span>
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4">
                  <p className="max-w-[240px] text-sm text-background/85">Upload future videos, reels, gym clips, and discount banners here.</p>
                  <div className="hidden rounded-full border border-background/20 bg-background/10 px-4 py-2 text-sm backdrop-blur md:block">
                    Image + video ready
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between lg:left-8 lg:right-8">
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                aria-label={`Go to ${slide.title}`}
                onClick={() => setActive(index)}
                className={`h-1.5 rounded-full transition-all ${index === active ? "w-10 bg-accent" : "w-4 bg-background/30"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button aria-label="Previous slide" onClick={previous} className="grid h-11 w-11 place-items-center rounded-full border border-background/20 bg-background/10 backdrop-blur transition hover:bg-background/20">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button aria-label="Next slide" onClick={next} className="grid h-11 w-11 place-items-center rounded-full border border-background/20 bg-background/10 backdrop-blur transition hover:bg-background/20">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
