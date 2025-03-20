/**
 * Liste des champs triables pour les adresses
 * Utilisé pour les requêtes d'adresses et la validation des paramètres de tri
 */

// Liste des champs triables avec typage strict
const addressSortableFields = [
	"id",
	"addressType",
	"line1",
	"postalCode",
	"city",
	"country",
	"isDefault",
	"createdAt",
	"updatedAt",
] as const;

// Type pour les champs triables
export type AddressSortableField = (typeof addressSortableFields)[number];

export default addressSortableFields;
