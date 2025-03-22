import { ClientPriority, ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";

const updateClientSchema = z.object({
	id: z.string().min(1, "L'ID du client est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	reference: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),
	notes: z.string().optional(),
	clientType: z.nativeEnum(ClientType).optional(),
	status: z.nativeEnum(ClientStatus).optional(),
	priority: z.nativeEnum(ClientPriority).optional(),
	siren: z.string().optional(),
	siret: z.string().optional(),
	vatNumber: z.string().optional(),
});

export default updateClientSchema;
