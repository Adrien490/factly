"use client";

import { Button } from "@/shared/components";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui";
import { RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useRefreshProducts } from "../hooks/use-refresh-products";

export function RefreshProductsButton() {
	const { dispatch, isPending } = useRefreshProducts();
	const params = useParams();
	const organizationId = params.organizationId as string;

	return (
		<form action={dispatch}>
			<input type="hidden" name="organizationId" value={organizationId} />
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button type="submit" variant="outline" disabled={isPending}>
							<RefreshCw className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Rafraîchir la liste des produits</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</form>
	);
}
