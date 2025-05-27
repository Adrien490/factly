import {
	BusinessSector,
	Civility,
	ClientStatus,
	ClientType,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

export const updateClientSchema = z
	.object({
		// Identifiants
		id: z.string(),
		reference: z.string().optional(),
		type: z.nativeEnum(ClientType),
		status: z.nativeEnum(ClientStatus),

		// Champs du contact
		contactCivility: z
			.string()
			.transform((val) => (val === "" ? null : val))
			.pipe(z.nativeEnum(Civility).optional().nullable()),
		contactFirstName: z.string().optional(),
		contactLastName: z.string().optional(),
		contactFunction: z.string().optional(),
		contactEmail: z.string().optional(),
		contactPhoneNumber: z.string().optional(),
		contactMobileNumber: z.string().optional(),
		contactFaxNumber: z.string().optional(),
		contactWebsite: z.string().optional(),
		contactNotes: z.string().optional(),

		// Champs de l'entreprise (optionnels)
		companyName: z.string().optional().nullable(),
		companyLegalForm: z.nativeEnum(LegalForm).optional().nullable(),
		companySiren: z.string().optional().nullable(),
		companySiret: z.string().optional().nullable(),
		companyEmail: z.string().optional().nullable(),
		companyNafApeCode: z.string().optional().nullable(),
		companyCapital: z.string().optional().nullable(),
		companyRcs: z.string().optional().nullable(),
		companyVatNumber: z.string().optional().nullable(),
		companyBusinessSector: z.nativeEnum(BusinessSector).optional().nullable(),
		companyEmployeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),
	})
	.superRefine((data, ctx) => {
		// Validation conditionnelle pour lastname si clientType est INDIVIDUAL
		if (data.type === ClientType.INDIVIDUAL && !data.contactLastName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le nom est obligatoire pour un client particulier",
				path: ["contactLastName"],
			});
		}

		// Validation conditionnelle pour companyName si clientType est COMPANY
		if (data.type === ClientType.COMPANY && !data.companyName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Le nom de l'entreprise est obligatoire pour un client entreprise",
				path: ["companyName"],
			});
		}
	});

export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
