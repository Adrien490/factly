"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
	size?: "sm" | "md" | "lg";
	className?: string;
};

const sizeClasses = {
	sm: "size-8",
	md: "size-10",
	lg: "size-12",
};

export function UserAvatarSkeleton({ size = "md", className }: Props) {
	return (
		<Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
	);
}
