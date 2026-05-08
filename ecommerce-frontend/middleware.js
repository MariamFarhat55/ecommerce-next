import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role
    const path = req.nextUrl.pathname

    // Only admin can access /admin routes
    if (path.startsWith("/admin") && role !== "admin")
      return NextResponse.redirect(new URL("/", req.url))

    // Only seller can access /seller routes
    if (path.startsWith("/seller") && role !== "seller")
      return NextResponse.redirect(new URL("/", req.url))
  },
  {
    // User must be logged in to access protected routes
    callbacks: { authorized: ({ token }) => !!token },
  }
)

export const config = {
  // These routes are protected - must be logged in
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/admin/:path*",
    "/seller/:path*",
  ],
}