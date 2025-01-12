"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../../../components/user-avatar";

export default function Navbar() {
	return (
		<nav
			className={cn(
				"sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				"px-4 lg:px-8 flex items-center justify-between h-16"
			)}
		>
			<div className="flex items-center gap-6">
				<Logo />
			</div>

			<div className="flex items-center gap-4">
				<UserAvatar size="sm" />
			</div>
		</nav>
	);
}
