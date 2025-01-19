import { z } from "zod";

const deleteOrganizationFormSchema = z.object({
	id: z.string().min(1, "L'ID de l'organisation est requis"),
	confirm: z.string().min(1, "La confirmation est requise"),
});

export type DeleteOrganizationFormData = z.infer<
	typeof deleteOrganizationFormSchema
>;

export default deleteOrganizationFormSchema;
