"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Award,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Target,
  ArrowRight,
  Sparkles,
  Loader2,
  Star,
  ThumbsUp,
} from "lucide-react"
import Link from "next/link"

export default function EducationPage() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  const modules = [
    {
      id: 1,
      title: "Financial Basics",
      description: "Understanding money, income, and expenses",
      duration: "30 min",
      progress: 100,
      status: "completed",
      icon: BookOpen,
      lessons: 5,
    },
    {
      id: 2,
      title: "Budgeting Mastery",
      description: "Create and manage your personal budget",
      duration: "45 min",
      progress: 100,
      status: "completed",
      icon: Target,
      lessons: 7,
    },
    {
      id: 3,
      title: "Understanding Credit",
      description: "How credit works and building credit history",
      duration: "40 min",
      progress: 100,
      status: "completed",
      icon: CreditCard,
      lessons: 6,
    },
    {
      id: 4,
      title: "Savings Strategies",
      description: "Emergency funds and long-term savings",
      duration: "35 min",
      progress: 60,
      status: "in-progress",
      icon: PiggyBank,
      lessons: 5,
    },
    {
      id: 5,
      title: "Investment Basics",
      description: "Introduction to investing and wealth building",
      duration: "50 min",
      progress: 0,
      status: "locked",
      icon: TrendingUp,
      lessons: 8,
    },
    {
      id: 6,
      title: "Debt Management",
      description: "Strategies for managing and reducing debt",
      duration: "40 min",
      progress: 0,
      status: "locked",
      icon: CreditCard,
      lessons: 6,
    },
  ]

  const achievements = [
    { title: "First Steps", description: "Completed your first module", earned: true },
    { title: "Budget Master", description: "Mastered budgeting fundamentals", earned: true },
    { title: "Credit Aware", description: "Learned about credit basics", earned: true },
    { title: "Savings Champion", description: "Complete savings module", earned: false },
    { title: "Investment Ready", description: "Complete investment basics", earned: false },
  ]

  const getContentRecommendations = async () => {
    setIsLoadingRecommendations(true)

    try {
      // Simulate API call for personalized recommendations
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockRecommendations = [
        {
          id: 1,
          title: "Advanced Budgeting Techniques",
          description: "Learn zero-based budgeting and envelope method",
          type: "Article",
          duration: "15 min read",
          difficulty: "Intermediate",
          rating: 4.8,
          reason: "Based on your completed budgeting module",
        },
        {
          id: 2,
          title: "Building Emergency Fund Fast",
          description: "Strategies to build your emergency fund quickly",
          type: "Video",
          duration: "12 min watch",
          difficulty: "Beginner",
          rating: 4.9,
          reason: "Perfect for your current savings progress",
        },
        {
          id: 3,
          title: "Credit Score Improvement Guide",
          description: "Actionable steps to boost your credit score",
          type: "Interactive",
          duration: "25 min",
          difficulty: "Intermediate",
          rating: 4.7,
          reason: "Matches your credit knowledge level",
        },
        {
          id: 4,
          title: "Investment Planning for Beginners",
          description: "Start your investment journey with confidence",
          type: "Course",
          duration: "45 min",
          difficulty: "Beginner",
          rating: 4.6,
          reason: "Prepare for upcoming investment module",
        },
      ]

      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error("Failed to get recommendations:", error)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Financial Education</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/community">Community</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Build Your Financial Knowledge</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete our comprehensive modules to improve your financial literacy and boost your credit score.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">67%</div>
              <Progress value={67} className="mb-2" />
              <p className="text-sm text-gray-600">4 of 6 modules completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Time Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">3.2h</div>
              <p className="text-sm text-gray-600">Total learning time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">3/5</div>
              <p className="text-sm text-gray-600">Badges earned</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Learning Modules */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Modules</h2>
            <div className="space-y-4">
              {modules.map((module) => {
                const IconComponent = module.icon
                return (
                  <Card
                    key={module.id}
                    className={`transition-all hover:shadow-md ${module.status === "locked" ? "opacity-60" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-lg ${
                            module.status === "completed"
                              ? "bg-green-100"
                              : module.status === "in-progress"
                                ? "bg-blue-100"
                                : "bg-gray-100"
                          }`}
                        >
                          <IconComponent
                            className={`w-6 h-6 ${
                              module.status === "completed"
                                ? "text-green-600"
                                : module.status === "in-progress"
                                  ? "text-blue-600"
                                  : "text-gray-400"
                            }`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                            <div className="flex items-center space-x-2">
                              {module.status === "completed" && (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                              {module.status === "in-progress" && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  In Progress
                                </Badge>
                              )}
                              {module.status === "locked" && <Badge variant="outline">Locked</Badge>}
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3">{module.description}</p>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {module.duration}
                              </span>
                              <span className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                {module.lessons} lessons
                              </span>
                            </div>
                          </div>

                          {module.progress > 0 && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{module.progress}%</span>
                              </div>
                              <Progress value={module.progress} />
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            {module.status === "completed" ? (
                              <Button variant="outline" size="sm">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                            ) : module.status === "in-progress" ? (
                              <Button size="sm">
                                <Play className="w-4 h-4 mr-2" />
                                Continue
                              </Button>
                            ) : module.status === "locked" ? (
                              <Button size="sm" disabled>
                                Complete previous modules
                              </Button>
                            ) : (
                              <Button size="sm">
                                <Play className="w-4 h-4 mr-2" />
                                Start Module
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Content Recommendations */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-sm text-blue-800 mb-4">
                        Get AI-powered content recommendations based on your learning progress and financial goals.
                      </p>
                    </div>
                    <Button
                      onClick={getContentRecommendations}
                      disabled={isLoadingRecommendations}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoadingRecommendations ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Getting Recommendations...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Get Content Recommendations
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-blue-800 font-medium">Recommended for you:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={getContentRecommendations}
                        disabled={isLoadingRecommendations}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {isLoadingRecommendations ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
                      </Button>
                    </div>

                    {recommendations.map((rec) => (
                      <div key={rec.id} className="bg-white rounded-lg p-4 border border-blue-100">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{rec.title}</h4>
                          <div className="flex items-center text-xs text-yellow-600">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {rec.rating}
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mb-2">{rec.description}</p>

                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Badge variant="outline" className="text-xs">
                              {rec.type}
                            </Badge>
                            <span>{rec.duration}</span>
                            <span>•</span>
                            <span>{rec.difficulty}</span>
                          </div>
                        </div>

                        <p className="text-xs text-blue-600 mb-3 italic">{rec.reason}</p>

                        <Button size="sm" variant="outline" className="w-full text-xs">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Start Learning
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-blue-600 hover:text-blue-700"
                      onClick={() => setRecommendations([])}
                    >
                      Clear Recommendations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      achievement.earned ? "bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <Award className={`w-5 h-5 ${achievement.earned ? "text-green-600" : "text-gray-400"}`} />
                    <div>
                      <p className={`font-medium ${achievement.earned ? "text-green-900" : "text-gray-600"}`}>
                        {achievement.title}
                      </p>
                      <p className={`text-xs ${achievement.earned ? "text-green-700" : "text-gray-500"}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Learning Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium mb-1">Set a Schedule</p>
                  <p className="text-xs text-blue-700">Dedicate 15-30 minutes daily for consistent progress.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-900 font-medium mb-1">Apply What You Learn</p>
                  <p className="text-xs text-green-700">Practice budgeting and saving in real life.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-900 font-medium mb-1">Join Discussions</p>
                  <p className="text-xs text-purple-700">Share insights with the community.</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/dashboard">
                    View Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/community">
                    Join Community <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
