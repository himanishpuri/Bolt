"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, CheckCircle, AlertCircle, ArrowRight, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoanApplicationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [loanData, setLoanData] = useState({
    amount: "",
    purpose: "",
    tenure: "",
    monthlyIncome: "",
    employmentType: "",
    bankAccount: "",
    panCard: "",
  })

  const [eligibilityData, setEligibilityData] = useState({
    eligible: true,
    maxAmount: 75000,
    interestRate: 14.5,
    processingFee: 2.5,
    creditScore: 720,
  })

  const handleInputChange = (field: string, value: string) => {
    setLoanData((prev) => ({ ...prev, [field]: value }))
  }

  const checkEligibility = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate eligibility check
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseInt(loanData.amount)
      const income = Number.parseInt(loanData.monthlyIncome)

      if (amount > eligibilityData.maxAmount) {
        setError(`Maximum eligible amount is ₹${eligibilityData.maxAmount.toLocaleString()}`)
        setIsLoading(false)
        return
      }

      if (amount > income * 10) {
        setError("Loan amount cannot exceed 10x your monthly income")
        setIsLoading(false)
        return
      }

      setStep(2)
    } catch (err) {
      setError("Eligibility check failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const submitApplication = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate loan application submission
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setSuccess("Loan application submitted successfully! You will receive a decision within 24 hours.")
      setStep(3)
    } catch (err) {
      setError("Application submission failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const initiatePayment = async () => {
    setIsLoading(true)

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round((Number.parseInt(loanData.amount) * eligibilityData.processingFee) / 100),
          currency: "INR",
          orderId: `loan_${Date.now()}`,
        }),
      })

      const orderData = await orderResponse.json()

      if (orderData.success) {
        // Simulate payment success
        setTimeout(() => {
          setSuccess("Payment successful! Your loan application is now being processed.")
          setStep(4)
          setIsLoading(false)
        }, 2000)
      }
    } catch (error) {
      setError("Payment failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">Loan Application</span>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
              <span className="text-sm text-gray-500">
                {step === 1 ? "Application" : step === 2 ? "Eligibility" : step === 3 ? "Payment" : "Confirmation"}
              </span>
            </div>
            <Progress value={(step / 4) * 100} />
          </div>

          {/* Alert Messages */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Application Form */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Loan Application Details</CardTitle>
                <CardDescription>Fill in your loan requirements and personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Loan Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50000"
                      value={loanData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="mt-1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Max: ₹{eligibilityData.maxAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label htmlFor="tenure">Loan Tenure (months)</Label>
                    <select
                      id="tenure"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={loanData.tenure}
                      onChange={(e) => handleInputChange("tenure", e.target.value)}
                      required
                    >
                      <option value="">Select tenure</option>
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="18">18 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="purpose">Loan Purpose</Label>
                  <select
                    id="purpose"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    value={loanData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    required
                  >
                    <option value="">Select purpose</option>
                    <option value="business">Business Expansion</option>
                    <option value="education">Education</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="home">Home Improvement</option>
                    <option value="personal">Personal Use</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="25000"
                      value={loanData.monthlyIncome}
                      onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <select
                      id="employmentType"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      value={loanData.employmentType}
                      onChange={(e) => handleInputChange("employmentType", e.target.value)}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="salaried">Salaried</option>
                      <option value="self-employed">Self Employed</option>
                      <option value="business">Business Owner</option>
                      <option value="freelancer">Freelancer</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankAccount">Bank Account Number</Label>
                    <Input
                      id="bankAccount"
                      placeholder="1234567890"
                      value={loanData.bankAccount}
                      onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="panCard">PAN Card Number</Label>
                    <Input
                      id="panCard"
                      placeholder="ABCDE1234F"
                      value={loanData.panCard}
                      onChange={(e) => handleInputChange("panCard", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <Button
                  onClick={checkEligibility}
                  disabled={isLoading || !loanData.amount || !loanData.monthlyIncome}
                  className="w-full"
                >
                  {isLoading ? "Checking Eligibility..." : "Check Eligibility"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Eligibility Results */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  Loan Eligibility Approved
                </CardTitle>
                <CardDescription>Based on your credit profile and application details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requested Amount:</span>
                      <span className="font-medium">₹{Number.parseInt(loanData.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-medium">{eligibilityData.interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">{eligibilityData.processingFee}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Tenure:</span>
                      <span className="font-medium">{loanData.tenure} months</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Monthly EMI</h4>
                      <p className="text-2xl font-bold text-green-800">
                        ₹
                        {Math.round(
                          (Number.parseInt(loanData.amount) *
                            (eligibilityData.interestRate / 100 / 12) *
                            Math.pow(1 + eligibilityData.interestRate / 100 / 12, Number.parseInt(loanData.tenure))) /
                            (Math.pow(1 + eligibilityData.interestRate / 100 / 12, Number.parseInt(loanData.tenure)) -
                              1),
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Processing Fee</h4>
                      <p className="text-xl font-bold text-blue-800">
                        ₹
                        {Math.round(
                          (Number.parseInt(loanData.amount) * eligibilityData.processingFee) / 100,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Credit Score Factors</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{eligibilityData.creditScore}</div>
                      <p className="text-sm text-gray-600">Credit Score</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">Verified</div>
                      <p className="text-sm text-gray-600">KYC Status</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">Good</div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setStep(3)} className="w-full">
                  Proceed to Payment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
                  Processing Fee Payment
                </CardTitle>
                <CardDescription>Pay the processing fee to complete your loan application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-900 font-medium">Processing Fee</span>
                    <span className="text-2xl font-bold text-blue-800">
                      ₹
                      {Math.round(
                        (Number.parseInt(loanData.amount) * eligibilityData.processingFee) / 100,
                      ).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    {eligibilityData.processingFee}% of loan amount (₹
                    {Number.parseInt(loanData.amount).toLocaleString()})
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Payment Methods</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-gray-600">Pay using UPI apps</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Net Banking</p>
                          <p className="text-sm text-gray-600">Pay using your bank account</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={initiatePayment} disabled={isLoading} className="w-full">
                  {isLoading ? "Processing Payment..." : "Pay Now"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  Application Submitted Successfully
                </CardTitle>
                <CardDescription>Your loan application is now being processed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Application ID: LOAN{Date.now().toString().slice(-6)}</h3>
                  <p className="text-gray-600">You will receive a decision within 24 hours</p>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium">Application Summary</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span>₹{Number.parseInt(loanData.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purpose:</span>
                      <span className="capitalize">{loanData.purpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tenure:</span>
                      <span>{loanData.tenure} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span>{eligibilityData.interestRate}% p.a.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Next Steps</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Application submitted and payment processed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      <span>Document verification (if required)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      <span>Final approval and loan disbursal</span>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href="/dashboard">
                    Return to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
