import { LogoutButton } from "@/domains/auth/features/logout/components";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { User } from "better-auth/types";
import { LogOut, MoreVertical, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { use } from "react";

interface UserDropdownProps {
	userPromise: Promise<User | null>;
}

export function UserDropdown({ userPromise }: UserDropdownProps) {
	const user = use(userPromise);

	if (!user) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
						{user.image ? (
							<Image
								src={user.image}
								alt={user.name}
								width={32}
								height={32}
								className="object-cover w-full h-full rounded-lg"
							/>
						) : (
							<UserIcon className="size-4" />
						)}
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">{user.name}</span>
						<span className="truncate text-xs text-muted-foreground">
							{user.email}
						</span>
					</div>
					<MoreVertical className="ml-auto size-4 shrink-0 opacity-50" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="start"
				side="top"
				sideOffset={4}
			>
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					Mon compte
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<LogoutButton>
					<LogOut className="size-4" />
					<span>Déconnexion</span>
				</LogoutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
