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
import { getHomeJsonLd } from "@/lib/seo"

export default function Home() {
  const jsonLd = getHomeJsonLd()

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
