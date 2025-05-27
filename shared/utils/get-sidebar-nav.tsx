import { getClientNavigation } from "@/domains/client/utils";
import { getProductNavigation } from "@/domains/product/utils";
import { getSupplierNavigation } from "@/domains/supplier/utils";
import {
	CalendarClock,
	LayoutDashboard,
	Package,
	Settings2,
	Truck,
	Users,
} from "lucide-react";

export const getSidebarNav = () => [
	{
		title: "Tableau de bord",
		url: `/dashboard`,
		icon: LayoutDashboard,
	},
	{
		title: "Clients",
		icon: Users,
		url: `/dashboard/clients`,
		items: getClientNavigation(),
	},
	{
		title: "Fournisseurs",
		icon: Truck,
		url: `/dashboard/suppliers`,
		items: getSupplierNavigation(),
	},
	{
		title: "Catalogue",
		icon: Package,
		url: `/dashboard/products`,
		items: getProductNavigation(),
	},
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
		url: `/dashboard/fiscal-years`,
		items: [
			{
				title: "Vue d'ensemble",
				url: `/dashboard/fiscal-years`,
			},
			{
				title: "Nouvel exercice",
				url: `/dashboard/fiscal-years/new`,
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
	{
		title: "Paramètres",
		icon: Settings2,
		items: [
			{
				title: "Modifier l'entreprise",
				url: `/dashboard/company/edit`,
			},
			{
				title: "Gestion des membres",
				url: `/dashboard/members`,
			},
			{
				title: "Gestion des droits",
				url: `/dashboard/permissions`,
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
