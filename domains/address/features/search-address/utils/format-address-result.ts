import { addressResponseSchema } from "../schemas";
import { FormattedAddressResult } from "../types";

/**
 * Formate les résultats de la recherche d'adresse
 * @param data Données non validées
 * @returns Les résultats formatés
 */
export const formatAddressResults = (
	data: unknown
): FormattedAddressResult[] => {
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
