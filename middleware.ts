import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Public routes - no authentication required
  const publicRoutes = ["/login", "/register", "/reset-password"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  if (!session && !isPublicRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If user is authenticated and trying to access public auth routes
  if (session && isPublicRoute) {
    // Redirect based on user role
    if (session.user?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (session.user?.role !== "admin") {
      // Redirect regular users to their dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // User routes protection
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // If admin tries to access user routes, redirect to admin dashboard
    if (session.user?.role === "admin" && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
  }

  // Root route handling - redirect based on auth status and role
  if (pathname === "/") {
    if (!session) {
      // Allow access to landing page for unauthenticated users
      return NextResponse.next()
    }

    // Redirect authenticated users based on role
    if (session.user?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}