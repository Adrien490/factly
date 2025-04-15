import { z } from "zod";

export const sortOrderSchema = z.enum(["asc", "desc"]).default("desc");

export const viewTypeSchema = z.enum(["grid", "list"]).default("grid");
