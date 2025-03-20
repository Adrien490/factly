import PricingPlan from "../types/pricing-plan";

const pricingPlans: PricingPlan[] = [
	{
		id: "free",
		name: "Gratuit",
		price: {
			monthly: "0€",
			yearly: "0€",
		},
		description: "Pour les petites entreprises et les freelances qui débutent",
		features: [
			"1 entreprise",
			"Jusqu'à 100 clients",
			"Factures et devis illimités",
			"Exportation comptable basique",
			"Application mobile (accès limité)",
		],
		cta: {
			label: "Commencer gratuitement",
			href: "/login",
		},
		popular: false,
	},
	{
		id: "essential",
		name: "Essentiel",
		price: {
			monthly: "29€",
			yearly: "290€",
		},
		description:
			"Pour les entreprises en croissance qui ont besoin de plus de fonctionnalités",
		features: [
			"3 entreprises",
			"Clients illimités",
			"Factures et devis illimités",
			"Suivi des paiements avancé",
			"Exportation comptable complète",
			"Gestion de stock",
			"Application mobile complète",
			"Support prioritaire",
		],
		cta: {
			label: "Essai gratuit de 14 jours",
			href: "/login?plan=essential",
		},
		popular: true,
	},
	{
		id: "business",
		name: "Business",
		price: {
			monthly: "59€",
			yearly: "590€",
		},
		description: "Pour les entreprises établies avec des besoins complexes",
		features: [
			"Entreprises illimitées",
			"Clients illimités",
			"Factures et devis illimités",
			"Gestion avancée des utilisateurs",
			"Tableaux de bord personnalisés",
			"Intégrations API complètes",
			"Support dédié",
			"Formation personnalisée",
		],
		cta: {
			label: "Essai gratuit de 14 jours",
			href: "/login?plan=business",
		},
		popular: false,
	},
];

export default pricingPlans;
