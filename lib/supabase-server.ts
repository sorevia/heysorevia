import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cachedClient: SupabaseClient | null = null

function getServerKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
}

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && getServerKey())
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null
  }

  if (!cachedClient) {
    cachedClient = createClient(process.env.SUPABASE_URL!, getServerKey()!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return cachedClient
}
