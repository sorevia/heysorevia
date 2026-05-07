export type OrderHistoryItem = {
  id: string
  customerName: string
  customerEmail: string
  phone: string
  address: string
  paymentMethod: string
  paymentStatus: string
  status: string
  totalAmount: number
  createdAt: string
  items: {
    id: string
    productId: string
    quantity: number
    unitPrice: number
    product?: {
      name: string
      image: string
      tag: string
    }
  }[]
}

export function formatOrderStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const trackingSteps = ["pending", "confirmed", "packed", "shipped", "delivered"]

export function getTrackingStepIndex(status: string) {
  const index = trackingSteps.indexOf(status)
  return index >= 0 ? index : 0
}
