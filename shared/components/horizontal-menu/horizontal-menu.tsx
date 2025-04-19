"use client";

import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HorizontalMenuProps } from "./types";

export function HorizontalMenu({ items, className }: HorizontalMenuProps) {
	const pathname = usePathname();

	// Check if menu should be rendered
	if (!items.length || (!items[0].href && !items[0].items?.length)) {
		return null;
	}

	// Check if a menu item matches the current path
	const isItemActive = (href?: string) => {
		if (!href) return false;
		return pathname === href;
	};

	return (
		<div
			className={cn("relative z-10 w-full rounded-lg py-1 mb-6", className)}
			aria-label="Main navigation"
		>
			<div className="flex overflow-x-auto sm:overflow-visible no-scrollbar gap-4">
				{items.map((item, index) => {
					const active = isItemActive(item.href);

					return (
						<div key={index} className="relative flex flex-col items-center">
							<Link
								href={item.href || "#"}
								className={cn(
									"flex items-center text-sm transition-all duration-200 gap-2 py-2",
									active
										? "text-primary font-medium"
										: "text-foreground/80 hover:text-foreground"
								)}
								aria-current={active ? "page" : undefined}
							>
								{item.icon && (
									<span className="shrink-0" aria-hidden="true">
										{item.icon}
									</span>
								)}
								<span className="line-clamp-1">{item.label}</span>
							</Link>

							{active && (
								<motion.div
									layoutId="activeIndicator"
									className="absolute bottom-0 h-0.5 bg-primary rounded-full w-full"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.2 }}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
