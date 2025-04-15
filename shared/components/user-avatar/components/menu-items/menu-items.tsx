"use client";

import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { useTheme } from "@/shared/hooks";
import { LogOut, Moon, Sun } from "lucide-react";
import { MenuItemsProps } from "./types";

export function MenuItems({ user, onLogout }: MenuItemsProps) {
	const themeToggle = useTheme();
	const ThemeIcon = themeToggle.isDark ? Moon : Sun;

	return (
		<>
			<div className="flex flex-col px-2 py-1.5">
				<span className="text-sm font-semibold">{user.name}</span>
				<span className="text-xs text-muted-foreground truncate">
					{user.email}
				</span>
			</div>
			<DropdownMenuSeparator />

			<DropdownMenuItem onClick={themeToggle.toggleTheme} className="relative">
				<ThemeIcon className="mr-2 h-4 w-4" />
				<span>{themeToggle.isDark ? "Mode sombre" : "Mode clair"}</span>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				className="text-red-600 dark:text-red-400 hover:!bg-red-100 dark:hover:!bg-red-900/20"
				onClick={onLogout}
			>
				<LogOut className="mr-2 h-4 w-4" />
				<span>Déconnexion</span>
			</DropdownMenuItem>
		</>
	);
}
