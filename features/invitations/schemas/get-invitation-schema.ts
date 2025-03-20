import { z } from "zod";

const GetInvitationSchema = z.object({
	id: z.string().min(1, "L'ID de l'invitation est requis"),
});

export type GetInvitationSchemaType = z.infer<typeof GetInvitationSchema>;

export default GetInvitationSchema;
