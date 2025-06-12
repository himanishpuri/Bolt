import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API key not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const fullPrompt = `${context}\n\nUser Query: ${prompt}\n\nProvide a helpful, accurate response focused on financial education and inclusion.`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate AI response" }, { status: 500 })
  }
}
