"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function Logo() {
	return (
		<Link
			href="/organizations"
			className="flex items-center space-x-2 px-4 py-2"
		>
			<LayoutDashboard className="h-6 w-6 text-primary" />
			<span className="font-semibold">Factly</span>
		</Link>
	);
}
