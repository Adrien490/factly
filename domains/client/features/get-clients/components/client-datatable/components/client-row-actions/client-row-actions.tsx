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
			<DropdownMenuContent align="end" side="bottom" sideOffset={4}>
				{menuItems.map((item, index) => (
					<React.Fragment key={`menu-item-${index}`}>
						{item.isSeparatorBefore && <DropdownMenuSeparator />}
						<DropdownMenuItem asChild>
							<Link
								href={item.href}
								className={cn(
									"flex w-full items-center justify-between",
									item.isDanger && "text-destructive"
								)}
							>
								<span>{item.label}</span>
								<LoadingIndicator className="ml-2 h-4 w-4" />
							</Link>
						</DropdownMenuItem>
					</React.Fragment>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
