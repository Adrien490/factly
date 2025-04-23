import { z } from "zod";

export const setFiscalYearAsDefaultSchema = z.object({
	id: z.string().min(1, "L'ID de l'année fiscale est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
