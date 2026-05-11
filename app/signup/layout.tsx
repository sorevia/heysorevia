import type React from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/signup")

export default function SignupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
