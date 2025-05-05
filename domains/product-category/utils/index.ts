/**
 * Construit le chemin URL complet pour une catégorie, en incluant tous ses parents
 * @param slug Le slug de la catégorie actuelle
 * @param parents Tableau des parents de la catégorie, du plus proche au plus éloigné
 * @returns Le chemin URL complet sous forme de string (ex: "parent-slug/child-slug")
 */
export function buildCategoryPath(
	slug: string,
	parents: Array<{ slug: string }> = []
): string {
	// Si pas de parents, retourner juste le slug actuel
	if (!parents || parents.length === 0) {
		return slug;
	}

	// Construire le chemin en partant du parent le plus éloigné vers l'enfant
	const parentSlugs = [...parents].reverse().map((parent) => parent.slug);
	return [...parentSlugs, slug].join("/");
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
	parents: Array<{ slug: string }> = []
): string {
	const path = buildCategoryPath(slug, parents);
	return `/dashboard/${organizationId}/products/categories/${path}`;
}

// Type pour représenter la structure récursive d'une catégorie
type CategoryWithParent = {
	slug: string;
	name: string;
	id: string;
	parent?: CategoryWithParent | null;
};

/**
 * Récupère un tableau de tous les parents d'une catégorie, en ordre de proximité
 * (du parent direct au parent le plus éloigné)
 * @param category La catégorie pour laquelle récupérer les parents
 * @returns Un tableau des parents, du plus proche au plus éloigné
 */
export function getCategoryAncestors(category: {
	parent?: CategoryWithParent | null;
}): Array<{ id: string; name: string; slug: string }> {
	const ancestors: Array<{ id: string; name: string; slug: string }> = [];

	// Fonction récursive pour remonter l'arbre des parents
	function addParent(currentCategory: typeof category) {
		if (currentCategory?.parent) {
			const { id, name, slug } = currentCategory.parent;
			ancestors.push({ id, name, slug });

			// Remonter au parent suivant si disponible
			if (currentCategory.parent.parent) {
				addParent(currentCategory.parent);
			}
		}
	}

	addParent(category);
	return ancestors;
}
