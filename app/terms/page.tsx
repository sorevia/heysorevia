import { StaticInfoPage } from "@/components/static-info-page"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/terms")

export default function TermsPage() {
  return (
    <StaticInfoPage
      eyebrow="Terms"
      title="Terms of Sale and Website Use"
      description="These terms explain basic conditions for using the Sorevia website and placing peanut butter ecommerce orders."
      sections={[
        {
          title: "Website use",
          body: "By using the Sorevia website, customers agree to use the store responsibly, provide accurate account and checkout details, and avoid misuse of product, order, or admin systems.",
        },
        {
          title: "Orders and payments",
          body: "Product prices, stock, offers, payment options, and order availability may change. Orders are subject to confirmation, stock validation, payment status, and delivery availability.",
        },
        {
          title: "Policies",
          body: "Shipping, refund policy, privacy policy, contact information, and product descriptions form part of the Sorevia ecommerce experience and should be reviewed before purchase.",
        },
      ]}
    />
  )
}
