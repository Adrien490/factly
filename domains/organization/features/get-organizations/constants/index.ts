import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour les organisations
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_ORGANIZATIONS_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	name: true,
	legalName: true,
	logoUrl: true,
	legalForm: true,

	// Informations fiscales
	siren: true,
	siret: true,
	vatNumber: true,
	intracomVatNumber: true,

	// Informations financières
	capitalAmount: true,

	// Informations de contact
	email: true,
	phone: true,
	website: true,

	// Adresse complète
	addressLine1: true,
	addressLine2: true,
	city: true,
	postalCode: true,
	region: true,
	country: true,

	// Paramètres TVA
	vatMethod: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,

	// Relations
	members: {
		select: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
		},
	},

	// Statistiques importantes
	/*_count: {
		select: {
			clients: true,
			invoices: true,
			quotes: true,
			fiscalYears: true,
		},
	},*/
} satisfies Prisma.OrganizationSelect;

export const ORGANIZATION_SORTABLE_FIELDS = ["name", "createdAt"] as const;

export const ORGANIZATION_SORT_OPTIONS = ORGANIZATION_SORTABLE_FIELDS.map(
	(field) => ({
		label:
			field === "createdAt"
				? "Date de création"
				: field === "name"
				? "Nom"
				: field,
		value: field,
	})
);
