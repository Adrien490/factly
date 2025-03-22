"use client";

import { LayoutDashboard, Users } from "lucide-react";

export const sidebarMenu = (organizationId: string) => ({
	navMain: [
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
		/*
		{
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
		},
		{
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
		},
		{
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
			title: "Comptabilité",
			icon: Calculator,
			items: [
				{
					title: "Années fiscales",
					url: `/dashboard/${organizationId}/accounting/fiscal-years`,
				},
				{
					title: "Gestion TVA",
					url: `/dashboard/${organizationId}/accounting/vat`,
				},
				{
					title: "Export comptable",
					url: `/dashboard/${organizationId}/accounting/export`,
				},
			],
		},

		{
			title: "Organisation",
			icon: Building2,
			items: [
				{
					title: "Informations légales",
					url: `/dashboard/${organizationId}/organization/legal`,
				},
				{
					title: "Membres",
					url: `/dashboard/${organizationId}/organization/members`,
				},
				{
					title: "Invitations",
					url: `/dashboard/${organizationId}/organization/invitations`,
				},
			],
		},
		{
			title: "Paramètres",
			icon: Settings,
			items: [
				{
					title: "Informations générales",
					url: `/dashboard/${organizationId}/settings/general`,
				},
				{
					title: "Facturation électronique",
					url: `/dashboard/${organizationId}/settings/e-invoicing`,
				},
				{
					title: "Numérotation",
					url: `/dashboard/${organizationId}/settings/numbering`,
				},
				{
					title: "Mentions légales",
					url: `/dashboard/${organizationId}/settings/legal-notices`,
				},
			],
		},
		*/
	],
});
