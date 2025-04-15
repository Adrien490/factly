"use client";

import { Button, ThemeToggleButton } from "@/shared/components";
import { Logo } from "@/shared/components/logo";
import { cn } from "@/shared/utils";
import { User } from "better-auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";
import { navigationLinks } from "./constants";
import { useActiveSection, useIsScrolled } from "./hooks";

type Props = {
	userPromise?: Promise<User | null>;
};

export function Navbar({ userPromise }: Props) {
	// Récupération de l'utilisateur avec le hook use de React (Server Components)
	let user: User | null = null;
	if (userPromise) {
		user = use(userPromise);
	}

	// Utilisation du hook chemin actuel pour la navigation active
	const pathname = usePathname();

	// Utilisation du hook useIsScrolled sans debounce
	const scrolled = useIsScrolled(75, 0);

	// Utilisation du hook personnalisé pour détecter la section active
	const activeSection = useActiveSection(navigationLinks);

	// Déterminer si un lien est actif
	const isLinkActive = (href: string): boolean => {
		// Si c'est un lien d'ancrage (#section)
		if (href.startsWith("#")) {
			return activeSection === href.replace("#", "");
		}
		// Sinon, comparer avec le pathname
		return pathname === href;
	};

	// Animation subtile pour indiquer la transition d'état
	const logoVariants = {
		normal: { scale: 1 },
		scrolled: { scale: 0.96, transition: { duration: 0.3, ease: "easeInOut" } },
	};

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
				scrolled
					? "backdrop-blur-lg bg-background/80 shadow-2xs"
					: "bg-transparent"
			)}
			role="banner"
			itemScope
			itemType="https://schema.org/SiteNavigationElement"
		>
			{/* Élément décoratif supérieur - visible uniquement quand scrolled */}
			{scrolled && (
				<motion.div
					className="absolute -bottom-px left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-primary/40 to-transparent"
					initial={{ scaleX: 0, opacity: 0 }}
					animate={{ scaleX: 1, opacity: 1 }}
					transition={{ duration: 0.4 }}
				/>
			)}

			<nav
				className={cn(
					"w-full transition-all duration-300 ease-in-out",
					scrolled ? "h-16 md:h-16" : "h-[60px] md:h-20",
					!scrolled && "pt-1" // Léger padding supplémentaire quand la navbar n'est pas scrollée
				)}
				role="navigation"
				aria-label="Navigation principale"
			>
				<div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
					{/* Logo */}
					<div className="flex items-center">
						<motion.div
							variants={logoVariants}
							animate={scrolled ? "scrolled" : "normal"}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
						>
							<Link
								href="/"
								className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
								aria-label="Accueil Factly"
								scroll={true}
								itemProp="url"
							>
								<Logo
									variant={scrolled ? "minimal" : "default"}
									size="md"
									shape="softSquare"
									interactive
									hideText={false}
									text="Factly"
									textSize="md"
									hover="fade"
									glow={scrolled ? "sm" : "md"}
									srText="Logo Factly"
								/>
								<meta itemProp="name" content="Factly" />
							</Link>
						</motion.div>
					</div>

					{/* Navigation principale - Desktop */}
					<div className="hidden md:flex items-center justify-center flex-1">
						<nav
							className={cn(
								"flex items-center space-x-1 lg:space-x-2 px-3 py-1.5 rounded-full border shadow-2xs",
								scrolled
									? "bg-background/50 backdrop-blur-md border-border/40"
									: "bg-transparent border-transparent"
							)}
							itemScope
							itemType="https://schema.org/SiteNavigationElement"
						>
							{navigationLinks.map((link) => {
								// Vérifier si le lien est actif
								const isActive = isLinkActive(link.href);

								return (
									<div key={link.name} itemProp="name">
										<Link
											href={link.href}
											className={cn(
												"relative flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
												isActive
													? "text-primary"
													: "text-foreground/80 hover:text-foreground",
												"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
											)}
											aria-current={isActive ? "page" : undefined}
											scroll={true}
											itemProp="url"
										>
											{/* Indicateur d'élément actif amélioré */}
											{isActive && (
												<>
													<motion.span
														className={cn(
															"absolute inset-0 rounded-full",
															scrolled ? "bg-primary/10" : "bg-background/10"
														)}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{ duration: 0.3 }}
													/>
													<motion.span
														className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full"
														layoutId="activeNavIndicator"
													/>
												</>
											)}

											<motion.span
												className="relative z-10"
												whileHover={{ y: -1 }}
												whileTap={{ y: 1 }}
											>
												{link.name}
											</motion.span>
										</Link>
									</div>
								);
							})}
						</nav>
					</div>

					{/* Actions section */}
					<div className="flex items-center gap-2 sm:gap-3">
						{/* Theme Toggle Button */}
						<div className="hidden sm:flex">
							<ThemeToggleButton
								variant="ghost"
								size="icon"
								className={cn(
									"bg-transparent border-0",
									scrolled
										? "hover:bg-background/50"
										: "hover:bg-background/10 text-foreground/80"
								)}
							/>
						</div>

						{/* Section utilisateur */}
						{user ? (
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									variant={scrolled ? "default" : "outline"}
									size="sm"
									asChild
									className={cn(
										"px-5 rounded-full transition-all duration-200",
										scrolled
											? "bg-primary hover:bg-primary/90"
											: "bg-transparent hover:bg-background/20 backdrop-blur-sm"
									)}
								>
									<Link
										href="/dashboard"
										className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
										scroll={true}
									>
										<span>Tableau de bord</span>
									</Link>
								</Button>
							</motion.div>
						) : (
							<Button
								variant={scrolled ? "default" : "outline"}
								size="sm"
								asChild
								className={cn(
									"px-5 rounded-full",
									scrolled
										? "bg-primary hover:bg-primary/90"
										: "bg-transparent hover:bg-background/20 backdrop-blur-sm"
								)}
							>
								<Link
									href="/login"
									className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
									scroll={true}
								>
									<motion.span whileTap={{ y: 1 }}>Se connecter</motion.span>
								</Link>
							</Button>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
