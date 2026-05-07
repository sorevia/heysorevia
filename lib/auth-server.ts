import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function getAuthenticatedUser(request: Request) {
  const supabase = getSupabaseServerClient()
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : ""

  if (!supabase || !token) {
    return null
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user?.email) {
    return null
  }

  return data.user
}

export function isAdminEmail(email: string | undefined) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)

  return Boolean(email && adminEmails.includes(email.toLowerCase()))
}

export async function requireAdminUser(request: Request) {
  const user = await getAuthenticatedUser(request)

  if (!user?.email || !isAdminEmail(user.email)) {
    return null
  }

  return user
}
