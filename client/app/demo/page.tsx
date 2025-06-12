"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, User, Shield, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DemoPage() {
  const router = useRouter()
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)

  const demoUsers = [
    {
      id: "user1",
      name: "Sarah Kim",
      email: "sarah.kim@email.com",
      role: "user",
      kyc_status: "verified",
      description: "Verified user with completed KYC and education modules",
    },
    {
      id: "user2",
      name: "John Doe",
      email: "john.doe@email.com",
      role: "user",
      kyc_status: "pending",
      description: "New user who needs to complete KYC verification",
    },
    {
      id: "admin1",
      name: "Admin User",
      email: "admin@fininclude.com",
      role: "admin",
      kyc_status: "verified",
      description: "Administrator with full platform access",
    },
  ]

  const handleDemoLogin = (user: any) => {
    if (user.role === "admin") {
      localStorage.setItem("admin", JSON.stringify(user))
      localStorage.setItem("token", "admin-demo-token")
      router.push("/admin/dashboard")
    } else {
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", "user-demo-token")

      if (user.kyc_status === "pending") {
        router.push("/kyc")
      } else {
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FinInclude Demo</span>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Try FinInclude Demo</h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience our financial inclusion platform with different user personas
            </p>
            <Badge className="bg-blue-100 text-blue-800">No registration required • Instant access</Badge>
          </div>

          {/* Demo Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {demoUsers.map((user) => (
              <Card
                key={user.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedDemo === user.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedDemo(user.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {user.role === "admin" ? (
                        <Shield className="w-6 h-6 text-red-600" />
                      ) : (
                        <User className="w-6 h-6 text-blue-600" />
                      )}
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                    </div>
                    <Badge
                      variant={user.role === "admin" ? "destructive" : "default"}
                      className={user.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{user.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>KYC Status:</span>
                      <Badge
                        variant={user.kyc_status === "verified" ? "default" : "secondary"}
                        className={
                          user.kyc_status === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {user.kyc_status}
                      </Badge>
                    </div>

                    {user.role === "user" && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        Access to education & community
                      </div>
                    )}

                    {user.role === "admin" && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        Full administrative access
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDemoLogin(user)
                    }}
                  >
                    Login as {user.name} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you can explore:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">User Experience:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Complete KYC verification process</li>
                    <li>• View personalized dashboard</li>
                    <li>• Access financial education modules</li>
                    <li>• Participate in community features</li>
                    <li>• Check alternative credit scoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Admin Experience:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Review KYC applications</li>
                    <li>• Manage user accounts</li>
                    <li>• Process loan applications</li>
                    <li>• View platform analytics</li>
                    <li>• Administrative controls</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Access */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Prefer to create your own account?</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
