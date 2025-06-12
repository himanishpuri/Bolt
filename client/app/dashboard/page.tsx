"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIChat } from "@/components/ai-chat"
import {
  CreditCard,
  TrendingUp,
  BookOpen,
  Users,
  CheckCircle,
  ArrowRight,
  Target,
  Award,
  Smartphone,
  Shield,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [creditData, setCreditData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Fetch credit score data
    fetchCreditData()
  }, [router])

  const fetchCreditData = async () => {
    try {
      const response = await fetch("/api/credit-score")
      const data = await response.json()
      if (data.success) {
        setCreditData(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch credit data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const creditScore = creditData?.score || 720
  const creditScoreChange = creditData?.change || 15
  const financialHealthScore = 78
  const completedEducationModules = 8
  const totalEducationModules = 12

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FinInclude Dashboard</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/education">Education</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/community">Community</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.clear()
                router.push("/")
              }}
            >
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600">Here's your financial overview and progress.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Alternative Credit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">{creditScore}</div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />+{creditScoreChange} this month
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {creditData?.riskLevel || "Good"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Credit Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ₹{(creditData?.creditLimit || 72000).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Available for loans</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Financial Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">{financialHealthScore}%</div>
              <Progress value={financialHealthScore} className="mb-2" />
              <p className="text-sm text-gray-600">Improving steadily</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Education Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {completedEducationModules}/{totalEducationModules}
              </div>
              <Progress value={(completedEducationModules / totalEducationModules) * 100} className="mb-2" />
              <p className="text-sm text-gray-600">Modules completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="credit">Credit Analysis</TabsTrigger>
                <TabsTrigger value="loans">Loans</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Credit Score Updated</p>
                          <p className="text-sm text-gray-600">Your score increased by {creditScoreChange} points</p>
                        </div>
                      </div>
                      {/* Always show verified status since all users are verified during signup */}
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Account Verified</p>
                          <p className="text-sm text-gray-600">Identity verified during registration</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Education Module Completed</p>
                          <p className="text-sm text-gray-600">Financial Basics module finished</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full" asChild>
                        <Link href="/loans/apply">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Apply for Loan
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/education">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/community">
                          <Users className="w-4 h-4 mr-2" />
                          Join Community
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="credit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Credit Score Breakdown</CardTitle>
                    <CardDescription>Factors affecting your alternative credit score</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {creditData?.factors &&
                      Object.entries(creditData.factors).map(([key, value]: [string, any]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                            <span>{Math.round(value * 100)}%</span>
                          </div>
                          <Progress value={value * 100} />
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {creditData?.recommendations && (
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Recommendations</CardTitle>
                      <CardDescription>Personalized suggestions to improve your score</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {creditData.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{rec.category}</h4>
                            <Badge
                              variant={
                                rec.priority === "High"
                                  ? "destructive"
                                  : rec.priority === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{rec.suggestion}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="loans" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Eligibility</CardTitle>
                    <CardDescription>Based on your current credit profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Personal Loan</h4>
                        <p className="text-2xl font-bold text-green-800">
                          ₹{(creditData?.creditLimit || 72000).toLocaleString()}
                        </p>
                        <p className="text-sm text-green-700">Interest rate: 12-15% p.a.</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Business Loan</h4>
                        <p className="text-2xl font-bold text-blue-800">
                          ₹{((creditData?.creditLimit || 72000) * 1.5).toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700">Interest rate: 14-18% p.a.</p>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/loans/apply">
                        Apply for Loan <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-gray-600">user@paytm</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Bank Account</p>
                          <p className="text-sm text-gray-600">HDFC Bank ****1234</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Chat */}
            <AIChat />

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Complete Education</h4>
                  <p className="text-sm text-blue-700 mb-3">Finish remaining modules to boost your credit score.</p>
                  <Button size="sm" asChild>
                    <Link href="/education">
                      Continue <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Join Community</h4>
                  <p className="text-sm text-green-700 mb-3">Connect with others on their financial journey.</p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/community">Join Discussion</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
