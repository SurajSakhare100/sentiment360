import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is empty to allow both authenticated and guest users
// The dashboard page will handle authentication and guest access
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"]
} 