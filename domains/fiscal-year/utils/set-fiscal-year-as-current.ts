import db from "@/shared/lib/db";

/**
 * Fonction utilitaire pour définir une année fiscale comme courante
 * et désactiver les autres années fiscales courantes
 */
export async function setFiscalYearAsCurrent(
	fiscalYearId: string,
	organizationId: string
) {
	// Désactiver toutes les autres années fiscales courantes
	await db.fiscalYear.updateMany({
		where: {
			organizationId,
			id: { not: fiscalYearId },
			isCurrent: true,
		},
		data: {
			isCurrent: false,
		},
	});

	// Activer l'année fiscale spécifiée comme courante
	await db.fiscalYear.update({
		where: { id: fiscalYearId },
		data: { isCurrent: true },
	});
}
