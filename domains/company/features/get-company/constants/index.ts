import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour une company
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_COMPANY_DEFAULT_SELECT = {
	id: true,
	name: true,
	logoUrl: true,
	email: true,
	legalForm: true,
	siret: true,
	siren: true,
	phoneNumber: true,
	mobileNumber: true,
	faxNumber: true,
	website: true,
	nafApeCode: true,
	capital: true,
	rcs: true,
	vatNumber: true,
	businessSector: true,
	isMain: true,
	employeeCount: true,
	clientId: true,
	supplierId: true,
} as const satisfies Prisma.CompanySelect;
