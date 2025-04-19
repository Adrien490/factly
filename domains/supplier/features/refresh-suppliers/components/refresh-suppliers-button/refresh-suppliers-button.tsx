"use client";

import { Button } from "@/shared/components";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshSuppliersButtonProps } from "./types";

export function RefreshSuppliersButton({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	organizationId,
}: RefreshSuppliersButtonProps) {
	const router = useRouter();
	const [isPending, setIsPending] = useState(false);

	const handleRefresh = () => {
		setIsPending(true);
		router.refresh();
		// Reset after a short delay for visual feedback
		setTimeout(() => {
			setIsPending(false);
		}, 1000);
	};

	return (
		<Button
			type="button"
			variant="outline"
			disabled={isPending}
			onClick={handleRefresh}
			aria-label="Rafraîchir la liste des fournisseurs"
		>
			<RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
		</Button>
	);
}
