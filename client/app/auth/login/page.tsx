"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Heart, Shield, User, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DemoNotice } from "@/components/demo-notice"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  })

  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
  })

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // For demo purposes, simulate login without API call
      if (userForm.email && userForm.password) {
        // Demo user credentials
        const demoUsers = [
          {
            email: "sarah.kim@email.com",
            password: "password123",
            firstName: "Sarah",
            lastName: "Kim",
            kyc_status: "verified",
          },
          {
            email: "john.doe@email.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            kyc_status: "pending",
          },
          { email: "demo@user.com", password: "demo123", firstName: "Demo", lastName: "User", kyc_status: "pending" },
        ]

        const user = demoUsers.find(
          (u) => u.email.toLowerCase() === userForm.email.toLowerCase() && u.password === userForm.password,
        )

        if (user) {
          setSuccess("Login successful! Redirecting...")
          const userData = { ...user, id: Date.now() }
          localStorage.setItem("user", JSON.stringify(userData))
          localStorage.setItem("token", "demo-token-" + Date.now())

          // Always redirect to dashboard regardless of KYC status
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        } else {
          setError("Invalid email or password. Try: demo@user.com / demo123")
        }
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Demo admin credentials
      if (adminForm.email === "admin@fininclude.com" && adminForm.password === "admin123") {
        setSuccess("Admin login successful! Redirecting...")
        const adminData = {
          id: 1,
          email: "admin@fininclude.com",
          firstName: "Admin",
          lastName: "User",
          role: "admin",
        }
        localStorage.setItem("admin", JSON.stringify(adminData))
        localStorage.setItem("token", "admin-token-" + Date.now())

        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 1000)
      } else {
        setError("Invalid admin credentials. Use: admin@fininclude.com / admin123")
      }
    } catch (err) {
      setError("Admin login failed. Please try again.")
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
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

        <DemoNotice />
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              User Login
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Admin Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>User Login</CardTitle>
                <CardDescription>Access your financial dashboard and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="Enter your email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="user-password">Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="user-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
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
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Demo User:</strong> demo@user.com / demo123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Access administrative dashboard and controls</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Enter admin email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter admin password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
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
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Admin Sign In"}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Demo Admin:</strong> admin@fininclude.com / admin123
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
