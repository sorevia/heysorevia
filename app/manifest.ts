import type { MetadataRoute } from "next"
import { brand } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.name} - Premium High-Protein Peanut Butter`,
    short_name: brand.name,
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#87562b",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
