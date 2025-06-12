import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Paths that require authentication
const PROTECTED_PATHS = ["/api/kyc", "/api/credit-score", "/api/payments", "/api/blockchain"]

// Paths that require admin authentication
const ADMIN_PATHS = ["/api/admin"]

// Function to verify JWT token
async function verifyToken(token: string) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
    const encoder = new TextEncoder()
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET))
    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))
  const isAdminPath = ADMIN_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))

  if (!isProtectedPath && !isAdminPath) {
    return NextResponse.next()
  }

  // Get token from Authorization header
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const token = authHeader.substring(7)
  const payload = await verifyToken(token)

  if (!payload) {
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
  }

  // Check if admin path requires admin role
  if (isAdminPath && payload.role !== "admin") {
    return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/kyc/:path*",
    "/api/credit-score/:path*",
    "/api/payments/:path*",
    "/api/blockchain/:path*",
    "/api/admin/:path*",
  ],
}
