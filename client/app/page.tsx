import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	ArrowRight,
	Users,
	Shield,
	GraduationCap,
	TrendingUp,
	Globe,
	Heart,
	CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
			{/* Header */}
			<header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
							<Heart className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold text-gray-900">
							FinInclude
						</span>
					</div>
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							href="#features"
							className="text-gray-600 hover:text-gray-900"
						>
							Features
						</Link>
						<Link
							href="#about"
							className="text-gray-600 hover:text-gray-900"
						>
							About
						</Link>
						<Link
							href="#contact"
							className="text-gray-600 hover:text-gray-900"
						>
							Contact
						</Link>
						<Button
							variant="outline"
							asChild
						>
							<Link href="/auth/login">Login</Link>
						</Button>
						<Button asChild>
							<Link href="/auth/signup">Sign Up</Link>
						</Button>
					</nav>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto text-center">
					<Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
						Empowering 1.4 Billion Unbanked Adults Worldwide
					</Badge>
					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
						Financial Inclusion for
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
							{" "}
							Everyone
						</span>
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						Breaking barriers to financial access through AI-driven
						alternative credit scoring, comprehensive financial education,
						and community-driven support for underbanked individuals.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							asChild
							className="bg-gradient-to-r from-blue-600 to-green-600"
						>
							<Link href="/auth/signup">
								Get Started <ArrowRight className="ml-2 w-4 h-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							asChild
						>
							<Link href="/education">Learn Financial Basics</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Problem Statement */}
			<section className="py-16 px-4 bg-white">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							The Challenge We're Solving
						</h2>
						<p className="text-lg text-gray-600 max-w-4xl mx-auto">
							Unbanked and underbanked individuals in emerging markets
							lack traditional credit histories, blocking their access to
							affordable loans and financial services. This barrier
							perpetuates poverty and limits economic mobility for
							millions.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<Card className="text-center">
							<CardHeader>
								<Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
								<CardTitle>1.4 Billion</CardTitle>
								<CardDescription>
									Adults worldwide remain unbanked as of 2023
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="text-center">
							<CardHeader>
								<TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
								<CardTitle>$26.7 Billion</CardTitle>
								<CardDescription>
									Total Credit Scoring Market value in 2023
								</CardDescription>
							</CardHeader>
						</Card>

						<Card className="text-center">
							<CardHeader>
								<Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
								<CardTitle>$45.2 Billion</CardTitle>
								<CardDescription>
									Forecasted market size by 2034
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</section>

			{/* Unique Selling Proposition */}
			<section
				id="features"
				className="py-16 px-4 bg-gray-50"
			>
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Our Unique Approach
						</h2>
						<p className="text-lg text-gray-600">
							Five pillars that make us different from traditional
							financial services
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<Shield className="w-10 h-10 text-blue-600 mb-2" />
								<CardTitle className="text-lg">
									Trust & Verification
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									DigiLocker KYC verification ensures authenticity and
									builds trust in our platform.
								</p>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<GraduationCap className="w-10 h-10 text-green-600 mb-2" />
								<CardTitle className="text-lg">
									Financial Education
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Personalized guidance on maintaining stable financial
									health and building wealth.
								</p>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<TrendingUp className="w-10 h-10 text-purple-600 mb-2" />
								<CardTitle className="text-lg">
									Credit Rehabilitation
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Helps low credit individuals recover and improve
									their financial standing.
								</p>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<Users className="w-10 h-10 text-orange-600 mb-2" />
								<CardTitle className="text-lg">
									Quantitive Analysis
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Capturing human experiences, attitudes, and cultural
									nuances beyond numbers.
								</p>
							</CardContent>
						</Card>

						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<Heart className="w-10 h-10 text-red-600 mb-2" />
								<CardTitle className="text-lg">
									Community Engagement
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Offline microloan fairs and workshops to build local
									financial communities.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Stakeholders */}
			<section className="py-16 px-4 bg-white">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Our Stakeholders
						</h2>
						<p className="text-lg text-gray-600">
							Building an ecosystem that benefits everyone
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<Card className="text-center border-2 border-blue-200">
							<CardHeader>
								<Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
								<CardTitle>Underbanked Individuals</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Access to credit, financial education, and tools for
									economic mobility.
								</p>
							</CardContent>
						</Card>

						<Card className="text-center border-2 border-green-200">
							<CardHeader>
								<TrendingUp className="w-16 h-16 text-green-600 mx-auto mb-4" />
								<CardTitle>Banks & Money Lenders</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Expanded customer base with reduced risk through
									AI-driven assessments.
								</p>
							</CardContent>
						</Card>

						<Card className="text-center border-2 border-purple-200">
							<CardHeader>
								<Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
								<CardTitle>NGOs & Government</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600">
									Tools for financial inclusion initiatives and poverty
									reduction programs.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Competitive Advantage */}
			<section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
				<div className="container mx-auto text-center">
					<h2 className="text-3xl font-bold mb-8">
						Our Competitive Advantage
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="flex items-center space-x-2">
							<CheckCircle className="w-6 h-6" />
							<span>Comprehensive Financial Education</span>
						</div>
						<div className="flex items-center space-x-2">
							<CheckCircle className="w-6 h-6" />
							<span>Community-Driven Approach</span>
						</div>
						<div className="flex items-center space-x-2">
							<CheckCircle className="w-6 h-6" />
							<span>Bias-Free AI Assessment</span>
						</div>
						<div className="flex items-center space-x-2">
							<CheckCircle className="w-6 h-6" />
							<span>Government-Verified KYC</span>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 bg-gray-900 text-white">
				<div className="container mx-auto text-center">
					<h2 className="text-3xl font-bold mb-4">
						Ready to Transform Your Financial Future?
					</h2>
					<p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
						Join millions of individuals building their credit history and
						accessing financial services.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-white text-gray-900 hover:bg-gray-100"
							asChild
						>
							<Link href="/demo">
								Try Demo <ArrowRight className="ml-2 w-4 h-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-white text-black hover:bg-white hover:text-gray-900"
							asChild
						>
							<Link href="/auth/signup">Sign Up Free</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-800 text-white py-12 px-4">
				<div className="container mx-auto">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
									<Heart className="w-5 h-5 text-white" />
								</div>
								<span className="text-xl font-bold">FinInclude</span>
							</div>
							<p className="text-gray-400">
								Empowering financial inclusion through AI and community.
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Platform</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link
										href="/dashboard"
										className="hover:text-white"
									>
										Dashboard
									</Link>
								</li>
								<li>
									<Link
										href="/education"
										className="hover:text-white"
									>
										Education
									</Link>
								</li>
								<li>
									<Link
										href="/community"
										className="hover:text-white"
									>
										Community
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Support</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link
										href="/help"
										className="hover:text-white"
									>
										Help Center
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className="hover:text-white"
									>
										Contact Us
									</Link>
								</li>
								<li>
									<Link
										href="/privacy"
										className="hover:text-white"
									>
										Privacy Policy
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Company</h3>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link
										href="/about"
										className="hover:text-white"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										href="/careers"
										className="hover:text-white"
									>
										Careers
									</Link>
								</li>
								<li>
									<Link
										href="/blog"
										className="hover:text-white"
									>
										Blog
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2024 FinInclude. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
