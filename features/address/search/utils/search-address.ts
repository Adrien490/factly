"use server";

import { DEFAULT_LIMIT } from "../constants";
import {
	SearchAddressParams,
	searchAddressSchema,
} from "../schemas/search-address-schema";
import { SearchAddressReturn } from "../types";
import { fetchAddresses } from "./fetch-addresses";

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
