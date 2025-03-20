/**
 * Calcule les dates de début et fin d'année fiscale
 * Par défaut: année civile (1er janvier - 31 décembre)
 * @returns {Object} Dates de début et fin de l'année fiscale
 */
function calculateFiscalYearDates(): {
	startDate: Date;
	endDate: Date;
	name: string;
} {
	const currentYear = new Date().getFullYear();

	// Par défaut: année civile (du 1er janvier au 31 décembre)
	const startDate = new Date(currentYear, 0, 1); // 1er janvier année courante
	const endDate = new Date(currentYear, 11, 31, 23, 59, 59); // 31 décembre année courante
	const name = `Année fiscale ${currentYear}`;

	return { startDate, endDate, name };
}

export default calculateFiscalYearDates;
