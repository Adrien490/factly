import { Country } from "@prisma/client";

/**
 * Interface pour les options de pays
 */
export interface CountryOption {
	value: Country;
	label: string;
	iso: string; // Code ISO 2-lettres (ex: FR, DE, US)
	code: string; // Code téléphonique international (ex: +33, +49, +1)
}
