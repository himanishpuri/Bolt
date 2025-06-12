import { type NextRequest, NextResponse } from "next/server"

const mockEducationData = {
  modules: [
    {
      id: 1,
      title: "Financial Basics",
      progress: 100,
      completed: true,
      timeSpent: 45,
      quizScore: 95,
    },
    {
      id: 2,
      title: "Budgeting Mastery",
      progress: 100,
      completed: true,
      timeSpent: 60,
      quizScore: 88,
    },
    {
      id: 3,
      title: "Understanding Credit",
      progress: 100,
      completed: true,
      timeSpent: 55,
      quizScore: 92,
    },
    {
      id: 4,
      title: "Savings Strategies",
      progress: 60,
      completed: false,
      timeSpent: 25,
      quizScore: null,
    },
  ],
  overallProgress: 67,
  totalTimeSpent: 185,
  averageQuizScore: 92,
  achievements: [
    { id: 1, title: "First Steps", earned: true },
    { id: 2, title: "Budget Master", earned: true },
    { id: 3, title: "Credit Aware", earned: true },
    { id: 4, title: "Savings Champion", earned: false },
  ],
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockEducationData,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { moduleId, progress, timeSpent } = await request.json()

    // In a real app, this would update the database
    console.log(`Updating module ${moduleId} progress to ${progress}%, time spent: ${timeSpent} minutes`)

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update progress" }, { status: 500 })
  }
}
