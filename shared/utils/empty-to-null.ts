/**
 * Transforme une chaîne vide en null.
 * Cette fonction est utile pour la validation des formulaires et la gestion des données,
 * particulièrement avec Prisma qui gère mieux les valeurs null que les chaînes vides.
 *
 * @param val - La valeur à transformer
 * @returns null si la valeur est une chaîne vide, sinon la valeur inchangée
 */
export const emptyToNull = (val: string) => (val === "" ? null : val);
