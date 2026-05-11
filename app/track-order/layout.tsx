import type React from "react"
import { createPageMetadata } from "@/lib/seo"

export const metadata = createPageMetadata("/track-order")

export default function TrackOrderLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
