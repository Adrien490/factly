"use client";

import { BackgroundLines } from "@/shared/components/ui/background-lines";
import { Button } from "@/shared/components/ui/button";
import { Highlight } from "@/shared/components/ui/hero-highlight";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { advantages, containerVariants, itemVariants } from "../constants";

export function Hero() {
	// Utilisation de useReducedMotion pour l'accessibilité
	const prefersReducedMotion = useReducedMotion();

	const { theme } = useTheme();
	const isDark = theme === "dark";

	// Contenu principal qui sera utilisé dans les deux arrière-plans
	const heroContent = (
		<>
			{/* Ancre accessible pour la navigation */}
			<div id="home" className="absolute top-0 left-0" aria-hidden="true"></div>

			{/* Contenu principal avec centrage amélioré */}
			<motion.div
				className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-34 sm:pt-36 pb-16 sm:pb-28 md:pb-16 md:py-14 relative z-10 h-full flex flex-col justify-center items-center"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
			>
				{/* Titre principal avec animation améliorée */}
				<motion.div variants={itemVariants} className="mb-6">
					<motion.h1
						className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-bold tracking-tight leading-[1.1] md:leading-[1.1] text-foreground"
						aria-label="Factly, gérez votre entreprise simplement."
					>
						Factly,{" "}
						<Highlight className="text-foreground">
							gérez votre entreprise
						</Highlight>{" "}
						simplement.
					</motion.h1>
				</motion.div>

				{/* Description améliorée */}
				<motion.p
					className="mt-6 mb-8 text-base md:text-xl text-muted-foreground max-w-xs sm:max-w-2xl mx-auto font-light"
					variants={itemVariants}
				>
					Plateforme complète de gestion d&apos;entreprise : facturation,
					clients, inventaire et analyses financières pour optimiser votre
					productivité au quotidien.
				</motion.p>

				{/* Avantages clés en ligne - version 2025 */}
				<motion.div
					className="flex flex-wrap justify-center gap-5 mb-8"
					variants={itemVariants}
					aria-label="Principales fonctionnalités"
				>
					{advantages.map((advantage, idx) => (
						<motion.div
							key={idx}
							className="flex items-center gap-2 text-sm text-foreground/80 bg-background/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
							whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(0,0,0,0.06)" }}
							transition={{ duration: 0.2 }}
							aria-label={advantage.text}
						>
							{advantage.icon}
							<span>{advantage.text}</span>
						</motion.div>
					))}
				</motion.div>

				{/* Boutons d'action - design 2025 avec CTA primaire et secondaire */}
				<motion.div
					className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 sm:mt-10 w-full"
					variants={itemVariants}
				>
					{/* CTA Primaire */}
					<motion.div
						whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
						whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
						className="w-full sm:max-w-md relative overflow-hidden"
					>
						<Button
							size="lg"
							asChild
							variant="gradient"
							className="w-full h-12 rounded-full"
						>
							<Link
								href="/login"
								aria-label="Commencer à utiliser Factly maintenant"
							>
								<motion.span
									className="absolute inset-0 bg-white/10 rounded-full transform-gpu"
									initial={{ scale: 0, opacity: 0 }}
									whileHover={
										prefersReducedMotion ? {} : { scale: 1.5, opacity: 0.4 }
									}
									transition={{ duration: 0.5 }}
								/>
								Commencer maintenant
								<ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
							</Link>
						</Button>

						{/* Effet pulse autour du bouton principal */}
						<div className="absolute -inset-0.5 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300 z-[-1]" />
					</motion.div>
				</motion.div>

				{/* Micro données structurées pour SEO */}
			</motion.div>
		</>
	);

	if (isDark) {
		return (
			<BackgroundLines
				className="flex items-center justify-center w-full min-h-[100vh]"
				svgOptions={{
					duration: 10,
				}}
			>
				{heroContent}
			</BackgroundLines>
		);
	}

	return (
		<div className="flex items-center justify-center w-full min-h-[100vh]">
			{heroContent}
		</div>
	);
}
