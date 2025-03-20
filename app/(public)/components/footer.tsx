"use client";

import { GridPattern } from "@/components/magicui/grid-pattern";
import PageContainer from "@/components/page-container";
import Logo from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronUp, Copyright, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";

const footerLinks = [
	{
		title: "Produit",
		links: [
			{ label: "Fonctionnalités", href: "/#features" },
			{ label: "Application", href: "/#application" },
			{ label: "Tarifs", href: "/pricing" },
			{ label: "Cas d'usage", href: "/use-cases" },
			{ label: "Roadmap", href: "/roadmap" },
		],
	},
	{
		title: "Entreprise",
		links: [
			{ label: "À propos", href: "/about" },
			{ label: "Carrières", href: "/careers" },
			{ label: "Contact", href: "/contact" },
		],
	},
	{
		title: "Ressources",
		links: [
			{ label: "Documentation", href: "/docs" },
			{ label: "Guide de démarrage", href: "/getting-started" },
			{ label: "Centre d'aide", href: "/help" },
			{ label: "Statut des services", href: "/status" },
		],
	},
	{
		title: "Légal",
		links: [
			{ label: "Conditions d'utilisation", href: "/terms" },
			{ label: "Politique de confidentialité", href: "/privacy" },
			{ label: "Mentions légales", href: "/legal" },
			{ label: "Conformité RGPD", href: "/gdpr" },
		],
	},
];

interface FooterProps {
	className?: string;
}

export default function Footer({ className }: FooterProps) {
	return (
		<footer
			className={cn("relative z-10 pt-28 pb-16 overflow-hidden", className)}
		>
			{/* Éléments décoratifs modernisés */}
			<div className="absolute inset-0 z-0 opacity-40 overflow-hidden">
				<GridPattern
					width={40}
					height={40}
					x={0}
					y={0}
					strokeWidth={1.2}
					className="absolute top-0 inset-x-0 h-full text-primary/15 stroke-primary/25 fill-none [mask-image:linear-gradient(to_bottom,white_25%,transparent_80%)]"
				/>
			</div>

			{/* Bordure supérieure améliorée */}
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"></div>

			<PageContainer className="relative z-10">
				<div className="max-w-7xl mx-auto">
					{/* Logo et description - redesign épuré */}
					<div className="flex justify-center mb-16">
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="flex flex-col items-center text-center"
						>
							<Logo
								variant="default"
								size="lg"
								shape="square"
								glow="lg"
								hover="grow"
							/>
							<p className="text-muted-foreground text-sm max-w-lg mt-4 px-4">
								Simplifiez la gestion de votre entreprise grâce à notre
								plateforme tout-en-un. Factures, clients, stocks et comptabilité
								dans une interface intuitive et puissante.
							</p>
						</motion.div>
					</div>

					{/* Navigation - mise en page optimisée */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-16">
						{footerLinks.map((column, idx) => (
							<motion.div
								key={column.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
								className="flex flex-col"
							>
								<h3 className="font-medium text-foreground mb-5 text-sm relative inline-block">
									{column.title}
									<span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary/30 rounded-full"></span>
								</h3>
								<ul className="space-y-3">
									{column.links.map((link) => (
										<li key={link.label}>
											<Link
												href={link.href}
												className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 flex items-center gap-1.5 group"
											>
												{link.label}
												<ExternalLink className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
											</Link>
										</li>
									))}
								</ul>
							</motion.div>
						))}
					</div>

					{/* Barre inférieure avec copyright - design modernisé */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.7 }}
						className="border-t border-border/20 pt-8 flex justify-center"
					>
						<div className="flex items-center gap-2 text-xs text-muted-foreground/80 bg-background/30 backdrop-blur-xs px-6 py-2 rounded-full border border-white/5 shadow-2xs">
							<Copyright className="h-3.5 w-3.5" />
							<span>
								{new Date().getFullYear()} Factly. Tous droits réservés
							</span>
							<span className="flex items-center">
								<span className="mx-2 w-1 h-1 rounded-full bg-primary/50"></span>
								<Heart className="h-3 w-3 text-destructive mr-1" />
								<span>Fait avec passion en France</span>
							</span>
						</div>
					</motion.div>

					{/* Bouton de retour en haut */}
					<div className="mt-16 flex flex-col items-center">
						<motion.button
							className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5 transition-colors duration-300 text-center text-muted-foreground/70 hover:text-foreground cursor-pointer group"
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.8 }}
							whileHover={{ y: -2 }}
							aria-label="Retour en haut de page"
						>
							<ChevronUp className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
							<span className="text-xs font-medium">Retour en haut</span>
						</motion.button>
					</div>
				</div>
			</PageContainer>
		</footer>
	);
}
