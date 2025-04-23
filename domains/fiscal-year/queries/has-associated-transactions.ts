import db from "@/shared/lib/db";

/**
 * Vérifie si l'année fiscale a des transactions associées
 */
export async function hasAssociatedTransactions(
	fiscalYearId: string
): Promise<boolean> {
	// Cette fonction est une version simplifiée - dans une application réelle,
	// vous devriez vérifier les transactions, factures, etc. liées à cette année fiscale

	// Exemple: vérifier si des transactions existent
	const transactionsCount = await db.fiscalYear.count({
		where: {
			id: fiscalYearId,
			// Ajouter ici les relations avec les transactions
			// Par exemple: transactions: { some: {} }
		},
	});

	console.log("transactionsCount", transactionsCount);

	// Pour la démonstration, nous supposons qu'il n'y a pas de transactions
	return false;
}
