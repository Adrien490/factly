import { z } from "zod";

const ReferenceSchema = z
	.string()
	.min(3, "La référence doit contenir au moins 3 caractères")
	.max(15, "La référence doit contenir au plus 10 caractères")
	.regex(
		/^[A-Z0-9-]+$/,
		"La référence ne peut contenir que des lettres majuscules, des chiffres et des tirets"
	);

export type ReferenceSchemaType = z.infer<typeof ReferenceSchema>;

export default ReferenceSchema;
