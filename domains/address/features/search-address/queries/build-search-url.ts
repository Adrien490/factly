import { BASE_ADRESSE_API_URL, DEFAULT_LIMIT } from "../constants";
import { SearchAddressParams } from "../types";

export /**
 * Construit l'URL de recherche à partir des paramètres
 * @param params Paramètres de recherche d'adresse
 * @returns L'URL complète pour l'API
 */
const buildSearchUrl = (params: SearchAddressParams): string => {
	try {
		const searchParams = new URLSearchParams();

		// Nettoyage et encodage de la requête
		let query = params.query.trim();

		// Vérification que la requête commence par un chiffre ou une lettre
		// Si ce n'est pas le cas, on essaie de trouver le premier caractère valide
		if (!/^[a-zA-Z0-9]/.test(query)) {
			const match = query.match(/[a-zA-Z0-9]/);
			if (match && match.index !== undefined) {
				// On démarre la requête à partir du premier caractère valide
				query = query.substring(match.index);
				console.info(
					"[buildSearchUrl] Requête ajustée pour commencer par un caractère valide:",
					query
				);
			} else {
				// Aucun caractère valide trouvé, on utilise une chaîne par défaut
				query = "adresse";
				console.warn(
					"[buildSearchUrl] Aucun caractère valide trouvé dans la requête, utilisation d'une valeur par défaut"
				);
			}
		}

		// Vérification finale de la longueur
		if (query.length < 3) {
			console.warn(
				"[buildSearchUrl] Requête trop courte après nettoyage, pas d'appel API effectué"
			);
			throw new Error("Requête trop courte (< 3 caractères)");
		}

		searchParams.append("q", query);

		// Paramètre limit
		searchParams.append(
			"limit",
			params.limit?.toString() || DEFAULT_LIMIT.toString()
		);

		// Paramètre type (filtre sur le type de résultat)
		if (params.type) {
			searchParams.append("type", params.type);
		}

		// Filtre par code postal
		if (params.postcode) {
			searchParams.append("postcode", params.postcode);
		}

		// Filtre par code INSEE
		if (params.citycode) {
			searchParams.append("citycode", params.citycode);
		}

		// Paramètres de géolocalisation pour la priorité
		if (params.lat !== undefined && params.lon !== undefined) {
			searchParams.append("lat", params.lat.toString());
			searchParams.append("lon", params.lon.toString());
		}

		// Désactiver l'autocomplétion si spécifié
		if (params.autocomplete === false) {
			searchParams.append("autocomplete", "0");
		}

		// Utiliser une URL de base valide
		const baseUrl =
			BASE_ADRESSE_API_URL || "https://api-adresse.data.gouv.fr/search";

		// Nettoyer l'URL de base
		const cleanBaseUrl = baseUrl.replace(/\/+$/, ""); // Supprime les slashes finaux

		// Construire l'URL finale
		const separator = cleanBaseUrl.includes("?") ? "&" : "?";
		const url = `${cleanBaseUrl}${separator}${searchParams.toString()}`;

		console.log("[buildSearchUrl] URL de recherche:", url);
		return url;
	} catch (error) {
		console.error(
			"[buildSearchUrl] Erreur lors de la construction de l'URL:",
			error
		);
		// Fallback sur une URL basique en cas d'erreur
		return `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(
			params.query
		)}`;
	}
};
