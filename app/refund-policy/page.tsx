import { StaticInfoPage } from "@/components/static-info-page"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/refund-policy")

export default function RefundPolicyPage() {
  return (
    <StaticInfoPage
      eyebrow="Refund Policy"
      title="Refund Policy"
      description="Sorevia handles refund and replacement requests for eligible peanut butter orders through customer support."
      sections={[
        {
          title: "Eligibility",
          body: "Refunds or replacements may be reviewed for damaged products, incorrect items, missing items, or order issues reported with clear details and supporting information.",
        },
        {
          title: "Food product safety",
          body: "Because Sorevia sells food products, opened or used peanut butter jars may not be eligible for return unless there is a verified quality, damage, or fulfilment issue.",
        },
        {
          title: "How to request help",
          body: "Contact Sorevia with your order number, registered email, product variant, photos when relevant, and a short explanation of the issue so the team can review the request.",
        },
      ]}
    />
  )
}
