import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PromoSlideshow } from "@/components/promo-slideshow"
import { ProductSection } from "@/components/product-section"
import { ScienceSection } from "@/components/science-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { MissionSection } from "@/components/mission-section"
import { ConversionSections } from "@/components/conversion-sections"
import { StickyCta } from "@/components/sticky-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PromoSlideshow />
      <ProductSection />
      <ConversionSections />
      <ScienceSection />
      <TestimonialsSection />
      <MissionSection />
      <StickyCta />
      <Footer />
    </main>
  )
}
