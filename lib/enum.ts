import { Country } from "@prisma/client";

export const COUNTRIES: Record<Country, string> = {
	FR: "France",
	BE: "Belgique",
	ES: "Espagne",
	DE: "Allemagne",
	IT: "Italie",
} as const;
