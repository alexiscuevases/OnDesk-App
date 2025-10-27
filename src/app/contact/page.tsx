import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { platformConfigs } from "@/configs/platform";

export default function ContactPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="container py-16 md:py-24">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
							Get in <span className="text-primary">Touch</span>
						</h1>
						<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
							Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
						</p>
					</div>
				</section>

				{/* Contact Section */}
				<section className="container pb-16 md:pb-24">
					<div className="mx-auto max-w-5xl">
						<div className="grid gap-8 lg:grid-cols-3">
							{/* Contact Info */}
							<div className="space-y-6">
								<Card className="p-6">
									<div className="flex items-start gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
											<Mail className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">Email</h3>
											{Object.entries(platformConfigs.mails).map(([key, mail]) => (
												<p key={key} className="text-sm text-muted-foreground">
													{mail}
												</p>
											))}
										</div>
									</div>
								</Card>

								<Card className="p-6">
									<div className="flex items-start gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
											<Phone className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">Phone</h3>
											<p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
											<p className="text-sm text-muted-foreground">Mon-Fri 9am-6pm EST</p>
										</div>
									</div>
								</Card>

								<Card className="p-6">
									<div className="flex items-start gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
											<MapPin className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold mb-1">Office</h3>
											<p className="text-sm text-muted-foreground">123 AI Street</p>
											<p className="text-sm text-muted-foreground">San Francisco, CA 94102</p>
										</div>
									</div>
								</Card>
							</div>

							{/* Contact Form */}
							<Card className="p-6 lg:col-span-2">
								<form className="space-y-6">
									<div className="grid gap-6 sm:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="firstName">First Name</Label>
											<Input id="firstName" placeholder="John" />
										</div>
										<div className="space-y-2">
											<Label htmlFor="lastName">Last Name</Label>
											<Input id="lastName" placeholder="Doe" />
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input id="email" type="email" placeholder="john@example.com" />
									</div>

									<div className="space-y-2">
										<Label htmlFor="company">Company</Label>
										<Input id="company" placeholder="Your Company" />
									</div>

									<div className="space-y-2">
										<Label htmlFor="subject">Subject</Label>
										<Input id="subject" placeholder="How can we help?" />
									</div>

									<div className="space-y-2">
										<Label htmlFor="message">Message</Label>
										<Textarea id="message" placeholder="Tell us more about your needs..." className="min-h-[150px]" />
									</div>

									<Button type="submit" className="w-full">
										Send Message
									</Button>
								</form>
							</Card>
						</div>
					</div>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
