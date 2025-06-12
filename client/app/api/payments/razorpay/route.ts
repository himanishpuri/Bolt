import { type NextRequest, NextResponse } from "next/server"

// Razorpay payment integration simulation
export async function POST(request: NextRequest) {
  try {
    const { amount, currency, orderId } = await request.json()

    // Simulate Razorpay order creation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const razorpayOrder = {
      id: `order_${Math.random().toString(36).substr(2, 9)}`,
      entity: "order",
      amount: amount * 100, // Razorpay uses paise
      currency: currency || "INR",
      status: "created",
      receipt: orderId,
      created_at: Math.floor(Date.now() / 1000),
      notes: {
        platform: "FinInclude",
        type: "loan_processing_fee",
      },
    }

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      key: "rzp_test_demo_key", // Demo key
      message: "Payment order created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Payment order creation failed" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { paymentId, orderId, signature } = await request.json()

    // Simulate payment verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const paymentVerification = {
      paymentId,
      orderId,
      signature,
      status: "captured",
      amount: 50000, // Demo amount
      currency: "INR",
      method: "upi",
      bank: "HDFC",
      wallet: null,
      vpa: "user@paytm",
      captured: true,
      created_at: Math.floor(Date.now() / 1000),
    }

    return NextResponse.json({
      success: true,
      payment: paymentVerification,
      message: "Payment verified successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 500 })
  }
}
