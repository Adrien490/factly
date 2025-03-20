"use client";

import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import advantages from "../lib/advantages";

export default function Hero() {
	// Référence pour l'effet de parallaxe
	/*const { resolvedTheme } = useTheme();
	const isLightTheme = resolvedTheme === "light";*/

	// Variantes d'animation optimisées pour Core Web Vitals
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.1, // Réduit de 0.2 à 0.1 pour un affichage plus rapide
				staggerChildren: 0.1, // Réduit pour une expérience plus fluide
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24,
				duration: 0.4, // Optimisé
			},
		},
	};
	// Contenu principal qui sera utilisé dans les deux arrière-plans
	const heroContent = (
		<>
			<div id="home" className="absolute top-0 left-0"></div>

			{/* Contenu principal avec centrage amélioré */}
			<motion.div
				className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-36 pb-28 sm:pb-16 sm:py-16 md:py-14 relative z-10 h-full flex flex-col justify-center"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
			>
				{/* Titre principal avec animation améliorée */}
				<motion.div variants={itemVariants} className="mb-6">
					<motion.h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-bold tracking-tight leading-[1.1] md:leading-[1.1] text-foreground">
						Factly,{" "}
						<Highlight className="text-foreground">
							gérez votre entreprise
						</Highlight>{" "}
						simplement.
					</motion.h1>
				</motion.div>

				{/* Description améliorée */}
				<motion.p
					className="mt-6 mb-8 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-light"
					variants={itemVariants}
				>
					Optimisez votre gestion commerciale avec notre plateforme tout-en-un :
					facturation, clients, inventaire et analyses financières en un seul
					endroit.
				</motion.p>

				{/* Avantages clés en ligne - version 2025 */}
				<motion.div
					className="flex flex-wrap justify-center gap-5 mb-8"
					variants={itemVariants}
				>
					{advantages.map((advantage, idx) => (
						<motion.div
							key={idx}
							className="flex items-center gap-2 text-sm text-foreground/80 bg-background/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
							whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(0,0,0,0.06)" }}
							transition={{ duration: 0.2 }}
						>
							{advantage.icon}
							<span>{advantage.text}</span>
						</motion.div>
					))}
				</motion.div>

				{/* Boutons d'action - design 2025 */}
				<motion.div
					className="flex justify-center items-center mt-10"
					variants={itemVariants}
				>
					<motion.div
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.98 }}
						className="w-full max-w-md relative overflow-hidden"
					>
						<Button
							size="lg"
							asChild
							className="w-full h-12 rounded-full shadow-[0_10px_25px_-12px_rgba(var(--primary-rgb),0.7)] hover:shadow-[0_16px_30px_-10px_rgba(var(--primary-rgb),0.65)] bg-linear-to-r from-primary to-primary/90 hover:translate-y-[1px] transition-all duration-200 group overflow-hidden relative"
						>
							<Link href="/login">
								<motion.span
									className="absolute inset-0 bg-white/10 rounded-full transform-gpu"
									initial={{ scale: 0, opacity: 0 }}
									whileHover={{ scale: 1.5, opacity: 0.4 }}
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
			</motion.div>
		</>
	);

	return (
		<div className="relative">
			<BackgroundLines
				className="min-h-[100vh] w-full relative"
				svgOptions={{ duration: 10 }}
			>
				{heroContent}
			</BackgroundLines>

			{/* Effet de masque pour transition douce - harmonisé */}
			<div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent pointer-events-none z-20"></div>
		</div>
	);
}
