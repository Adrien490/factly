/**
 * Construit le chemin URL complet pour une catégorie, en incluant tous ses parents
 * @param slug Le slug de la catégorie actuelle
 * @param parents Tableau des parents de la catégorie, du plus proche au plus éloigné
 * @returns Le chemin URL complet sous forme de string (ex: "parent-slug/child-slug")
 */
export function buildCategoryPath(
	slug: string,
	parents: ReadonlyArray<{ slug: string }> = []
): string {
	// Si pas de parents, retourner juste le slug actuel
	if (!parents || parents.length === 0) {
		return slug;
	}

	// Construction immutable du chemin avec reduce
	// Du parent le plus éloigné vers l'enfant
	const path = parents
		.slice() // Créer une copie pour éviter toute mutation
		.reduce<string[]>((slugs, parent, index, array) => {
			// Ajouter les slugs dans l'ordre inverse
			const reverseIndex = array.length - 1 - index;
			slugs[reverseIndex] = parent.slug;
			return slugs;
		}, new Array(parents.length));

	// Retourner le chemin complet
	return [...path, slug].join("/");
}

/**
 * Construit l'URL complète d'une catégorie, en incluant le préfixe du dashboard et l'ID de l'organisation
 * @param organizationId ID de l'organisation
 * @param slug Slug de la catégorie actuelle
 * @param parents Tableau des parents de la catégorie, du plus proche au plus éloigné
 * @returns L'URL complète vers la catégorie
 */
export function getCategoryUrl(
	organizationId: string,
	slug: string,
	parents: ReadonlyArray<{ slug: string }> = []
): string {
	const path = buildCategoryPath(slug, parents);
	return `/dashboard/${organizationId}/products/categories/${path}`;
}
