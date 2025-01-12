"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
}

const avatarSizes = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-14 w-14",
} as const;

function getUserInitials(
	nom: string | null | undefined,
	email: string | null | undefined
): string {
	if (nom) {
		return nom
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}
	return email?.substring(0, 2).toUpperCase() || "??";
}

function MenuItems({ user }: { user: User }) {
	const themeToggle = ThemeToggle();
	const ThemeIcon = themeToggle.icon;

	return (
		<>
			<div className="flex flex-col px-2 py-1.5">
				<span className="text-sm font-semibold">{user.name}</span>
				<span className="text-xs text-muted-foreground truncate">
					{user.email}
				</span>
			</div>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem>
					<UserIcon className="mr-2 h-4 w-4" />
					<span>Profil</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Settings className="mr-2 h-4 w-4" />
					<span>Paramètres</span>
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuItem onClick={themeToggle.onClick} className="relative">
				<ThemeIcon className="mr-2 h-4 w-4" />
				<span>{themeToggle.label}</span>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem
				onClick={() => signOut({ callbackUrl: "/login" })}
				className="text-red-600 dark:text-red-400 hover:!bg-red-100 dark:hover:!bg-red-900/20"
			>
				<LogOut className="mr-2 h-4 w-4" />
				<span>Déconnexion</span>
			</DropdownMenuItem>
		</>
	);
}

function SheetMenuItems({ user }: { user: User }) {
	const themeToggle = ThemeToggle();
	const ThemeIcon = themeToggle.icon;

	return (
		<div className="grid gap-4 py-4">
			<div className="flex items-center gap-4 px-4">
				<Avatar className={avatarSizes.lg}>
					<AvatarImage
						src={user.image || undefined}
						alt={user.name || "Avatar de l'utilisateur"}
					/>
					<AvatarFallback className="font-medium">
						{getUserInitials(user.name, user.email)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="font-medium">{user.name}</span>
					<span className="text-sm text-muted-foreground">{user.email}</span>
				</div>
			</div>
			<div className="border-t" />
			<div className="grid gap-2 px-4">
				<Button variant="ghost" className="w-full justify-start" size="sm">
					<UserIcon className="mr-2 h-4 w-4" />
					Profil
				</Button>
				<Button variant="ghost" className="w-full justify-start" size="sm">
					<Settings className="mr-2 h-4 w-4" />
					Paramètres
				</Button>
				<Button
					variant="ghost"
					className="w-full justify-start relative"
					size="sm"
					onClick={themeToggle.onClick}
				>
					<ThemeIcon className="mr-2 h-4 w-4" />
					{themeToggle.label}
				</Button>
				<div className="border-t my-2" />
				<Button
					variant="ghost"
					className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
					size="sm"
					onClick={() => signOut({ callbackUrl: "/login" })}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Déconnexion
				</Button>
			</div>
		</div>
	);
}

export function UserAvatar({ size = "md", className }: UserAvatarProps) {
	const session = useSession();
	const isMobile = useIsMobile();

	if (!session?.data?.user) return null;

	const avatar = (
		<Avatar
			className={cn(
				avatarSizes[size],
				"transition-opacity cursor-pointer hover:opacity-80",
				className
			)}
		>
			<AvatarImage
				src={session.data.user.image || undefined}
				alt={session.data.user.name || "Avatar de l'utilisateur"}
			/>
			<AvatarFallback className="font-medium">
				{getUserInitials(session.data.user.name, session.data.user.email)}
			</AvatarFallback>
		</Avatar>
	);

	if (isMobile) {
		return (
			<Sheet>
				<SheetTrigger asChild>{avatar}</SheetTrigger>
				<SheetContent side="right" className="w-full sm:w-[400px] p-0">
					<SheetHeader className="p-4 text-left">
						<SheetTitle>Mon compte</SheetTitle>
					</SheetHeader>
					<SheetMenuItems user={session.data.user} />
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{avatar}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<MenuItems user={session.data.user} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
