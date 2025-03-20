"use client";

import { HorizontalMenu } from "@/components/ui/horizontal-menu";
import Logo from "@/components/ui/logo";
import UserAvatar from "@/features/auth/components/user-avatar";
import { useIsScrolled } from "@/hooks/use-is-scrolled";
import { cn } from "@/lib/utils";
import { User } from "better-auth";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";
import menuItems from "../lib/menu-items";

type Props = {
	userPromise: Promise<User | null>;
	className?: string;
};

// Configuration standardisée des animations
const ANIMATION_CONFIG = {
	duration: 0.2,
	ease: "easeInOut",
};

export default function Header({ userPromise, className }: Props) {
	const user = use(userPromise);
	const isScrolled = useIsScrolled(20);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full transition-all border-b",
				isScrolled
					? "bg-background/90 backdrop-blur-sm shadow-sm"
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
			<div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center">
					{/* Logo */}
					<Link
						href="/dashboard/organizations"
						className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
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
								<HorizontalMenu items={menuItems} size="sm" alignment="start" />
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
						<div className="mx-auto w-full max-w-[1440px] px-4 py-2 sm:px-6 lg:px-8">
							<HorizontalMenu
								items={menuItems}
								size="default"
								alignment="start"
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
