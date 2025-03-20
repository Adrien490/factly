import datatableSchema from "@/features/datatable/schemas/datatable-schema";
import { z } from "zod";
import clientSortableFields from "../lib/client-sortable-fields";
import clientFiltersSchema from "./client-filters-schema";

const getClientsSchema = datatableSchema(clientSortableFields).extend({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: clientFiltersSchema.default({}),
});

// Type pour les paramètres de requête des clients
export type GetClientsParams = z.infer<typeof getClientsSchema>;

export default getClientsSchema;
