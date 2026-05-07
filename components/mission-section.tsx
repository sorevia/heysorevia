"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section ref={sectionRef} id="mission" className="py-24 lg:py-32 px-6">
      <div className="relative max-w-7xl mx-auto rounded-[48px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/healthy%20lifestyle%20background.png"
            alt="Sorevia healthy lifestyle background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-foreground/50" />

          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[2px]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[8px] opacity-60" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[20px] opacity-30" />
        </div>

        {/* Content with padding */}
        <div className="relative px-6 lg:px-8 py-16 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image - removed as we now have background */}
            <div className="reveal opacity-0 order-2 lg:order-1"></div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
                Our Story
              </p>
              <h2 className="reveal opacity-0 animation-delay-200 font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-background text-balance mb-8">
                Natural ingredients, stronger everyday rituals
              </h2>
              <div className="reveal opacity-0 animation-delay-400 space-y-6 text-background/90 leading-relaxed">
                <p>
                  Sorevia began with a simple belief: healthy snacking should feel motivating, premium, and easy to
                  repeat. We craft peanut butter for people who want clean energy without losing the joy of real food.
                </p>
                <p>
                  From natural ingredients to morning focus, from gym meals to family breakfasts, every jar is made to
                  support the lifestyle you are building one disciplined scoop at a time.
                </p>
              </div>
              <div className="reveal opacity-0 animation-delay-600 mt-10">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 group"
                >
                  Join the Sorevia community
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
