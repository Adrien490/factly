import { GetClientsReturn } from "@/features/clients/get-all";
import { Client } from "@prisma/client";

export interface ClientListProps {
	/**
	 * Promise contenant les clients à afficher
	 */
	clientsPromise: Promise<GetClientsReturn>;

	/**
	 * Fonction pour obtenir l'ID d'un client (par défaut client.id)
	 */
	getClientId?: (client: Client) => string;
}

export interface ClientListColumnDef<T = Client> {
	/**
	 * Identifiant unique de la colonne
	 */
	id: string;

	/**
	 * En-tête de la colonne (texte ou élément React)
	 */
	header: string | (() => React.ReactNode);

	/**
	 * Fonction de rendu du contenu de la cellule
	 */
	cell: (item: T) => React.ReactNode;

	/**
	 * Visibilité de la colonne selon la taille de l'écran
	 */
	visibility?: "always" | "tablet" | "desktop";

	/**
	 * Alignement du contenu de la colonne
	 */
	align?: "left" | "center" | "right";

	/**
	 * Si la colonne peut être triée
	 */
	sortable?: boolean;
}
