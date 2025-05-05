import { sortOrderSchema } from "@/shared/schemas";
import { ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";

export const getClientsSortFieldSchema = z.enum(["name", "createdAt"]);

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
	sortBy: getClientsSortFieldSchema.default("createdAt"),
	sortOrder: sortOrderSchema.default("desc"),
});

// Type pour les paramètres de requête des clients
