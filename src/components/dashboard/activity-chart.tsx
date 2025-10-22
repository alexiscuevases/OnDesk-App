"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const data = [
	{ day: "Mon", conversations: 245 },
	{ day: "Tue", conversations: 312 },
	{ day: "Wed", conversations: 289 },
	{ day: "Thu", conversations: 401 },
	{ day: "Fri", conversations: 378 },
	{ day: "Sat", conversations: 189 },
	{ day: "Sun", conversations: 156 },
];

export function ActivityChart() {
	return (
		<ChartContainer
			config={{
				conversations: {
					label: "Conversations",
					color: "var(--primary)",
				},
			}}
			className="w-full h-[300px]">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<XAxis dataKey="day" />
					<YAxis />
					<ChartTooltip content={<ChartTooltipContent />} />
					<Bar dataKey="conversations" fill="var(--color-conversations)" radius={[8, 8, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
