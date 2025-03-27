import { datatableSchema } from "@/features/shared/components/datatable/schemas";
import { Civility, ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";
import { clientSortableFields } from "../constants/client-sortable-fields";

const filterValueSchema = z.union([
	// Valeurs uniques (chaînes)
	z.nativeEnum(ClientStatus),
	z.nativeEnum(ClientType),
	z.nativeEnum(Civility),
	z.string(),

	// Tableaux de valeurs
	z.array(z.nativeEnum(ClientStatus)),
	z.array(z.nativeEnum(ClientType)),
	z.array(z.nativeEnum(Civility)),
	z.array(z.string()),
]);

// Le schéma accepte désormais des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const clientFiltersSchema = z.record(filterValueSchema);

export const getClientsSchema = datatableSchema(clientSortableFields).extend({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: clientFiltersSchema.default({}),
});

// Type pour les paramètres de requête des clients
