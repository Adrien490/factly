"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface HeaderSkeletonProps {
	className?: string;
	isScrolled?: boolean;
}

export default function HeaderSkeleton({
	className,
	isScrolled = false,
}: HeaderSkeletonProps) {
	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full transition-all border-b",
				isScrolled
					? "bg-background/90 backdrop-blur-xs shadow-2xs"
					: "bg-background",
				className
			)}
			role="banner"
		>
			{/* En-tête principal avec logo et contrôles utilisateur */}
			<div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center">
					{/* Logo skeleton */}
					<div className="flex items-center">
						<Skeleton className="h-8 w-8 rounded-md" />
						{!isScrolled && <Skeleton className="ml-2 h-5 w-24" />}
					</div>

					{/* Menu horizontal à côté du logo lorsqu'on défile */}
					{isScrolled && (
						<div className="ml-8 flex items-center space-x-4">
							{Array(4)
								.fill(0)
								.map((_, i) => (
									<Skeleton key={i} className="h-4 w-16" />
								))}
						</div>
					)}
				</div>

				{/* Espace central flexible */}
				<div className="flex-1"></div>

				{/* Section droite : Avatar utilisateur */}
				<div className="flex items-center gap-2 sm:gap-3">
					<Skeleton className="h-8 w-8 rounded-full" />
				</div>
			</div>

			{/* Menu de navigation - Visible uniquement lorsqu'on ne défile pas */}
			{!isScrolled && (
				<div className="mx-auto w-full max-w-[1440px] px-4 py-2 sm:px-6 lg:px-8">
					<div className="flex items-center space-x-6">
						{Array(5)
							.fill(0)
							.map((_, i) => (
								<Skeleton key={i} className="h-5 w-20" />
							))}
					</div>
				</div>
			)}
		</header>
	);
}

/**
 * Skeleton pour le menu horizontal
 */
export function HorizontalMenuSkeleton() {
	return (
		<div className="flex items-center space-x-6">
			{Array(5)
				.fill(0)
				.map((_, i) => (
					<Skeleton key={i} className="h-5 w-20" />
				))}
		</div>
	);
}

/**
 * Skeleton pour le logo
 */
export function LogoSkeleton({ hideText = false }: { hideText?: boolean }) {
	return (
		<div className="flex items-center">
			<Skeleton className="h-8 w-8 rounded-md" />
			{!hideText && <Skeleton className="ml-2 h-5 w-24" />}
		</div>
	);
}

/**
 * Skeleton pour l'avatar utilisateur
 */
export function UserAvatarSkeleton() {
	return <Skeleton className="h-8 w-8 rounded-full" />;
}
