"use client";

import Feature from "@/app/(public)/types/feature";
import { cn } from "@/shared/lib/utils";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

// Variantes d'animation pour chaque élément - transitions plus douces et optimisées
export const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 24,
			duration: 0.4,
		},
	},
};

interface FeatureItemProps extends Feature {
	index: number;
	totalItems: number;
	columns: number;
}

export function FeatureItem({
	title,
	description,
	icon,
	benefits,
	cta,
	index,
	totalItems,
	columns,
}: FeatureItemProps) {
	// Référence pour effet d'observation
	const featureRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(featureRef, { amount: 0.2, once: true });

	// Calcule dynamiquement les positions en bordure en fonction du nombre de colonnes
	const isFirstColumn = index % columns === 0;
	const isLastColumn = index % columns === columns - 1;
	const rowIndex = Math.floor(index / columns);
	const totalRows = Math.ceil(totalItems / columns);
	const isBottomRow = rowIndex === totalRows - 1;

	return (
		<motion.div
			ref={featureRef}
			className={cn(
				"group/feature relative h-full overflow-hidden",
				isFirstColumn ? "lg:border-l dark:border-neutral-800" : "",
				isLastColumn ? "" : "lg:border-r dark:border-neutral-800",
				isBottomRow ? "" : "lg:border-b dark:border-neutral-800"
			)}
			variants={itemVariants}
			animate={isInView ? "visible" : "hidden"}
			whileHover={{
				backgroundColor: "hsl(var(--background))",
				y: -2,
				transition: { duration: 0.2 },
			}}
		>
			{/* Effet de dégradé au survol - design neomorphique 2025 */}
			<div
				className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full pointer-events-none"
				style={{
					background:
						"radial-gradient(circle at center, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0) 70%)",
				}}
			/>
			<div className="opacity-0 group-hover/feature:opacity-40 transition-opacity duration-500 absolute -inset-[0.5px] scale-[0.99] m-auto rounded-xl bg-primary/5 blur-md pointer-events-none" />

			{/* Points de lumière animés selon les tendances 2025 */}
			<div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
				<div
					className="absolute w-1.5 h-1.5 rounded-full bg-primary/40 top-1/4 left-1/5 blur-xs animate-pulse"
					style={{ animationDuration: "3s", animationDelay: "0.2s" }}
				></div>
				<div
					className="absolute w-2 h-2 rounded-full bg-primary/30 bottom-1/4 right-1/5 blur-xs animate-pulse"
					style={{ animationDuration: "4s", animationDelay: "0.5s" }}
				></div>
				<div
					className="absolute w-1 h-1 rounded-full bg-primary/50 top-2/3 left-2/5 blur-xs animate-pulse"
					style={{ animationDuration: "2.5s", animationDelay: "0.7s" }}
				></div>
			</div>

			{/* Contenu principal avec espacement et accessibilité améliorée */}
			<div className="p-7 md:p-8 relative z-10 h-full flex flex-col">
				{/* En-tête avec icône et titre - design 2025 */}
				<div className="space-y-5 mb-5">
					{/* Icône avec animation harmonisée */}
					<div className="text-primary transition-transform duration-300 group-hover/feature:translate-y-[-2px]">
						<div className="w-14 h-14 flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 shadow-2xs group-hover/feature:shadow-md transition-all duration-300 relative overflow-hidden">
							{/* Effet lumineux sur l'icône */}
							<div className="absolute inset-0 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-500 bg-linear-to-r from-primary/0 via-primary/10 to-primary/0 blur-xs"></div>

							<div className="transform transition-transform duration-500 ease-out group-hover/feature:scale-110 group-hover/feature:rotate-[5deg]">
								{icon}
							</div>
						</div>
					</div>

					{/* Titre avec barre verticale animée et effet de profondeur */}
					<div className="relative">
						<div className="absolute left-0 -ml-6 top-1/2 -translate-y-1/2 h-6 group-hover/feature:h-full w-[3px] rounded-r-full bg-linear-to-b from-primary/50 to-primary/30 transition-all duration-300 origin-top opacity-0 group-hover/feature:opacity-100 shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" />
						<h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight transform transition duration-300 group-hover/feature:translate-x-3">
							{title}
						</h3>
					</div>
				</div>

				{/* Description avec style optimisé 2025 */}
				<p className="text-sm md:text-base text-muted-foreground/80 mb-6 leading-relaxed grow transition-all duration-300 group-hover/feature:text-muted-foreground/95 group-hover/feature:translate-y-[-2px]">
					{description}
				</p>

				{/* Avantages avec checkmarks - version moderne et modulaire */}
				{benefits && benefits.length > 0 && (
					<div className="mt-auto space-y-3.5">
						{benefits.map((benefit, i) => (
							<div
								key={i}
								className="flex items-center gap-3 text-xs font-medium text-foreground/80 group-hover/feature:text-foreground transition-all duration-300 transform group-hover/feature:translate-x-3"
								style={{ transitionDelay: `${i * 70}ms` }}
							>
								<div
									className="shrink-0 w-5 h-5 flex items-center justify-center bg-primary/10 rounded-full text-primary transition-all duration-300 group-hover/feature:bg-primary/20 group-hover/feature:scale-110"
									style={{ transitionDelay: `${i * 70 + 50}ms` }}
								>
									<CheckCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
								</div>
								<span className="group-hover/feature:font-semibold transition-all duration-300">
									{benefit}
								</span>
							</div>
						))}
					</div>
				)}

				{/* Bouton CTA avec design neomorphique */}
				{cta && (
					<div className="mt-7 pt-4 border-t border-primary/10">
						<Link
							href={cta.href}
							className="group/link inline-flex items-center gap-2 text-xs font-medium text-primary rounded-full pr-3 py-1.5 pl-2 hover:bg-primary/5 transition-colors duration-300"
						>
							<span className="relative overflow-hidden">
								<span className="transition-transform duration-300 inline-block group-hover/link:translate-y-[-100%]">
									{cta.label}
								</span>
								<span className="absolute left-0 top-full transition-transform duration-300 group-hover/link:translate-y-[-100%]">
									{cta.label}
								</span>
							</span>
							<div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center transform transition-all duration-300 group-hover/link:bg-primary/20 group-hover/link:scale-110">
								<ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-[1px]" />
							</div>
						</Link>
					</div>
				)}
			</div>

			{/* Effet de flash lors du hover - optimisé pour Core Web Vitals */}
			<div className="absolute inset-0 opacity-0 group-hover/feature:opacity-30 -z-10 transition-opacity duration-500 pointer-events-none bg-linear-to-tr from-primary/10 via-transparent to-transparent" />

			{/* Effet de lueur en bas - style neomorphique 2025 */}
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] opacity-0 group-hover/feature:opacity-100 transition-opacity duration-700 bg-linear-to-r from-primary/0 via-primary/30 to-primary/0 blur-xs"></div>
		</motion.div>
	);
}
