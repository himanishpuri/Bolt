import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock notifications - in production, fetch from database
const notifications = [
  {
    id: 1,
    userId: 1,
    title: "KYC Verified",
    message: "Your KYC verification has been completed successfully.",
    type: "kyc",
    isRead: false,
    createdAt: "2024-06-10T14:30:00Z",
  },
  {
    id: 2,
    userId: 1,
    title: "Credit Score Updated",
    message: "Your credit score has increased by 15 points.",
    type: "credit",
    isRead: true,
    createdAt: "2024-06-08T09:15:00Z",
  },
  {
    id: 3,
    userId: 2,
    title: "Complete Your KYC",
    message: "Please complete your KYC verification to access all features.",
    type: "kyc",
    isRead: false,
    createdAt: "2024-06-11T10:45:00Z",
  },
  {
    id: 4,
    userId: 3,
    title: "Welcome to FinInclude",
    message: "Thank you for joining FinInclude. Start your financial journey today!",
    type: "general",
    isRead: false,
    createdAt: "2024-06-12T08:00:00Z",
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

    // Get notifications for user
    const userNotifications = notifications.filter((n) => n.userId === decodedToken.userId)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"

    // Filter by unread if requested
    const filteredNotifications = unreadOnly ? userNotifications.filter((n) => !n.isRead) : userNotifications

    return NextResponse.json({
      success: true,
      notifications: filteredNotifications,
      unreadCount: userNotifications.filter((n) => !n.isRead).length,
    })
  } catch (error) {
    console.error("Notifications error:", error)
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

    const { notificationId, isRead } = await request.json()

    if (!notificationId) {
      return NextResponse.json({ success: false, error: "Notification ID is required" }, { status: 400 })
    }

    // Find notification
    const notificationIndex = notifications.findIndex(
      (n) => n.id === notificationId && n.userId === decodedToken.userId,
    )

    if (notificationIndex === -1) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 })
    }

    // Update notification
    notifications[notificationIndex] = {
      ...notifications[notificationIndex],
      isRead: isRead !== undefined ? isRead : true,
    }

    return NextResponse.json({
      success: true,
      notification: notifications[notificationIndex],
      message: "Notification updated successfully",
    })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
