import { TagType } from "@prisma/client";
import { z } from "zod";

const GetTagsSchema = z.object({
	organizationId: z.string({
		required_error: "L'ID de l'organisation est requis",
	}),
	search: z.string().optional(),
	type: z.nativeEnum(TagType).optional(),
	sortBy: z.string().optional().default("name"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export default GetTagsSchema;
export type GetTagsParams = z.infer<typeof GetTagsSchema>;
