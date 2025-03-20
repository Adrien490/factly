import { z } from "zod";

const DeleteInvitationSchema = z.object({
	id: z.string().min(1, "L'ID de l'invitation est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});

export type DeleteInvitationSchemaType = z.infer<typeof DeleteInvitationSchema>;

export default DeleteInvitationSchema;
