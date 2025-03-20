"use client";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import features from "../lib/features";

// Couleurs optimisées pour WavyBackground - valeurs plus vives et plus opaques

interface CTASectionProps {
	title?: string;
	subtitle?: string;
	featureCount?: number;
	primaryCTA?: {
		label: string;
		href: string;
	};
	secondaryCTA?: {
		label: string;
		href: string;
	};
	className?: string;
}

export function CTASection({
	title = "Prêt à transformer votre gestion d'entreprise ?",
	subtitle = "Simplifiez votre quotidien avec notre suite d'outils intégrés pour gérer efficacement toute votre activité commerciale.",
	featureCount = 3,
	primaryCTA = {
		label: "Commencer gratuitement",
		href: "/login",
	},
	secondaryCTA = {
		label: "Découvrir nos tarifs",
		href: "/pricing",
	},
	className,
}: CTASectionProps) {
	const ctaRef = useRef<HTMLDivElement>(null);

	// Sélectionner uniquement le nombre de fonctionnalités demandé
	const selectedFeatures = features.slice(0, featureCount);

	return (
		<section
			id="cta"
			className={cn("relative py-24 overflow-hidden", className)}
		>
			{/* Conteneur externe pour s'assurer que WavyBackground est visible */}
			<div className="relative w-full">
				{/* Composant WavyBackground avec paramètres améliorés pour visibilité */}

				<div className="max-w-4xl mx-auto relative z-20">
					{/* Badge supérieur - style neomorphique 2025 amélioré */}
					<motion.div
						className="flex justify-center mb-8"
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 border border-white/10 shadow-xl backdrop-blur-xl">
							<Sparkles className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium text-white">2025</span>
						</div>
					</motion.div>

					{/* Titre et sous-titre avec effet d'apparition amélioré */}
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-white drop-shadow-lg">
							{title}
						</h2>
						<p className="text-white/90 max-w-2xl mx-auto text-base backdrop-blur-sm py-3 px-5 rounded-2xl bg-white/10 shadow-inner border border-white/5">
							{subtitle}
						</p>
					</motion.div>

					{/* Liste des fonctionnalités clés avec animation au survol */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 px-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						{selectedFeatures.map((feature, index) => (
							<motion.div
								key={index}
								className="rounded-xl p-4 backdrop-blur-md border bg-white/5 border-white/10 transition-all duration-300 flex items-start gap-3 group hover:bg-white/15 hover:border-white/20 hover:shadow-lg hover:scale-105"
								whileHover={{ y: -5 }}
							>
								<div className="rounded-full p-2 bg-primary/20 text-primary mt-0.5 shrink-0">
									<Check className="h-4 w-4" />
								</div>
								<div>
									<h3 className="font-medium text-white text-sm">
										{feature.title}
									</h3>
									<p className="text-white/70 text-xs mt-1 line-clamp-2">
										{feature.description}
									</p>
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Boutons d'action améliorés */}
					<div
						className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
						ref={ctaRef}
					>
						{/* CTA Principal */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.6 }}
							className="w-full sm:w-auto"
						>
							<Link href={primaryCTA.href} className="block">
								<HoverBorderGradient
									containerClassName="rounded-full overflow-hidden"
									as="button"
									className="bg-primary/90 text-white py-3.5 px-7 font-medium text-base flex items-center justify-center gap-2.5 hover:bg-primary transition-colors duration-300 rounded-full w-full group relative overflow-hidden min-w-52 sm:min-w-64 shadow-xl"
									duration={1.5}
								>
									<span className="relative z-10">{primaryCTA.label}</span>
									<ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
									<span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
								</HoverBorderGradient>
							</Link>
						</motion.div>

						{/* CTA Secondaire */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.7 }}
							className="w-full sm:w-auto"
						>
							<Link href={secondaryCTA.href} className="block">
								<div className="py-3.5 px-7 font-medium text-base flex items-center justify-center gap-2.5 transition-all duration-300 rounded-full w-full group relative overflow-hidden min-w-52 sm:min-w-64 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/10 hover:border-white/20">
									<span>{secondaryCTA.label}</span>
									<ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-[-2px]" />
								</div>
							</Link>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Points lumineux décoratifs améliorés */}
			<div className="absolute inset-0 pointer-events-none">
				<div
					className="absolute w-40 h-40 rounded-full bg-primary/10 -top-20 left-1/4 blur-3xl animate-pulse"
					style={{ animationDuration: "8s" }}
				></div>
				<div
					className="absolute w-56 h-56 rounded-full bg-primary/10 top-1/2 -right-28 blur-3xl animate-pulse"
					style={{ animationDuration: "12s" }}
				></div>
				<div
					className="absolute w-24 h-24 rounded-full bg-secondary/10 bottom-20 left-1/3 blur-3xl animate-pulse"
					style={{ animationDuration: "10s" }}
				></div>
			</div>

			{/* Masque supérieur pour transition avec la section précédente */}
			<div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

			{/* Masque inférieur pour transition avec la section suivante */}
			<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
		</section>
	);
}
