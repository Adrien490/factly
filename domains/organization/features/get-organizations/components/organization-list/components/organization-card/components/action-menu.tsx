"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export function ActionMenu({ id }: { id: string }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="rounded-md p-1 hover:bg-muted transition-colors"
					aria-label="Options pour cette organisation"
					onClick={(e) => e.preventDefault()}
				>
					<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Link href={`/dashboard/${id}`} className="cursor-pointer">
						Accéder au tableau de bord
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href={`/dashboard/${id}/settings`} className="cursor-pointer">
						Paramétrage
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
