import db from "@/shared/lib/db";

/**
 * Vérifie si une période (startDate - endDate) chevauche des années fiscales existantes
 */
export async function hasDateOverlap(
	startDate: Date,
	endDate: Date
): Promise<boolean> {
	const overlappingFiscalYears = await db.fiscalYear.findMany({
		where: {
			OR: [
				// Cas 1: startDate est entre les dates d'une année existante
				{
					startDate: { lte: startDate },
					endDate: { gte: startDate },
				},
				// Cas 2: endDate est entre les dates d'une année existante
				{
					startDate: { lte: endDate },
					endDate: { gte: endDate },
				},
				// Cas 3: les dates englobent complètement une année existante
				{
					startDate: { gte: startDate },
					endDate: { lte: endDate },
				},
			],
		},
		select: { id: true, name: true },
	});

	return overlappingFiscalYears.length > 0;
}
