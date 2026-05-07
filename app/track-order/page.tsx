import { Suspense } from "react"
import { TrackOrderClient } from "@/components/track-order-client"

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-8" />}>
      <TrackOrderClient />
    </Suspense>
  )
}
