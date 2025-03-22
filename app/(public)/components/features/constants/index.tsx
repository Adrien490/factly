import {
	Building2,
	FileBarChart,
	PackageCheck,
	Receipt,
	Users,
} from "lucide-react";

export const features = [
	{
		title: "Application multi tenants",
		description:
			"Gérez plusieurs entreprises sur une seule plateforme avec une isolation complète des données et une expérience personnalisée.",
		icon: <Building2 className="h-5 w-5 text-primary" />,
		benefits: [
			"Isolation des données",
			"Interface personnalisable",
			"Administration centralisée",
		],
	},
	{
		title: "Gestion des partenaires commerciaux",
		description:
			"Centralisez et organisez tous vos contacts professionnels, clients, fournisseurs et prospects pour optimiser vos relations commerciales.",
		icon: <Users className="h-5 w-5 text-primary" />,
		benefits: [
			"Clients et fournisseurs",
			"Historique complet",
			"Segmentation avancée",
		],
	},
	{
		title: "Gestion financière complète",
		description:
			"Créez et suivez vos devis, factures et paiements dans un flux de travail intégré et efficace pour optimiser votre cycle de vente.",
		icon: <Receipt className="h-5 w-5 text-primary" />,
		benefits: [
			"Devis et facturation",
			"Suivi des paiements",
			"Relances automatiques",
		],
	},
	{
		title: "Suivi comptable",
		description:
			"Préparez votre comptabilité avec des outils de suivi fiscal et des exercices comptables bien structurés.",
		icon: <FileBarChart className="h-5 w-5 text-primary" />,
		benefits: [
			"Années fiscales",
			"Rapports détaillés",
			"Export pour experts-comptables",
		],
	},
	{
		title: "Gestion des produits et de l'inventaire",
		description:
			"Organisez votre catalogue de produits et services avec un suivi en temps réel des stocks et un contrôle précis de votre inventaire.",
		icon: <PackageCheck className="h-5 w-5 text-primary" />,
		benefits: [
			"Suivi des stocks",
			"Catalogues multiples",
			"Alertes de réapprovisionnement",
		],
	},
] as const;
