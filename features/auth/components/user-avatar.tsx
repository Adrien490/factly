"use client";

import { ThemeToggle } from "@/shared/components/theme-toggle";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn } from "@/shared/lib/utils";
import { User } from "better-auth/types";
import { LogOut, Moon, Settings, Sun, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import getUserInitials from "../lib/get-user-initials";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
	user: User | null;
}

const avatarSizes = {
	sm: "h-8 w-8",
	md: "h-10 w-10",
	lg: "h-14 w-14",
} as const;

function MenuItems({ user, onLogout }: { user: User; onLogout: () => void }) {
	const themeToggle = ThemeToggle();
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

function SheetMenuItems({
	user,
	onLogout,
}: {
	user: User;
	onLogout: () => void;
}) {
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
				<div className="border-t my-2" />

				<Button
					onClick={onLogout}
					variant="ghost"
					className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
					size="sm"
				>
					<LogOut className="mr-2 h-4 w-4" />
					Déconnexion
				</Button>
			</div>
		</div>
	);
}

export default function UserAvatar({
	size = "md",
	className,
	user,
}: UserAvatarProps) {
	const isMobile = useIsMobile();
	const router = useRouter();

	const onLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
				},
			},
		});
	};

	if (!user) return null;

	const avatar = (
		<Avatar
			className={cn(
				avatarSizes[size],
				"transition-opacity cursor-pointer hover:opacity-80",
				className
			)}
		>
			<AvatarImage
				src={user.image || undefined}
				alt={user.name || "Avatar de l'utilisateur"}
			/>
			<AvatarFallback className="font-medium">
				{getUserInitials(user.name, user.email)}
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
					<SheetMenuItems user={user} onLogout={onLogout} />
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{avatar}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<MenuItems user={user} onLogout={onLogout} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
