import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock user data - in production, fetch from database
const users = [
  {
    id: 1,
    email: "sarah.kim@email.com",
    firstName: "Sarah",
    lastName: "Kim",
    phone: "+91-9876543210",
    dateOfBirth: "1992-05-15",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    kyc_status: "verified",
    created_at: "2023-12-01T10:30:00Z",
    last_login: "2024-06-12T08:15:00Z",
  },
  {
    id: 2,
    email: "john.doe@email.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+91-9876543211",
    dateOfBirth: "1988-08-22",
    address: "456 Park Avenue",
    city: "Delhi",
    state: "Delhi",
    postalCode: "110001",
    kyc_status: "pending",
    created_at: "2024-01-15T14:45:00Z",
    last_login: "2024-06-11T16:30:00Z",
  },
  {
    id: 3,
    email: "demo@user.com",
    firstName: "Demo",
    lastName: "User",
    phone: "+91-9876543212",
    dateOfBirth: "1995-03-10",
    address: "789 Demo Street",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560001",
    kyc_status: "pending",
    created_at: "2024-05-20T09:00:00Z",
    last_login: "2024-06-12T10:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    let decodedToken

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as any
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    // Find user by ID
    const user = users.find((u) => u.id === decodedToken.userId)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password, ...userProfile } = user as any

    return NextResponse.json({
      success: true,
      user: userProfile,
    })
  } catch (error) {
    console.error("User profile error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    let decodedToken

    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as any
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const updateData = await request.json()

    // Find user by ID
    const userIndex = users.findIndex((u) => u.id === decodedToken.userId)

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Prevent updating sensitive fields
    const { email, id, kyc_status, created_at, ...allowedUpdates } = updateData

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...allowedUpdates,
    }

    // Remove sensitive information
    const { password, ...updatedUserProfile } = users[userIndex] as any

    return NextResponse.json({
      success: true,
      user: updatedUserProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
