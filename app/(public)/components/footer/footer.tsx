import { Logo } from "@/shared/components/logo";
import { PageContainer } from "@/shared/components/page-container";
import { GridPattern } from "@/shared/components/shadcn-ui/grid-pattern";
import { cn } from "@/shared/utils";
import { ChevronUp, Copyright, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import { footerLinks } from "./constants";
import { FooterProps } from "./types";

export function Footer({ className }: FooterProps) {
	return (
		<PageContainer>
			<footer
				className={cn(
					"relative z-10 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 overflow-hidden",
					className
				)}
				itemScope
				itemType="https://schema.org/WPFooter"
			>
				{/* Éléments décoratifs modernisés */}
				<div className="absolute inset-0 z-0 opacity-40 overflow-hidden">
					<GridPattern
						width={40}
						height={40}
						x={0}
						y={0}
						strokeWidth={1.2}
						className="absolute top-0 inset-x-0 h-full text-primary/15 stroke-primary/25 fill-none [mask-image:linear-gradient(to_bottom,white_25%,transparent_80%)]"
					/>
				</div>

				{/* Bordure supérieure améliorée */}
				<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent"></div>

				<div className="relative z-10">
					<div className="max-w-7xl mx-auto px-4 sm:px-6">
						{/* Logo et description - redesign épuré */}
						<div className="flex justify-center mb-10 sm:mb-16">
							<div className="flex flex-col items-center text-center">
								<Logo
									variant="default"
									size="lg"
									shape="square"
									glow="lg"
									hover="grow"
								/>
								<p className="text-muted-foreground text-sm max-w-lg mt-4 px-4">
									Simplifiez la gestion de votre entreprise grâce à notre
									plateforme tout-en-un. Factures, clients, stocks et
									comptabilité dans une interface intuitive et puissante.
								</p>
							</div>
						</div>

						{/* Navigation - mise en page optimisée et responsive amélioré */}
						<nav
							className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-8 md:gap-y-10 mb-12 sm:mb-16"
							itemScope
							itemType="https://schema.org/SiteNavigationElement"
						>
							{footerLinks.map((column) => (
								<div key={column.title}>
									<h3 className="font-medium text-foreground mb-4 sm:mb-5 text-sm relative inline-block">
										{column.title}
										<span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary/30 rounded-full"></span>
									</h3>
									<ul className="space-y-2 sm:space-y-3">
										{column.links.map((link) => (
											<li key={link.label}>
												<Link
													href={link.href}
													className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 flex items-center gap-1.5 group"
													itemProp="url"
												>
													<span itemProp="name">{link.label}</span>
													<ExternalLink className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
												</Link>
											</li>
										))}
									</ul>
								</div>
							))}
						</nav>

						{/* Barre inférieure avec copyright - design modernisé */}
						<div
							className="border-t border-border/20 pt-6 sm:pt-8 flex justify-center"
							itemScope
							itemType="https://schema.org/Organization"
						>
							<div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-muted-foreground/80 bg-background/30 backdrop-blur-xs px-4 sm:px-6 py-2 rounded-full border border-white/5 shadow-2xs">
								<div className="flex items-center">
									<Copyright className="h-3.5 w-3.5 mr-1" />
									<span itemProp="copyrightYear">
										{new Date().getFullYear()}
									</span>
									<span itemProp="name" className="ml-1">
										Factly. Tous droits réservés
									</span>
								</div>
								<span className="hidden sm:flex items-center">
									<span className="mx-2 w-1 h-1 rounded-full bg-primary/50"></span>
									<Heart className="h-3 w-3 text-destructive mr-1" />
									<span
										itemProp="location"
										itemScope
										itemType="https://schema.org/Place"
									>
										<span
											itemProp="address"
											itemScope
											itemType="https://schema.org/PostalAddress"
										>
											<span itemProp="addressCountry">
												Fait avec passion en France
											</span>
										</span>
									</span>
								</span>
							</div>
						</div>

						{/* Bouton de retour en haut */}
						<div className="mt-10 sm:mt-16 flex flex-col items-center">
							<button
								className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5 transition-colors duration-300 text-center text-muted-foreground/70 hover:text-foreground cursor-pointer group"
								onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
								aria-label="Retour en haut de page"
							>
								<ChevronUp className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
								<span className="text-xs font-medium">Retour en haut</span>
							</button>
						</div>
					</div>
				</div>
			</footer>
		</PageContainer>
	);
}
