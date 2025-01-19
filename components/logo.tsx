"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface LogoProps {
	className?: string;
}

export function Logo({ className }: LogoProps) {
	return (
		<div className={cn("flex items-center", className)}>
			<Link href="/organizations" className="flex items-center gap-2">
				<LayoutDashboard className="h-6 w-6 text-primary" />
				<span className="font-semibold">Factly</span>
			</Link>
		</div>
	);
}
