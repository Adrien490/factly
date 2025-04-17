import { Button } from "@/shared/components";
import { LoadingIndicator } from "@/shared/components/loading-indicator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/shadcn-ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getClientRowMenuItems } from "./constants";
import { ClientRowActionsProps } from "./types";

export function ClientRowActions({ client }: ClientRowActionsProps) {
	const menuItems = getClientRowMenuItems(client.organizationId, client.id);

	// Fonction pour résoudre l'icône

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8 rounded-full hover:bg-muted focus-visible:bg-muted"
					)}
					aria-label="Menu d'actions"
					type="button"
				>
					<MoreVerticalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				side="bottom"
				sideOffset={4}
				className="w-48"
			>
				{menuItems.map((item, index) => (
					<React.Fragment key={`menu-item-${index}`}>
						{item.isSeparatorBefore && <DropdownMenuSeparator />}
						<DropdownMenuItem asChild>
							<Link
								href={item.href}
								className={cn(
									"flex w-full items-center",
									item.isDanger && "text-destructive"
								)}
							>
								{item.icon}
								<span>{item.label}</span>
								{/* Indicateur de chargement masqué par défaut */}
								<LoadingIndicator className="ml-auto h-4 w-4 invisible" />
							</Link>
						</DropdownMenuItem>
					</React.Fragment>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
