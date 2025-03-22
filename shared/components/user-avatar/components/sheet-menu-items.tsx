import getUserInitials from "@/features/auth/lib/get-user-initials";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { User } from "better-auth";
import { LogOut, Settings, UserIcon } from "lucide-react";
import { avatarSizes } from "../constants";

export function SheetMenuItems({
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
