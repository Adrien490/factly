/**
 * Calcule les informations de pagination à partir du nombre total d'éléments
 *
 * @param total - Nombre total d'éléments
 * @param page - Page demandée (commençant à 1)
 * @param perPage - Nombre d'éléments par page
 * @returns Informations de pagination
 */
export function calculatePagination(
	total: number,
	page: number,
	perPage: number
) {
	// S'assurer que les valeurs sont valides
	const validTotal = Math.max(0, total);
	const validPerPage = Math.max(1, perPage);

	// Calculer le nombre total de pages
	const pageCount = Math.ceil(validTotal / validPerPage);

	// S'assurer que la page demandée est valide
	const validPage = Math.min(Math.max(1, page), pageCount || 1);

	// Calculer l'offset pour la requête à la base de données
	const skip = (validPage - 1) * validPerPage;

	return {
		pagination: {
			page: validPage,
			perPage: validPerPage,
			total: validTotal,
			pageCount,
		},
		skip,
		take: validPerPage,
	};
}
