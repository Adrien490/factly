import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components";

import { LogoutButton } from "@/domains/auth/components/logout-button";
import { cn, getUserInitials } from "@/shared/utils";
import { User } from "better-auth/types";
import { LogOut } from "lucide-react";
import { use } from "react";
import { avatarSizes } from "./constants";

interface UserAvatarProps {
	size?: "sm" | "md" | "lg";
	userPromise: Promise<User | null>;
}

export function UserAvatar({ size = "md", userPromise }: UserAvatarProps) {
	const user = use(userPromise);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar
					className={cn(
						avatarSizes[size],
						"transition-opacity cursor-pointer hover:opacity-80"
					)}
				>
					<AvatarImage
						src={user?.image || undefined}
						alt={user?.name || "Avatar de l'utilisateur"}
					/>
					<AvatarFallback className="font-medium">
						{getUserInitials(user?.name, user?.email)}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<div className="flex flex-col px-2 py-1.5">
					<span className="text-sm font-semibold">{user?.name}</span>
					<span className="text-xs text-muted-foreground truncate">
						{user?.email}
					</span>
				</div>
				<DropdownMenuSeparator />
				<LogoutButton>
					<DropdownMenuItem className="text-red-600 dark:text-red-400 hover:!bg-red-100 dark:hover:!bg-red-900/20">
						<LogOut className="mr-2 h-4 w-4" />
						<span>Déconnexion</span>
					</DropdownMenuItem>
				</LogoutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
