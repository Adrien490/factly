"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import PageContainer from "@/components/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import pricingPlans from "../lib/pricing-plans";
import { PricingItem } from "./pricing-item";

// Définition des plans de tarification

export function Pricing() {
	const sectionRef = useRef<HTMLElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const contactRef = useRef<HTMLDivElement>(null);

	// Effets de parallaxe similaires à ceux de hero.tsx
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const titleY = useTransform(scrollYProgress, [0, 1], [50, -50]);
	const cardsY = useTransform(scrollYProgress, [0, 1], [100, 0]);

	// Variantes d'animation pour les conteneurs et éléments
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.05,
			},
		},
	};

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

	return (
		<section
			id="pricing"
			ref={sectionRef}
			className="relative overflow-hidden py-24 md:py-32 bg-background"
		>
			<PageContainer className="relative z-10">
				{/* Header Section with improved animations */}
				<motion.div
					className="text-center space-y-6 mb-16"
					ref={headerRef}
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					<motion.div variants={itemVariants} className="inline-flex">
						<Badge
							variant="outline"
							className="border-primary/20 bg-background/80 py-1.5 backdrop-blur-lg"
						>
							<Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
							<span className="text-foreground">Nos tarifs</span>
						</Badge>
					</motion.div>

					{/* Titre inspiré du style hero.tsx */}
					<motion.div style={{ y: titleY }} variants={itemVariants}>
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
							Des tarifs adaptés à vos besoins
						</h1>
					</motion.div>

					{/* Description */}
					<motion.p
						variants={itemVariants}
						className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground"
					>
						Choisissez le plan qui correspond à vos besoins. Tous nos plans
						incluent des mises à jour régulières et un accès à notre communauté.
					</motion.p>

					{/* Avantages clés en format inline comme dans hero.tsx */}
					<motion.div
						className="flex flex-wrap justify-center gap-5 mt-3"
						variants={itemVariants}
					>
						{["Sans engagement", "Données sécurisées", "Support réactif"].map(
							(advantage, idx) => (
								<motion.div
									key={idx}
									className="flex items-center gap-2 text-sm text-foreground/80 bg-background/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-sm"
									whileHover={{
										y: -2,
										boxShadow: "0 8px 16px rgba(0,0,0,0.06)",
									}}
									transition={{ duration: 0.2 }}
								>
									<Check className="h-3.5 w-3.5 text-primary" />
									<span>{advantage}</span>
								</motion.div>
							)
						)}
					</motion.div>
				</motion.div>

				{/* Cartes de tarification avec animation améliorée */}
				<motion.div
					style={{ y: cardsY }}
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.1 }}
					ref={cardsRef}
					className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 max-w-6xl mx-auto"
				>
					{pricingPlans.map((plan) => (
						<PricingItem key={plan.id} plan={plan} billingPeriod="monthly" />
					))}
				</motion.div>

				{/* Section FAQ / Contact */}
				<motion.div
					className="mt-20 text-center"
					ref={contactRef}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.6 }}
					transition={{ duration: 0.7, delay: 0.2 }}
				>
					<h3 className="text-xl font-medium mb-4">
						Vous avez des besoins spécifiques ?
					</h3>
					<p className="text-muted-foreground mb-6 max-w-xl mx-auto">
						Contactez notre équipe commerciale pour discuter de vos besoins et
						découvrir comment nous pouvons vous aider avec une solution
						personnalisée.
					</p>
					<motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
						<Button variant="outline" size="lg" asChild className="group">
							<Link href="/contact" className="flex items-center gap-2">
								Contacter notre équipe commerciale
								<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			</PageContainer>
		</section>
	);
}
