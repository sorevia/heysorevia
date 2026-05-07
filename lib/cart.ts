import type { Product } from "@/lib/products"

export type CartItem = {
  product: Product
  quantity: number
}

export const CART_STORAGE_KEY = "sorevia_cart"

export function getCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function readCart() {
  if (typeof window === "undefined") return []

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : []
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event("sorevia-cart-updated"))
}

export function addProductToCart(product: Product) {
  if (product.stock <= 0) {
    return readCart()
  }

  const cart = readCart()
  const existingItem = cart.find((item) => item.product.id === product.id)

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + 1, product.stock)
  } else {
    cart.push({ product, quantity: 1 })
  }

  writeCart(cart)
  return cart
}
