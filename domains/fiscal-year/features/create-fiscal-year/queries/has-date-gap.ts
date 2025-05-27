import db from "@/shared/lib/db";

/**
 * Vérifie s'il y a un "trou" entre cette année fiscale et les années adjacentes
 */
export async function hasDateGap(
	startDate: Date,
	endDate: Date
): Promise<{ hasGap: boolean; gapDays?: number; message?: string }> {
	// Trouver l'année fiscale qui se termine juste avant cette année
	const previousYear = await db.fiscalYear.findFirst({
		where: {
			endDate: { lt: startDate },
		},
		orderBy: {
			endDate: "desc",
		},
		take: 1,
		select: { id: true, name: true, endDate: true },
	});

	// Trouver l'année fiscale qui commence juste après cette année
	const nextYear = await db.fiscalYear.findFirst({
		where: {
			startDate: { gt: endDate },
		},
		orderBy: {
			startDate: "asc",
		},
		take: 1,
		select: { id: true, name: true, startDate: true },
	});

	// Vérifier s'il y a un trou avec l'année précédente
	if (previousYear) {
		const previousEndTime = new Date(previousYear.endDate).getTime();
		const currentStartTime = new Date(startDate).getTime();
		const gapMs = currentStartTime - previousEndTime - 24 * 60 * 60 * 1000;

		if (gapMs > 0) {
			const gapDays = Math.ceil(gapMs / (24 * 60 * 60 * 1000));
			return {
				hasGap: true,
				gapDays,
				message: `Il existe un écart de ${gapDays} jour(s) entre cette année fiscale et l'année précédente "${previousYear.name}".`,
			};
		}
	}

	// Vérifier s'il y a un trou avec l'année suivante
	if (nextYear) {
		const currentEndTime = new Date(endDate).getTime();
		const nextStartTime = new Date(nextYear.startDate).getTime();
		const gapMs = nextStartTime - currentEndTime - 24 * 60 * 60 * 1000;

		if (gapMs > 0) {
			const gapDays = Math.ceil(gapMs / (24 * 60 * 60 * 1000));
			return {
				hasGap: true,
				gapDays,
				message: `Il existe un écart de ${gapDays} jour(s) entre cette année fiscale et l'année suivante "${nextYear.name}".`,
			};
		}
	}

	return { hasGap: false };
}
