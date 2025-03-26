"use server";

import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { BASE_ADRESSE_API_URL, DEFAULT_LIMIT, MAX_RESULTS } from "../constants";
import { SearchAddressParams } from "../schemas";
import { SearchAddressReturn } from "../types";
import { buildSearchUrl } from "./build-search-url";
import { formatAddressResults } from "./format-address-result";

/**
 * Fonction interne cacheable qui interroge l'API Adresse
 * @param params Paramètres de recherche validés
 */
export async function fetchAddresses(
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
