import db from "@/shared/lib/db";

/**
 * Vérifie s'il y a un "trou" entre cette année fiscale et les années adjacentes
 */
export async function hasDateGap(
	organizationId: string,
	startDate: Date,
	endDate: Date
): Promise<{ hasGap: boolean; message?: string }> {
	// Trouver l'année fiscale qui se termine juste avant cette année
	const previousYear = await db.fiscalYear.findFirst({
		where: {
			organizationId,
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
			organizationId,
			startDate: { gt: endDate },
		},
		orderBy: {
			startDate: "asc",
		},
		take: 1,
		select: { id: true, name: true, startDate: true },
	});

	// Vérifier s'il y a un trou avec l'année précédente
	const hasPreviousGap = previousYear
		? new Date(previousYear.endDate).getTime() + 24 * 60 * 60 * 1000 <
		  new Date(startDate).getTime()
		: false;

	// Vérifier s'il y a un trou avec l'année suivante
	const hasNextGap = nextYear
		? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 <
		  new Date(nextYear.startDate).getTime()
		: false;

	if (hasPreviousGap) {
		return {
			hasGap: true,
			message: `Il existe un écart entre cette année fiscale et l'année précédente "${previousYear?.name}". Cela peut créer des discontinuités dans vos données financières.`,
		};
	}

	if (hasNextGap) {
		return {
			hasGap: true,
			message: `Il existe un écart entre cette année fiscale et l'année suivante "${nextYear?.name}". Cela peut créer des discontinuités dans vos données financières.`,
		};
	}

	return { hasGap: false };
}
