/**
 * Sélection par défaut des champs pour une année fiscale
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_FISCAL_YEAR_DEFAULT_SELECT = {
	id: true,
	name: true,
	description: true,
	startDate: true,
	endDate: true,
	status: true,
	isCurrent: true,
	createdAt: true,
	updatedAt: true,
} as const;
