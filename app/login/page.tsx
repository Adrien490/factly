import { LoginWithSocialProviderForm } from "@/domains/auth/features/login-with-social-provider/components";
import { Logo, Spotlight } from "@/shared/components";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
	return (
		<div className="flex flex-col items-center justify-start sm:justify-center px-4 sm:px-6 py-8 min-h-screen mx-auto relative overflow-hidden">
			{/* Spotlight avec effet subtil */}
			<Spotlight translateY={-100} width={500} height={500} duration={10} />

			{/* Navigation simplifiée */}
			<header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 sm:p-8 z-20">
				<Link
					href="/"
					className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full px-4 py-2 bg-background/60 backdrop-blur-xs"
					aria-label="Retour à l'accueil"
				>
					<ArrowLeft className="w-4 h-4" />
					<span>Accueil</span>
				</Link>

				<Logo
					variant="minimal"
					size="sm"
					shape="circle"
					hideText={false}
					text="Factly"
					textSize="sm"
				/>
			</header>

			{/* Carte principale simplifiée avec bordure améliorée */}
			<div
				className="w-full max-w-md p-6 sm:p-8 space-y-5 rounded-xl relative z-10 
                bg-background/90 backdrop-blur-xs 
                border border-border/10
                shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]
                dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.05)]
                mt-16 sm:mt-0"
			>
				{/* En-tête simplifié */}
				<div className="space-y-3 text-center">
					<div className="flex justify-center mb-2">
						<Logo variant="default" size="md" shape="circle" hideText={true} />
					</div>

					<h1 className="text-xl font-bold">Bienvenue sur Factly</h1>

					<p className="text-muted-foreground text-sm">
						Connectez-vous pour accéder à votre espace de travail
					</p>
				</div>

				{/* Options de connexion sociale */}
				<div className="py-2">
					<LoginWithSocialProviderForm />
				</div>

				{/* Séparateur simple */}
				<div className="relative py-1">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-border/20"></span>
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="px-3 py-1 text-muted-foreground bg-background/90 backdrop-blur-xs">
							ou
						</span>
					</div>
				</div>

				{/* Mentions légales simplifiées */}
				<div className="text-center">
					<p className="text-muted-foreground text-xs text-center">
						En continuant, vous acceptez nos{" "}
						<Link
							href="#"
							className="text-primary/90 hover:text-primary transition-colors font-medium hover:underline"
						>
							Conditions d&apos;Utilisation
						</Link>{" "}
						et{" "}
						<Link
							href="#"
							className="text-primary/90 hover:text-primary transition-colors font-medium hover:underline"
						>
							Politique de Confidentialité
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
