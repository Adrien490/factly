import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { advantages } from "../constants";

export function HeroContent() {
	return (
		<>
			{/* Ancre accessible pour la navigation */}
			<div id="home" className="absolute top-0 left-0" aria-hidden="true"></div>

			{/* Contenu principal avec centrage amélioré */}
			<div className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-34 sm:pt-36 pb-16 sm:pb-28 md:pb-16 md:py-14 relative z-10 h-full flex flex-col justify-center items-center">
				{/* Titre principal avec animation améliorée */}
				<div className="mb-6">
					<h1
						className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-bold tracking-tight leading-[1.1] md:leading-[1.1] text-foreground"
						aria-label="Factly, gérez votre entreprise simplement."
					>
						Gérez votre entreprise{" "}
						<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							simplement.
						</span>
					</h1>
				</div>

				{/* Description améliorée */}
				<p className="mt-6 mb-8 text-base md:text-xl text-muted-foreground max-w-xs sm:max-w-2xl mx-auto font-light">
					Plateforme complète de gestion d&apos;entreprise : facturation,
					clients, inventaire et analyses financières pour optimiser votre
					productivité au quotidien.
				</p>

				{/* Avantages clés en ligne - version 2025 */}
				<div
					className="flex flex-wrap justify-center gap-5 mb-8"
					aria-label="Principales fonctionnalités"
				>
					{advantages.map((advantage, idx) => (
						<div
							key={idx}
							className="flex items-center gap-2 text-sm text-foreground/80 bg-background/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
							aria-label={advantage.text}
						>
							{advantage.icon}
							<span>{advantage.text}</span>
						</div>
					))}
				</div>

				{/* Boutons d'action - design 2025 avec CTA primaire et secondaire */}
				<div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 sm:mt-10 w-full">
					{/* CTA Primaire */}
					<div className="w-full sm:max-w-md relative overflow-hidden isolate z-10">
						<Button
							size="lg"
							asChild
							variant="default"
							className="w-full h-12 rounded-full relative z-10"
						>
							<Link
								href="/signin"
								aria-label="Commencer à utiliser Factly maintenant"
							>
								<span className="absolute inset-0 bg-white/10 rounded-full" />
								Commencer maintenant
								<ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
							</Link>
						</Button>

						{/* Effet pulse autour du bouton principal */}
						<div className="absolute -inset-0.5 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300 z-[-1]" />
					</div>
				</div>

				{/* Micro données structurées pour SEO */}
			</div>
		</>
	);
}
