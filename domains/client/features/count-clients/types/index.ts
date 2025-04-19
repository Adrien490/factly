import { z } from "zod";
import { countClientsSchema } from "../schemas";

export type CountClientsParams = z.infer<typeof countClientsSchema>;
