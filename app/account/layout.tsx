import type React from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/account")

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
