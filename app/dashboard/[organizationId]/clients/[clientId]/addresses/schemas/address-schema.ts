import { AddressType, Country } from "@prisma/client";
import { z } from "zod";

const AddressSchema = z.object({
	addressType: z.nativeEnum(AddressType),
	line1: z.string().min(1, "L'adresse est requise"),
	line2: z.string().optional().nullable(),
	zipCode: z.string().min(1, "Le code postal est requis"),
	city: z.string().min(1, "La ville est requise"),
	country: z.nativeEnum(Country).default("FR"),
	isDefault: z.boolean().default(true),
});

export default AddressSchema;
