"use client";

import {
	Button, DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import { MenuActionsProps } from "./types";

export function MenuActions({
	actions,
	triggerClassName,
	contentClassName,
	align = "end",
	side,
	sideOffset = 4,
}: MenuActionsProps) {
	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8 rounded-full hover:bg-muted focus-visible:bg-muted",
						triggerClassName
					)}
					aria-label="Menu d'actions"
					type="button"
				>
					<MoreHorizontalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={align}
				side={side}
				sideOffset={sideOffset}
				className={cn(
					"w-52 p-1 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
					contentClassName
				)}
			>
				{actions.map((action, index) => (
					<Fragment key={action.id || `${action.label}-${index}`}>
						{action.divider && index > 0 && (
							<DropdownMenuSeparator className="my-1" />
						)}
						<DropdownMenuItem
							disabled={action.disabled}
							className={cn(
								"flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm focus:bg-accent focus:text-accent-foreground",
								(action.onClick || action.href) && "cursor-pointer",
								action.variant === "destructive" &&
									"text-destructive focus:text-destructive-foreground focus:bg-destructive/10",
								action.disabled && "opacity-50 pointer-events-none",
								action.className
							)}
							onSelect={(e) => {
								if (action.onClick) {
									e.preventDefault();
									e.stopPropagation();
									action.onClick();
								}
							}}
							asChild={Boolean(action.href)}
						>
							{action.href ? (
								<Link href={action.href}>
									<div className="flex items-center gap-2 w-full">
										{action.icon && (
											<div
												className={cn(
													"h-4 w-4 shrink-0",
													action.variant === "destructive" && "text-destructive"
												)}
											>
												{action.icon}
											</div>
										)}
										<span className="flex-1 truncate">{action.label}</span>
									</div>
								</Link>
							) : (
								<div className="flex items-center gap-2 w-full">
									{action.icon && (
										<div
											className={cn(
												"h-4 w-4 shrink-0",
												action.variant === "destructive" && "text-destructive"
											)}
										>
											{action.icon}
										</div>
									)}
									<span className="flex-1 truncate">{action.label}</span>
								</div>
							)}
						</DropdownMenuItem>
					</Fragment>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
