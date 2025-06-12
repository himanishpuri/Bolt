import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock database - in production, use a real database
const users = [
  {
    id: 1,
    email: "sarah.kim@email.com",
    password: "$2a$10$rOzJqKqKqKqKqKqKqKqKqOzJqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK", // password123
    firstName: "Sarah",
    lastName: "Kim",
    role: "user",
    kyc_status: "verified",
  },
  {
    id: 2,
    email: "john.doe@email.com",
    password: "$2a$10$rOzJqKqKqKqKqKqKqKqKqOzJqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK", // password123
    firstName: "John",
    lastName: "Doe",
    role: "user",
    kyc_status: "pending",
  },
  {
    id: 3,
    email: "demo@user.com",
    password: "$2a$10$rOzJqKqKqKqKqKqKqKqKqOzJqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK", // demo123
    firstName: "Demo",
    lastName: "User",
    role: "user",
    kyc_status: "pending",
  },
]

const admins = [
  {
    id: 1,
    email: "admin@fininclude.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // admin123
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
]

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ success: false, error: "Email, password, and role are required" }, { status: 400 })
    }

    // Find user in appropriate collection
    const userCollection = role === "admin" ? admins : users
    const user = userCollection.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // For demo purposes, we'll use a simple password check
    // In production, use bcrypt.compare(password, user.password)
    const isValidPassword =
      (role === "admin" && password === "admin123") ||
      (email === "demo@user.com" && password === "demo123") ||
      (["sarah.kim@email.com", "john.doe@email.com"].includes(email) && password === "password123")

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token with expiration
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        // Don't include KYC status in token as it's not used for routing decisions
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      },
      JWT_SECRET,
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      // No redirect URL in response - client will always redirect to dashboard
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
