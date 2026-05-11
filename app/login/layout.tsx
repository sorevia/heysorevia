import type React from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/login")

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
