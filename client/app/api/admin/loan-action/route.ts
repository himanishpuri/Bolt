import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      if (decoded.role !== "admin") {
        return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 })
      }
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const { loanId, action } = await request.json()

    if (!loanId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 })
    }

    // In production, update database
    console.log(`Admin loan action: ${action} for loan ${loanId}`)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `Loan ${action}d successfully`,
      loanId,
      action,
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Admin loan action error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
