import { z } from "zod";
import { sortOrderSchema } from "../schemas";

export type SortOrder = z.infer<typeof sortOrderSchema>;
