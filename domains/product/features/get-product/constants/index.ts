/**
 * Sélection par défaut des champs pour un produit
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_PRODUCT_DEFAULT_SELECT = {
	id: true,
	organizationId: true,
	reference: true,
	name: true,
	description: true,
	status: true,
	price: true,
	vatRate: true,
	imageUrl: true,
	weight: true,
	width: true,
	height: true,
	depth: true,
	categoryId: true,
	supplierId: true,
	createdAt: true,
	updatedAt: true,
	// Relations
	category: {
		select: {
			id: true,
			name: true,
		},
	},
	supplier: {
		select: {
			id: true,
			name: true,
		},
	},
} as const;
