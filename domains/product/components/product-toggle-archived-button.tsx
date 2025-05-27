"use client";

import { Button } from "@/shared/components";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function ProductToggleArchivedButton() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const isArchivedView = searchParams.get("archived") === "true";

	const handleToggle = () => {
		startTransition(() => {
			const params = new URLSearchParams(searchParams);
			if (isArchivedView) {
				params.delete("archived");
			} else {
				params.set("archived", "true");
			}
			router.push(`/dashboard/products?${params.toString()}`);
		});
	};

	return (
		<Button
			variant="outline"
			onClick={handleToggle}
			disabled={isPending}
			className="shrink-0"
		>
			{isArchivedView
				? "Voir les produits actifs"
				: "Voir les produits archivés"}
		</Button>
	);
}
