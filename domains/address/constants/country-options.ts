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

/**
 * Mapping des pays vers des libellés plus lisibles en français
 */
const COUNTRY_LABELS: Record<Country, string> = {
	[Country.FRANCE]: "France",
	[Country.GERMANY]: "Allemagne",
	[Country.SPAIN]: "Espagne",
	[Country.ITALY]: "Italie",
	[Country.UNITED_KINGDOM]: "Royaume-Uni",
	[Country.BELGIUM]: "Belgique",
	[Country.SWITZERLAND]: "Suisse",
	[Country.NETHERLANDS]: "Pays-Bas",
	[Country.LUXEMBOURG]: "Luxembourg",
	[Country.PORTUGAL]: "Portugal",
	[Country.AUSTRIA]: "Autriche",
	[Country.SWEDEN]: "Suède",
	[Country.DENMARK]: "Danemark",
	[Country.NORWAY]: "Norvège",
	[Country.FINLAND]: "Finlande",
	[Country.IRELAND]: "Irlande",
	[Country.GREECE]: "Grèce",
	[Country.POLAND]: "Pologne",
	[Country.CZECH_REPUBLIC]: "République tchèque",
	[Country.HUNGARY]: "Hongrie",
	[Country.ROMANIA]: "Roumanie",
	[Country.BULGARIA]: "Bulgarie",
	[Country.CROATIA]: "Croatie",
	[Country.SLOVAKIA]: "Slovaquie",
	[Country.SLOVENIA]: "Slovénie",
	[Country.ESTONIA]: "Estonie",
	[Country.LATVIA]: "Lettonie",
	[Country.LITHUANIA]: "Lituanie",
	[Country.MALTA]: "Malte",
	[Country.CYPRUS]: "Chypre",
	[Country.UNITED_STATES]: "États-Unis",
	[Country.CANADA]: "Canada",
	[Country.AUSTRALIA]: "Australie",
	[Country.JAPAN]: "Japon",
	[Country.CHINA]: "Chine",
	[Country.INDIA]: "Inde",
	[Country.BRAZIL]: "Brésil",
	[Country.MEXICO]: "Mexique",
	[Country.ARGENTINA]: "Argentine",
	[Country.MOROCCO]: "Maroc",
	[Country.TUNISIA]: "Tunisie",
	[Country.ALGERIA]: "Algérie",
	[Country.SENEGAL]: "Sénégal",
	[Country.COTE_DIVOIRE]: "Côte d'Ivoire",
	[Country.CAMEROON]: "Cameroun",
	[Country.SOUTH_AFRICA]: "Afrique du Sud",
	[Country.RUSSIA]: "Russie",
	[Country.UKRAINE]: "Ukraine",
	[Country.TURKEY]: "Turquie",
	[Country.ISRAEL]: "Israël",
	[Country.UNITED_ARAB_EMIRATES]: "Émirats arabes unis",
	[Country.QATAR]: "Qatar",
	[Country.SAUDI_ARABIA]: "Arabie Saoudite",
	[Country.OTHER]: "Autre",
};

/**
 * Codes ISO 2-lettres pour chaque pays
 */
const COUNTRY_ISO_CODES: Record<Country, string> = {
	[Country.FRANCE]: "FR",
	[Country.GERMANY]: "DE",
	[Country.SPAIN]: "ES",
	[Country.ITALY]: "IT",
	[Country.UNITED_KINGDOM]: "GB",
	[Country.BELGIUM]: "BE",
	[Country.SWITZERLAND]: "CH",
	[Country.NETHERLANDS]: "NL",
	[Country.LUXEMBOURG]: "LU",
	[Country.PORTUGAL]: "PT",
	[Country.AUSTRIA]: "AT",
	[Country.SWEDEN]: "SE",
	[Country.DENMARK]: "DK",
	[Country.NORWAY]: "NO",
	[Country.FINLAND]: "FI",
	[Country.IRELAND]: "IE",
	[Country.GREECE]: "GR",
	[Country.POLAND]: "PL",
	[Country.CZECH_REPUBLIC]: "CZ",
	[Country.HUNGARY]: "HU",
	[Country.ROMANIA]: "RO",
	[Country.BULGARIA]: "BG",
	[Country.CROATIA]: "HR",
	[Country.SLOVAKIA]: "SK",
	[Country.SLOVENIA]: "SI",
	[Country.ESTONIA]: "EE",
	[Country.LATVIA]: "LV",
	[Country.LITHUANIA]: "LT",
	[Country.MALTA]: "MT",
	[Country.CYPRUS]: "CY",
	[Country.UNITED_STATES]: "US",
	[Country.CANADA]: "CA",
	[Country.AUSTRALIA]: "AU",
	[Country.JAPAN]: "JP",
	[Country.CHINA]: "CN",
	[Country.INDIA]: "IN",
	[Country.BRAZIL]: "BR",
	[Country.MEXICO]: "MX",
	[Country.ARGENTINA]: "AR",
	[Country.MOROCCO]: "MA",
	[Country.TUNISIA]: "TN",
	[Country.ALGERIA]: "DZ",
	[Country.SENEGAL]: "SN",
	[Country.COTE_DIVOIRE]: "CI",
	[Country.CAMEROON]: "CM",
	[Country.SOUTH_AFRICA]: "ZA",
	[Country.RUSSIA]: "RU",
	[Country.UKRAINE]: "UA",
	[Country.TURKEY]: "TR",
	[Country.ISRAEL]: "IL",
	[Country.UNITED_ARAB_EMIRATES]: "AE",
	[Country.QATAR]: "QA",
	[Country.SAUDI_ARABIA]: "SA",
	[Country.OTHER]: "OT",
};

/**
 * Indicatifs téléphoniques internationaux pour chaque pays
 */
const COUNTRY_PHONE_CODES: Record<Country, string> = {
	[Country.FRANCE]: "+33",
	[Country.GERMANY]: "+49",
	[Country.SPAIN]: "+34",
	[Country.ITALY]: "+39",
	[Country.UNITED_KINGDOM]: "+44",
	[Country.BELGIUM]: "+32",
	[Country.SWITZERLAND]: "+41",
	[Country.NETHERLANDS]: "+31",
	[Country.LUXEMBOURG]: "+352",
	[Country.PORTUGAL]: "+351",
	[Country.AUSTRIA]: "+43",
	[Country.SWEDEN]: "+46",
	[Country.DENMARK]: "+45",
	[Country.NORWAY]: "+47",
	[Country.FINLAND]: "+358",
	[Country.IRELAND]: "+353",
	[Country.GREECE]: "+30",
	[Country.POLAND]: "+48",
	[Country.CZECH_REPUBLIC]: "+420",
	[Country.HUNGARY]: "+36",
	[Country.ROMANIA]: "+40",
	[Country.BULGARIA]: "+359",
	[Country.CROATIA]: "+385",
	[Country.SLOVAKIA]: "+421",
	[Country.SLOVENIA]: "+386",
	[Country.ESTONIA]: "+372",
	[Country.LATVIA]: "+371",
	[Country.LITHUANIA]: "+370",
	[Country.MALTA]: "+356",
	[Country.CYPRUS]: "+357",
	[Country.UNITED_STATES]: "+1",
	[Country.CANADA]: "+1",
	[Country.AUSTRALIA]: "+61",
	[Country.JAPAN]: "+81",
	[Country.CHINA]: "+86",
	[Country.INDIA]: "+91",
	[Country.BRAZIL]: "+55",
	[Country.MEXICO]: "+52",
	[Country.ARGENTINA]: "+54",
	[Country.MOROCCO]: "+212",
	[Country.TUNISIA]: "+216",
	[Country.ALGERIA]: "+213",
	[Country.SENEGAL]: "+221",
	[Country.COTE_DIVOIRE]: "+225",
	[Country.CAMEROON]: "+237",
	[Country.SOUTH_AFRICA]: "+27",
	[Country.RUSSIA]: "+7",
	[Country.UKRAINE]: "+380",
	[Country.TURKEY]: "+90",
	[Country.ISRAEL]: "+972",
	[Country.UNITED_ARAB_EMIRATES]: "+971",
	[Country.QATAR]: "+974",
	[Country.SAUDI_ARABIA]: "+966",
	[Country.OTHER]: "",
};

/**
 * Génère les options de pays pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getCountryOptions(): CountryOption[] {
	return Object.values(Country).map((country) => ({
		value: country,
		label: COUNTRY_LABELS[country] || String(country),
		iso: COUNTRY_ISO_CODES[country] || "",
		code: COUNTRY_PHONE_CODES[country] || "",
	}));
}

/**
 * Liste complète des options de pays
 */
export const COUNTRY_OPTIONS = getCountryOptions();
