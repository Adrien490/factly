/**
 * Sélection par défaut des champs pour un fournisseur
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_SUPPLIER_DEFAULT_SELECT = {
	id: true,
	organizationId: true,
	reference: true,
	name: true,
	legalName: true,
	email: true,
	phone: true,
	website: true,
	supplierType: true,
	status: true,
	siren: true,
	siret: true,
	vatNumber: true,
	notes: true,
	createdAt: true,
	updatedAt: true,

	// Informations ESG (2025)
	esgScore: true,
	carbonFootprint: true,
	localSupplier: true,
	sustainabilityCertifications: true,

	addresses: {
		select: {
			id: true,
			addressLine1: true,
			addressLine2: true,
			postalCode: true,
			city: true,
			country: true,
			latitude: true,
			longitude: true,
			isDefault: true,
			addressType: true,
		},
	},

	contacts: {
		select: {
			id: true,
			civility: true,
			firstName: true,
			lastName: true,
			email: true,
			phone: true,
			title: true,
			isDefault: true,
		},
	},
} as const;
