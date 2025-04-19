import { z } from "zod";
import { countSuppliersSchema } from "../schemas";

export type CountSuppliersParams = z.infer<typeof countSuppliersSchema>;
