import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface TabItem {
	label: string;
	href: string;
	active?: boolean;
	count?: number;
}

interface TabsNavProps extends React.HTMLAttributes<HTMLDivElement> {
	items: TabItem[];
}

export default function TabsNav({ items, className, ...props }: TabsNavProps) {
	return (
		<div className={cn("w-full border-b", className)} {...props}>
			{/* Version desktop */}
			<div className="hidden sm:flex items-center justify-between -mb-px">
				<nav className="flex items-center gap-1" aria-label="Tabs">
					{items.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className={cn(
								"inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative border-b-2",
								item.active
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
							)}
						>
							{item.label}
							{item.count !== undefined && (
								<span
									className={cn(
										"ml-2 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
										item.active
											? "bg-primary/10 text-primary ring-primary/20"
											: "bg-muted text-muted-foreground ring-muted-foreground/20"
									)}
								>
									{item.count}
								</span>
							)}
						</Link>
					))}
				</nav>
			</div>

			{/* Version mobile */}
			<div className="flex sm:hidden items-center gap-2 overflow-x-auto pb-1 -mb-px">
				{items.map((item, index) => (
					<Link
						key={index}
						href={item.href}
						className={cn(
							"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
							item.active
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
						)}
					>
						{item.label}
						{item.count !== undefined && (
							<span
								className={cn(
									"ml-2 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
									item.active
										? "bg-primary/10 text-primary ring-primary/20"
										: "bg-muted text-muted-foreground ring-muted-foreground/20"
								)}
							>
								{item.count}
							</span>
						)}
					</Link>
				))}
			</div>
		</div>
	);
}
