import type React from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/admin")

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
