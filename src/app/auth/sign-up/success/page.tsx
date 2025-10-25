import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpSuccessPage() {
	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
						<Mail className="h-6 w-6 text-accent-foreground" />
					</div>
					<CardTitle className="text-2xl">Revisa tu correo electrónico</CardTitle>
					<CardDescription>Te hemos enviado un enlace de confirmación</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground text-center leading-relaxed">
						Por favor revisa tu correo electrónico y haz clic en el enlace de confirmación para activar tu cuenta. Una vez confirmado, podrás crear
						tu equipo y seleccionar tu plan.
					</p>
					<Button asChild className="w-full">
						<Link href="/auth/sign-in">Ir a Iniciar Sesión</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
