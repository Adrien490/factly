import { z } from "zod";

export const sortOrderSchema = z.enum(["asc", "desc"]).default("asc");

export const viewTypeSchema = z.enum(["grid", "list"]).default("grid");
