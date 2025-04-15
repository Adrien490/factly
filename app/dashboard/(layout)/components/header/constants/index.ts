import { MenuItem } from "@/app/dashboard/(layout)/components/header/types";

export const menuItems: MenuItem[] = [
	{
		label: "Mes organisations",
		href: "/dashboard",
	},

	{
		label: "Nouvelle organisation",
		href: "/dashboard/new",
	},
	/*{
		label: "Invitations",
		href: "/dashboard/invitations",
	},*/
];

// Configuration standardisée des animations
export const ANIMATION_CONFIG = {
	duration: 0.2,
	ease: "easeInOut",
};
