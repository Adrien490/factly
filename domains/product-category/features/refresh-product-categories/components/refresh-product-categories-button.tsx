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
import { useRefreshProductCategories } from "../hooks/use-refresh-product-categories";

export function RefreshProductCategoriesButton() {
	const params = useParams();
	const { dispatch, isPending } = useRefreshProductCategories();
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
						<p>Rafraîchir la liste des catégories</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</form>
	);
}
