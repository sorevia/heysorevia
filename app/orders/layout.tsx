import type React from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/orders")

export default function OrdersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
