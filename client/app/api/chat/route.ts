import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { message, context, userId } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // Fallback response if no API key
      return NextResponse.json({
        success: true,
        response:
          "I'm here to help with your financial questions! However, the AI service is currently unavailable. Please try again later or contact support.",
        timestamp: new Date().toISOString(),
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPrompt = `You are a helpful financial advisor for FinInclude, a platform focused on financial inclusion. 
    You help users with:
    - Financial education and literacy
    - Credit score improvement
    - Budgeting and savings advice
    - Understanding loans and credit
    - KYC and verification processes
    - Community financial programs
    
    Keep responses helpful, accurate, and focused on financial inclusion. Be encouraging and supportive.
    
    Context: ${context || "General financial advice"}
    User ID: ${userId || "Anonymous"}`

    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}`)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({
      success: true,
      response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
      timestamp: new Date().toISOString(),
    })
  }
}
