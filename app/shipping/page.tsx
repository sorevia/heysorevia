import { StaticInfoPage } from "@/components/static-info-page"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/shipping")

export default function ShippingPage() {
  return (
    <StaticInfoPage
      eyebrow="Shipping"
      title="Shipping Policy"
      description="Sorevia ships premium high-protein peanut butter orders with clear order tracking and customer support."
      sections={[
        {
          title: "Delivery",
          body: "Shipping timelines depend on destination, courier availability, order volume, and stock. After checkout, customers can track eligible orders from the Sorevia track order page.",
        },
        {
          title: "Order processing",
          body: "Orders are processed after order confirmation and stock validation. Sorevia may contact customers if delivery details are incomplete or a product variant is unavailable.",
        },
        {
          title: "Support",
          body: "For shipping questions, damaged packages, missing items, or address corrections, contact Sorevia support with the order details and registered email address.",
        },
      ]}
    />
  )
}
