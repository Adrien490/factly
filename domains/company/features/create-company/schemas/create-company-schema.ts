import {
	AddressType,
	BusinessSector,
	Country,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

export const createCompanySchema = z.object({
	// Champs obligatoires
	name: z.string().min(1, "Le nom de l'entreprise est requis"),

	// Champs optionnels
	logoUrl: z.string().optional().nullable(),
	email: z.string().optional().nullable(),
	legalForm: z.nativeEnum(LegalForm).optional().nullable(),
	siret: z.string().optional().nullable(),
	siren: z.string().optional().nullable(),
	phoneNumber: z.string().optional().nullable(),
	mobileNumber: z.string().optional().nullable(),
	faxNumber: z.string().optional().nullable(),
	website: z.string().optional().nullable(),
	nafApeCode: z.string().optional().nullable(),
	capital: z.string().optional().nullable(),
	rcs: z.string().optional().nullable(),
	vatNumber: z.string().optional().nullable(),
	businessSector: z.nativeEnum(BusinessSector).optional().nullable(),
	employeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),
	isMain: z.boolean().default(false),

	// Champs d'adresse
	addressType: z.nativeEnum(AddressType).default(AddressType.HEADQUARTERS),
	addressLine1: z.string().optional().nullable(),
	addressLine2: z.string().optional().nullable(),
	postalCode: z.string().optional().nullable(),
	city: z.string().optional().nullable(),
	country: z.nativeEnum(Country).default(Country.FRANCE),
	latitude: z.number().optional().nullable(),
	longitude: z.number().optional().nullable(),
});
