"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { useIsScrolled } from "@/hooks/use-is-scrolled";
import { cn } from "@/lib/utils";
import { User } from "better-auth";
import Link from "next/link";
import { use } from "react";
import navigationLinks from "../lib/navigation-links";

// Récupération des ids des sections pour le hook useActiveSection

type Props = {
	userPromise?: Promise<User | null>;
};

export default function Navbar({ userPromise }: Props) {
	// Récupération de l'utilisateur avec le hook use de React (Server Components)
	let user: User | null = null;
	if (userPromise) {
		user = use(userPromise);
	}

	// Seuil en pixels à partir duquel la navbar change d'apparence
	const threshold = 50;

	// Utilisation du hook simplifié useIsScrolled
	const scrolled = useIsScrolled(threshold);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
				scrolled
					? "backdrop-blur-lg bg-background/80 shadow-2xs"
					: "bg-transparent"
			)}
			role="banner"
		>
			{/* Élément décoratif supérieur - visible uniquement quand scrolled */}
			{scrolled && (
				<div className="absolute -bottom-px left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-primary/40 to-transparent" />
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
						<Link
							href="/"
							className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
							aria-label="Accueil Factly"
							scroll={true}
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
						</Link>
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
						>
							{navigationLinks.map((link) => {
								// Vérifier si le lien est actif en comparant avec activeTab
								const isActive = false;

								return (
									<div key={link.name}>
										<Link
											href={link.href}
											className={cn(
												"relative flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
												isActive
													? "text-primary"
													: !scrolled
													? "text-foreground/80 hover:text-foreground"
													: "text-foreground/80 hover:text-foreground",
												"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
											)}
											aria-current={isActive ? "page" : undefined}
											scroll={true}
										>
											{/* Indicateur actif */}
											{isActive && (
												<span
													className={cn(
														"absolute inset-0 rounded-full",
														scrolled ? "bg-primary/10" : "bg-background/10"
													)}
												/>
											)}

											<span className="relative z-10">{link.name}</span>
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
							<Button
								variant={scrolled ? "default" : "outline"}
								size="sm"
								asChild
								className={cn(
									"px-5 rounded-full transition-all duration-200",
									scrolled
										? "bg-primary hover:bg-primary/90"
										: "bg-transparent hover:bg-background/20"
								)}
							>
								<Link
									href="/dashboard"
									className="flex items-center gap-2"
									scroll={true}
								>
									<span>Tableau de bord</span>
								</Link>
							</Button>
						) : (
							<Button
								variant={scrolled ? "default" : "outline"}
								size="sm"
								asChild
								className={cn(
									"px-5 rounded-full",
									scrolled ? "bg-primary" : "bg-transparent"
								)}
							>
								<Link
									href="/login"
									className="flex items-center gap-2"
									scroll={true}
								>
									<span>Se connecter</span>
								</Link>
							</Button>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
