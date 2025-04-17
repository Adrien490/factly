import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/shared/components/shadcn-ui/navigation-menu";
import { cn } from "@/shared/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HorizontalMenuProps } from "./types";

const menuItemVariants = cva(
	"flex items-center text-sm gap-2 justify-between rounded-md px-3 py-2",
	{
		variants: {
			active: {
				true: "text-primary font-medium bg-primary/5",
				false: "text-muted-foreground hover:text-foreground hover:bg-muted/60",
			},
			size: {
				default: "text-sm",
				sm: "text-xs",
				lg: "text-base",
			},
		},
		defaultVariants: {
			active: false,
			size: "default",
		},
	}
);

export function HorizontalMenu({
	items,
	className,
	variant = "default",
	size = "default",
}: HorizontalMenuProps) {
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
		<NavigationMenu
			className={cn(
				"relative z-10 w-full rounded-lg p-1",
				variant === "filled" && "bg-muted/80 backdrop-blur-sm shadow-sm",
				variant === "bordered" && "border border-border",
				className
			)}
			aria-label="Main navigation"
		>
			<NavigationMenuList className="flex overflow-x-auto sm:overflow-visible no-scrollbar gap-1">
				{items.map((item, index) => {
					const active = isItemActive(item.href);

					return (
						<NavigationMenuItem key={index} className="relative">
							<NavigationMenuLink asChild>
								<Link
									href={item.href || "#"}
									className={cn(menuItemVariants({ active, size }), "relative")}
									aria-current={active ? "page" : undefined}
								>
									{item.icon && (
										<span
											className={cn(
												"shrink-0",
												size === "sm"
													? "size-3.5"
													: size === "lg"
													? "size-5"
													: "size-4"
											)}
											aria-hidden="true"
										>
											{item.icon}
										</span>
									)}
									<span>{item.label}</span>

									{active && variant !== "pills" && (
										<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
									)}
								</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					);
				})}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
