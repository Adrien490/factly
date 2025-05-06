/**
 * Formate un prix en devise euro
 * @param price Le prix à formater
 * @param options Options de formatage
 * @returns Le prix formaté
 */
export function formatPrice(
	price: number,
	options: {
		currency?: string;
		locale?: string;
		minimumFractionDigits?: number;
		maximumFractionDigits?: number;
	} = {}
): string {
	const {
		currency = "EUR",
		locale = "fr-FR",
		minimumFractionDigits = 2,
		maximumFractionDigits = 2,
	} = options;

	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		minimumFractionDigits,
		maximumFractionDigits,
	}).format(price);
}
