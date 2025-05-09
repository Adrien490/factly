import { BusinessSector } from "@prisma/client";
import { BusinessSectorType } from "../types";

export const BUSINESS_SECTORS: BusinessSectorType[] = [
	{
		value: BusinessSector.AGRICULTURE,
		label: "Agriculture, sylviculture et pêche",
	},
	{
		value: BusinessSector.INDUSTRY,
		label: "Industrie manufacturière",
	},
	{
		value: BusinessSector.CONSTRUCTION,
		label: "Construction",
	},
	{
		value: BusinessSector.TRADE,
		label: "Commerce",
	},
	{
		value: BusinessSector.TRANSPORT,
		label: "Transport et entreposage",
	},
	{
		value: BusinessSector.HOSPITALITY,
		label: "Hébergement et restauration",
	},
	{
		value: BusinessSector.INFORMATION,
		label: "Information et communication",
	},
	{
		value: BusinessSector.FINANCE,
		label: "Activités financières et d'assurance",
	},
	{
		value: BusinessSector.REAL_ESTATE,
		label: "Activités immobilières",
	},
	{
		value: BusinessSector.PROFESSIONAL,
		label: "Activités spécialisées, scientifiques et techniques",
	},
	{
		value: BusinessSector.ADMINISTRATIVE,
		label: "Activités de services administratifs et de soutien",
	},
	{
		value: BusinessSector.PUBLIC,
		label: "Administration publique",
	},
	{
		value: BusinessSector.EDUCATION,
		label: "Enseignement",
	},
	{
		value: BusinessSector.HEALTH,
		label: "Santé humaine et action sociale",
	},
	{
		value: BusinessSector.ARTS,
		label: "Arts, spectacles et activités récréatives",
	},
	{
		value: BusinessSector.OTHER,
		label: "Autres activités de services",
	},
];
