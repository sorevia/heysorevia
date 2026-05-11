import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { brand, siteUrl } from "@/lib/seo"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sorevia | Premium High-Protein Peanut Butter",
    template: "%s | Sorevia",
  },
  description: brand.description,
  applicationName: brand.name,
  keywords: brand.keywords,
  authors: [{ name: brand.name }],
  creator: brand.name,
  publisher: brand.name,
  category: "Food and beverage",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "/",
    siteName: brand.name,
    title: "Sorevia | Premium High-Protein Peanut Butter",
    description: brand.description,
    locale: "en_IN",
    images: [
      {
        url: "/images/3flavors.png",
        width: 1200,
        height: 630,
        alt: "Three Sorevia premium peanut butter flavors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sorevia | Premium High-Protein Peanut Butter",
    description: brand.description,
    images: ["/images/3flavors.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    title: brand.name,
    capable: true,
    statusBarStyle: "default",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
