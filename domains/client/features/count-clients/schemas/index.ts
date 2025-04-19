import { ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";

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

// Le schéma accepte des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const clientFiltersSchema = z.record(filterValueSchema);

export const countClientsSchema = z.object({
	organizationId: z.string(),
	filters: clientFiltersSchema.optional().default({}),
});
