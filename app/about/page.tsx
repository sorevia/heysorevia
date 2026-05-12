import { StaticInfoPage } from "@/components/static-info-page"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/about")

export default function AboutPage() {
  return (
    <StaticInfoPage
      eyebrow="About Sorevia"
      title="Fitness nutrition with clean ingredients and natural flavor"
      description="Sorevia is a premium high-protein peanut butter brand built for breakfast, training, healthy snacking, and everyday performance."
      sections={[
        {
          title: "Our purpose",
          body: "Sorevia makes peanut butter for people who want nutrition to feel simple, enjoyable, and consistent. Our products focus on protein, clean ingredients, natural flavor, and practical fitness nutrition for busy routines.",
        },
        {
          title: "Our products",
          body: "The Sorevia range includes Classic Crunch, Cocoa Strength, and Honey Fit product variants, each made for toast, oats, smoothies, pancakes, post-workout meals, and premium everyday snacking.",
        },
        {
          title: "Our standard",
          body: "We focus on quality ingredients, satisfying texture, clear product information, and a polished ecommerce experience so customers can understand, order, track, and enjoy Sorevia peanut butter with confidence.",
        },
      ]}
    />
  )
}
