import { z } from "zod";
import SortOrderSchema from "../schemas/sort-order-schema";

export type SortOrder = z.infer<typeof SortOrderSchema>;

export default SortOrder;
