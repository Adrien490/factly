import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour une organisation
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_ORGANIZATION_DEFAULT_SELECT = {
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
} satisfies Prisma.OrganizationSelect;
