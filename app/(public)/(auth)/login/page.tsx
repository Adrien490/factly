import { LoginWithSocialProviderForm } from "@/domains/auth/features/login-with-social-provider";
import { SignInEmailForm } from "@/domains/auth/features/sign-in-email/components/sign-in-email-form";
import { SignUpEmailForm } from "@/domains/auth/features/sign-up-email/components/sign-up-email-form";
import { Logo, Spotlight } from "@/shared/components";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
	searchParams: Promise<{
		callbackURL?: string;
		formType?: "signin" | "signup";
	}>;
}

export default async function LoginPage({ searchParams }: Props) {
	const { callbackURL, formType = "signin" } = await searchParams;

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
			{/* Spotlight avec effet subtil */}
			<Spotlight translateY={-100} width={500} height={500} duration={10} />

			{/* Navigation simplifiée */}
			<header className="fixed top-0 left-0 w-full p-4 sm:p-8 z-20">
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-full bg-background/60 px-4 py-2 text-sm font-medium text-foreground/80 backdrop-blur-xs transition-colors hover:text-foreground"
					aria-label="Retour à l'accueil"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>Accueil</span>
				</Link>
			</header>

			{/* Carte principale */}
			<div className="w-full max-w-md space-y-6 rounded-xl border border-border/50 bg-background/95 p-6 shadow-xl backdrop-blur-sm sm:p-8">
				{/* En-tête */}
				<div className="space-y-4 text-center">
					<div className="flex justify-center">
						<Logo variant="default" size="md" shape="circle" hideText={true} />
					</div>

					<div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tight">
							{formType === "signin"
								? "Bienvenue sur Factly"
								: "Créer un compte"}
						</h1>
						<p className="text-sm text-muted-foreground">
							{formType === "signin"
								? "Connectez-vous pour accéder à votre espace de travail"
								: "Créez votre compte pour commencer à utiliser Factly"}
						</p>
					</div>
				</div>

				{/* Options de connexion sociale */}
				<div className="w-full">
					<LoginWithSocialProviderForm />
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
					{formType === "signin" ? <SignInEmailForm /> : <SignUpEmailForm />}
				</div>

				{/* Bouton de basculement */}
				<div className="text-center">
					<p className="text-sm text-muted-foreground">
						{formType === "signin" ? (
							<>
								Pas encore de compte ?{" "}
								<Link
									href={`/login?formType=signup${
										callbackURL ? `&callbackURL=${callbackURL}` : ""
									}`}
									className="font-medium text-primary hover:underline"
								>
									S&apos;inscrire
								</Link>
							</>
						) : (
							<>
								Déjà un compte ?{" "}
								<Link
									href={`/login?formType=signin${
										callbackURL ? `&callbackURL=${callbackURL}` : ""
									}`}
									className="font-medium text-primary hover:underline"
								>
									Se connecter
								</Link>
							</>
						)}
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
			</div>
		</div>
	);
}
