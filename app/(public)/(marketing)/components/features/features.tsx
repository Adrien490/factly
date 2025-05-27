import { features } from "@/app/(public)/(marketing)/components/features/constants";
import { PageContainer } from "@/shared/components/page-container";
import { cn } from "@/shared/utils";
import { Sparkles } from "lucide-react";
import { FeatureItem } from "./components";

export function Features() {
	// Nombre de colonnes dynamique en fonction de la taille d'écran
	// Nous utilisons 3 colonnes sur desktop, mais ce paramètre sera transféré au composant FeatureItem
	const columns = 3;

	return (
		<section
			id="features"
			className={cn(
				"py-20 md:py-24 lg:py-28 relative overflow-hidden",
				"mask-t-from-99% mask-t-to-100% mask-b-from-97% mask-b-to-99% sm:mask-t-from-98% sm:mask-t-to-99% sm:mask-b-from-95% sm:mask-b-to-98% md:mask-t-from-97% md:mask-t-to-99% md:mask-b-from-90% md:mask-b-to-98% lg:mask-t-from-95% lg:mask-t-to-99% lg:mask-b-from-85% lg:mask-b-to-98%"
			)}
			itemScope
			itemType="https://schema.org/ItemList"
		>
			<PageContainer>
				<div className="relative z-10">
					{/* Badge supérieur - style neomorphique 2025 */}
					<div className="flex justify-center mb-7">
						<div
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/15 to-primary/30 border-none shadow-lg shadow-primary/10 backdrop-blur-lg relative z-20"
							aria-hidden="true"
						>
							<Sparkles className="h-4 w-4" />
							<span className="text-sm font-medium text-foreground">
								Fonctionnalités clés
							</span>
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
			</PageContainer>
		</section>
	);
}
