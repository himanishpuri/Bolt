import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json()

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing payment verification parameters",
        },
        { status: 400 },
      )
    }

    // In production, get this from environment variables
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "test_secret_key"

    // Create the signature verification string
    const signatureVerificationString = `${razorpay_order_id}|${razorpay_payment_id}`

    // Create an HMAC SHA256 hash using the key secret
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(signatureVerificationString)
      .digest("hex")

    // Compare the generated signature with the received signature
    const isSignatureValid = expectedSignature === razorpay_signature

    if (!isSignatureValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature",
        },
        { status: 400 },
      )
    }

    // In a real application, update the payment status in your database
    // and perform any necessary business logic (e.g., update loan status)

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
