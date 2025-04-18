import {
	Building2,
	CalendarClock,
	LayoutDashboard,
	Truck,
	Users,
} from "lucide-react";

export const navItems = (organizationId: string) => [
	{
		title: "Tableau de bord",
		url: `/dashboard/${organizationId}`,
		icon: LayoutDashboard,
	},
	{
		title: "Clients",
		icon: Users,
		url: `/dashboard/${organizationId}/clients`,
		items: [
			{
				title: "Liste des clients",
				url: `/dashboard/${organizationId}/clients`,
			},
			{
				title: "Ajouter un client",
				url: `/dashboard/${organizationId}/clients/new`,
			},
		],
	},
	{
		title: "Fournisseurs",
		icon: Truck,
		url: `/dashboard/${organizationId}/suppliers`,
		items: [
			{
				title: "Liste des fournisseurs",
				url: `/dashboard/${organizationId}/suppliers`,
			},
			{
				title: "Ajouter un fournisseur",
				url: `/dashboard/${organizationId}/suppliers/new`,
			},
		],
	},
	/*{
		title: "Catalogue",
		icon: Package,
		items: [
			{
				title: "Produits",
				url: `/dashboard/${organizationId}/products`,
			},
			{
				title: "Ajouter un produit",
				url: `/dashboard/${organizationId}/products/new`,
			},
			{
				title: "Catégories",
				url: `/dashboard/${organizationId}/products/categories`,
			},
			{
				title: "Taux de TVA",
				url: `/dashboard/${organizationId}/products/tax-rates`,
			},
		],
	},*/
	/*{
		title: "Devis",
		icon: FileText,
		items: [
			{
				title: "Liste des devis",
				url: `/dashboard/${organizationId}/quotes`,
			},
			{
				title: "Créer un devis",
				url: `/dashboard/${organizationId}/quotes/new`,
			},
		],
	},*/
	/*{
		title: "Facturation",
		icon: Receipt,
		items: [
			{
				title: "Liste des factures",
				url: `/dashboard/${organizationId}/invoices`,
			},
			{
				title: "Créer une facture",
				url: `/dashboard/${organizationId}/invoices/new`,
			},
			{
				title: "Paiements",
				url: `/dashboard/${organizationId}/invoices/payments`,
			},
		],
	},
	{
		title: "Stock",
		icon: Warehouse,
		items: [
			{
				title: "Inventaire",
				url: `/dashboard/${organizationId}/inventory`,
			},
			{
				title: "Entrepôts",
				url: `/dashboard/${organizationId}/warehouses`,
			},
			{
				title: "Mouvements de stock",
				url: `/dashboard/${organizationId}/stock-movements`,
			},
		],
	},*/
	{
		title: "Années fiscales",
		icon: CalendarClock,
		items: [
			{
				title: "Vue d'ensemble",
				url: `/dashboard/${organizationId}/fiscal-years`,
			},
			{
				title: "Nouvel exercice",
				url: `/dashboard/${organizationId}/fiscal-years/new`,
			},
			/*{
				title: "Procédure de clôture",
				url: `/dashboard/${organizationId}/fiscal-years/closing`,
			},*/
			/*{
				title: "Documents comptables",
				url: `/dashboard/${organizationId}/fiscal-years/documents`,
			},*/
		],
	},
	/*{
		title: "Comptabilité",
		icon: Calculator,
		items: [
			/*{
				title: "Rapports financiers",
				url: `/dashboard/${organizationId}/accounting/reports`,
			},*/
	/*{
				title: "Gestion TVA",
				url: `/dashboard/${organizationId}/accounting/vat`,
			},
			{
				title: "Export comptable",
				url: `/dashboard/${organizationId}/accounting/export`,
			},
		],
	},*/
	/*{
		title: "Analytique",
		icon: BarChart3,
		items: [
			{
				title: "Tableaux de bord",
				url: `/dashboard/${organizationId}/analytics/dashboards`,
			},
			{
				title: "Analyse des ventes",
				url: `/dashboard/${organizationId}/analytics/sales`,
			},
			{
				title: "Analyse clients",
				url: `/dashboard/${organizationId}/analytics/clients`,
			},
			{
				title: "Analyse fournisseurs",
				url: `/dashboard/${organizationId}/analytics/suppliers`,
			},
		],
	},*/
	{
		title: "Organisation",
		icon: Building2,
		items: [
			/*{
				title: "Informations légales",
				url: `/dashboard/${organizationId}/legal`,
			},*/
			{
				title: "Membres",
				url: `/dashboard/${organizationId}/members`,
			},
			{
				title: "Invitations",
				url: `/dashboard/${organizationId}/invitations`,
			},
		],
	},
	/*{
		title: "Paiements",
		icon: CreditCard,
		items: [
			{
				title: "Méthodes de paiement",
				url: `/dashboard/${organizationId}/payments/methods`,
			},
			{
				title: "Transactions",
				url: `/dashboard/${organizationId}/payments/transactions`,
			},
			{
				title: "Coordonnées bancaires",
				url: `/dashboard/${organizationId}/payments/bank-details`,
			},
		],
	},*/
	/*{
		title: "Facturation électronique",
		icon: FileSpreadsheet,
		items: [
			{
				title: "Configuration",
				url: `/dashboard/${organizationId}/e-invoicing/config`,
			},
			{
				title: "Connexion PPF/PDP",
				url: `/dashboard/${organizationId}/e-invoicing/platforms`,
			},
			{
				title: "Statut des transmissions",
				url: `/dashboard/${organizationId}/e-invoicing/status`,
			},
			{
				title: "Archivage électronique",
				url: `/dashboard/${organizationId}/e-invoicing/archive`,
			},
		],
	},*/
	/*{
		title: "Sécurité",
		icon: ShieldCheck,
		items: [
			{
				title: "Authentification",
				url: `/dashboard/${organizationId}/security/auth`,
			},
			{
				title: "Passkeys",
				url: `/dashboard/${organizationId}/security/passkeys`,
			},
			{
				title: "Journaux d'activité",
				url: `/dashboard/${organizationId}/security/logs`,
			},
			{
				title: "Sauvegardes",
				url: `/dashboard/${organizationId}/security/backups`,
			},
		],
	},*/
	/*{
		title: "Paramètres",
		icon: Settings,
		items: [
			{
				title: "Informations générales",
				url: `/dashboard/${organizationId}/settings/general`,
			},
			/*{
				title: "Numérotation",
				url: `/dashboard/${organizationId}/settings/numbering`,
			},*/
	/*{
				title: "Mentions légales",
				url: `/dashboard/${organizationId}/settings/legal-notices`,
			},*/
	/*{
				title: "Intégrations",
				url: `/dashboard/${organizationId}/settings/integrations`,
			},*/
	/*],
	},*/
];
