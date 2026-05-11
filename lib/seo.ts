import { fallbackProducts } from "@/lib/products"

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://heysoreviagmail.com").replace(/\/$/, "")

export const brand = {
  name: "Sorevia",
  legalName: "Sorevia",
  email: "heysorevia@gmail.com",
  description:
    "Sorevia makes premium high-protein peanut butter with clean ingredients, natural flavor, and everyday nutrition for fitness, breakfast, snacking, and healthy routines.",
  keywords: [
    "Sorevia",
    "Sorevia peanut butter",
    "high protein peanut butter",
    "premium peanut butter",
    "natural peanut butter",
    "clean nutrition",
    "fitness snacks",
    "healthy peanut butter",
    "peanut butter India",
  ],
}

export const publicRoutes = [
  {
    url: "/",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    url: "/signup",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: "/login",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/forgot-password",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  },
  {
    url: "/account",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  },
  {
    url: "/orders",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  },
  {
    url: "/payment",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  },
  {
    url: "/track-order",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/admin",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.2,
  },
]

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export function getHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: brand.name,
        legalName: brand.legalName,
        url: siteUrl,
        logo: absoluteUrl("/apple-touch-icon.png"),
        email: brand.email,
        description: brand.description,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: brand.name,
        description: brand.description,
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#featured-products`,
        name: "Sorevia premium peanut butter products",
        itemListElement: fallbackProducts.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: absoluteUrl(product.image),
            brand: {
              "@type": "Brand",
              name: brand.name,
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.price,
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `${siteUrl}/#produits`,
            },
          },
        })),
      },
    ],
  }
}
