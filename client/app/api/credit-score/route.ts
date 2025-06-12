import { type NextRequest, NextResponse } from "next/server"

// Enhanced AI-driven credit scoring algorithm
async function calculateAlternativeCreditScore(userData: any) {
  const factors = {
    digitalFootprint: userData.digitalActivity || 0.6,
    socialVerification: userData.socialConnections || 0.8,
    financialBehavior: userData.transactionHistory || 0.7,
    educationProgress: userData.educationCompletion || 0.65,
    communityEngagement: userData.communityParticipation || 0.5,
    kycVerification: userData.kycStatus === "verified" ? 1.0 : 0.3,
    paymentHistory: userData.paymentHistory || 0.7,
    incomeStability: userData.incomeStability || 0.6,
  }

  // Weighted calculation with bias-free AI assessment
  const score = Math.round(
    (factors.digitalFootprint * 0.15 +
      factors.socialVerification * 0.12 +
      factors.financialBehavior * 0.25 +
      factors.educationProgress * 0.15 +
      factors.communityEngagement * 0.08 +
      factors.kycVerification * 0.15 +
      factors.paymentHistory * 0.2 +
      factors.incomeStability * 0.1) *
      850,
  )

  return {
    score: Math.max(300, Math.min(850, score)),
    factors,
    recommendations: await generateAIRecommendations(factors),
    riskLevel: score > 700 ? "Low" : score > 600 ? "Medium" : "High",
    creditLimit: Math.round(score * 100),
  }
}

async function generateAIRecommendations(factors: any) {
  const recommendations = []

  if (factors.digitalFootprint < 0.7) {
    recommendations.push({
      category: "Digital Activity",
      suggestion: "Increase your digital payment usage and maintain consistent online financial activity",
      impact: "Medium",
      priority: "High",
    })
  }

  if (factors.educationProgress < 0.8) {
    recommendations.push({
      category: "Financial Education",
      suggestion: "Complete remaining financial literacy modules to demonstrate knowledge",
      impact: "High",
      priority: "High",
    })
  }

  if (factors.communityEngagement < 0.6) {
    recommendations.push({
      category: "Community Participation",
      suggestion: "Engage more with community discussions and attend financial workshops",
      impact: "Low",
      priority: "Medium",
    })
  }

  if (factors.paymentHistory < 0.8) {
    recommendations.push({
      category: "Payment History",
      suggestion: "Maintain consistent payment schedules and avoid late payments",
      impact: "High",
      priority: "Critical",
    })
  }

  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const creditAnalysis = await calculateAlternativeCreditScore(userData)

    return NextResponse.json({
      success: true,
      data: creditAnalysis,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to calculate credit score" }, { status: 500 })
  }
}

export async function GET() {
  // Return enhanced mock user credit data
  const mockData = {
    score: 720,
    change: 15,
    factors: {
      digitalFootprint: 0.68,
      socialVerification: 0.9,
      financialBehavior: 0.72,
      educationProgress: 0.8,
      communityEngagement: 0.55,
      kycVerification: 1.0,
      paymentHistory: 0.85,
      incomeStability: 0.75,
    },
    history: [
      { month: "Jan", score: 680 },
      { month: "Feb", score: 690 },
      { month: "Mar", score: 705 },
      { month: "Apr", score: 720 },
    ],
    riskLevel: "Low",
    creditLimit: 72000,
    recommendations: [
      {
        category: "Community Engagement",
        suggestion: "Participate more in financial workshops",
        impact: "Medium",
        priority: "Medium",
      },
    ],
  }

  return NextResponse.json({ success: true, data: mockData })
}
