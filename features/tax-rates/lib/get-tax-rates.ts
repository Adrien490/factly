/**
 * Définit les taux de TVA standards français
 * @returns {Array} Liste des taux de TVA à créer
 */
export default function getTaxRates() {
	return [
		{
			name: "TVA standard",
			rate: 20.0,
			description: "Taux normal applicable à la majorité des biens et services",
			isDefault: true,
			accountCode: "445711",
		},
		{
			name: "TVA intermédiaire",
			rate: 10.0,
			description: "Restauration, travaux d'amélioration, transport...",
			isDefault: false,
			accountCode: "445713",
		},
		{
			name: "TVA réduite",
			rate: 5.5,
			description: "Produits alimentaires, livres, médicaments...",
			isDefault: false,
			accountCode: "445712",
		},
		{
			name: "TVA super réduite",
			rate: 2.1,
			description: "Médicaments remboursables, presse...",
			isDefault: false,
			accountCode: "445714",
		},
	];
}
