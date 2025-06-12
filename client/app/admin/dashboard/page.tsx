"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Shield, TrendingUp, AlertCircle, CheckCircle, CreditCard, DollarSign, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/auth/login")
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [router])

  // Mock data - in production, fetch from API
  const stats = {
    totalUsers: 12450,
    pendingKYC: 234,
    verifiedUsers: 11890,
    totalLoans: 5670,
    approvedLoans: 4890,
    pendingLoans: 456,
    rejectedLoans: 324,
    totalLoanAmount: 45600000,
    averageCreditScore: 685,
  }

  const recentLoans = [
    {
      id: 1,
      userName: "Sarah Kim",
      amount: 50000,
      purpose: "Business Expansion",
      creditScore: 720,
      status: "approved",
      appliedAt: "2024-12-14",
    },
    {
      id: 2,
      userName: "David Chen",
      amount: 25000,
      purpose: "Education",
      creditScore: 680,
      status: "pending",
      appliedAt: "2024-12-15",
    },
    {
      id: 3,
      userName: "Maria Rodriguez",
      amount: 75000,
      purpose: "Home Improvement",
      creditScore: 750,
      status: "approved",
      appliedAt: "2024-12-13",
    },
  ]

  const handleLoanAction = async (loanId: number, action: "approve" | "reject") => {
    try {
      // Simulate API call without actual network request
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log(`Loan ${action} successful for loan ${loanId}`)

      // In a real app, you would refresh the data here
      alert(`Loan ${action}d successfully!`)
    } catch (error) {
      console.error("Loan action error:", error)
      alert("Action failed. Please try again.")
    }
  }

  if (!admin) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {admin.firstName}</span>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.clear()
                router.push("/")
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, KYC verifications, and loan applications</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.approvedLoans.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">
                ₹{(stats.totalLoanAmount / 10000000).toFixed(1)}Cr disbursed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Avg Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.averageCreditScore}</div>
              <div className="text-sm text-green-600 mt-1">+5 points this month</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="loans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="loans">Loan Applications</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="loans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Recent Loan Applications
                </CardTitle>
                <CardDescription>Review and process loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{loan.userName}</h4>
                          <p className="text-sm text-gray-600">
                            ₹{loan.amount.toLocaleString()} • {loan.purpose}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Credit Score: {loan.creditScore}</span>
                            <span className="text-xs text-gray-500">Applied: {loan.appliedAt}</span>
                            <Badge
                              variant={
                                loan.status === "approved"
                                  ? "default"
                                  : loan.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={
                                loan.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : loan.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : ""
                              }
                            >
                              {loan.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {loan.status === "pending" && (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleLoanAction(loan.id, "approve")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleLoanAction(loan.id, "reject")}>
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>Overview of user base and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.totalUsers.toLocaleString()}</div>
                    <p className="text-sm text-green-700">Total Users</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <p className="text-sm text-blue-700">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Applications</span>
                      <span className="font-medium">{stats.totalLoans.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approved</span>
                      <span className="font-medium text-green-600">{stats.approvedLoans.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending</span>
                      <span className="font-medium text-yellow-600">{stats.pendingLoans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rejected</span>
                      <span className="font-medium text-red-600">{stats.rejectedLoans}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Disbursed</span>
                      <span className="font-medium">₹{(stats.totalLoanAmount / 10000000).toFixed(1)}Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Loan Size</span>
                      <span className="font-medium">
                        ₹{Math.round(stats.totalLoanAmount / stats.approvedLoans).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approval Rate</span>
                      <span className="font-medium text-green-600">
                        {Math.round((stats.approvedLoans / stats.totalLoans) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
