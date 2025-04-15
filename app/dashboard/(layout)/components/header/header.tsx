"use client";

import { useIsScrolled } from "@/app/(public)/components/navbar/hooks/use-is-scrolled";
import { HorizontalMenu, Logo, UserAvatar } from "@/shared/components";
import { cn } from "@/shared/utils";
import { User } from "better-auth";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";
import { ANIMATION_CONFIG, menuItems } from "./constants";

type Props = {
	userPromise: Promise<User | null>;
	className?: string;
};

export function Header({ userPromise, className }: Props) {
	const user = use(userPromise);
	const isScrolled = useIsScrolled(20);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full transition-all",
				isScrolled
					? "bg-background/90 backdrop-blur-xs shadow-2xs"
					: "bg-background",
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
					<Link
						href="/dashboard/organizations"
						className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
						aria-label="Tableau de bord Factly"
					>
						<Logo
							variant="minimal"
							size="md"
							shape="softSquare"
							interactive
							hideText={isScrolled}
							text="Factly"
							textSize="md"
							hover="fade"
							glow="sm"
							srText="Logo Factly"
						/>
					</Link>

					{/* Menu horizontal à côté du logo lorsqu'on défile */}
					<AnimatePresence mode="wait">
						{isScrolled && (
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								transition={{
									duration: ANIMATION_CONFIG.duration,
									ease: ANIMATION_CONFIG.ease,
								}}
								className="ml-8"
							>
								<HorizontalMenu items={menuItems} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Espace central flexible */}
				<div className="flex-1"></div>

				{/* Section droite : Avatar utilisateur */}
				<div className="flex items-center gap-2 sm:gap-3">
					<UserAvatar size="sm" user={user} />
				</div>
			</div>

			{/* Menu de navigation - Visible uniquement lorsqu'on ne défile pas */}
			<AnimatePresence>
				{!isScrolled && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{
							duration: ANIMATION_CONFIG.duration,
							ease: ANIMATION_CONFIG.ease,
						}}
						className="overflow-hidden"
					>
						<div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 border-b border-border/50">
							<HorizontalMenu items={menuItems} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
