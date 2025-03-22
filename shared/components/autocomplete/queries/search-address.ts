"use server";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { addressResponseSchema } from "../schemas/address-result-schema";
import searchAddressSchema, {
	SearchAddressParams,
} from "../schemas/search-address-schema";
import { FormattedAddressResult } from "../types";

// Constants
const BASE_ADRESSE_API_URL =
	process.env.NEXT_PUBLIC_BASE_ADRESSE_API_URL ||
	"https://api-adresse.data.gouv.fr/search";
const DEFAULT_LIMIT = 5;
const MAX_RESULTS = 15;

export type SearchAddressReturn = {
	results: FormattedAddressResult[];
	metadata: {
		query: string;
		limit: number;
		attribution: string;
		licence: string;
	};
};

/**
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

/**
 * Transforme les données brutes de l'API en format utilisable par l'application
 * @param data Données brutes de l'API
 * @returns Résultats formatés
 */
const formatAddressResults = (data: unknown): FormattedAddressResult[] => {
	try {
		// Utiliser safeParse au lieu de parse pour éviter les exceptions
		const validation = addressResponseSchema.safeParse(data);

		if (!validation.success) {
			console.error(
				"[formatAddressResults] Erreur de validation:",
				validation.error
			);

			// Définir un type pour les features non validées
			type PartialFeature = {
				properties?: {
					label?: string;
					city?: string;
					postcode?: string;
					street?: string;
					housenumber?: string;
					district?: string;
					type?: string;
					id?: string;
					score?: number;
					context?: string;
				};
				geometry?: {
					coordinates?: [number, number];
				};
			};

			// Essayer de récupérer les features même en cas d'erreur de validation
			if (
				data &&
				typeof data === "object" &&
				"features" in data &&
				Array.isArray(data.features)
			) {
				console.info(
					"[formatAddressResults] Tentative de récupération des features malgré l'erreur de validation"
				);

				// Tenter de transformer les données en contournant la validation complète
				return data.features
					.filter(
						(feature: PartialFeature) =>
							feature &&
							feature.properties &&
							feature.properties.label &&
							feature.geometry &&
							feature.geometry.coordinates
					)
					.map((feature: PartialFeature) => {
						// Déterminer le type correct
						let validType:
							| "housenumber"
							| "street"
							| "locality"
							| "municipality" = "street";

						// Si le type est défini et est l'un des types valides, l'utiliser
						if (feature.properties?.type) {
							const type = feature.properties.type;
							if (
								type === "housenumber" ||
								type === "street" ||
								type === "locality" ||
								type === "municipality"
							) {
								validType = type;
							}
						}

						return {
							label: feature.properties?.label || "",
							value: feature.properties?.label || "",
							city: feature.properties?.city || "",
							postcode: feature.properties?.postcode || "",
							street: feature.properties?.street || "",
							housenumber: feature.properties?.housenumber || "",
							coordinates: feature.geometry?.coordinates || [0, 0],
							district: feature.properties?.district || "",
							type: validType,
							id: feature.properties?.id || "",
							score: feature.properties?.score || 0,
							context: feature.properties?.context || "",
						};
					});
			}

			// Si la récupération échoue, renvoyer un tableau vide
			return [];
		}

		// Si la validation réussit, utiliser les données validées
		return validation.data.features.map((feature) => ({
			label: feature.properties.label,
			value: feature.properties.label,
			city: feature.properties.city,
			postcode: feature.properties.postcode,
			street: feature.properties.street,
			housenumber: feature.properties.housenumber,
			coordinates: feature.geometry.coordinates,
			district: feature.properties.district,
			type: feature.properties.type,
			id:
				feature.properties.id ||
				`address-${feature.properties.label.replace(/\s+/g, "-")}`,
			score: feature.properties.score,
			context: feature.properties.context,
		}));
	} catch (error) {
		console.error("[formatAddressResults] Erreur inattendue:", error);
		return [];
	}
};

/**
 * Fonction interne cacheable qui interroge l'API Adresse
 * @param params Paramètres de recherche validés
 */
async function fetchAddresses(
	params: SearchAddressParams
): Promise<SearchAddressReturn> {
	"use cache";

	// Configuration du cache avec une stratégie différenciée selon le type de recherche
	// - Les recherches avec code postal sont plus stables, donc cachées plus longtemps
	// - Les recherches génériques sont plus volatiles, donc cachées moins longtemps
	if (params.postcode || params.citycode) {
		// Pour les recherches avec filtres géographiques (plus stables)
		cacheLife({ stale: 60, revalidate: 3600, expire: 86400 }); // 1min stale, 1h revalidate, 24h expire
	} else if (params.type) {
		// Pour les recherches par type spécifique
		cacheLife({ stale: 45, revalidate: 900, expire: 7200 }); // 45s stale, 15min revalidate, 2h expire
	} else {
		// Pour les recherches génériques
		cacheLife({ stale: 30, revalidate: 300, expire: 3600 }); // 30s stale, 5min revalidate, 1h expire
	}

	// Tags de cache pour invalidation ciblée selon divers critères
	// Tag principal pour la requête
	cacheTag(`address:search:${params.query}`);

	// Tags spécifiques au type de recherche
	if (params.postcode) {
		cacheTag(`address:postcode:${params.postcode}`);
	}

	if (params.citycode) {
		cacheTag(`address:citycode:${params.citycode}`);
	}

	if (params.type) {
		cacheTag(`address:type:${params.type}`);
	}

	// Tag pour les recherches géolocalisées
	if (params.lat && params.lon) {
		const geoHash = `${Math.round(params.lat * 10)}:${Math.round(
			params.lon * 10
		)}`;
		cacheTag(`address:geo:${geoHash}`);
	}

	try {
		// Vérification de la configuration API
		if (!BASE_ADRESSE_API_URL) {
			console.log(
				"[FETCH_ADDRESSES] Utilisation de l'URL par défaut: https://api-adresse.data.gouv.fr/search"
			);
		}

		// Vérification supplémentaire de la longueur de requête
		if (params.query.length < 3) {
			console.log("[FETCH_ADDRESSES] Requête trop courte (< 3 caractères)");
			return {
				results: [],
				metadata: {
					query: params.query,
					limit: DEFAULT_LIMIT,
					attribution: "API Adresse (Base Adresse Nationale)",
					licence: "ODbL 1.0",
				},
			};
		}

		// Validation des paramètres
		const validParams = {
			...params,
			limit: Math.min(Math.max(1, params.limit || DEFAULT_LIMIT), MAX_RESULTS),
		};

		console.log("[FETCH_ADDRESSES] Paramètres de recherche:", validParams);

		// Construction de l'URL et appel à l'API
		const url = buildSearchUrl(validParams);
		const response = await fetch(url, { next: { revalidate: 300 } });

		if (!response.ok) {
			console.error(
				`[FETCH_ADDRESSES] Erreur API: ${response.status} ${response.statusText}`
			);

			// Pour les erreurs 400, on récupère le détail mais on retourne un résultat vide
			if (response.status === 400) {
				const errorText = await response.text();
				console.error("[FETCH_ADDRESSES] Détails de l'erreur 400:", errorText);

				// Retourner un résultat vide plutôt que de lever une exception
				return {
					results: [],
					metadata: {
						query: params.query,
						limit: validParams.limit,
						attribution: "API Adresse (Base Adresse Nationale)",
						licence: "ODbL 1.0",
					},
				};
			}

			throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
		}

		// Récupération et validation des données
		const data = await response.json();
		const formattedResults = formatAddressResults(data);

		return {
			results: formattedResults,
			metadata: {
				query: data.query,
				limit: data.limit,
				attribution: data.attribution,
				licence: data.licence,
			},
		};
	} catch (error) {
		console.error("[FETCH_ADDRESSES]", error);
		return {
			results: [],
			metadata: {
				query: params.query,
				limit: params.limit || DEFAULT_LIMIT,
				attribution: "API Adresse (Base Adresse Nationale)",
				licence: "ODbL 1.0",
			},
		};
	}
}

/**
 * Recherche une adresse via l'API Adresse du gouvernement français
 * @param params Paramètres de recherche
 * @returns Les résultats formatés de la recherche d'adresse
 */
export async function searchAddress(
	paramsInput: Partial<SearchAddressParams>
): Promise<SearchAddressReturn> {
	try {
		// S'assurer que la requête n'est pas undefined ou vide
		if (!paramsInput.query || paramsInput.query.trim() === "") {
			console.info("[SEARCH_ADDRESS] Requête vide, pas de recherche effectuée");
			return {
				results: [],
				metadata: {
					query: "",
					limit: DEFAULT_LIMIT,
					attribution: "API Adresse (Base Adresse Nationale)",
					licence: "ODbL 1.0",
				},
			};
		}

		// Nettoyage de la requête
		const cleanQuery = paramsInput.query.trim();

		// Vérification que la requête commence par un chiffre ou une lettre
		if (!/^[a-zA-Z0-9]/.test(cleanQuery)) {
			console.info(
				"[SEARCH_ADDRESS] La requête doit commencer par un chiffre ou une lettre"
			);
			return {
				results: [],
				metadata: {
					query: cleanQuery,
					limit: DEFAULT_LIMIT,
					attribution: "API Adresse (Base Adresse Nationale)",
					licence: "ODbL 1.0",
				},
			};
		}

		// Vérification de la longueur minimale de la requête
		if (cleanQuery.length < 3) {
			console.info("[SEARCH_ADDRESS] Requête trop courte (< 3 caractères)");
			return {
				results: [],
				metadata: {
					query: cleanQuery,
					limit: DEFAULT_LIMIT,
					attribution: "API Adresse (Base Adresse Nationale)",
					licence: "ODbL 1.0",
				},
			};
		}

		// Mise à jour de la requête avec la version nettoyée
		const updatedParams = {
			...paramsInput,
			query: cleanQuery,
		};

		// Validation des paramètres d'entrée
		const validation = searchAddressSchema.safeParse(updatedParams);

		if (!validation.success) {
			console.error("[SEARCH_ADDRESS] Invalid parameters:", validation.error);
			return {
				results: [],
				metadata: {
					query: cleanQuery || "",
					limit: DEFAULT_LIMIT,
					attribution: "API Adresse (Base Adresse Nationale)",
					licence: "ODbL 1.0",
				},
			};
		}

		const params = validation.data;

		// Appel à la fonction cacheable
		return await fetchAddresses(params);
	} catch (error) {
		console.error("[SEARCH_ADDRESS]", error);
		return {
			results: [],
			metadata: {
				query: paramsInput.query || "",
				limit: DEFAULT_LIMIT,
				attribution: "API Adresse (Base Adresse Nationale)",
				licence: "ODbL 1.0",
			},
		};
	}
}
