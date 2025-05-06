import { sortOrderSchema } from "@/shared/schemas";
import { ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";
import {
	GET_CLIENTS_DEFAULT_SORT_BY,
	GET_CLIENTS_DEFAULT_SORT_ORDER,
	GET_CLIENTS_SORT_FIELDS,
} from "../constants";

const filterValueSchema = z.union([
	// Valeurs uniques (chaînes)
	z.nativeEnum(ClientStatus),
	z.nativeEnum(ClientType),
	z.string(),

	// Tableaux de valeurs
	z.array(z.nativeEnum(ClientStatus)),
	z.array(z.nativeEnum(ClientType)),
	z.array(z.string()),
]);

// Le schéma accepte désormais des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const clientFiltersSchema = z.record(filterValueSchema);

export const getClientsSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: clientFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: z
		.preprocess((val) => {
			return typeof val === "string" &&
				GET_CLIENTS_SORT_FIELDS.includes(
					val as (typeof GET_CLIENTS_SORT_FIELDS)[number]
				)
				? val
				: GET_CLIENTS_DEFAULT_SORT_BY;
		}, z.enum(GET_CLIENTS_SORT_FIELDS))
		.default(GET_CLIENTS_DEFAULT_SORT_BY),
	sortOrder: sortOrderSchema.default(GET_CLIENTS_DEFAULT_SORT_ORDER),
});

// Type pour les paramètres de requête des clients
