import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./create-toast-callbacks";
export * from "./format-price";
export * from "./generate-reference";
export * from "./generate-slug";
export * from "./get-sidebar-nav";
export * from "./with-callbacks";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getUserInitials(
	nom: string | null | undefined,
	email: string | null | undefined
): string {
	if (nom) {
		return nom
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}
	return email?.substring(0, 2).toUpperCase() || "??";
}

export function formatDate(date: Date | string | null): string {
	if (!date) return "-";

	try {
		const dateObject = typeof date === "string" ? new Date(date) : date;

		// Vérifier si la date est valide
		if (isNaN(dateObject.getTime())) {
			return "-";
		}

		return new Intl.DateTimeFormat("fr-FR", {
			dateStyle: "long",
		}).format(dateObject);
	} catch (error) {
		console.error("Error formatting date:", error);
		return "-";
	}
}

/**
 * Formate une date en temps relatif (il y a X minutes, heures, jours, etc.)
 * @param date La date à formater
 * @returns Une chaîne formatée en français
 */
export function formatRelativeTime(date: Date | string | null): string {
	if (!date) return "-";

	try {
		const dateObject = typeof date === "string" ? new Date(date) : date;

		// Vérifier si la date est valide
		if (isNaN(dateObject.getTime())) {
			return "-";
		}

		const now = new Date();
		const diffMs = now.getTime() - dateObject.getTime();
		const diffSecs = Math.floor(diffMs / 1000);
		const diffMins = Math.floor(diffSecs / 60);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);
		const diffMonths = Math.floor(diffDays / 30);
		const diffYears = Math.floor(diffDays / 365);

		if (diffSecs < 60) {
			return "à l'instant";
		} else if (diffMins < 60) {
			return `il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`;
		} else if (diffHours < 24) {
			return `il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
		} else if (diffDays < 30) {
			return `il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
		} else if (diffMonths < 12) {
			return `il y a ${diffMonths} mois`;
		} else {
			return `il y a ${diffYears} an${diffYears > 1 ? "s" : ""}`;
		}
	} catch (error) {
		console.error("Error formatting relative time:", error);
		return "-";
	}
}
