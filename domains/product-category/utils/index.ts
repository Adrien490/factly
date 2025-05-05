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

// Type pour représenter la structure récursive d'une catégorie
type CategoryWithParent = {
	readonly slug: string;
	readonly name: string;
	readonly id: string;
	readonly parent?: CategoryWithParent | null;
};

/**
 * Récupère un tableau de tous les parents d'une catégorie, en ordre de proximité
 * (du parent direct au parent le plus éloigné)
 * Implémentation itérative pour éviter les problèmes de pile d'appels récursifs
 * @param category La catégorie pour laquelle récupérer les parents
 * @returns Un tableau des parents, du plus proche au plus éloigné
 */
export function getCategoryAncestors(category: {
	parent?: CategoryWithParent | null;
}): ReadonlyArray<{ id: string; name: string; slug: string }> {
	// Tableau pour stocker les ancêtres
	const ancestors: Array<{ id: string; name: string; slug: string }> = [];

	// Approche itérative avec une boucle while au lieu de récursion
	let currentCategory = category;

	while (currentCategory?.parent) {
		const { id, name, slug } = currentCategory.parent;
		// Ajouter l'ancêtre au tableau
		ancestors.push({ id, name, slug });
		// Passer au parent suivant
		currentCategory = { parent: currentCategory.parent.parent };
	}

	// Retourner le tableau en lecture seule pour garantir l'immutabilité
	return Object.freeze([...ancestors]);
}
