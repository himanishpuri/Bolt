import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
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

    const { amount, purpose, tenure, monthlyIncome, employmentType, bankAccount, panCard } = await request.json()

    // Validate required fields
    if (!amount || !purpose || !tenure || !monthlyIncome || !employmentType || !bankAccount || !panCard) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    // Validate loan amount
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid loan amount",
        },
        { status: 400 },
      )
    }

    // Fetch user's credit score
    const creditScoreResponse = await fetch(`${request.nextUrl.origin}/api/credit-score`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const creditScoreData = await creditScoreResponse.json()
    const creditScore = creditScoreData.success ? creditScoreData.data.score : 650 // Default score if fetch fails

    // Calculate maximum eligible loan amount based on credit score
    const maxEligibleAmount = creditScore * 100

    if (Number(amount) > maxEligibleAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum eligible amount is ₹${maxEligibleAmount.toLocaleString()}`,
        },
        { status: 400 },
      )
    }

    // Calculate interest rate based on credit score
    let interestRate = 18 // Default high rate
    if (creditScore >= 750) {
      interestRate = 12
    } else if (creditScore >= 700) {
      interestRate = 14
    } else if (creditScore >= 650) {
      interestRate = 16
    }

    // Calculate EMI
    const monthlyInterestRate = interestRate / 100 / 12
    const emi = Math.round(
      (Number(amount) * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, Number(tenure))) /
        (Math.pow(1 + monthlyInterestRate, Number(tenure)) - 1),
    )

    // Calculate processing fee
    const processingFeePercentage = 2.5
    const processingFee = Math.round((Number(amount) * processingFeePercentage) / 100)

    // Create loan application record
    const loanApplication = {
      id: `LOAN_${Date.now()}`,
      userId: decodedToken.userId,
      amount: Number(amount),
      purpose,
      tenure: Number(tenure),
      monthlyIncome: Number(monthlyIncome),
      employmentType,
      bankAccount,
      panCard,
      interestRate,
      emi,
      processingFee,
      processingFeePercentage,
      status: "pending",
      creditScoreAtApplication: creditScore,
      appliedAt: new Date().toISOString(),
    }

    // In a real application, save to database here

    return NextResponse.json({
      success: true,
      loanApplication,
      message: "Loan application submitted successfully",
    })
  } catch (error) {
    console.error("Loan application error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
