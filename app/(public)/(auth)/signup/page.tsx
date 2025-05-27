import { SignInSocialForm } from "@/domains/auth/features/sign-in-social/components/sign-in-social-form";
import { SignUpEmailForm } from "@/domains/auth/features/sign-up-email/components/sign-up-email-form";
import { Card, CardContent } from "@/shared/components";
import Link from "next/link";

export default async function SignupPage() {
	return (
		<Card className="w-full max-w-md">
			<CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
				<div className="space-y-4 text-center">
					<div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tight">
							Bienvenue sur Factly
						</h1>
						<p className="text-sm text-muted-foreground">
							Créez un compte pour accéder à votre espace de travail
						</p>
					</div>
				</div>

				{/* Options de connexion sociale */}
				<div className="w-full">
					<SignInSocialForm />
				</div>

				{/* Séparateur */}
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-border/20" />
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="bg-background/95 px-3 py-1 text-muted-foreground backdrop-blur-sm">
							ou
						</span>
					</div>
				</div>

				{/* Formulaire de connexion ou d'inscription */}
				<div className="w-full">
					<SignUpEmailForm />
				</div>

				{/* Bouton de basculement */}
				<div className="text-center">
					<p className="text-sm text-muted-foreground">
						Déjà un compte ?{" "}
						<Link
							href={`/`}
							className="font-medium text-primary hover:underline"
						>
							Se connecter
						</Link>
					</p>
				</div>

				{/* Mentions légales */}
				<div className="text-center">
					<p className="text-xs text-muted-foreground">
						En continuant, vous acceptez nos{" "}
						<Link
							href="/terms"
							className="font-medium text-primary/90 transition-colors hover:text-primary hover:underline"
						>
							Conditions d&apos;Utilisation
						</Link>{" "}
						et{" "}
						<Link
							href="/privacy"
							className="font-medium text-primary/90 transition-colors hover:text-primary hover:underline"
						>
							Politique de Confidentialité
						</Link>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
