import { z } from "zod";
import { SortOrderSchema } from "../schemas";

export type SortOrder = z.infer<typeof SortOrderSchema>;

export * from "./view-type";
