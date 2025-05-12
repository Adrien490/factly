/**
 * Génère un slug à partir d'une chaîne de caractères
 * Support multilingue (français, anglais, etc.)
 *
 * @param text - Le texte à convertir en slug
 * @param options - Options de configuration
 * @returns Le slug généré
 *
 * @example
 * generateSlug("Mon Entreprise") // "mon-entreprise"
 * generateSlug("Éléphant & Co.") // "elephant-co"
 * generateSlug("Hello World!", { separator: "_" }) // "hello_world"
 */
export function generateSlug(
	text: string,
	options: {
		separator?: string;
		lowercase?: boolean;
		removeSpecialChars?: boolean;
	} = {}
): string {
	const {
		separator = "-",
		lowercase = true,
		removeSpecialChars = true,
	} = options;

	// Normalisation Unicode (NFKD) pour décomposer les caractères accentués
	let slug = text.normalize("NFKD");

	// Conversion en minuscules si demandé
	if (lowercase) {
		slug = slug.toLowerCase();
	}

	// Remplacement des caractères spéciaux
	if (removeSpecialChars) {
		// Suppression des caractères diacritiques (accents)
		slug = slug.replace(/[\u0300-\u036f]/g, "");
		// Remplacement des caractères spéciaux par le séparateur
		slug = slug.replace(/[^a-z0-9]+/g, separator);
		// Suppression des séparateurs multiples
		slug = slug.replace(new RegExp(`${separator}+`, "g"), separator);
		// Suppression des séparateurs au début et à la fin
		slug = slug.replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
	}

	return slug;
}

/**
 * Génère un slug unique avec un timestamp et une chaîne aléatoire
 *
 * @param text - Le texte de base pour le slug
 * @param options - Options de configuration
 * @returns Le slug unique généré
 *
 * @example
 * generateUniqueSlug("Mon Entreprise") // "mon-entreprise-ln7x2k-abc123"
 */
export function generateUniqueSlug(
	text: string,
	options: {
		separator?: string;
		lowercase?: boolean;
		removeSpecialChars?: boolean;
	} = {}
): string {
	const baseSlug = generateSlug(text, options);
	const timestamp = Date.now().toString(36);
	const randomString = Math.random().toString(36).substring(2, 8);
	const separator = options.separator || "-";

	return `${baseSlug}${separator}${timestamp}${separator}${randomString}`;
}
