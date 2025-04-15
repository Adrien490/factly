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
				"sticky top-0 z-50 w-full bg-background/95 backdrop-blur-[2px] border-b border-border/20 shadow-sm",
				className
			)}
			style={{
				transitionDuration: `${ANIMATION_CONFIG.duration}s`,
				transitionTimingFunction: ANIMATION_CONFIG.ease,
			}}
			role="banner"
		>
			{/* Conteneur principal avec espacement optimisé */}
			<div className="mx-auto w-full max-w-[1440px]">
				{/* Barre supérieure avec logo et avatar */}
				<div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
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

					{/* Section droite : Avatar utilisateur */}
					<div className="flex items-center gap-2 sm:gap-3">
						<UserAvatar size="sm" user={user} />
					</div>
				</div>

				{/* Menu de navigation horizontal */}
				<div className="h-10 px-4 sm:px-6 lg:px-8 border-t border-border/10">
					<HorizontalMenu items={menuItems} />
				</div>
			</div>
		</header>
	);
}
