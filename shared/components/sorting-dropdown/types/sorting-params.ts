import { z } from "zod";
import { sortingSchema } from "../schemas";

export type SortingParams<T extends [string, ...string[]]> = z.infer<
	ReturnType<typeof sortingSchema<T>>
>;
