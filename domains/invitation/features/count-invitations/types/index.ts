import { z } from "zod";
import { countInvitationsSchema } from "../schemas";

export type CountInvitationsParams = z.infer<typeof countInvitationsSchema>;
