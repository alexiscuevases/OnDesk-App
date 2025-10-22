import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const blogPosts = [
	{
		id: 1,
		title: "How AI Agents Are Transforming Customer Service",
		excerpt: "Discover how businesses are leveraging AI agents to provide 24/7 customer support and improve satisfaction rates.",
		category: "AI Insights",
		date: "Jan 15, 2025",
		readTime: "5 min read",
		image: "/ai-customer-service-dashboard.png",
	},
	{
		id: 2,
		title: "WhatsApp Integration: A Complete Guide",
		excerpt: "Learn how to connect your AI agents to WhatsApp and start engaging with customers on their favorite platform.",
		category: "Tutorials",
		date: "Jan 12, 2025",
		readTime: "8 min read",
		image: "/whatsapp-business-integration.jpg",
	},
	{
		id: 3,
		title: "5 Ways to Optimize Your AI Agent's Performance",
		excerpt: "Best practices for training and configuring your AI agents to deliver exceptional customer experiences.",
		category: "Best Practices",
		date: "Jan 10, 2025",
		readTime: "6 min read",
		image: "/ai-performance-optimization.jpg",
	},
	{
		id: 4,
		title: "The Future of Conversational AI",
		excerpt: "Explore emerging trends in conversational AI and what they mean for your business.",
		category: "Industry Trends",
		date: "Jan 8, 2025",
		readTime: "7 min read",
		image: "/future-of-ai-conversation.jpg",
	},
	{
		id: 5,
		title: "Case Study: How TechCorp Increased Sales by 40%",
		excerpt: "See how one company used AgentHub to transform their customer engagement and drive revenue growth.",
		category: "Case Studies",
		date: "Jan 5, 2025",
		readTime: "10 min read",
		image: "/business-growth-chart.png",
	},
	{
		id: 6,
		title: "Building Custom Prompts for Your AI Agents",
		excerpt: "A comprehensive guide to crafting effective prompts that align with your brand voice and business goals.",
		category: "Tutorials",
		date: "Jan 3, 2025",
		readTime: "9 min read",
		image: "/ai-prompt-engineering.png",
	},
];

export default function BlogPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="container py-16 md:py-24">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
							AgentHub <span className="text-primary">Blog</span>
						</h1>
						<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
							Insights, tutorials, and best practices for building exceptional AI-powered customer experiences.
						</p>
					</div>
				</section>

				{/* Blog Posts Grid */}
				<section className="container pb-16 md:pb-24">
					<div className="mx-auto max-w-6xl">
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{blogPosts.map((post) => (
								<Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
									<div className="relative h-48 overflow-hidden">
										<Image
											src={post.image || "/placeholder.svg"}
											alt={post.title}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<div className="p-6">
										<Badge variant="secondary" className="mb-3">
											{post.category}
										</Badge>
										<h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
										<p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
										<div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
											<div className="flex items-center gap-1">
												<Calendar className="h-3 w-3" />
												<span>{post.date}</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="h-3 w-3" />
												<span>{post.readTime}</span>
											</div>
										</div>
										<Button variant="ghost" className="w-full group/btn" asChild>
											<Link href={`/blog/${post.id}`}>
												Read More
												<ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
											</Link>
										</Button>
									</div>
								</Card>
							))}
						</div>
					</div>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
