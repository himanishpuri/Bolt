import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock loan data - in production, fetch from database
const mockLoans = [
  {
    id: "LOAN_1234567890",
    userId: 1,
    amount: 50000,
    purpose: "business",
    tenure: 12,
    interestRate: 14.5,
    emi: 4500,
    status: "approved",
    appliedAt: "2024-06-01T10:30:00Z",
    approvedAt: "2024-06-03T14:15:00Z",
    disbursedAmount: 50000,
    nextPaymentDate: "2024-07-03T00:00:00Z",
    remainingAmount: 50000,
    remainingInstallments: 12,
  },
  {
    id: "LOAN_2345678901",
    userId: 2,
    amount: 25000,
    purpose: "education",
    tenure: 6,
    interestRate: 12,
    emi: 4300,
    status: "pending",
    appliedAt: "2024-06-10T15:45:00Z",
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

    // Get loan ID from query params
    const { searchParams } = new URL(request.url)
    const loanId = searchParams.get("id")

    let loans

    if (loanId) {
      // Find specific loan
      const loan = mockLoans.find((l) => l.id === loanId && l.userId === decodedToken.userId)
      if (!loan) {
        return NextResponse.json({ success: false, error: "Loan not found" }, { status: 404 })
      }
      loans = [loan]
    } else {
      // Get all loans for user
      loans = mockLoans.filter((loan) => loan.userId === decodedToken.userId)
    }

    return NextResponse.json({
      success: true,
      loans,
    })
  } catch (error) {
    console.error("Loan status error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
