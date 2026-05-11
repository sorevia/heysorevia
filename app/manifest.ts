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
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
