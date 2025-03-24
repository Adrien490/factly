import { viewTypeSchema } from "@/shared/components/view-toggle/schemas";
import { z } from "zod";

/**
 * Représente les types de vue disponibles dans l'application
 */
export type ViewType = z.infer<typeof viewTypeSchema>;
