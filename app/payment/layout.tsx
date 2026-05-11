import type React from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/payment")

export default function PaymentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
