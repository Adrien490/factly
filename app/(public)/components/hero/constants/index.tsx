import { Clock, Database, Shield } from "lucide-react";

export const advantages = [
	{
		text: "Facturation automatisée",
		icon: <Clock className="h-4 w-4 text-primary" />,
	},
	{
		text: "Gestion de stock",
		icon: <Database className="h-4 w-4 text-primary" />,
	},
	{
		text: "Sécurité RGPD",
		icon: <Shield className="h-4 w-4 text-primary" />,
	},
] as const;

// Variantes d'animation optimisées pour Core Web Vitals
export const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			delayChildren: 0.1, // Réduit de 0.2 à 0.1 pour un affichage plus rapide
			staggerChildren: 0.1, // Réduit pour une expérience plus fluide
		},
	},
};

export const itemVariants = {
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
