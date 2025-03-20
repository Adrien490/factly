import { z } from "zod";

const GetPendingInvitationsCountSchema = z.object({
	email: z.string().email("L'email est invalide"),
});

export type GetPendingInvitationsCountSchemaType = z.infer<
	typeof GetPendingInvitationsCountSchema
>;

export default GetPendingInvitationsCountSchema;
