import { z } from "zod";

const SortOrderSchema = z.enum(["asc", "desc"]).default("desc");

export default SortOrderSchema;
