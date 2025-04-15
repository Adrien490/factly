/**
 * Sélection par défaut des champs pour un client
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_CLIENT_DEFAULT_SELECT = {
	id: true,
	organizationId: true,
	reference: true,
	name: true,
	email: true,
	phone: true,
	website: true,
	clientType: true,
	status: true,
	siren: true,
	siret: true,
	vatNumber: true,
	notes: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
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
		},
		where: {
			isDefault: true,
		},
	},
} as const;
