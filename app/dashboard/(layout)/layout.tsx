import { auth } from "@/domains/auth";
import {
	HorizontalMenu,
	Logo,
	UserAvatar,
	UserAvatarSkeleton,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<header
				className={cn(
					"sticky top-0 z-50 w-full bg-background/95 backdrop-blur-[2px] border-b border-border/20 shadow-sm"
				)}
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
							<Suspense fallback={<UserAvatarSkeleton />}>
								<UserAvatar
									size="sm"
									userPromise={auth.api
										.getSession({ headers: await headers() })
										.then((session) => session?.user ?? null)}
								/>
							</Suspense>
						</div>
					</div>

					{/* Menu de navigation horizontal */}
					<div className="h-10 px-4 sm:px-6 lg:px-8">
						<HorizontalMenu
							className="border-none"
							items={[
								{
									title: "Organisations",
									url: "/dashboard",
								},
								{
									title: "Nouvelle organisation",
									url: "/dashboard/new",
								},
							]}
						/>
					</div>
				</div>
			</header>
			<div className="flex-1">{children}</div>
		</div>
	);
}
