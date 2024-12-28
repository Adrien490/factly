// actions/clients/types.ts
import type { ServerActionState } from "@/lib/types/server-action";
import type { Client } from "@prisma/client";
import { z } from "zod";

// Schéma de validation
export const ClientFormSchema = z.object({
	reference: z.string().min(3),
	name: z.string().min(2),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.string().optional(),
	notes: z.string().optional(),
});

// Types d'entrée/sortie
export type ClientFormInput = z.infer<typeof ClientFormSchema>;
export type ClientFormData = Pick<Client, "id">;
export type ClientFormState = ServerActionState<
	ClientFormData,
	ClientFormInput
>;
