import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
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
