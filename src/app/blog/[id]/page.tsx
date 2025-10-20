import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, ArrowLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock data - in production, this would come from your backend
const blogPosts = {
	"1": {
		id: 1,
		title: "How AI Agents Are Transforming Customer Service",
		excerpt: "Discover how businesses are leveraging AI agents to provide 24/7 customer support and improve satisfaction rates.",
		category: "AI Insights",
		date: "Jan 15, 2025",
		readTime: "5 min read",
		image: "/ai-customer-service-dashboard.png",
		author: {
			name: "Sarah Johnson",
			role: "AI Product Manager",
			avatar: "/professional-woman-diverse.png",
		},
		content: `
      <p>The landscape of customer service is undergoing a revolutionary transformation, driven by the rapid advancement of artificial intelligence. AI agents are no longer a futuristic concept—they're here, and they're reshaping how businesses interact with their customers.</p>

      <h2>The Rise of AI-Powered Customer Service</h2>
      <p>In today's fast-paced digital world, customers expect instant responses and 24/7 availability. Traditional customer service models struggle to meet these demands without significant investment in human resources. This is where AI agents step in, offering a scalable solution that never sleeps.</p>

      <p>According to recent studies, businesses implementing AI agents have seen:</p>
      <ul>
        <li>40% reduction in response times</li>
        <li>60% decrease in operational costs</li>
        <li>35% improvement in customer satisfaction scores</li>
        <li>80% of routine queries handled automatically</li>
      </ul>

      <h2>Beyond Simple Chatbots</h2>
      <p>Modern AI agents are far more sophisticated than the chatbots of the past. They leverage advanced natural language processing, machine learning, and contextual understanding to provide human-like interactions. These agents can:</p>

      <ul>
        <li>Understand complex queries and context</li>
        <li>Learn from previous interactions</li>
        <li>Seamlessly escalate to human agents when needed</li>
        <li>Provide personalized recommendations</li>
        <li>Handle multiple languages and cultural nuances</li>
      </ul>

      <h2>Real-World Success Stories</h2>
      <p>Companies across industries are already reaping the benefits. A leading e-commerce platform reduced their customer service costs by 50% while improving satisfaction scores. A financial services company now handles 10,000+ daily inquiries with just a fraction of their previous support team.</p>

      <h2>The Human Touch Still Matters</h2>
      <p>While AI agents are powerful, they work best as part of a hybrid approach. The most successful implementations use AI to handle routine queries and data collection, freeing human agents to focus on complex issues that require empathy and creative problem-solving.</p>

      <h2>Getting Started</h2>
      <p>Implementing AI agents doesn't have to be complicated. Modern platforms like AgentHub make it easy to create, train, and deploy AI agents across multiple channels—from WhatsApp to your website—without requiring technical expertise.</p>

      <p>The future of customer service is here, and it's powered by AI. The question isn't whether to adopt AI agents, but how quickly you can implement them to stay competitive.</p>
    `,
	},
	"2": {
		id: 2,
		title: "WhatsApp Integration: A Complete Guide",
		excerpt: "Learn how to connect your AI agents to WhatsApp and start engaging with customers on their favorite platform.",
		category: "Tutorials",
		date: "Jan 12, 2025",
		readTime: "8 min read",
		image: "/whatsapp-business-integration.jpg",
		author: {
			name: "Michael Chen",
			role: "Integration Specialist",
			avatar: "/professional-man.jpg",
		},
		content: `
      <p>WhatsApp has become the preferred communication channel for billions of users worldwide. Integrating your AI agents with WhatsApp opens up unprecedented opportunities for customer engagement.</p>

      <h2>Why WhatsApp?</h2>
      <p>With over 2 billion active users, WhatsApp offers unparalleled reach. More importantly, it's where your customers already are, making it the perfect channel for proactive customer service.</p>

      <h2>Setting Up Your Integration</h2>
      <p>Getting started with WhatsApp integration is straightforward with AgentHub. Here's what you need to know...</p>
    `,
	},
};

export default function BlogPostPage({ params }: { params: { id: string } }) {
	const post = blogPosts[params.id as keyof typeof blogPosts];

	if (!post) {
		return (
			<div className="flex min-h-screen flex-col">
				<SiteHeader />
				<main className="flex-1 container py-16">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
						<p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
						<Button asChild>
							<Link href="/blog">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Blog
							</Link>
						</Button>
					</div>
				</main>
				<SiteFooter />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				{/* Back Button */}
				<div className="container pt-8">
					<Button variant="ghost" asChild>
						<Link href="/blog">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Blog
						</Link>
					</Button>
				</div>

				{/* Article Header */}
				<article className="container py-8 md:py-12">
					<div className="mx-auto max-w-4xl">
						<div className="mb-8">
							<Badge variant="secondary" className="mb-4">
								{post.category}
							</Badge>
							<h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-balance">{post.title}</h1>
							<p className="text-xl text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>

							{/* Meta Info */}
							<div className="flex items-center justify-between flex-wrap gap-4">
								<div className="flex items-center gap-4">
									<Image
										src={post.author.avatar || "/placeholder.svg"}
										alt={post.author.name}
										width={48}
										height={48}
										className="rounded-full"
									/>
									<div>
										<div className="font-semibold">{post.author.name}</div>
										<div className="text-sm text-muted-foreground">{post.author.role}</div>
									</div>
								</div>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-1">
										<Calendar className="h-4 w-4" />
										<span>{post.date}</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4" />
										<span>{post.readTime}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Featured Image */}
						<div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
							<Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-2 mb-8">
							<Button variant="outline" size="sm">
								<Share2 className="mr-2 h-4 w-4" />
								Share
							</Button>
							<Button variant="outline" size="sm">
								<Bookmark className="mr-2 h-4 w-4" />
								Save
							</Button>
						</div>

						<Separator className="mb-8" />

						{/* Article Content */}
						<div
							className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-p:mb-4 prose-ul:my-4 prose-li:my-2"
							dangerouslySetInnerHTML={{ __html: post.content }}
						/>

						<Separator className="my-12" />

						{/* Author Bio */}
						<div className="flex items-start gap-4 p-6 rounded-lg bg-muted/50">
							<Image src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} width={64} height={64} className="rounded-full" />
							<div>
								<h3 className="font-semibold text-lg mb-1">{post.author.name}</h3>
								<p className="text-sm text-muted-foreground mb-3">{post.author.role}</p>
								<p className="text-sm leading-relaxed">
									Passionate about leveraging AI to create exceptional customer experiences. With over 10 years in the industry, I help
									businesses transform their customer engagement strategies.
								</p>
							</div>
						</div>

						{/* CTA */}
						<div className="mt-12 p-8 rounded-lg bg-primary/5 border border-primary/20 text-center">
							<h3 className="text-2xl font-bold mb-3">Ready to Transform Your Customer Service?</h3>
							<p className="text-muted-foreground mb-6 leading-relaxed">
								Start building AI agents that engage customers 24/7 across all channels.
							</p>
							<Button size="lg" asChild>
								<Link href="/sign-up">Get Started Free</Link>
							</Button>
						</div>
					</div>
				</article>
			</main>
			<SiteFooter />
		</div>
	);
}
