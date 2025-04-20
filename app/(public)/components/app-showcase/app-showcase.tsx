import { Button, ScrollToButton } from "@/shared/components";
import { PageContainer } from "@/shared/components/page-container";
import { ContainerScroll } from "@/shared/components/ui/container-scroll-animation";
import { ShootingStars } from "@/shared/components/ui/shooting-stars";
import { StarsBackground } from "@/shared/components/ui/stars-background";
import { cn } from "@/shared/utils";
import { ChevronDown, ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AppShowcase() {
	return (
		<PageContainer>
			<section
				id="application"
				className="relative py-28 sm:py-32 md:py-36 overflow-hidden"
			>
				{/* Élément décoratif supérieur - plus subtil */}
				<div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-background to-transparent pointer-events-none z-10"></div>

				{/* Arrière-plan avec étoiles et étoiles filantes - optimisé */}
				<div className="absolute inset-0 w-full h-full">
					<div className="h-full w-full flex flex-col items-center justify-center relative dark:opacity-80">
						<ShootingStars
							minSpeed={15}
							maxSpeed={35}
							minDelay={1200}
							maxDelay={3500}
							starColor="var(--color-primary)"
							trailColor="var(--color-secondary, #2EB9DF)"
							starWidth={10}
							starHeight={1.5}
						/>
						<StarsBackground
							className="opacity-80"
							starDensity={0.0002}
							allStarsTwinkle={true}
							twinkleProbability={0.8}
							minTwinkleSpeed={0.4}
							maxTwinkleSpeed={1.2}
						/>
					</div>
				</div>

				<div className="relative z-20">
					<div className="flex flex-col overflow-hidden">
						<ContainerScroll
							titleComponent={
								<>
									<div className="max-w-4xl mx-auto text-center mb-12">
										{/* Badge amélioré - design 2025 */}
										<div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-linear-to-r from-primary/5 to-primary/15 border-none shadow-lg shadow-primary/5 backdrop-blur-lg">
											<Sparkles className="w-4 h-4" />
											<span className="text-sm font-medium">
												Tableau de bord intelligent
											</span>
										</div>

										{/* Titre avec animation améliorée */}
										<div>
											<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
												Visualisez votre{" "}
												<span className="relative inline-block group">
													<span className="text-primary relative z-10">
														activité commerciale
													</span>
													<span className="absolute -bottom-1 left-0 right-0 h-3 bg-primary/10 rounded-full -z-10 transform -rotate-1 group-hover:h-4 group-hover:bg-primary/20 transition-all duration-300"></span>
												</span>{" "}
												en un coup d&apos;œil
											</h2>

											<p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
												Un tableau de bord qui vous donne toutes les
												informations essentielles pour prendre les bonnes
												décisions au bon moment.
											</p>
										</div>

										{/* Indicateur de défilement - accessibilité améliorée */}
										<div className="hidden md:flex justify-center mt-10">
											<ScrollToButton
												targetId="features"
												icon={
													<ChevronDown className="h-4 w-4 animate-bounce" />
												}
												label="Découvrez les fonctionnalités"
												aria-label="Découvrir les fonctionnalités"
											/>
										</div>
									</div>
								</>
							}
						>
							{/* Conteneur d'image amélioré avec effet 3D */}
							<div className="relative">
								{/* Cadre d'image avec ombre portée améliorée et effet neomorphique 2025 */}
								<div
									className={cn(
										"relative w-full max-w-6xl mx-auto mt-4 rounded-2xl overflow-hidden transform perspective-1000",
										"border border-white/20 dark:border-white/10 bg-background/5",
										"before:absolute before:inset-0 before:bg-grid-pattern/50 before:bg-[length:20px_20px] before:opacity-10 before:[mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,white,transparent)]",
										"shadow-[0_20px_70px_-20px_rgba(0,0,0,0.3),0_10px_30px_-15px_rgba(var(--primary-rgb),0.2)] dark:shadow-[0_20px_50px_-25px_rgba(var(--primary-rgb),0.4)]",
										"hover:shadow-[0_30px_100px_-30px_rgba(0,0,0,0.4),0_20px_60px_-30px_rgba(var(--primary-rgb),0.4)] dark:hover:shadow-[0_30px_70px_-30px_rgba(var(--primary-rgb),0.5)]",
										"transition-all duration-700 hover:scale-[1.01]"
									)}
								>
									{/* Effet de lumière dynamique sur l'image */}
									<div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-tr from-primary/5 via-primary/0 to-primary/5 z-10 pointer-events-none"></div>

									{/* Points lumineux animés */}
									<div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/40 blur-xs animate-pulse z-20 pointer-events-none"></div>
									<div
										className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-primary/30 blur-xs animate-pulse z-20 pointer-events-none"
										style={{ animationDuration: "3s" }}
									></div>

									{/* Image principale avec meilleure optimisation */}
									<div className="relative aspect-16/9 w-full">
										<Image
											src="/showcase-action.webp"
											alt="Dashboard Factly"
											fill
											className="object-cover rounded-lg"
											priority
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
											placeholder="blur"
											blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMDEwMTAiLz48L3N2Zz4="
											draggable={false}
										/>

										{/* Overlay pour améliorer la lisibilité et l'effet visuel */}
										<div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-70 rounded-lg"></div>
									</div>
								</div>

								{/* CTA centré avec design 2025 */}
								<div className="mt-10 flex justify-center">
									<Button
										variant="default"
										size="lg"
										asChild
										className="rounded-full px-8 shadow-lg shadow-primary/20 group/btn relative overflow-hidden"
									>
										<Link href="/demo" className="group">
											<span className="relative z-10 flex items-center gap-2">
												Essayer gratuitement
												<ExternalLink className="h-4 w-4 transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110" />
											</span>
											<span className="absolute inset-0 bg-linear-to-r from-primary to-primary/70 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
										</Link>
									</Button>
								</div>
							</div>
						</ContainerScroll>
					</div>
				</div>

				{/* Élément décoratif inférieur - harmonisé avec sections adjacentes */}
				<div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent pointer-events-none z-10"></div>
			</section>
		</PageContainer>
	);
}
