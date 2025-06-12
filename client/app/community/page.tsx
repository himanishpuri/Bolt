import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageCircle, Calendar, MapPin, Heart, TrendingUp, Award, Clock, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Building Your First Budget",
      date: "Dec 16, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Community Center, Downtown",
      attendees: 24,
      type: "Workshop",
    },
    {
      id: 2,
      title: "Credit Score Improvement Strategies",
      date: "Dec 20, 2024",
      time: "6:00 PM - 7:30 PM",
      location: "Online Webinar",
      attendees: 156,
      type: "Webinar",
    },
    {
      id: 3,
      title: "Small Business Loan Fair",
      date: "Dec 23, 2024",
      time: "10:00 AM - 3:00 PM",
      location: "City Hall, Main Street",
      attendees: 89,
      type: "Fair",
    },
  ]

  const successStories = [
    {
      id: 1,
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      story:
        "Thanks to FinInclude, I improved my credit score by 50 points in 6 months and got approved for my first business loan!",
      improvement: "+50 points",
      timeframe: "6 months",
      likes: 23,
    },
    {
      id: 2,
      name: "James Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      story: "The financial education modules helped me create my first budget and save $2,000 for emergencies.",
      improvement: "$2,000 saved",
      timeframe: "4 months",
      likes: 18,
    },
    {
      id: 3,
      name: "Priya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      story:
        "From having no credit history to getting a credit card with favorable terms. The community support was amazing!",
      improvement: "First credit card",
      timeframe: "8 months",
      likes: 31,
    },
  ]

  const discussions = [
    {
      id: 1,
      title: "Best strategies for building emergency fund?",
      author: "Sarah Kim",
      replies: 12,
      lastActivity: "2 hours ago",
      category: "Savings",
    },
    {
      id: 2,
      title: "How to negotiate better loan terms?",
      author: "Michael Brown",
      replies: 8,
      lastActivity: "4 hours ago",
      category: "Credit",
    },
    {
      id: 3,
      title: "Side hustle ideas for extra income",
      author: "Lisa Wang",
      replies: 24,
      lastActivity: "6 hours ago",
      category: "Income",
    },
    {
      id: 4,
      title: "Budgeting apps vs manual tracking",
      author: "David Johnson",
      replies: 15,
      lastActivity: "1 day ago",
      category: "Budgeting",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Community</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/education">Education</Link>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Our Financial Community</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with others on their financial journey, share experiences, and learn together.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">12,450</div>
              <p className="text-sm text-gray-600">Active Members</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">3,240</div>
              <p className="text-sm text-gray-600">Discussions</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">156</div>
              <p className="text-sm text-gray-600">Events Hosted</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">89%</div>
              <p className="text-sm text-gray-600">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          event.type === "Workshop" ? "default" : event.type === "Webinar" ? "secondary" : "outline"
                        }
                      >
                        {event.type}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {event.attendees}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                    <Button className="w-full">Register Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <div className="space-y-6">
              {successStories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={story.avatar || "/placeholder.svg"} alt={story.name} />
                        <AvatarFallback>
                          {story.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{story.name}</h3>
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-green-100 text-green-800">{story.improvement}</Badge>
                            <span className="text-sm text-gray-500">{story.timeframe}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{story.story}</p>
                        <div className="flex items-center justify-between">
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Heart className="w-4 h-4 mr-1" />
                            {story.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="outline">
                Load More Stories <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Discussions</h2>
              <Button>Start New Discussion</Button>
            </div>
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{discussion.category}</Badge>
                          <span className="text-sm text-gray-500">by {discussion.author}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{discussion.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {discussion.replies} replies
                          </span>
                          <span>{discussion.lastActivity}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Financial Calculators
                  </CardTitle>
                  <CardDescription>Tools to help with your financial planning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Budget Calculator
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Loan Payment Calculator
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Savings Goal Calculator
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Credit Score Simulator
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Recommended Reading
                  </CardTitle>
                  <CardDescription>Curated financial literacy resources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">The Total Money Makeover</h4>
                    <p className="text-sm text-gray-600">Dave Ramsey</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">Your Money or Your Life</h4>
                    <p className="text-sm text-gray-600">Vicki Robin</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium">The Richest Man in Babylon</h4>
                    <p className="text-sm text-gray-600">George S. Clason</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Glossary</CardTitle>
                  <CardDescription>Common financial terms explained</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Browse Glossary <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expert Webinars</CardTitle>
                  <CardDescription>Recorded sessions from financial experts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Watch Webinars <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
