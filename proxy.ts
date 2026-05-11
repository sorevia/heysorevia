import { NextRequest, NextResponse } from "next/server"

const primaryHost = "heysorevia.com"
const redirectHosts = new Set(["www.heysorevia.com", "heysoreviagmail.com", "www.heysoreviagmail.com"])

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase()

  if (host && redirectHosts.has(host)) {
    const url = request.nextUrl.clone()
    url.protocol = "https"
    url.hostname = primaryHost
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
