import datatableSchema from "@/schemas/datatable-schema";
import { Civility, ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";

// Champs triables pour les clients
export const CLIENT_SORTABLE_FIELDS = [
	"createdAt",
	"name",
	"email",
	"reference",
	"status",
] as ["createdAt", ...string[]];

// Type pour les champs triables
export type ClientSortableField = (typeof CLIENT_SORTABLE_FIELDS)[number];

// Schéma pour les filtres spécifiques aux clients
export const clientFiltersSchema = z.record(
	z.union([
		z.nativeEnum(ClientStatus),
		z.nativeEnum(ClientType),
		z.nativeEnum(Civility),
		z.string(),
	])
);

// Schéma de base pour les requêtes de clients
const getClientsSchema = datatableSchema(CLIENT_SORTABLE_FIELDS).extend({
	organizationId: z.string(),
	status: z.nativeEnum(ClientStatus).optional(),
	filters: clientFiltersSchema.default({}),
});

// Type pour les paramètres de requête des clients
export type GetClientsQueryParams = z.infer<typeof getClientsSchema>;

export default getClientsSchema;
