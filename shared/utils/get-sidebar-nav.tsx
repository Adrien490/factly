import { getClientNavigation } from "@/domains/client/utils";
import { getProductNavigation } from "@/domains/product/utils";
import { getSupplierNavigation } from "@/domains/supplier/utils";
import {
	BarChart3,
	Building2,
	LayoutDashboard,
	Package,
	Settings,
	ShoppingCart,
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
		sectionDescription: "Cœur de l'activité commerciale",
		items: [
			{
				title: "Clients",
				url: `/dashboard/clients`,
				icon: Users,
				items: getClientNavigation(),
			},
			{
				title: "Fournisseurs",
				url: `/dashboard/suppliers`,
				icon: Truck,
				items: getSupplierNavigation(),
			},
		],
	},

	// 2. CATALOGUE - Gestion des produits et services
	{
		title: "Catalogue",
		icon: Package,
		isSection: true,
		sectionDescription: "Gestion des produits et services",
		items: [
			{
				title: "Produits",
				url: `/dashboard/products`,
				items: getProductNavigation(),
			},
			{
				title: "Catégories",
				url: `/dashboard/products/categories`,
			},
			/*{
				title: "Prix et tarification",
				url: `/dashboard/products/pricing`,
			},*/
		],
	},

	// 3. ADMINISTRATION - Gestion interne et configuration
	{
		title: "Administration",
		icon: Settings,
		isSection: true,
		sectionDescription: "Gestion interne et configuration",
		items: [
			{
				title: "Équipe",
				icon: UserCheck,
				items: [
					{
						title: "Utilisateurs",
						url: `/dashboard/admin/users`,
					},
					{
						title: "Rôles et permissions",
						url: `/dashboard/admin/permissions`,
					},
					/*{
						title: "Groupes de travail",
						url: `/dashboard/admin/groups`,
					},*/
				],
			},
			{
				title: "Configuration",
				icon: Building2,
				items: [
					{
						title: "Entreprise",
						url: `/dashboard/admin/company`,
					},
					{
						title: "Années fiscales",
						url: `/dashboard/fiscal-years`,
					},
					/*{
						title: "Paramètres généraux",
						url: `/dashboard/admin/settings`,
					},*/
				],
			},
		],
	},

	// 4. RAPPORTS & ANALYTICS - Tableaux de bord et statistiques
	{
		title: "Rapports & Analytics",
		icon: BarChart3,
		isSection: true,
		sectionDescription: "Tableaux de bord et statistiques",
		items: [
			/*{
				title: "Rapports commerciaux",
				url: `/dashboard/reports/commercial`,
			},
			{
				title: "Analytics clients",
				url: `/dashboard/reports/clients`,
			},
			{
				title: "Performance produits",
				url: `/dashboard/reports/products`,
			},*/
		],
	},
];
