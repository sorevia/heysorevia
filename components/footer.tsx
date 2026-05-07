import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

const footerLinks = {
  products: [
    { label: "Classic Crunch", href: "#produits" },
    { label: "Cocoa Strength", href: "#produits" },
    { label: "Honey Fit", href: "#produits" },
    { label: "Combo packs", href: "#bundles" },
  ],
  company: [
    { label: "Our story", href: "#mission" },
    { label: "Ingredients", href: "#science" },
    { label: "Gym partners", href: "#temoignages" },
    { label: "Community", href: "#community" },
  ],
  resources: [
    { label: "Recipes", href: "#community" },
    { label: "FAQ", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Wholesale", href: "#bundles" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                <span className="text-foreground font-serif text-sm font-medium">S</span>
              </div>
              <span className="font-serif text-xl font-medium text-background">Sorevia</span>
            </Link>
            <p className="text-background/70 leading-relaxed mb-6 max-w-sm">
              Premium high-protein peanut butter for clean energy, stronger rituals, and healthy snacking that feels
              worth repeating.
            </p>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>hello@sorevia.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>+1 234 567 8900</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>New York, USA</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">© 2026 Sorevia. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-background/50">
            <Link href="#" className="hover:text-background transition-colors">
              Legal notice
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Privacy policy
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Terms of sale
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
