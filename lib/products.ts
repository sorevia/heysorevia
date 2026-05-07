export type Product = {
  id: string
  name: string
  slug: string
  description: string
  image: string
  tag: string
  price: number
  compareAtPrice?: number
  stock: number
  featured: boolean
}

export const fallbackProducts: Product[] = [
  {
    id: "classic-crunch",
    name: "Classic Crunch",
    slug: "classic-crunch",
    description: "Roasted peanut depth with a satisfying crunch, made for toast, oats, and post-workout spoons.",
    image: "/images/product-equilibrium.png",
    tag: "25g Protein",
    price: 499,
    compareAtPrice: 599,
    stock: 18,
    featured: true,
  },
  {
    id: "cocoa-strength",
    name: "Cocoa Strength",
    slug: "cocoa-strength",
    description: "A rich cocoa blend for clean energy, dessert-like cravings, and recovery meals that still feel premium.",
    image: "/images/product-serenity.png",
    tag: "No Palm Oil",
    price: 549,
    compareAtPrice: 649,
    stock: 11,
    featured: true,
  },
  {
    id: "honey-fit",
    name: "Honey Fit",
    slug: "honey-fit",
    description: "Naturally sweet, freshly crafted, and built for smoothies, pancakes, fruit bowls, and gym meal prep.",
    image: "/images/product-vitality.png",
    tag: "Limited Edition",
    price: 529,
    stock: 7,
    featured: true,
  },
]
