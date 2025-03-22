/**
 * Représente les types de vue disponibles dans l'application
 */
export type ViewType = "grid" | "list";

/**
 * Représente les paramètres de configuration d'un ViewSwitcher
 */
export interface ToggleViewProps {
	/** Classe CSS optionnelle pour le composant */
	className?: string;
}
