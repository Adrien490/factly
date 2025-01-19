"use client";

import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
	const router = useRouter();

	return (
		<Button
			size="sm"
			variant="outline"
			onClick={() => router.refresh()}
			title="Rafraîchir la liste"
		>
			<RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
			<span className="sr-only">Rafraîchir la liste</span>
		</Button>
	);
}
