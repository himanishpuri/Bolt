"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Heart, AlertCircle, CheckCircle, User, Phone, Mail, Calendar, MapPin, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DemoNotice } from "@/components/demo-notice"
import { DigilockerConnect, type DigilockerData } from "@/components/digilocker-connect"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [step, setStep] = useState(1)
  const [digilockerVerified, setDigilockerVerified] = useState(false)
  const [digilockerData, setDigilockerData] = useState<DigilockerData | null>(null)

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",

    // Step 2: Address
    address: "",
    city: "",
    state: "",
    postalCode: "",

    // Step 3: Security
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.dateOfBirth) {
      setError("Please fill in all required fields")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      setError("Please enter a valid phone number")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.address || !formData.city || !formData.state || !formData.postalCode) {
      setError("Please fill in all address fields")
      return false
    }
    return true
  }

  const validateStep3 = () => {
    if (!digilockerVerified) {
      setError("Please verify your identity using DigiLocker")
      return false
    }
    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter and confirm your password")
      return false
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      setError("Please agree to the terms and privacy policy")
      return false
    }
    return true
  }

  const handleNext = () => {
    setError("")

    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setError("")
    setStep(step - 1)
  }

  const handleDigilockerSuccess = (data: DigilockerData) => {
    setDigilockerData(data)
    setDigilockerVerified(true)
    setError("")
  }

  const handleDigilockerError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep3()) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulate signup process without API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if email already exists (demo check)
      const existingEmails = ["sarah.kim@email.com", "john.doe@email.com", "admin@fininclude.com"]

      if (existingEmails.includes(formData.email.toLowerCase())) {
        setError("Email already exists. Please use a different email.")
        setIsLoading(false)
        return
      }

      // Create new user with verified status
      const newUser = {
        id: Date.now(),
        email: formData.email.toLowerCase(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        aadhaarNumber: digilockerData?.aadhaarNumber,
        panNumber: digilockerData?.panNumber,
        role: "user",
        kyc_status: "verified", // Set as verified immediately
        created_at: new Date().toISOString(),
      }

      setSuccess("Account created and verified successfully! Redirecting to dashboard...")
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("token", "user-token-" + Date.now())

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">FinInclude</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join thousands building their financial future</p>
        </div>

        <DemoNotice />
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm text-gray-500">
              {step === 1 ? "Personal Info" : step === 2 ? "Address" : "Security & Verification"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1
                ? "Personal Information"
                : step === 2
                  ? "Address Details"
                  : "Security & Identity Verification"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Tell us about yourself"
                : step === 2
                  ? "Where are you located?"
                  : "Secure your account and verify identity"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={
                step === 3
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault()
                      handleNext()
                    }
              }
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        id="address"
                        placeholder="Enter your full address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="123456"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-900">DigiLocker Verification</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      Verify your identity securely using DigiLocker to access all platform features.
                    </p>
                  </div>

                  {!digilockerVerified ? (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                      <div className="flex justify-center mb-4">
                        <img
                          src="/placeholder.svg?height=60&width=200"
                          alt="DigiLocker Logo"
                          className="h-15 object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Connect to DigiLocker to securely verify your Aadhaar and PAN details without manual entry.
                      </p>
                      <DigilockerConnect
                        onSuccess={handleDigilockerSuccess}
                        onError={handleDigilockerError}
                        buttonText="Connect to DigiLocker"
                      />
                    </div>
                  ) : (
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <h3 className="font-medium text-green-900">DigiLocker Verification Successful</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{digilockerData?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Aadhaar Number:</span>
                          <span className="font-medium">XXXX-XXXX-{digilockerData?.aadhaarNumber?.slice(-4)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">PAN Number:</span>
                          <span className="font-medium">{digilockerData?.panNumber}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Verification Status:</span>
                          <span className="font-medium text-green-600">Verified</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-5">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreeToPrivacy}
                        onCheckedChange={(checked) => handleInputChange("agreeToPrivacy", checked as boolean)}
                      />
                      <Label htmlFor="privacy" className="text-sm leading-5">
                        I agree to the{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}

                <Button type="submit" className={`${step === 1 ? "w-full" : "ml-auto"}`} disabled={isLoading}>
                  {isLoading ? "Creating Account..." : step === 3 ? "Create Account" : "Next"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
