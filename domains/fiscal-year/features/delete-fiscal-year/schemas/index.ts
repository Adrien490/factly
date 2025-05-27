import { z } from "zod";

export const deleteFiscalYearSchema = z.object({
	id: z.string().min(1, "L'ID de l'année fiscale est requis"),
});
