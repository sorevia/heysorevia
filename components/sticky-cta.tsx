"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StickyCta() {
  return (
    <div className="fixed bottom-5 left-4 right-4 z-40 md:left-auto md:right-6 md:w-auto">
      <Button asChild className="h-14 w-full rounded-full bg-foreground px-7 text-background shadow-2xl shadow-foreground/25 hover:bg-foreground/90 md:w-auto">
        <Link href="/payment">
          <ShoppingBag className="mr-2 h-4 w-4" />
          View Cart
        </Link>
      </Button>
    </div>
  )
}
