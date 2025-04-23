import { Button } from "@/shared/components";
import { PageContainer } from "@/shared/components/page-container";
import { ContainerScroll } from "@/shared/components/ui/container-scroll-animation";
import { ShootingStars } from "@/shared/components/ui/shooting-stars";
import { StarsBackground } from "@/shared/components/ui/stars-background";
import { cn } from "@/shared/utils";
import { ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AppShowcase() {
	return (
		<PageContainer>
			<section
				id="application"
				className={cn(
					"relative py-24 overflow-hidden",
					"mask-b-from-99% mask-b-to-100% mask-t-from-95% mask-t-to-98% sm:mask-b-from-98% sm:mask-b-to-99% sm:mask-t-from-93% sm:mask-t-to-97% md:mask-b-from-97% md:mask-b-to-99% md:mask-t-from-85% md:mask-t-to-97% lg:mask-b-from-95% lg:mask-b-to-99% lg:mask-t-from-80% lg:mask-t-to-99%"
				)}
			>
				{/* Arrière-plan avec étoiles */}
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
						/>
					</div>
				</div>

				<div className="relative z-20">
					<div className="flex flex-col overflow-hidden">
						<ContainerScroll
							titleComponent={
								<div className="max-w-4xl mx-auto text-center mb-12">
									{/* Badge */}
									<div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 backdrop-blur-lg">
										<Sparkles className="w-4 h-4" />
										<span className="text-sm font-medium">
											Tableau de bord intelligent
										</span>
									</div>

									{/* Titre */}
									<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
										Visualisez votre{" "}
										<span className="text-primary relative">
											activité commerciale
										</span>{" "}
										en un coup d&apos;œil
									</h2>

									<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
										Un tableau de bord qui vous donne toutes les informations
										essentielles pour prendre les bonnes décisions.
									</p>
								</div>
							}
						>
							{/* Conteneur d'image avec mask en bas */}
							<div className="relative">
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
									/>
								</div>
							</div>

							{/* CTA */}
							<div className="mt-8 flex justify-center">
								<Button
									variant="default"
									size="lg"
									asChild
									className="rounded-full px-6 shadow-lg shadow-primary/20 group"
								>
									<Link href="/demo" className="flex items-center gap-2">
										Essayer gratuitement
										<ExternalLink className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
									</Link>
								</Button>
							</div>
						</ContainerScroll>
					</div>
				</div>
			</section>
		</PageContainer>
	);
}
