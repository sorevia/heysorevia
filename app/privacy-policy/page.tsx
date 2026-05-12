import { StaticInfoPage } from "@/components/static-info-page"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/privacy-policy")

export default function PrivacyPolicyPage() {
  return (
    <StaticInfoPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      description="Sorevia respects customer privacy across account creation, checkout, order history, payments, and delivery support."
      sections={[
        {
          title: "Information we use",
          body: "Sorevia may collect account details, contact information, delivery information, order details, payment status, and customer support messages needed to operate the ecommerce store.",
        },
        {
          title: "How information helps",
          body: "Customer information helps Sorevia process peanut butter orders, manage stock-aware checkout, support delivery tracking, send order updates, prevent misuse, and improve the shopping experience.",
        },
        {
          title: "Customer requests",
          body: "Customers can contact Sorevia for reasonable privacy questions, account support, correction requests, or information related to their Sorevia account and orders.",
        },
      ]}
    />
  )
}
