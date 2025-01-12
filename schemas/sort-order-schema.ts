import { z } from "zod";

const SortOrderSchema = z.enum(["asc", "desc"]).default("desc");
export type SortOrder = z.infer<typeof SortOrderSchema>;

export default SortOrderSchema;
