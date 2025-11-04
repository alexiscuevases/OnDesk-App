import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { AlertCircle, Bell, Bot, CheckCircle, TrendingUp, Users } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getNotificationIcon(type: string) {
	switch (type.toLowerCase()) {
		case "conversation":
			return Bot;
		case "alert":
			return AlertCircle;
		case "team":
			return Users;
		case "success":
			return CheckCircle;
		case "performance":
			return TrendingUp;
		default:
			return Bell;
	}
}

export function formatDate(date: string | number | Date) {
	return format(date, "MMM d, yyyy • h:mm a");
}
