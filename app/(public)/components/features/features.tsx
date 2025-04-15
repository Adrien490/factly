import { features } from "@/app/(public)/components/features/constants";
import { PageContainer } from "@/shared/components/page-container";
import { Sparkles } from "lucide-react";
import { FeatureItem } from "./components";

export function Features() {
	// Nombre de colonnes dynamique en fonction de la taille d'écran
	// Nous utilisons 3 colonnes sur desktop, mais ce paramètre sera transféré au composant FeatureItem
	const columns = 3;

	return (
		<section
			id="features"
			className="py-20 md:py-24 lg:py-28 relative overflow-hidden"
			itemScope
			itemType="https://schema.org/ItemList"
		>
			<PageContainer>
				{/* Points lumineux dynamiques en arrière-plan avec animation optimisée */}
				<div className="absolute inset-0 pointer-events-none">
					<div
						className="absolute w-3 h-3 rounded-full bg-primary/30 top-1/4 left-1/5 blur-md animate-pulse"
						style={{ animationDelay: "0.5s", animationDuration: "3s" }}
						aria-hidden="true"
					></div>
					<div
						className="absolute w-4 h-4 rounded-full bg-primary/20 bottom-1/3 right-1/4 blur-md animate-pulse"
						style={{ animationDelay: "1.2s", animationDuration: "5s" }}
						aria-hidden="true"
					></div>
					<div
						className="absolute w-3 h-3 rounded-full bg-primary/25 top-2/3 left-1/3 blur-md animate-pulse"
						style={{ animationDelay: "0.8s", animationDuration: "4s" }}
						aria-hidden="true"
					></div>
				</div>

				{/* Masque supérieur pour transition avec la section précédente - harmonisé */}
				<div
					className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-background to-transparent z-10 pointer-events-none"
					aria-hidden="true"
				/>

				<div className="relative z-10">
					{/* Badge supérieur - style neomorphique 2025 */}
					<div className="flex justify-center mb-7">
						<div
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/5 to-primary/15 border-none shadow-lg shadow-primary/5 backdrop-blur-lg"
							aria-hidden="true"
						>
							<Sparkles className="h-4 w-4" />
							<span className="text-sm font-medium">Fonctionnalités clés</span>
						</div>
					</div>

					<div className="text-center mb-14">
						<h2
							className="text-3xl sm:text-4xl font-bold tracking-tight mb-5"
							itemProp="name"
						>
							Solution complète de{" "}
							<span className="relative inline-block group">
								<span className="relative z-10 text-primary">
									gestion commerciale
								</span>
								<span
									className="absolute -bottom-1.5 left-0 right-0 h-3 bg-primary/10 rounded-full -z-10 group-hover:h-4 group-hover:bg-primary/20 transition-all duration-300"
									aria-hidden="true"
								></span>
							</span>
						</h2>
						<p className="max-w-2xl mx-auto text-base dark:text-muted-foreground text-muted-foreground/80">
							Simplifiez votre quotidien avec notre suite d&apos;outils intégrés
							pour gérer efficacement toute votre activité commerciale.
						</p>
					</div>

					{/* Grille de fonctionnalités avec design 2025 */}
					<div
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 xl:gap-0 bg-transparent xl:border dark:border-neutral-800 rounded-xl overflow-hidden shadow-[0_5px_30px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_30px_-15px_rgba(var(--primary-rgb),0.1)]"
						role="list"
						aria-label="Liste des fonctionnalités principales"
					>
						{features.map((feature, index) => (
							<div
								key={index}
								itemScope
								itemType="https://schema.org/ListItem"
								itemProp="itemListElement"
								role="listitem"
							>
								<FeatureItem
									{...feature}
									index={index}
									totalItems={features.length}
									columns={columns}
								/>
							</div>
						))}
					</div>
				</div>

				{/* Masque inférieur pour transition avec la section suivante - optimisé */}
				<div
					className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent z-10 pointer-events-none"
					aria-hidden="true"
				/>
			</PageContainer>
		</section>
	);
}
