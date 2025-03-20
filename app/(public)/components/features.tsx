"use client";

import { FeatureItem } from "@/app/(public)/components/feature-item";
import features from "@/app/(public)/lib/features";
import PageContainer from "@/components/page-container";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef } from "react";

// Variantes d'animation pour le conteneur - optimisée pour Core Web Vitals
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			delayChildren: 0.05,
			staggerChildren: 0.08,
		},
	},
};

// Variantes pour les animations des éléments individuels
const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: [0.22, 1, 0.36, 1],
		},
	},
};

export default function Features() {
	const featuresRef = useRef<HTMLDivElement>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const badgeRef = useRef<HTMLDivElement>(null);

	// Nombre de colonnes dynamique en fonction de la taille d'écran
	// Nous utilisons 3 colonnes sur desktop, mais ce paramètre sera transféré au composant FeatureItem
	const columns = 3;

	return (
		<section
			id="features"
			className="py-20 md:py-24 lg:py-28 relative overflow-hidden"
			ref={sectionRef}
		>
			{/* Container pour le GridPattern avec effet parallaxe */}

			{/* Points lumineux dynamiques en arrière-plan avec animation optimisée */}
			<div className="absolute inset-0 pointer-events-none">
				<div
					className="absolute w-3 h-3 rounded-full bg-primary/30 top-1/4 left-1/5 blur-md animate-pulse"
					style={{ animationDelay: "0.5s", animationDuration: "3s" }}
				></div>
				<div
					className="absolute w-4 h-4 rounded-full bg-primary/20 bottom-1/3 right-1/4 blur-md animate-pulse"
					style={{ animationDelay: "1.2s", animationDuration: "5s" }}
				></div>
				<div
					className="absolute w-3 h-3 rounded-full bg-primary/25 top-2/3 left-1/3 blur-md animate-pulse"
					style={{ animationDelay: "0.8s", animationDuration: "4s" }}
				></div>
			</div>

			{/* Masque supérieur pour transition avec la section précédente - harmonisé */}
			<div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />

			<PageContainer className="relative z-10">
				{/* Badge supérieur - style neomorphique 2025 */}
				<motion.div
					className="flex justify-center mb-7"
					ref={badgeRef}
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.8 }}
					transition={{ duration: 0.6 }}
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/5 to-primary/15 border-none shadow-lg shadow-primary/5 backdrop-blur-lg">
						<Sparkles className="h-4 w-4" />
						<span className="text-sm font-medium">Fonctionnalités clés</span>
					</div>
				</motion.div>

				<motion.div
					className="text-center mb-14"
					ref={titleRef}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.6 }}
					transition={{ duration: 0.7 }}
				>
					<h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">
						Solution complète de{" "}
						<span className="relative inline-block group">
							<span className="relative z-10 text-primary">
								gestion commerciale
							</span>
							<span className="absolute -bottom-1.5 left-0 right-0 h-3 bg-primary/10 rounded-full -z-10 group-hover:h-4 group-hover:bg-primary/20 transition-all duration-300"></span>
						</span>
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto text-base">
						Simplifiez votre quotidien avec notre suite d&apos;outils intégrés
						pour gérer efficacement toute votre activité commerciale.
					</p>
				</motion.div>

				{/* Grille de fonctionnalités avec design 2025 */}
				<motion.div
					ref={featuresRef}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 xl:gap-0 bg-transparent xl:border dark:border-neutral-800 rounded-xl overflow-hidden shadow-[0_5px_30px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_30px_-15px_rgba(var(--primary-rgb),0.1)]"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
				>
					{features.map((feature, index) => (
						<motion.div key={index} variants={itemVariants}>
							<FeatureItem
								{...feature}
								index={index}
								totalItems={features.length}
								columns={columns}
							/>
						</motion.div>
					))}
				</motion.div>
			</PageContainer>

			{/* Masque inférieur pour transition avec la section suivante - optimisé */}
			<div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
		</section>
	);
}
