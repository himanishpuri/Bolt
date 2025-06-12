import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock database storage - in production, use a real database
let nextUserId = 100

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      postalCode,
      digilockerData,
      password,
      confirmPassword,
    } = formData

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json({ success: false, error: "All required fields must be filled" }, { status: 400 })
    }

    // Validate DigiLocker data
    if (!digilockerData || !digilockerData.verified) {
      return NextResponse.json({ success: false, error: "DigiLocker verification is required" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: "Passwords do not match" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long" },
        { status: 400 },
      )
    }

    // Check if email already exists (mock check)
    const existingEmails = ["sarah.kim@email.com", "john.doe@email.com", "admin@fininclude.com"]

    if (existingEmails.includes(email.toLowerCase())) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 })
    }

    // Hash password (in production)
    // const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: nextUserId++,
      email: email.toLowerCase(),
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      postalCode,
      aadhaarNumber: digilockerData.aadhaarNumber,
      panNumber: digilockerData.panNumber,
      role: "user",
      kyc_status: "verified", // Set as verified immediately
      created_at: new Date().toISOString(),
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // In production, save to database here
    console.log("New user created:", newUser)

    return NextResponse.json({
      success: true,
      user: newUser,
      token,
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
