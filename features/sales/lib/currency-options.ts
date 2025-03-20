import { Currency } from "@prisma/client";

/**
 * Interface pour les options de devise
 */
export interface CurrencyOption {
	value: Currency;
	label: string;
	symbol: string;
	code: string;
	format: string;
	description: string;
	decimalPlaces: number;
}

/**
 * Mapping des devises vers des libellés plus lisibles
 */
const CURRENCY_LABELS: Record<Currency, string> = {
	[Currency.EUR]: "Euro",
	[Currency.USD]: "Dollar américain",
	[Currency.GBP]: "Livre sterling",
	[Currency.CHF]: "Franc suisse",
};

/**
 * Symboles des devises
 */
const CURRENCY_SYMBOLS: Record<Currency, string> = {
	[Currency.EUR]: "€",
	[Currency.USD]: "$",
	[Currency.GBP]: "£",
	[Currency.CHF]: "CHF",
};

/**
 * Codes ISO des devises
 */
const CURRENCY_CODES: Record<Currency, string> = {
	[Currency.EUR]: "EUR",
	[Currency.USD]: "USD",
	[Currency.GBP]: "GBP",
	[Currency.CHF]: "CHF",
};

/**
 * Format d'affichage des montants pour chaque devise
 * %s = symbole, %v = valeur
 */
const CURRENCY_FORMATS: Record<Currency, string> = {
	[Currency.EUR]: "%v %s", // 123,45 €
	[Currency.USD]: "%s%v", // $123.45
	[Currency.GBP]: "%s%v", // £123.45
	[Currency.CHF]: "%v %s", // 123.45 CHF
};

/**
 * Descriptions détaillées pour chaque devise
 */
const CURRENCY_DESCRIPTIONS: Record<Currency, string> = {
	[Currency.EUR]: "Monnaie officielle de la zone euro",
	[Currency.USD]: "Monnaie officielle des États-Unis",
	[Currency.GBP]: "Monnaie officielle du Royaume-Uni",
	[Currency.CHF]: "Monnaie officielle de la Suisse et du Liechtenstein",
};

/**
 * Nombre de décimales standard pour chaque devise
 */
const CURRENCY_DECIMAL_PLACES: Record<Currency, number> = {
	[Currency.EUR]: 2,
	[Currency.USD]: 2,
	[Currency.GBP]: 2,
	[Currency.CHF]: 2,
};

/**
 * Génère les options de devise pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getCurrencyOptions(): CurrencyOption[] {
	return Object.values(Currency).map((currency) => ({
		value: currency,
		label: CURRENCY_LABELS[currency] || String(currency),
		symbol: CURRENCY_SYMBOLS[currency] || "",
		code: CURRENCY_CODES[currency] || String(currency),
		format: CURRENCY_FORMATS[currency] || "%s%v",
		description: CURRENCY_DESCRIPTIONS[currency] || "",
		decimalPlaces: CURRENCY_DECIMAL_PLACES[currency] || 2,
	}));
}

/**
 * Formate un montant selon la devise spécifiée
 * @param amount Montant à formater
 * @param currency Devise à utiliser
 * @returns Montant formaté selon les règles de la devise
 */
export function formatCurrency(amount: number, currency: Currency): string {
	const options = getCurrencyOptions().find((c) => c.value === currency);
	if (!options) return `${amount}`;

	const formatted = amount.toFixed(options.decimalPlaces);
	const { format, symbol } = options;

	return format.replace("%s", symbol).replace("%v", formatted);
}

/**
 * Liste complète des options de devise
 */
const currencyOptions = getCurrencyOptions();

export default currencyOptions;
