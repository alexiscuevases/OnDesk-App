"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export default function ProfilePage() {
	const { profile } = useAuth();

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Profile</h1>
				<p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
			</div>

			{/* Profile Settings */}
			<div className="grid gap-6 md:grid-cols-3">
				<Card className="md:col-span-1">
					<CardHeader>
						<CardTitle>Profile Picture</CardTitle>
						<CardDescription>Update your avatar</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-4">
						<Avatar className="h-32 w-32">
							<AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
							<AvatarFallback className="text-2xl">JD</AvatarFallback>
						</Avatar>
						<Button variant="outline" size="sm">
							<Camera className="mr-2 h-4 w-4" />
							Change Photo
						</Button>
					</CardContent>
				</Card>

				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
						<CardDescription>Update your personal details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="first-name">Full Name</Label>
							<Input id="first-name" defaultValue={profile?.full_name} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" defaultValue={profile?.email} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
						</div>

						<Button>Save Changes</Button>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Preferences</CardTitle>
					<CardDescription>Customize your experience</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="language">Language</Label>
						<Input id="language" defaultValue="English" disabled />
					</div>

					<div className="space-y-2">
						<Label htmlFor="timezone">Timezone</Label>
						<Input id="timezone" defaultValue="UTC-5 (Eastern Time)" disabled />
					</div>

					<Button disabled>Save Preferences</Button>
				</CardContent>
			</Card>
		</div>
	);
}
