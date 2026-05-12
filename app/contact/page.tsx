import { StaticInfoPage } from "@/components/static-info-page"
import { brand, createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/contact")

export default function ContactPage() {
  return (
    <StaticInfoPage
      eyebrow="Contact"
      title="Contact Sorevia"
      description="Reach Sorevia for peanut butter orders, product questions, shipping support, refunds, partnerships, and wholesale enquiries."
      sections={[
        {
          title: "Email support",
          body: `For order help, product questions, shipping, refund policy support, privacy requests, or terms questions, email ${brand.email}.`,
        },
        {
          title: "Order help",
          body: "Customers can use the order history and track order pages to review payment information, order status, and delivery progress for Sorevia peanut butter purchases.",
        },
        {
          title: "Business enquiries",
          body: "For gym partners, community collaborations, wholesale, retail, or fitness nutrition partnerships, contact Sorevia with your location, expected order volume, and preferred product variants.",
        },
      ]}
    />
  )
}
