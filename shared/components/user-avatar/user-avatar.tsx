"use client";

import { authClient } from "@/domains/auth";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import { cn, getUserInitials } from "@/shared/utils";
import { User } from "better-auth/types";
import { useRouter } from "next/navigation";
import { MenuItems, SheetMenuItems } from "./components";
import { avatarSizes } from "./constants";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
	user: User | null;
}

export function UserAvatar({ size = "md", className, user }: UserAvatarProps) {
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
