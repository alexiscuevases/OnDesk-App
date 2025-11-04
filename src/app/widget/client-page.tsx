"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatWidgetProps {
	teamId: string;
}

export default function WidgetClientPage({ teamId }: FloatingChatWidgetProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);

	useEffect(() => {
		setShowAnimation(true);
	}, []);

	useEffect(() => {
		if (isOpen) {
			window.parent.postMessage(
				{
					type: "WIDGET_RESIZE",
					width: "400px",
					height: "600px",
				},
				"*"
			);
		} else {
			window.parent.postMessage(
				{
					type: "WIDGET_RESIZE",
					width: "88px",
					height: "88px",
				},
				"*"
			);
		}
	}, [isOpen]);

	return (
		<div className="w-full h-full">
			{/* Botón flotante */}
			<div id="widget" className={`fixed bottom-6 right-6 transition-all duration-300 ${showAnimation ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
				<Button onClick={() => setIsOpen(!isOpen)} size="lg" className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow">
					{isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
				</Button>
			</div>

			{/* Panel del chat */}
			{isOpen && (
				<div
					className="fixed bottom-24 right-6 transition-all duration-300 transform scale-100 opacity-100"
					style={{
						transformOrigin: "bottom right",
					}}>
					<div className="w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
						<div className="p-4 bg-primary text-white">
							<h3 className="font-semibold">Chat Support</h3>
						</div>
						<div className="flex-1 p-4">
							<p className="text-sm text-gray-600">How can we help you today?</p>
						</div>
					</div>
				</div>
			)}

			{/* Overlay para cerrar */}
			{isOpen && <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />}
		</div>
	);
}
