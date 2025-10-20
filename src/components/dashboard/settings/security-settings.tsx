"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { Enable2FADialog } from "../enable-2fa-dialog";

export function SecuritySettings() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>Update your password to keep your account secure</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="current-password">Current Password</Label>
						<Input id="current-password" type="password" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="new-password">New Password</Label>
						<Input id="new-password" type="password" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirm-password">Confirm New Password</Label>
						<Input id="confirm-password" type="password" />
					</div>

					<Button>Update Password</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Two-Factor Authentication</CardTitle>
					<CardDescription>Add an extra layer of security to your account</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-3 p-4 border border-border rounded-lg">
						<Shield className="h-5 w-5 text-muted-foreground" />
						<div className="flex-1">
							<p className="font-medium">Two-factor authentication is disabled</p>
							<p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
						</div>
						<Badge variant="outline">Disabled</Badge>
					</div>

					<Enable2FADialog>
						<Button>Enable 2FA</Button>
					</Enable2FADialog>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Active Sessions</CardTitle>
					<CardDescription>Manage your active sessions across devices</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{[
							{ device: "Chrome on MacBook Pro", location: "New York, US", current: true },
							{ device: "Safari on iPhone", location: "New York, US", current: false },
						].map((session, index) => (
							<div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
								<div>
									<p className="font-medium">{session.device}</p>
									<p className="text-sm text-muted-foreground">{session.location}</p>
								</div>
								<div className="flex items-center gap-3">
									{session.current && <Badge variant="outline">Current</Badge>}
									{!session.current && (
										<Button variant="ghost" size="sm">
											Revoke
										</Button>
									)}
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
