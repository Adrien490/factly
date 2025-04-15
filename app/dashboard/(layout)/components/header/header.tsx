import { HorizontalMenu, Logo, UserAvatar } from "@/shared/components";
import { cn } from "@/shared/utils";
import { User } from "better-auth";
import { use } from "react";
import { ANIMATION_CONFIG, menuItems } from "./constants";

type Props = {
	userPromise: Promise<User | null>;
	className?: string;
};

export function Header({ userPromise, className }: Props) {
	const user = use(userPromise);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full transition-all bg-background",

				className
			)}
			style={{
				transitionDuration: `${ANIMATION_CONFIG.duration}s`,
				transitionTimingFunction: ANIMATION_CONFIG.ease,
			}}
			role="banner"
		>
			{/* En-tête principal avec logo et contrôles utilisateur */}
			<div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center">
					{/* Logo */}

					<Logo
						variant="minimal"
						size="md"
						shape="softSquare"
						interactive
						hideText={false}
						text="Factly"
						textSize="md"
						hover="fade"
						glow="sm"
						srText="Logo Factly"
						href="/"
					/>
				</div>

				{/* Espace central flexible */}
				<div className="flex-1"></div>

				{/* Section droite : Avatar utilisateur */}
				<div className="flex items-center gap-2 sm:gap-3">
					<UserAvatar size="sm" user={user} />
				</div>
			</div>

			{/* Menu de navigation - Visible uniquement lorsqu'on ne défile pas */}

			<div className="overflow-hidden">
				<HorizontalMenu items={menuItems} />
			</div>
		</header>
	);
}
