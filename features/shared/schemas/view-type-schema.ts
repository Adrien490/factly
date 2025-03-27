import { z } from "zod";

export const viewTypeSchema = z.enum(["grid", "list"]).default("grid");
