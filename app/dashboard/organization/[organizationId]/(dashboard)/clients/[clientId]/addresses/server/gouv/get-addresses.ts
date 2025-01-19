"use server";

import { z } from "zod";

const API_URL = "https://api-adresse.data.gouv.fr/search/";

// Schéma de validation des paramètres
const searchParamsSchema = z.object({
	q: z.string().min(1, "La recherche est requise"),
	limit: z.number().optional().default(15),
	type: z
		.enum(["housenumber", "street", "locality", "municipality"])
		.optional(),
	autocomplete: z.boolean().optional().default(true),
	lat: z.number().optional(),
	lon: z.number().optional(),
	postcode: z.string().optional(),
	citycode: z.string().optional(),
});

export type AddressSearchParams = z.infer<typeof searchParamsSchema>;

export type AddressSearchResponse = {
	type: "FeatureCollection";
	version: string;
	features: Array<{
		type: "Feature";
		geometry: {
			type: "Point";
			coordinates: [number, number]; // [longitude, latitude]
		};
		properties: {
			label: string;
			score: number;
			housenumber?: string;
			id: string;
			type: "housenumber" | "street" | "locality" | "municipality";
			name: string;
			postcode: string;
			citycode: string;
			x: number;
			y: number;
			city: string;
			district?: string;
			context: string;
			importance: number;
			street?: string;
		};
	}>;
	attribution: string;
	licence: string;
	query: string;
	limit: number;
};

export type AddressSearchResult = {
	success: boolean;
	data?: AddressSearchResponse;
	error?: {
		message: string;
		details?: Record<string, string[]>;
	};
};

export async function getAddresses(
	params: AddressSearchParams
): Promise<AddressSearchResult> {
	try {
		// 1. Validation des paramètres
		const validation = searchParamsSchema.safeParse(params);

		if (!validation.success) {
			return {
				success: false,
				error: {
					message: "Paramètres invalides",
					details: validation.error.flatten().fieldErrors,
				},
			};
		}

		// 2. Construction de l'URL avec les paramètres validés
		const searchParams = new URLSearchParams();
		Object.entries(validation.data).forEach(([key, value]) => {
			if (value !== undefined) {
				searchParams.append(key, value.toString());
			}
		});

		// 3. Appel à l'API gouvernementale avec gestion du rate limit
		const response = await fetch(`${API_URL}?${searchParams.toString()}`, {
			headers: {
				Accept: "application/json",
				"User-Agent": "Factly/1.0",
			},
		});

		// 4. Gestion des erreurs HTTP
		if (!response.ok) {
			if (response.status === 429) {
				return {
					success: false,
					error: {
						message:
							"Trop de requêtes ont été effectuées. Veuillez réessayer plus tard.",
					},
				};
			}

			return {
				success: false,
				error: {
					message: "Erreur lors de la requête à l'API Adresse",
				},
			};
		}

		// 5. Parsing et validation de la réponse
		const data = (await response.json()) as AddressSearchResponse;

		// 6. Retour des résultats
		return {
			success: true,
			data,
		};
	} catch (error) {
		console.error("[GET_ADDRESSES]", error);
		return {
			success: false,
			error: {
				message:
					error instanceof Error ? error.message : "Une erreur est survenue",
			},
		};
	}
}
