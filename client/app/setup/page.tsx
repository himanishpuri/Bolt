"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Key, Database, Smartphone, CreditCard } from "lucide-react"

export default function SetupPage() {
  const [apiKeys, setApiKeys] = useState({
    gemini: "",
    razorpay: "",
    digilocker: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // In a real app, this would save to environment variables or database
      localStorage.setItem("api_keys", JSON.stringify(apiKeys))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("API keys saved successfully! The platform is now fully configured.")
    } catch (err) {
      setError("Failed to save API keys. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Platform Setup</h1>
            <p className="text-lg text-gray-600">Configure API keys to enable all platform features</p>
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

          <div className="space-y-6">
            {/* Gemini AI */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-blue-600" />
                  Gemini AI API Key
                </CardTitle>
                <CardDescription>
                  Required for AI-powered credit scoring, chat support, and financial recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gemini">API Key</Label>
                    <Input
                      id="gemini"
                      type="password"
                      placeholder="Enter your Gemini API key"
                      value={apiKeys.gemini}
                      onChange={(e) => setApiKeys((prev) => ({ ...prev, gemini: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>How to get:</strong> Visit{" "}
                      <a
                        href="https://makersuite.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Google AI Studio
                      </a>{" "}
                      to generate your free API key
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Razorpay */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Razorpay API Keys
                </CardTitle>
                <CardDescription>Required for processing loan payments and handling transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="razorpay">API Key</Label>
                    <Input
                      id="razorpay"
                      type="password"
                      placeholder="Enter your Razorpay API key"
                      value={apiKeys.razorpay}
                      onChange={(e) => setApiKeys((prev) => ({ ...prev, razorpay: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>How to get:</strong> Sign up at{" "}
                      <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="underline">
                        Razorpay
                      </a>{" "}
                      and get your API keys from the dashboard
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DigiLocker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-purple-600" />
                  DigiLocker API
                </CardTitle>
                <CardDescription>Required for government document verification and KYC processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="digilocker">Client ID</Label>
                    <Input
                      id="digilocker"
                      type="password"
                      placeholder="Enter your DigiLocker Client ID"
                      value={apiKeys.digilocker}
                      onChange={(e) => setApiKeys((prev) => ({ ...prev, digilocker: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>How to get:</strong> Register at{" "}
                      <a
                        href="https://partners.digilocker.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        DigiLocker Partners
                      </a>{" "}
                      to get API access for document verification
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2 text-orange-600" />
                  Database Configuration
                </CardTitle>
                <CardDescription>PostgreSQL database setup for production deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>For production:</strong> Set up a PostgreSQL database and configure the DATABASE_URL
                    environment variable. The SQL scripts in the /scripts folder will create the necessary tables.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Features</CardTitle>
                <CardDescription>What becomes available with proper API configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">With Gemini AI:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• AI-powered credit scoring</li>
                      <li>• Intelligent financial recommendations</li>
                      <li>• Real-time chat support</li>
                      <li>• Personalized education content</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">With Payment APIs:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Loan processing fee payments</li>
                      <li>• UPI and net banking support</li>
                      <li>• Secure transaction handling</li>
                      <li>• Payment verification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={isLoading} className="w-full">
              {isLoading ? "Saving Configuration..." : "Save Configuration"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have API keys? The platform works in demo mode without them.{" "}
                <a href="/demo" className="text-blue-600 hover:underline">
                  Try the demo
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
