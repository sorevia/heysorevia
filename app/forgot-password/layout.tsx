import type React from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/forgot-password")

export default function ForgotPasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
