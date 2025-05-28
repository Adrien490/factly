import {
	Box,
	Building2,
	Handshake,
	LayoutDashboard,
	Package,
	Receipt,
	Settings,
	ShoppingCart,
	Tags,
	Truck,
	UserCheck,
	Users,
} from "lucide-react";

export const getSidebarNav = () => [
	// Dashboard principal
	{
		title: "Tableau de bord",
		url: `/dashboard`,
		icon: LayoutDashboard,
	},

	// 1. COMMERCIAL - Cœur de l'activité commerciale
	{
		title: "Commercial",
		icon: ShoppingCart,
		isSection: true,
		items: [
			{
				title: "Clients",
				url: `/dashboard/commercial/clients`,
				icon: Users,
			},
			{
				title: "Fournisseurs",
				url: `/dashboard/commercial/suppliers`,
				icon: Truck,
			},
			/*
			{
				title: "Prospection & CRM",
				url: `/dashboard/commercial/crm`,
				icon: Target,
				items: [
					{
						title: "Prospects",
						url: `/dashboard/commercial/crm/prospects`,
					},
					{
						title: "Opportunités",
						url: `/dashboard/commercial/crm/opportunities`,
					},
					{
						title: "Pipeline commercial",
						url: `/dashboard/commercial/crm/pipeline`,
					},
				],
			},*/
		],
	},

	// 2. VENTES & ACHATS - Gestion des transactions
	{
		title: "Ventes & Achats",
		icon: Handshake,
		isSection: true,
		items: [
			{
				title: "Ventes",
				url: `/dashboard/sales/quotes`,
				icon: Receipt,
				items: [
					{
						title: "Devis",
						url: `/dashboard/sales/quotes`,
					},
					{
						title: "Commandes clients",
						url: `/dashboard/sales/orders`,
					},
					{
						title: "Factures",
						url: `/dashboard/sales/invoices`,
					},
					{
						title: "Avoirs",
						url: `/dashboard/sales/credit-notes`,
					},
				],
			},
			/*
			{
				title: "Achats",
				url: `/dashboard/purchases`,
				icon: ShoppingCart,
				items: [
					{
						title: "Demandes d'achat",
						url: `/dashboard/purchases/requests`,
					},
					{
						title: "Commandes fournisseurs",
						url: `/dashboard/purchases/orders`,
					},
					{
						title: "Factures fournisseurs",
						url: `/dashboard/purchases/invoices`,
					},
				],
			},*/
			/*
			{
				title: "Livraisons",
				url: `/dashboard/logistics/deliveries`,
				icon: Truck,
			},
			*/
		],
	},

	// 3. CATALOGUE & STOCK - Gestion des produits et inventaire
	{
		title: "Catalogue & Stock",
		icon: Package,
		isSection: true,
		items: [
			{
				title: "Produits",
				url: `/dashboard/catalog/products`,
				icon: Box,
			},
			{
				title: "Catégories",
				url: `/dashboard/catalog/categories`,
				icon: Tags,
			},
			/*
			{
				title: "Gestion des stocks",
				icon: Warehouse,
				items: [
					{
						title: "Stock actuel",
						url: `/dashboard/inventory/stock`,
					},
					{
						title: "Mouvements de stock",
						url: `/dashboard/inventory/movements`,
					},
					{
						title: "Inventaires",
						url: `/dashboard/inventory/counts`,
					},
					{
						title: "Alertes stock",
						url: `/dashboard/inventory/alerts`,
					},
				],
			},
			{
				title: "Prix et tarification",
				url: `/dashboard/catalog/pricing`,
			},
			*/
		],
	},

	/* 4. FINANCE & COMPTABILITÉ - Gestion financière
	{
		title: "Finance & Comptabilité",
		icon: Calculator,
		isSection: true,
		sectionDescription: "Gestion financière et comptable",
		items: [
			{
				title: "Comptabilité",
				icon: FileText,
				items: [
					{
						title: "Plan comptable",
						url: `/dashboard/accounting/chart-of-accounts`,
					},
					{
						title: "Écritures comptables",
						url: `/dashboard/accounting/journal-entries`,
					},
					{
						title: "Grand livre",
						url: `/dashboard/accounting/general-ledger`,
					},
					{
						title: "Balance comptable",
						url: `/dashboard/accounting/trial-balance`,
					},
				],
			},
			{
				title: "Trésorerie",
				icon: CreditCard,
				items: [
					{
						title: "Comptes bancaires",
						url: `/dashboard/treasury/bank-accounts`,
					},
					{
						title: "Paiements clients",
						url: `/dashboard/treasury/customer-payments`,
					},
					{
						title: "Paiements fournisseurs",
						url: `/dashboard/treasury/supplier-payments`,
					},
					{
						title: "Rapprochements bancaires",
						url: `/dashboard/treasury/bank-reconciliation`,
					},
				],
			},
			{
				title: "Budget & Prévisions",
				url: `/dashboard/finance/budget`,
				icon: PieChart,
			},
		],
	},*/

	/* 5. RAPPORTS & ANALYTICS - Tableaux de bord et statistiques
	{
		title: "Rapports & Analytics",
		icon: BarChart3,
		isSection: true,
		sectionDescription: "Tableaux de bord et analyses",
		items: [
			{
				title: "Rapports commerciaux",
				icon: TrendingUp,
				items: [
					{
						title: "Chiffre d'affaires",
						url: `/dashboard/reports/sales/revenue`,
					},
					{
						title: "Performance commerciale",
						url: `/dashboard/reports/sales/performance`,
					},
					{
						title: "Analyse des marges",
						url: `/dashboard/reports/sales/margins`,
					},
				],
			},
			{
				title: "Analytics clients",
				url: `/dashboard/reports/customers`,
				items: [
					{
						title: "Segmentation clients",
						url: `/dashboard/reports/customers/segmentation`,
					},
					{
						title: "Fidélisation",
						url: `/dashboard/reports/customers/retention`,
					},
					{
						title: "Valeur vie client",
						url: `/dashboard/reports/customers/lifetime-value`,
					},
				],
			},
			{
				title: "Performance produits",
				url: `/dashboard/reports/products`,
				items: [
					{
						title: "Meilleures ventes",
						url: `/dashboard/reports/products/best-sellers`,
					},
					{
						title: "Rotation des stocks",
						url: `/dashboard/reports/products/inventory-turnover`,
					},
				],
			},
			{
				title: "Rapports financiers",
				url: `/dashboard/reports/financial`,
				items: [
					{
						title: "Bilan",
						url: `/dashboard/reports/financial/balance-sheet`,
					},
					{
						title: "Compte de résultat",
						url: `/dashboard/reports/financial/income-statement`,
					},
					{
						title: "Flux de trésorerie",
						url: `/dashboard/reports/financial/cash-flow`,
					},
				],
			},
		],
	},*/

	// 6. ADMINISTRATION - Gestion interne et configuration
	{
		title: "Administration",
		icon: Settings,
		isSection: true,
		items: [
			{
				title: "Équipe",
				url: `/dashboard/admin/users`,
				icon: UserCheck,
				items: [
					{
						title: "Utilisateurs",
						url: `/dashboard/admin/users`,
					},
					{
						title: "Rôles et permissions",
						url: `/dashboard/admin/roles`,
					},
				],
			},
			{
				title: "Configuration",
				url: `/dashboard/admin/company`,
				icon: Building2,
				items: [
					{
						title: "Entreprise",
						url: `/dashboard/admin/company`,
					},
					{
						title: "Années fiscales",
						url: `/dashboard/admin/fiscal-years`,
					},
					{
						title: "Taxes & TVA",
						url: `/dashboard/admin/taxes`,
					},
					{
						title: "Devises",
						url: `/dashboard/admin/currencies`,
					},
					{
						title: "Paramètres généraux",
						url: `/dashboard/admin/settings`,
					},
				],
			},
			/*
			{
				title: "Planification",
				icon: Calendar,
				items: [
					{
						title: "Agenda commercial",
						url: `/dashboard/admin/calendar`,
					},
					{
						title: "Tâches & rappels",
						url: `/dashboard/admin/tasks`,
					},
				],
			},
			*/
		],
	},
];
