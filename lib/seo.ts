import type { Metadata } from "next"
import { fallbackProducts, type Product } from "@/lib/products"

export const siteUrl = "https://heysorevia.com"

export const brand = {
  name: "Sorevia",
  alternateName: "Hey Sorevia",
  legalName: "Sorevia",
  email: "heysorevia@gmail.com",
  logo: "/logo.png",
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
    url: "/products/classic-crunch",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
  {
    url: "/products/cocoa-strength",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
  {
    url: "/products/honey-fit",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
  {
    url: "/about",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/contact",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/shipping",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/refund-policy",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/privacy-policy",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/terms",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  },
  {
    url: "/signup",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  },
  {
    url: "/login",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  },
  {
    url: "/forgot-password",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.3,
  },
  {
    url: "/account",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  },
  {
    url: "/orders",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
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

export const pageSeo: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Premium High-Protein Peanut Butter",
    description: brand.description,
  },
  "/signup": {
    title: "Create Account",
    description: "Create a Sorevia account to save checkout details, view peanut butter orders, and track deliveries.",
  },
  "/about": {
    title: "About Sorevia",
    description:
      "Learn about Sorevia, a fitness nutrition brand making premium high-protein peanut butter with clean ingredients and natural flavor.",
  },
  "/contact": {
    title: "Contact",
    description: "Contact Sorevia for peanut butter orders, shipping questions, refunds, wholesale, and support.",
  },
  "/shipping": {
    title: "Shipping Policy",
    description: "Read Sorevia shipping information for peanut butter orders, delivery timelines, and order tracking.",
  },
  "/refund-policy": {
    title: "Refund Policy",
    description: "Read the Sorevia refund policy for peanut butter purchases, damaged items, and order support.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "Read how Sorevia handles customer data, account details, orders, and privacy for online purchases.",
  },
  "/terms": {
    title: "Terms",
    description: "Read Sorevia terms for website use, ecommerce orders, payments, shipping, and customer accounts.",
  },
  "/login": {
    title: "Login",
    description: "Log in to your Sorevia account to manage orders, payment history, and delivery tracking.",
  },
  "/forgot-password": {
    title: "Reset Password",
    description: "Reset your Sorevia account password securely.",
  },
  "/account": {
    title: "Customer Account",
    description: "Manage your Sorevia profile, account details, and peanut butter shopping activity.",
  },
  "/orders": {
    title: "Order History",
    description: "Review your Sorevia peanut butter order history and payment details.",
  },
  "/payment": {
    title: "Cart and Checkout",
    description: "Complete your Sorevia peanut butter order with secure checkout and delivery details.",
  },
  "/track-order": {
    title: "Track Order",
    description: "Track your Sorevia peanut butter delivery and order status.",
  },
  "/admin": {
    title: "Admin Dashboard",
    description: "Sorevia admin dashboard for product, stock, order, and store management.",
  },
}

export function getProductMetadata(product: Product): Metadata {
  const path = `/products/${product.slug}`
  const title = `${product.name} Peanut Butter`
  const description = `${product.description} Shop Sorevia ${product.name}, a premium high-protein peanut butter for clean ingredients, natural flavor, fitness nutrition, and everyday snacking.`

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: brand.name,
      title: `${title} | ${brand.name}`,
      description,
      locale: "en_IN",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: `${brand.name} ${product.name} peanut butter`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${brand.name}`,
      description,
      images: [product.image],
    },
  }
}

export function getProductJsonLd(product: Product) {
  const productUrl = `${siteUrl}/products/${product.slug}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: `${brand.name} ${product.name}`,
        sku: product.slug,
        description: product.description,
        image: absoluteUrl(product.image),
        category: "High-protein peanut butter",
        brand: {
          "@type": "Brand",
          name: brand.name,
        },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          price: product.price,
          itemCondition: "https://schema.org/NewCondition",
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: {
            "@id": `${siteUrl}/#organization`,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${productUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${siteUrl}/#produits`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  }
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export function createPageMetadata(path: string): Metadata {
  const seo = pageSeo[path]

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: brand.name,
      title: `${seo.title} | ${brand.name}`,
      description: seo.description,
      locale: "en_IN",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Sorevia premium high-protein peanut butter",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} | ${brand.name}`,
      description: seo.description,
      images: ["/og-image.png"],
    },
  }
}

export function getHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: brand.name,
        alternateName: brand.alternateName,
        legalName: brand.legalName,
        url: siteUrl,
        logo: absoluteUrl(brand.logo),
        image: absoluteUrl(brand.logo),
        email: brand.email,
        description: brand.description,
        contactPoint: {
          "@type": "ContactPoint",
          email: brand.email,
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["en"],
        },
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
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: `${brand.name} | Premium High-Protein Peanut Butter`,
        description: brand.description,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
        ],
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
            "@id": `${siteUrl}/#product-${product.slug}`,
            name: product.name,
            sku: product.slug,
            description: product.description,
            image: absoluteUrl(product.image),
            category: "High-protein peanut butter",
            brand: {
              "@type": "Brand",
              name: brand.name,
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.price,
              itemCondition: "https://schema.org/NewCondition",
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `${siteUrl}/#produits`,
              seller: {
                "@id": `${siteUrl}/#organization`,
              },
            },
          },
        })),
      },
    ],
  }
}
