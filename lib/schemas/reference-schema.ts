import { z } from "zod";
import { ServerActionState } from "../types/server-action";

const ReferenceSchema = z
	.string()
	.min(3, "Reference must be at least 3 characters")
	.max(15, "Reference must be at most 10 characters")
	.regex(
		/^[A-Z0-9-]+$/,
		"Reference can only contain uppercase letters, numbers, and hyphens"
	);

export type ReferenceSchemaType = z.infer<typeof ReferenceSchema>;

export default ReferenceSchema;

export type CheckReferenceInput = z.infer<typeof ReferenceSchema>;

export type CheckReferenceState = ServerActionState<CheckReferenceInput>;
