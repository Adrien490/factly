"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function useCursorPagination() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const handleCursorChange = (
		newCursor: string | null,
		direction: "next" | "previous"
	) => {
		const params = new URLSearchParams(searchParams);

		// Préserver les autres paramètres
		const existingParams = Array.from(params.entries()).reduce(
			(acc, [key, value]) => {
				if (!["cursor", "direction"].includes(key)) {
					acc[key] = value;
				}
				return acc;
			},
			{} as Record<string, string>
		);

		// Mettre à jour le curseur et la direction
		if (newCursor === null) {
			params.delete("cursor");
			params.delete("direction");
		} else {
			params.set("cursor", newCursor);
			params.set("direction", direction);
		}

		// Reconstruire l'URL avec tous les paramètres
		Object.entries(existingParams).forEach(([key, value]) => {
			params.set(key, value);
		});

		startTransition(() => {
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	const handlePerPageChange = (newPerPage: number) => {
		const params = new URLSearchParams(searchParams);

		// Préserver les autres paramètres
		const existingParams = Array.from(params.entries()).reduce(
			(acc, [key, value]) => {
				if (!["perPage", "cursor", "direction"].includes(key)) {
					acc[key] = value;
				}
				return acc;
			},
			{} as Record<string, string>
		);

		// Réinitialiser la pagination
		params.set("perPage", String(newPerPage));
		params.delete("cursor");
		params.delete("direction");

		// Reconstruire l'URL avec tous les paramètres
		Object.entries(existingParams).forEach(([key, value]) => {
			params.set(key, value);
		});

		startTransition(() => {
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	const clearPagination = () => {
		const params = new URLSearchParams(searchParams);

		// Préserver les autres paramètres
		const existingParams = Array.from(params.entries()).reduce(
			(acc, [key, value]) => {
				if (!["perPage", "cursor", "direction"].includes(key)) {
					acc[key] = value;
				}
				return acc;
			},
			{} as Record<string, string>
		);

		// Supprimer les paramètres de pagination
		params.delete("cursor");
		params.delete("direction");
		params.delete("perPage");

		// Reconstruire l'URL avec tous les paramètres
		Object.entries(existingParams).forEach(([key, value]) => {
			params.set(key, value);
		});

		startTransition(() => {
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	return {
		isPending,
		handleCursorChange,
		handlePerPageChange,
		clearPagination,
	};
}
