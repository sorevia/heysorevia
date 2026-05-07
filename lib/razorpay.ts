import crypto from "crypto"

type RazorpayOrderPayload = {
  amount: number
  currency: "INR"
  receipt: string
  notes?: Record<string, string>
}

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || ""
}

function getRazorpayAuthHeader() {
  const keyId = process.env.RAZORPAY_KEY_ID || ""
  const keySecret = process.env.RAZORPAY_KEY_SECRET || ""
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`
}

export async function createRazorpayOrder(payload: RazorpayOrderPayload) {
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: getRazorpayAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.error?.description || "Could not create Razorpay order."
    throw new Error(message)
  }

  return data as {
    id: string
    amount: number
    currency: string
    receipt: string
    status: string
  }
}

export function verifyRazorpayPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}) {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex")

  try {
    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpaySignature))
  } catch {
    return false
  }
}

export function verifyRazorpayWebhookSignature(payload: string, signature: string) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ""
  if (!webhookSecret) return false

  const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(payload).digest("hex")

  try {
    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  } catch {
    return false
  }
}
