import { Civility, ClientStatus, ClientType, LegalForm } from "@prisma/client";
import { z } from "zod";

const ClientSchema = z.object({
	id: z.string().optional(),
	organizationId: z.string(),
	clientType: z.nativeEnum(ClientType),
	status: z.nativeEnum(ClientStatus),
	reference: z.string().min(1, "La référence est requise"),
	name: z.string().min(1, "Le nom est requis"),
	email: z.string().email("L'email n'est pas valide").optional().nullable(),
	phone: z.string().optional().nullable(),
	website: z.string().url("L'URL n'est pas valide").optional().nullable(),
	civility: z.nativeEnum(Civility).optional().nullable(),
	siren: z.string().optional().nullable(),
	siret: z.string().optional().nullable(),
	vatNumber: z.string().optional().nullable(),
	legalForm: z.nativeEnum(LegalForm).optional().nullable(),
});

export default ClientSchema;
