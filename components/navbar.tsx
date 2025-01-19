"use client";

import { Logo } from "@/components/logo";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";

export default function Navbar() {
	return (
		<nav
			className={cn(
				"sticky top-0 z-50 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
			)}
		>
			<div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
				<Logo />
				<UserAvatar size="sm" />
			</div>
		</nav>
	);
}
