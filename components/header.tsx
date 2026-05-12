"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { LogOut, Menu, ShoppingBag, UserRound, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const updateAdminState = (nextUser: User | null) => {
      setUser(nextUser)
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
      setIsAdmin(Boolean(nextUser?.email && adminEmails.includes(nextUser.email.toLowerCase())))
    }

    supabase.auth.getUser().then(({ data }) => updateAdminState(data.user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAdminState(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase?.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    setIsOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <nav className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between h-20 px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-foreground text-2xl font-normal">Sorevia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="#produits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </Link>
            <Link href="#bundles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Bundles
            </Link>
            <Link href="/#science" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ingredients
            </Link>
            <Link href="#temoignages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </Link>
            <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Orders
            </Link>
            <Link href="/track-order" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Track
            </Link>
            {isAdmin ? (
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            ) : null}
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button asChild variant="outline" className="rounded-full bg-background/60 px-5">
                  <Link href="/account">
                    <UserRound className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </Button>
                <Button variant="ghost" className="rounded-full px-3" onClick={handleLogout} aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" className="rounded-full bg-background/60 px-5">
                <Link href="/login">Login</Link>
              </Button>
            )}
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              <Link href="/payment">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Cart
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 px-6 lg:px-8 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <Link
                href="#produits"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="#bundles"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Bundles
              </Link>
              <Link
                href="/#science"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Ingredients
              </Link>
              <Link
                href="#temoignages"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href="/orders"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/track-order"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Track
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href="/about"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    className="text-left text-lg text-muted-foreground hover:text-foreground transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full mt-4">
                <Link href="/payment" onClick={() => setIsOpen(false)}>
                  Cart
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
